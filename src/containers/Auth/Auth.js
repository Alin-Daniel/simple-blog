import React, { Component } from "react";

import { Redirect } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";


import "./Auth.css";

class Auth extends Component {
  state = {
    isSignUp: false
  };

  componentDidMount() {
    if (!this.props.commenting && this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        isSignUp: !prevState.isSignUp
      };
    });
  };

  render() {

    let redirect = null;
    if (this.props.isAuthenticated) {
      redirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={"Auth"}>
        {redirect}
        {this.state.isSignUp ? (
          <SignUp isSignUp={this.state.isSignUp} />
        ) : (
          <SignIn isSignUp={this.state.isSignUp} />
        )}
        <Button clicked={this.switchAuthModeHandler} btnType="Danger">
          SWITCH TO {this.state.isSignUp ? "SIGN IN" : "SIGN UP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
    commenting: state.comment.commenting
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Auth);
