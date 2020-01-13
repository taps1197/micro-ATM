import React, { Component } from "react";
import { Link } from "react-router-dom";

// images being used
import detectImg from "../assets/images/detect-img.jpg";
import registerImg from "../assets/images/register-img.jpg";
import galleryImg from "../assets/images/gallery-img.jpg";

import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";

class LandingPage extends Component {
  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col xs={12} className="text-center">
            <h1>YOUR FACE IS YOUR IDENTITY</h1>
            <br />
            <p>
              This application allows the user to use facial recognition for
              digital payments!
            </p>
            <p>
              <b>Register. Login. Pay with your Face!</b>
            </p>
            <br />
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={3} style={{ textAlign: "center" }}>
            <Card body>
              <CardImg top width="100%" src={detectImg} alt="detect" />
              <CardBody>
                <CardTitle>Login with Face</CardTitle>
                <Link to="/login">
                  <Button color="primary">Login</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={3} style={{ textAlign: "center" }}>
            <Card body>
              <CardImg top width="100%" src={registerImg} alt="register" />
              <CardBody>
                <CardTitle>Register with Face</CardTitle>
                <Link to="/register">
                  <Button color="primary">Register</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={3} style={{ textAlign: "center" }}>
            <Card body>
              <CardImg top width="100%" src={galleryImg} alt="store" />
              <CardBody>
                <CardTitle>Buy From your store</CardTitle>
                <Link to="/store">
                  <Button color="primary">Store</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LandingPage;
