import React from "react";
import { Container, Row, Col, Button } from "reactstrap";

export default class Vehicle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFrame: true
    };
  }

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
            <Col onClick={() => this.props.history.push("/ekyc")}>
              <iframe src="dl-verify.html" width="100%" height="500px" />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
