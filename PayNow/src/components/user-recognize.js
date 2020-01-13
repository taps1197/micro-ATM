import React, { Component } from "react";
import { Link } from "react-router-dom";

class UserRecognize extends Component {
  render() {
    console.log(this.props.detect);
    if (this.props.detect.message === "error") {
      return (
        <p>
          <br />
          <br />
          <b>Face not in the frame or gallery is empty.</b> Please try again by
          occupying the frame and if the error still persists, try registering.
        </p>
      );
    } else if (this.props.detect.message === "failure") {
      return (
        <p>
          <br />
          <br />
          <b>Face not in gallery.</b> Please register with us{" "}
          <Link to={"/register"}>here</Link>
        </p>
      );
    } else if (this.props.detect.message === "success") {
      return (
        <div>
          <p>
            <br />
            <br />
            <b>Profile name: </b>
            {this.props.data.name}
          </p>
          <p>
            <b>Profile age: </b>
            {this.props.data.age}
          </p>
          <p>
            <b>Profile address: </b>
            {this.props.data.address}
          </p>
          <p>
            <b>Profile balance: </b>
            {this.props.data.balance}
          </p>
          {/* <p>
            <b>Face ID: </b>
            {this.props.detect.faceID}
          </p> */}
        </div>
      );
    } else {
      return (
        <p>
          <br />
          <br />
          <b>RECOGNITION STATUS</b> WILL BE DISPLAYED HERE
        </p>
      );
    }
  }
}

export default UserRecognize;
