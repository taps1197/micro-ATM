import React from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import axios from "axios";
import { Container, Row, Col, Button } from "reactstrap";

import * as KEYS from "../constant/keys";
import { db } from "./firebase";

export default class EKYC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      face_id: "",
      client_id: "",
      client: {},
      status: "",
      showFrame: true
    };
  }

  componentDidMount() {
    if (this.state.showFrame == false) {
      this.timer = setInterval(this.capture, 2000);
    }
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = async () => {
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
        if (response.data.images[0].transaction.status == "failure") {
          this.setState({
            status: "Sorry, Couldn't ID you, would you like to register?"
          });
        }
        if (response.data.images[0].transaction.status == "error") {
          this.setState({
            status:
              "Don't cover your face or the camera. Also check if someone is standing in the background..."
          });
        } else {
          this.setState({
            face_id: response.data.images[0].candidates[0].face_id
          });
        }
      })
      .then(() => {
        clearInterval(this.timer);
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
          this.setState({
            client_id: doc.docs[0].id,
            client: doc.docs[0].data()
          });
          console.log(doc.docs[0].data());
        }
      });
  };

  render() {
    return (
      <>
        <Container className="mt-4">
          <Row>
            <Col xs={12}>
              <div style={{ textAlign: "center" }}>
                <h3>EKYC - Driving License Verification</h3>
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
            <Col xs={12} md={6}>
              <p>
                <b>Returned data when this api is called:</b>
                <pre>{JSON.stringify(this.state.client, null, 2)}</pre>
              </p>
            </Col>
          </Row>
        </Container>
      </>
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
