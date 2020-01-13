import React, { Component } from "react";
import Webcam from "react-webcam";
import UserData from "./user-data";
import { connect } from "react-redux";
import { detectImage, initiateCaptureLoader, clearData } from "../actions";

class Capture extends Component {
  componentDidMount() {
    this.props.clearData();
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  capture() {
    const imageSrc = this.webcam.getScreenshot();
    this.props.initiateCaptureLoader();
    this.props.detectImage(imageSrc);
  }

  render() {
    console.log(this.props.userData.fetching);

    return (
      <div style={{ textAlign: "center" }}>
        <h3>Show your face to login!</h3>
        <Webcam
          audio={false}
          height={500}
          width={500}
          ref={event => this.setRef(event)}
          screenshotFormat="image/jpeg"
        />
        <RefreshIndicator
          className="css-loader"
          size={80}
          left={70}
          top={0}
          loadingColor="#ADD8E6"
          status="loading"
          style={
            this.props.userData.fetching === false ? style.hide : style.refresh
          }
        />
        <br />
        <RaisedButton
          onClick={() => this.capture()}
          label="DETECT"
          primary={true}
          style={{ margin: 16 }}
        />
        <UserData user={this.props.userData} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userData
  };
}

export default connect(
  mapStateToProps,
  { detectImage, initiateCaptureLoader, clearData }
)(Capture);
