import React, { Component } from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import { checkValidity } from "../../../shared/utility";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Spinner from '../../../components/UI/Spinner/Spinner';

import "./SignUp.css";

class SignUp extends Component {
  state = {
    controls: {
      displayName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Display Name"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
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
    //console.log(this.state.controls.email.valid);
  };

  formSubmitHandler = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.controls.displayName.value,
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

    if(this.props.loading){
      form = <Spinner />;
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p className={'SignUp--error'}>{this.props.error.message}</p>;
    }

    return (
      <Aux>
        {errorMessage}
        <form onSubmit={event => this.formSubmitHandler(event)}>
          {form}
          <Button btnType="Submit" disabled={!this.state.formIsValid}>
            Submit
          </Button>
        </form>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
