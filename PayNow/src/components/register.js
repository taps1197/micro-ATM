import React, { Component } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

import { Container, Col, Row, Button, Input, Label } from "reactstrap";

import axios from "axios";
import { db } from "./firebase";

import { connect } from "react-redux";
import { registerUser, clearDisplayData } from "../actions";

import UserRegister from "./user-register";
import * as KEYS from "../constant/keys";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      age: 0,
      address: "",
      image: "",
      face_id: "",
      load: false
    };
  }

  componentDidMount() {
    this.props.clearDisplayData();
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = async () => {
    if (this.state.name === "" || this.state.name === " ") {
      alert("Username cannot be empty");
      return;
    }
    if (this.state.age < 0) {
      alert("Age cannot be negative");
      return;
    }

    this.setState({
      load: true
    });

    const imageSrc = this.webcam.getScreenshot();

    await axios
      .post(
        `https://api.kairos.com/enroll`,
        {
          gallery_name: "users",
          image: imageSrc,
          subject_id: this.state.name
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
        this.props.registerUser(response.data);
        this.setState({
          load: false,
          face_id: response.data.face_id
        });
      });
    await db
      .collection("users")
      .add({
        name: this.state.name,
        age: this.state.age,
        address: this.state.address,
        face_id: this.state.face_id,
        image: imageSrc,
        balance: 1000
      })
      .then(() => {
        console.log("data added to firestore");
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };

  resetGallery = () => {
    this.setState({
      load: true
    });

    axios
      .post(
        `https://api.kairos.com/gallery/remove`,
        {
          gallery_name: "users"
        },
        {
          headers: {
            app_id: KEYS.KAIROS_APP_ID,
            app_key: KEYS.KAIROS_API_KEY
          }
        }
      )
      .then(response => {
        alert("Gallery has been reset. Feel free to register now");
        this.setState({
          load: false
        });
      });
  };

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} className="text-center mt-4">
            <h3>REGISTER FACE</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Camera
              audio={false}
              mirrored={true}
              ref={this.setRef}
              screenshotFormat="image/jpg"
              screenshotQuality={70}
            />
            <div className="d-flex justify-content-around">
              <Button onClick={this.capture} color="primary">
                Register
              </Button>
              <Button onClick={this.resetGallery} color="primary">
                Reset Gallery
              </Button>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ margin: "0 auto!important" }}>
              <Label for="name">Name:</Label>
              <Input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <Label for="age">Age:</Label>
              <Input
                type="number"
                name="age"
                value={this.state.age}
                onChange={this.handleChange}
              />
              <Label for="address">Address:</Label>
              <Input
                type="text"
                name="address"
                value={this.state.address}
                onChange={this.handleChange}
              />
            </div>
            <UserRegister detect={this.props.regData} />
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
    regData: state.regData
  };
}

export default connect(
  mapStateToProps,
  { registerUser, clearDisplayData }
)(Register);
