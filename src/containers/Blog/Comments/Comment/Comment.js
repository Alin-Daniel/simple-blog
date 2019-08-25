import React, { Component } from "react";
import EditComment from "../EditComment/EditComment";
import Button from "../../../../components/UI/Button/Button";
import Replies from '../Replies/Replies';
import {connect} from 'react-redux';
import * as actions from '../../../../store/actions/index';
//import {replies} from '../../../../shared/utility';

class Comment extends Component {
   render() {
    let comments = null;
    if (this.props.comments) {  
      // console.log(this.props.comments); 

      comments = this.props.comments.map(comment => (
        <div className={"Comment"} key={comment.id}>
          {!(this.props.editing || this.props.reply) ||
          comment.id !== this.props.selectedComment ? (
            <div className="CommentBody">
              <div className={"Comment--header"}>
                <div className={"Comment--author"}><strong>{comment.displayName}</strong></div>
                <span className={"Comment--date"}><time dateTime={comment.date}>{comment.date}</time></span>
              </div>
              <div className={"Comment--content"}>
                <p>{comment.content}</p>
              </div>
              <div className="Comment--actions">
                <Button
                  btnType={"Success"}
                  clicked={() => this.props.onReply(comment.id)}
                >
                  {this.props.token ? 'Reply' : 'Login'}
                </Button>
                {this.props.userId === comment.userId && (
                  <Button
                    btnType={"Success"}
                    clicked={() => this.props.onEdit(comment.id)}
                  >
                    Edit
                  </Button>
                )}
                {this.props.userId === comment.userId && (
                  <Button
                  btnType={"Danger"}
                  clicked={() =>
                    this.props.onDeleteComment(
                      this.props.postId,
                      comment.id,
                      this.props.token
                      )
                    }
                    >
                    Delete
                  </Button>
                )}
              </div>
              <Replies comment={comment} commentId={comment.id} postId={this.props.postId}/>      
            </div>
          ) : (
            <EditComment
            cancelEdit={this.props.cancelEdit}
            commentId={comment.id}
            selectedReply={this.props.selectedComment}
            postId={this.props.postId}
              value={this.props.reply ? "" : comment.content}
              isReply={this.props.reply}
              />
              )}
        </div>
      ));
    }
    return comments;
       
  }
}

const mapSTateToProps = state => {
  return {
    replies: state.comment.replies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchComments: (postId) => dispatch(actions.fetchComments(postId))
  };
};

export default connect(mapSTateToProps, mapDispatchToProps)(Comment);
