import React, { Component } from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import { checkValidity } from "../../../shared/utility";
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';

import "./NewPost.css";

class NewPost extends Component {
  state = {
    formControls: {
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Title"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      content: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "Write something",
          rows: 5
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false
  };

  submitHandler = event => {
    event.preventDefault();

    const newPost = {};
    newPost.date = new Date().toLocaleDateString();
    newPost.displayName = this.props.displayName;
    newPost.userId = this.props.userId;

    for (let key in this.state.formControls) {
      newPost[key] = this.state.formControls[key].value;
    }

    this.props.onCreatePost(newPost, this.props.token);
    this.props.history.push("/");
    // clear inputs
    const updatedState = { ...this.state.formControls };
    for (let key in this.state.formControls) {
      const updatedInput = { ...this.state.formControls[key] };
      updatedInput.value = "";

      updatedState[key] = updatedInput;
    }
    this.setState({
      formControls: updatedState
    });
  };

  inputChangeHandler = (event, elementId) => {
    const updatedState = { ...this.state.formControls };
    const updatedInput = { ...this.state.formControls[elementId] };
    updatedInput.value = event.target.value;
    updatedInput.touched = true;
    updatedInput.valid = checkValidity(
      event.target.value,
      this.state.formControls[elementId].validation
    );
    updatedState[elementId] = updatedInput;

    let formIsValid = true;
    for (let key in updatedState) {
      formIsValid = formIsValid && updatedState[key].valid;
    }
    this.setState({ formControls: updatedState, formIsValid: formIsValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.formControls) {
      formElementsArray.push({
        id: key,
        config: this.state.formControls[key]
      });
    }
    let form = (
      <form onSubmit={this.submitHandler}>
        <fieldset disabled={!this.props.token}>
          {formElementsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              value={formElement.config.value}
              elementConfig={formElement.config.elementConfig}
              touched={formElement.config.touched}
              invalid={!formElement.config.valid}
              changed={event => this.inputChangeHandler(event, formElement.id)}
            />
          ))}
        </fieldset>
        <Button
          disabled={!this.state.formIsValid || !this.props.token}
          btnType={"Submit"}
        >
          Submit
        </Button>
      </form>
    );
    return <div className={"NewPost--form"}>{form}</div>;
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    displayName: state.auth.displayName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreatePost: (newPost, token) => dispatch(actions.createPost(newPost, token))
  };
};  

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
