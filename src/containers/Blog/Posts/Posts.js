import React, { Component } from "react";

import Post from "../../../components/Post/Post";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../../axios-posts";
import Spinner from '../../../components/UI/Spinner/Spinner';

import "./Posts.css";

class Posts extends Component {
  state = {
    people: ""
  };
  componentDidMount() {
    this.props.onCommenting(false);
    this.props.onFetchPosts();
  }

  singlePostHandler = id => {
    this.props.history.push("/posts/" + id);
  };

  onShowAllCommentsHandler = post => {
    let comments = 0;
    if (post.comments) {
      return comments = Object.keys(post.comments).length;
    }
    return comments;
  };

  render() {
    let posts = null;
    if (!this.props.error) {
      posts = this.props.posts.map(post => (
        <Post
          key={post.id}
          title={post.title}
          id={post.id}
          displayName={post.displayName}
          content={post.content}
          date={post.date}
          clicked={() => this.singlePostHandler(post.id)}
          comments={post.comments}
          totalComments={this.onShowAllCommentsHandler(post)}
        />
      ));
    }
    return (
      <div>
        {this.props.loading ? <Spinner /> : <section className={"Posts"}>{posts}</section>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.post.posts,
    error: state.post.error,
    loading: state.post.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchPosts: () => dispatch(actions.fetchPosts()),
    onCommenting: commenting => dispatch(actions.commenting(commenting))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withErrorHandler(Posts, axios))
);
