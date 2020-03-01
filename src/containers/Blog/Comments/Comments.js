import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import Input from "../../../components/UI/Input/Input";
import BigButton from '../../../components/UI/Button/BigButton';
import { checkValidity } from "../../../shared/utility";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { Link } from "react-router-dom";
import Comment from "./Comment/Comment";
import axios from "../../../axios-posts";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {replies} from '../../../shared/utility';

import "./Comments.css";

class Comments extends Component {
  state = {
    formControls: {
      comment: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "Leave a comment",
          rows: 5
        },
        value: "",
        validation: {
          required: true,
          minLength: 1
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false,
    selectedComment: null,
    editing: false,
    reply: false
  };

  componentDidMount() {
    this.props.onFetchComments(this.props.postId);
  }
  
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
    const newComment = {
      date: new Date().toLocaleDateString(),
      content: this.state.formControls.comment.value,
      displayName: this.props.displayName,
      userId: this.props.userId
    };

    this.props.onCreateComment(
      this.props.postId,
      this.props.token,
      newComment
    );

    // clear inputs
    const updatedState = { ...this.state.formControls };
    const updatedInput = { ...this.state.formControls.comment };
    updatedInput.value = "";
    updatedState.comment = updatedInput;

    this.setState({ formControls: updatedState, formIsValid: false });
  };

  redirectHandler = () => {
    this.props.onSetAuthRedirectPath("/posts/" + this.props.postId);
    this.props.onCommenting(true);
    this.props.history.push("/auth");
  };

  onEditingHandler = commentId => {
    this.setState({ editing: true });
    this.setState({ selectedComment: commentId });
  };

  onReplyHandler = commentId => {
    if (this.props.isAuth) {
      this.setState({ reply: true });
      this.setState({ selectedComment: commentId });
    } else {
      this.props.history.push("/auth");
    }
  };

  onCancelEditingHandler = () => {
    this.setState({ editing: false });
    this.setState({ reply: false });
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
        <fieldset disabled={!this.props.token}>
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
        {this.props.isAuth ? (
          <BigButton
            disabled={!this.state.formIsValid || !this.props.isAuth}
            btnType="BigBtnSuccess"
            style={{left: '50%', transform:'translateX(-50%)'}}
          >
            Submit
          </BigButton>
        ) : (
          <Link to="/auth">
            <BigButton style={{left: '50%', marginTop: '20px'}} clicked={this.redirectHandler} btnType="BigBtnSuccess">
              Sign In to comment
            </BigButton>
          </Link>
        )}
      </form>
    );

    let comment = (
      <Comment
        reply={this.state.reply}
        editing={this.state.editing}
        selectedComment={this.state.selectedComment}
        comments={replies(this.props.comments)}
        postId={this.props.postId}
        userId={this.props.userId}
        onReply={this.onReplyHandler}
        cancelEdit={this.onCancelEditingHandler}
        onEdit={this.onEditingHandler}
        onDeleteComment={this.props.onDeleteComment}
        token={this.props.token}
      />
    );

    if (this.props.loading) {
      comment = <Spinner />;
    }
    return (
      <div className={"Comment--input"}>
        {comment}
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null,
    token: state.auth.token,
    userId: state.auth.userId,
    displayName: state.auth.displayName,
    comments: state.comment.comments,
    editing: state.comment.editing,
    loading: state.comment.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchComments: postId => dispatch(actions.fetchComments(postId)),
    onCreateComment: (postId, token, newComment) =>
      dispatch(
        actions.createComment(postId, token, newComment)
      ),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path)),
    onDeleteComment: (postId, id, token) =>
      dispatch(actions.deleteComment(postId, id, token)),
    onCommenting: commenting => dispatch(actions.commenting(commenting))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withErrorHandler(Comments, axios))
);
