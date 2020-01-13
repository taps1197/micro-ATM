import React from "react";
import * as VPA from "../constant/merchant";

import { Container, Row, Col, Button } from "reactstrap";

export default class Transaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      merchantVPA: ""
    };
  }
  componentDidMount() {
    console.log(this.props.location.state.selectedEl);
    this.setState({
      selected: this.props.location.state.selectedEl,
      merchantVPA: VPA.MERCHANT_VPA
    });
  }
  acceptHandler = () => {
    this.props.history.push({
      pathname: "/paywithface",
      state: { ...this.state }
    });
  };
  rejectHandler = () => {
    this.props.history.push("/store");
  };
  render() {
    return (
      <>
        <Container>
          <Row className="text-center mt-4">
            <Col>
              <h1>Transaction Details</h1>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={6}>
              <h4>Paying to: </h4>
              <p>{this.state.merchantVPA}</p>
              <h4>Amount: </h4>
              <p>Rs. {this.state.selected.cost}</p>
              <h4>Paying for: </h4>
              <p>{this.state.selected.name}</p>
            </Col>
            <Col md={6}>
              <img src={"img/" + this.state.selected.image} width="300px" />
            </Col>
          </Row>
          <Row className="my-3">
            <Col className="d-flex justify-content-around">
              <Button color="success" onClick={this.acceptHandler}>
                Accept
              </Button>
              <Button color="danger" onClick={this.rejectHandler}>
                Reject
              </Button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
