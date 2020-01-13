import React from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import axios from "axios";
import { Container, Row, Col, Button, Input } from "reactstrap";

import * as KEYS from "../constant/keys";
import "../constant/merchant";
import { db } from "./firebase";
import { MERCHANT_VPA } from "../constant/merchant";

export default class MerchantDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemprice: 0,
      merchant_vpa: MERCHANT_VPA,
      merchant_name: "",
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

  handleInput = e => {
    this.setState({
      itemprice: e.target.value
    });
  };

  capture = async () => {
    this.setState({
      status: []
    });
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
          return;
        }
        if (response.data.images[0].transaction.status == "error") {
          this.setState({
            status: this.state.status.concat(
              "Don't cover your face or the camera. Also check if someone is standing in the background..."
            )
          });
          return;
        } else {
          this.setState({
            status: this.state.status.concat(
              "Face matched! Initiating transaction..."
            ),
            face_id: response.data.images[0].candidates[0].face_id
          });
          this.runTransaction();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  runTransaction = async () => {
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
          merchant_balance: doc.data().balance,
          merchant_name: doc.data().name
        })
      );
    this.setState({
      status: this.state.status.concat("Transaction Initiated!")
    });
    await db
      .collection("users")
      .doc(this.state.client_vpa)
      .update({
        balance: this.state.client_balance - parseInt(this.state.itemprice)
      });
    await db
      .collection("users")
      .doc(this.state.merchant_vpa)
      .update({
        balance:
          parseInt(this.state.merchant_balance) + parseInt(this.state.itemprice)
      });
    this.setState({
      status: this.state.status.concat("Transaction Complete!")
    });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <h3 className="text-center mt-4">Merchant Payment Gateway</h3>
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
            <div className="d-flex justify-content-center">
              <Input
                type="text"
                name="price"
                value={this.state.itemprice}
                onChange={this.handleInput}
              />
              <Button onClick={this.capture} color="primary">
                Initiate Transaction
              </Button>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <br />
            <br />
            <br />
            <p>
              <b>Paying to:</b> {this.state.merchant_vpa}
            </p>
            <p>
              <b>Amount:</b> Rs.{this.state.itemprice}
            </p>
            {this.state.status.map(x => {
              return <p>{x}</p>;
            })}
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
  border: none;
  @media (max-width: 768px) {
    width: 90%;
    height: 90%;
    margin: 0 auto;
  }
`;
