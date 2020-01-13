import React from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Container,
  Row,
  Col
} from "reactstrap";

import productData from "../constant/products.json";

export default class DemoStore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEl: {},
      load: false
    };
  }

  getPrice = el => {
    this.setState(
      {
        selectedEl: el
      },
      () => {
        this.props.history.push({
          pathname: "/transaction",
          state: { ...this.state }
        });
      }
    );
  };

  render() {
    return (
      <>
        <Container>
          <Row className="mt-4">
            <Col xs={12}>
              <h3 className="text-center">Store</h3>
            </Col>
          </Row>
          <Row>
            {productData.map(el => {
              return (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: "10px auto"
                  }}
                  key={el.id}
                >
                  <Card key={el.id}>
                    <CardImg src={"img/" + el.image} />
                    <CardBody>
                      <CardTitle style={{ fontWeight: 700 }}>
                        {el.name}
                      </CardTitle>
                      <CardText>Price: Rs{el.cost}</CardText>
                      <Button
                        color="primary"
                        className="d-flex justify-content-center"
                        onClick={() => this.getPrice(el)}
                      >
                        Buy
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </>
    );
  }
}
