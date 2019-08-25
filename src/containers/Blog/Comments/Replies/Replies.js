import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";
import Button from "../../../../components/UI/Button/Button";
import EditComment from "../EditComment/EditComment";

import "./Replies.css";

class Replies extends Component {
  state = {
    isEditing: false,
    selectedReply: null,
    reply: false
  };
 
  onReplyHandler = replyId => {
    this.setState({reply: true});
    this.setState({selectedReply: replyId});
  }

  onEditHandler = replyId => {
    this.setState({ isEditing: true });
    this.setState({ selectedReply: replyId });
  };

  onCancelEdit = () => {
    this.setState({ isEditing: false });
    this.setState({reply: false});
  };

  render() {
    let replies = null;
    if (this.props.comment.replies) {
      replies = Object.keys(this.props.comment.replies)
        .map(key => {
          return {
            ...this.props.comment.replies[key],
            key: key,
            date: new Date(this.props.comment.replies[key].date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
          };
        })
        .map((reply, index) => {
          return !(this.state.isEditing || this.state.reply) ||
            this.state.selectedReply !== reply.id ? (
            <div className={"Reply"} key={reply.id}>
              <div className="ReplyBody">
                <div className="Reply--header">
                  <div className={'Reply--author'}><strong>{reply.displayName}</strong></div>
                  <span className={'Reply--date'}><time dateTime={reply.date}>{reply.date}</time></span>
                </div>
                <div className="Reply--content">
                  <p>{reply.content}</p>
                </div>
                <div className="Reply--actions">
                <Button
                    clicked={() => this.onReplyHandler(reply.id)}
                    btnType="Success"
                  >
                    Reply
                  </Button>
                {this.props.token && this.props.userId===reply.userId ?<Button
                    clicked={() => this.onEditHandler(reply.id)}
                    btnType="Success"
                  >
                    Edit
                  </Button> : null }
                  {this.props.token && this.props.userId===reply.userId ?<Button
                    btnType="Danger"
                    clicked={() =>
                      this.props.onDeleteReply(
                        this.props.postId,
                        reply.id,
                        this.props.token
                      )
                    }
                  >
                    Delete
                  </Button>: null}
                </div>
                {reply.replies && <Replies {...this.props} comment={reply} />}
              </div>
            </div>
          ) : (
            <EditComment
              key={reply.id}
              value={this.state.reply ? '' : reply.content}
              cancelEdit={this.onCancelEdit}
              onEditReply={this.props.onEditReply}
              replyId={reply.id}
              isEditReply={this.state.isEditing}
              isReply={this.state.reply}
              postId={this.props.postId}
              commentId={reply.commentId}
              selectedReply={this.state.selectedReply}
              onCreateReply={this.props.onCreateReply}
            />
          );
        });
    }

    return replies;
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    replies: state.comment.replies,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onEditReply: (commentId, postId, token, editedComment) =>
      dispatch(actions.editComment(commentId, postId, token, editedComment)),
    onDeleteReply: (postId, id, token) =>
      dispatch(actions.deleteComment(postId, id, token)),
    onCreateReply: (postId, token, newComment) => dispatch(actions.createComment(postId, token, newComment))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Replies);