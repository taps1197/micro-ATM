import React from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import axios from "axios";
import { Container, Row, Col, Button } from "reactstrap";

import * as KEYS from "../constant/keys";
import { db } from "./firebase";

export default class PayWithFace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      merchant_vpa: "",
      merchant_balance: 0,
      face_id: "",
      client_vpa: "",
      client_balance: 0,
      status: []
    };
  }
  setRef = webcam => {
    this.webcam = webcam;
  };
  componentDidMount() {
    this.setState({
      selected: this.props.location.state.selected,
      merchant_vpa: this.props.location.state.merchantVPA
    });
    this.timer = setInterval(this.capture, 2000);
  }

  capture = async () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      status: this.state.status.concat("Waiting for facial authentication...")
    });
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
            status: this.state.status.concat(
              "Sorry, Couldn't ID you, would you like to register?"
            )
          });
        }
        if (response.data.images[0].transaction.status == "error") {
          this.setState({
            status: this.state.status.concat(
              "Don't cover your face or the camera. Also check if someone is standing in the background..."
            )
          });
        } else {
          this.setState({
            status: this.state.status.concat(
              "Face matched! Initiating transaction..."
            ),
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
            client_vpa: doc.docs[0].id,
            client_balance: doc.docs[0].data().balance
          });
        }
      });
    await db
      .collection("users")
      .doc(this.state.merchant_vpa)
      .get()
      .then(doc =>
        this.setState({
          merchant_balance: doc.data().balance
        })
      );
    this.setState({
      status: this.state.status.concat("Transaction Initiated!")
    });
    await db
      .collection("users")
      .doc(this.state.client_vpa)
      .update({
        balance: this.state.client_balance - this.state.selected.cost
      });
    await db
      .collection("users")
      .doc(this.state.merchant_vpa)
      .update({
        balance: this.state.merchant_balance + this.state.selected.cost
      });
    this.setState({
      status: this.state.status.concat("Transaction Complete!")
    });
  };

  render() {
    let message = this.state.status.map(x => {
      return <p>{x}</p>;
    });
    return (
      <>
        <Container className="mt-4">
          <Row>
            <Col xs={12}>
              <div style={{ textAlign: "center" }}>
                <h3>Pay with Facial Recognition</h3>
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
            <Col>{message}</Col>
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
