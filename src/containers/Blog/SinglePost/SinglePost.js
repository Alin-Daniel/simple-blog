import React, { Component } from "react";

import Button from "../../../components/UI/Button/Button";
import Comments from "../Comments/Comments";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import EditPost from "../SinglePost/EditPost/EditPost";
import axios from '../../../axios-posts';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import "./SinglePost.css";
class SinglePost extends Component {
 
  state = {
    editing: false
  };

  componentDidMount() {
    const postId = this.props.match.params.id;
    this.props.onFetchSinglePost(postId);
    this.onShowAllCommentsHandler()
  }


  onDeleteHandler = id => {
    this.props.onDeletePost(id, this.props.token);
    if(!this.props.loading){
      this.props.history.replace("/");
    }
  };

  onEditHandler = () => {
    this.setState({ editing: true });
  };

  onCancelEditHandler = event => {
    this.setState({ editing: false });
  };

  onShowAllCommentsHandler = () => {
      let totalComments = 0;
      if(this.props.comments.length > 0) {
        totalComments = this.props.comments.length;
      }
      return totalComments;
  };

  render() {
    const commentIcon = <FontAwesomeIcon icon={faComments}/>;
    let post = null;
    if (this.props.singlePost) {
      post = this.props.singlePost.map(post =>
        !this.state.editing ? (
          <article className="SinglePost" key={post.id}>
            <h1 className={"SinglePost--title"}>{post.title}</h1>
            <div className={"SinglePost--body"}>
              <div className={"SinglePost--header"}>
                <div className={"SinglePost--author"}>
                  <strong>{post.displayName}</strong>
                </div>
                <span className={"SinglePost--date"}>
                  <time dateTime={post.date}>{post.date}</time>
                </span>
                <span className={'SinglePost--counter'}>{commentIcon} {this.onShowAllCommentsHandler()} comments</span>
              </div>
              <div className={"SinglePost--content"}>
                <p>{post.content}</p>
              </div>
              <div className="SinglePost--actions">
                {this.props.userId === post.userId && (
                  <Button
                    clicked={this.onEditHandler}
                    btnType="Success"
                    className="Edit"
                  >
                    Edit
                  </Button>
                )}
                {this.props.userId === post.userId && (
                  <Button
                    btnType="Danger"
                    clicked={() => this.onDeleteHandler(post.id)}
                    className="Delete"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </article>
        ) : (
          <EditPost
            titleValue={post.title}
            contentValue={post.content}
            postId={post.id}
            cancel={this.onCancelEditHandler}
            key={post.id}
          />
        )
      );
    }

    return (
      <Aux>
        {post}
        <Comments postId={this.props.match.params.id} />
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    singlePost: state.post.singlePost,
    comments: state.comment.comments,
    loading: state.post.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeletePost: (id, token) => dispatch(actions.deletePost(id, token)),
    onFetchSinglePost: id => dispatch(actions.fetchSinglePost(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(SinglePost, axios));
