import React, { Component } from "react";

//import {Redirect} from 'react-router-dom';
import Input from "../../../components/UI/Input/Input";
import BigButton from "../../../components/UI/Button/BigButton";
import { checkValidity } from "../../../shared/utility";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import Spinner from "../../../components/UI/Spinner/Spinner";

import "./SignIn.css";

class SignIn extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false
  };

  inputchangeHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };

    let formIsValid = true;
    for (let key in updatedControls) {
      formIsValid = updatedControls[key].valid && formIsValid;
    }
    this.setState({ controls: updatedControls, formIsValid: formIsValid });
  };

  formSubmitHandler = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.props.isSignUp
    );
  };

  render() {
    const elementsArray = [];
    for (let key in this.state.controls) {
      elementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = elementsArray.map(formElement => (
      <Input
        key={formElement.id}
        value={formElement.config.value}
        elementConfig={formElement.config.elementConfig}
        touched={formElement.config.touched}
        invalid={!formElement.config.valid}
        changed={event => this.inputchangeHandler(event, formElement.id)}
      />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p className={"SignIn--error"}>{this.props.error.message}</p>
      );
    }
    return (
      <form onSubmit={event => this.formSubmitHandler(event)}>
        {errorMessage}
        {form}
        <BigButton
          style={{
            left: "50%",
            marginTop: "30px"
          }}
          btnType="BigBtnSuccess"
        >
          Submit
        </BigButton>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
    error: state.auth.error,
    loading: state.auth.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, displayName, isSignUp) =>
      dispatch(actions.auth(email, password, displayName, isSignUp))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
