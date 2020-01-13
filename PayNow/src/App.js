import React from "react";
import { Route, Switch, Link } from "react-router-dom";

import styled from "styled-components";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem
} from "reactstrap";

import logo from "./assets/images/logo.png";

import LandingPage from "./components/landing-page";
import Login from "./components/login";
import Register from "./components/register";
import DemoStore from "./components/demoStore";
import Transaction from "./components/transaction";
import PayWithFace from "./components/paywithface";
import MerchantDemo from "./components/merchant-demo";
import EKYC from "./components/ekyc";
import Vehicle from "./components/vehicle";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () =>
    this.setState({
      isOpen: !this.state.isOpen
    });

  render() {
    return (
      <Everything>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <img src={logo} height="60px" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <LinkEl to={"/login"}>Login</LinkEl>
              </NavItem>
              <NavItem>
                <LinkEl to={"/register"}>Register</LinkEl>
              </NavItem>
              <NavItem>
                <LinkEl to={"/store"}>Store</LinkEl>
              </NavItem>
              <NavItem>
                <LinkEl to={"/merchantdemo"}>Merchant Demo</LinkEl>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Switch>
          <Route exact path="/" render={props => <LandingPage {...props} />} />
          <Route path="/login" render={props => <Login {...props} />} />
          <Route path="/register" render={props => <Register {...props} />} />
          <Route path="/store" render={props => <DemoStore {...props} />} />
          <Route
            path="/transaction"
            render={props => <Transaction {...props} />}
          />
          <Route
            path="/paywithface"
            render={props => <PayWithFace {...props} />}
          />
          <Route
            path="/merchantdemo"
            render={props => <MerchantDemo {...props} />}
          />
          <Route path="/ekyc" render={props => <EKYC {...props} />} />
          <Route path="/vehicle" render={props => <Vehicle {...props} />} />

          <Route path="**" render={props => <LandingPage {...props} />} />
        </Switch>
      </Everything>
    );
  }
}

const LinkEl = styled(Link)`
  cursor: pointer;
  padding: 0 10px;
`;

const Everything = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
`;

export default App;
