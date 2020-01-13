import React, { Component } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import { Container, Row, Col, Button } from "reactstrap";
import axios from "axios";

import { connect } from "react-redux";
import { recognizeUser, clearDisplayData } from "../actions";

import * as KEYS from "../constant/keys";
import UserRecognize from "./user-recognize";
import { db } from "./firebase";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      load: false,
      face_id: "",
      name: "",
      age: 0,
      balance: 0,
      address: ""
    };
  }

  componentDidMount() {
    this.props.clearDisplayData();
    this.timer = setInterval(this.capture, 2000);
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = async () => {
    this.setState({
      load: true
    });

    const imageSrc = this.webcam.getScreenshot();

    await axios
      .post(
        `https://api.kairos.com/recognize`,
        {
          gallery_name: "users",
          image: imageSrc
        },
        {
          headers: {
            app_id: KEYS.KAIROS_APP_ID,
            app_key: KEYS.KAIROS_API_KEY
          }
        }
      )
      .then(response => {
        console.log(response);
        this.props.recognizeUser(response.data);
        this.setState({
          load: false,
          face_id: response.data.images[0].candidates[0].face_id
        });
      })
      .catch(error => {
        console.log(error);
      });

    await db
      .collection("users")
      .where("face_id", "==", this.state.face_id)
      .get()
      .then(doc => {
        if (doc.docs.length == 0) {
          console.log("sorry no user found!");
        } else {
          const data = doc.docs[0].data();
          this.setState({
            name: data.name,
            age: data.age,
            balance: data.balance,
            address: data.address
          });
        }
      })
      .then(() => {
        clearInterval(this.timer);
      });
  };

  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col xs={12}>
            <div style={{ textAlign: "center" }}>
              <h3>DETECT FACE</h3>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Camera
              mirrored={true}
              audio={false}
              ref={this.setRef}
              screenshotFormat="image/jpg"
              screenshotQuality={70}
            />
            <Button
              onClick={this.capture}
              color="primary"
              className="d-flex mx-auto"
            >
              Detect
            </Button>
          </Col>
          <Col>
            <UserRecognize detect={this.props.detData} data={this.state} />
          </Col>
        </Row>
      </Container>
    );
  }
}

const Camera = styled(Webcam)`
  width: 500px;
  height: 500px;
  clip-path: circle(35%);
  @media (max-width: 768px) {
    width: 90%;
    height: 90%;
    margin: 0 auto;
  }
`;

function mapStateToProps(state) {
  return {
    detData: state.detData
  };
}

export default connect(
  mapStateToProps,
  { recognizeUser, clearDisplayData }
)(Login);
