import React, { Component } from "react";

import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Button";
import { checkValidity } from "../../../../shared/utility";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";

import "./EditComment.css";

class EditComment extends Component {
  state = {
    formControls: {
      editComment: {
        elementType: "textarea",
        elementConfig: {
          autoFocus: true,
          placeholder: "",
          rows: 5
        },
        value: this.props.value,
        validation: {
          required: true,
          minLength: 1
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false
  };

  onChangeHandler = (event, inputElement) => {
    const updatedState = { ...this.state.formControls };
    const updatedInput = { ...this.state.formControls[inputElement] };
    updatedInput.value = event.target.value;
    updatedInput.valid = checkValidity(
      event.target.value,
      this.state.formControls[inputElement].validation
    );
    updatedInput.touched = true;
    updatedState[inputElement] = updatedInput;

    let formIsValid = true;
    for (let key in updatedState) {
      formIsValid = formIsValid && updatedState[key].valid;
    }

    this.setState({ formControls: updatedState, formIsValid: formIsValid });
  };

  onSubmitHandler = event => {
    event.preventDefault();
    const formData = {
      date: new Date().toLocaleDateString(),
      commentId: this.props.isEditReply ? this.props.commentId : this.props.selectedReply,
      content: this.state.formControls.editComment.value,
      displayName: this.props.displayName,
      userId: this.props.userId
    };

    if (this.props.isReply) {
      this.props.onCreateReply(
        this.props.postId,
        this.props.token,
        formData,
        this.props.selectedReply,
      );
    } else if(this.props.isEditReply){
        this.props.onEditReply(
          this.props.replyId,
          this.props.postId,
          this.props.token,
          formData
        );
    }
    else {
      const editedComment= {
        ...formData,
        commentId: null
      };

      this.props.onEditComment(
        this.props.commentId,
        this.props.postId,
        this.props.token,
        editedComment
      );
    }
    this.props.cancelEdit();
  };

  render() {
    let formElementsArray = [];
    for (let key in this.state.formControls) {
      formElementsArray.push({
        id: key,
        config: this.state.formControls[key]
      });
    }

    let form = (
      <form onSubmit={this.onSubmitHandler}>
        <fieldset disabled={!this.props.isAuth}>
          {formElementsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              value={formElement.config.value}
              elementConfig={formElement.config.elementConfig}
              touched={formElement.config.touched}
              invalid={!formElement.config.valid}
              changed={event => this.onChangeHandler(event, formElement.id)}
            />
          ))}
        </fieldset>
        <div className="EditActions">
          <Button
            disabled={!this.state.formIsValid || !this.props.isAuth}
            btnType="Success"
          >
            {this.props.isReply ? "Submit" : "Save"}
          </Button>
          <Button
            type="button"
            clicked={this.props.cancelEdit}
            disabled={!this.props.isAuth}
            btnType="Danger"
          >
            Cancel
          </Button>
        </div>
      </form>
    );

    return <div className={"EditComment--input"}>{form}</div>;
  }
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    displayName: state.auth.displayName,
    isAuth: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onEditComment: (commentId, postId, token, editedComment) =>
      dispatch(actions.editComment(commentId, postId, token, editedComment)),
    onFetchComments: () => dispatch(actions.fetchComments()),
    onCreateReply: (postId, token, newComment, commentId) =>
      dispatch(
        actions.createComment(postId, token, newComment, commentId)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditComment);
