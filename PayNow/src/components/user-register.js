import React, { Component } from "react";
import { Link } from "react-router-dom";

class UserRegister extends Component {
  render() {
    if (this.props.detect.message === "error") {
      return (
        <p>
          <br />
          <br />
          <b>Face not in the frame.</b> Please try again by occupying the frame.
        </p>
      );
    } else if (this.props.detect.message === "failure") {
      return (
        <p>
          <br />
          <br />
          <b>Registration failed</b>
          <br />
          Please try again.
        </p>
      );
    } else if (this.props.detect.message === "success") {
      return (
        <div>
          <br />
          <br />
          <p>
            User successfully <b>registered</b>
            <br />
            Go ahead and recognize yourself <Link to={"/login"}>here.</Link>
          </p>
        </div>
      );
    } else {
      return (
        <p>
          <br />
          <br />
          <b>REGISTRATION STATUS</b> WILL APPEAR HERE.
          <br />
          <br />
        </p>
      );
    }
  }
}

export default UserRegister;
