import React, { Component } from "react";

import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Button";
import { checkValidity, updateObject } from "../../../../shared/utility";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";

import "./EditPost.css";

class EditPost extends Component {
  state = {
    formControls: {
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: ""
        },
        value: this.props.titleValue,
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      content: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "",
          rows: 5
        },
        value: this.props.contentValue,
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

    const editedPost = {};
    editedPost.date = new Date().toLocaleDateString();
    editedPost.displayName = this.props.displayName;
    editedPost.userId = this.props.userId;

    for (let key in this.state.formControls) {
      editedPost[key] = this.state.formControls[key].value;
    }
    this.props.onEditPost(this.props.postId, this.props.token, editedPost);
    this.props.cancel();
  };


  inputChangeHandler = (event, elementId) => {
    // const updatedState = { ...this.state.formControls };
    // const updatedInput = { ...this.state.formControls[elementId] };
    // updatedInput.value = event.target.value;
    // updatedInput.touched = true;
    // updatedInput.valid = checkValidity(
    //   event.target.value,
    //   this.state.formControls[elementId].validation
    // );
    // updatedState[elementId] = updatedInput;

    const updatedInput = updateObject(
      this.state.formControls[elementId], {
      value: event.target.value,
      touched: true,
      valid: checkValidity(
          event.target.value,
          this.state.formControls[elementId].validation
         )
      });

      const updatedState = updateObject(this.state.formControls, {
        [elementId] : updatedInput
      });

    let formIsValid = true;
    for (let key in updatedState) {
      // formIsValid = formIsValid && updatedState[key].valid;
      formIsValid = formIsValid && checkValidity(
        this.state.formControls[key].value,
        this.state.formControls[key].validation
       );
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
        <div className={"EditPost--actions"}>
          <Button
            disabled={!this.state.formIsValid || !this.props.token}
            btnType={"Success"}
          >
            Save
          </Button>

          <Button
            type={'button'}
            clicked={this.props.cancel}
            disabled={!this.props.token}
            btnType={"Danger"}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
    return <div className={"EditPost--form"}>{form}</div>;
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    displayName: state.auth.displayName
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onEditPost: (postId, token, editedPost) => dispatch(actions.editPost(postId, token, editedPost))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPost);
