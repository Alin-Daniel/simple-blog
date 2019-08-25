import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-posts";

export const commenting = commenting => {
  return {
    type: actionTypes.COMMENTING,
    commenting: commenting
  };
};

export const fetchCommentsStart = () => {
  return {
    type: actionTypes.FETCH_COMMENTS_START
  };
};

export const fetchCommentsSuccess = comments => {
  return {
    type: actionTypes.FETCH_COMMENTS_SUCCESS,
    comments: comments
  };
};

export const fetchCommentsFail = error => {
  return {
    type: actionTypes.FETCH_COMMENTS_FAILED,
    error: error
  };
};

export const fetchComments = postId => {
  return dispatch => {
    dispatch(fetchCommentsStart());
    axios
      .get("/posts/" + postId + '/comments.json?&orderBy="$key"')
      .then(response => {
        let comments = null;
        if (response.data !== null) {
          comments = Object.keys(response.data)
            .map(key => {
              return {
                id: key,
                ...response.data[key],
                date: new Date(response.data[key].date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
              };
            })
            .sort();
        } else {
          comments = [];
        }
        dispatch(fetchCommentsSuccess(comments));
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchCommentsFail(error));
      });
  };
};

export const createCommentStart = () => {
  return {
    type: actionTypes.CREATE_COMMENT_START
  };
};

export const createCommentSuccess = comment => {
  return {
    type: actionTypes.CREATE_COMMENT_SUCCESS,
    comment: comment
  };
};

export const createCommentFail = error => {
  return {
    type: actionTypes.CREATE_COMMENT_FAIL,
    error: error
  };
};

export const createComment = (postId, token, newComment) => {
  return dispatch => {    
      dispatch(createCommentStart());
    const url = "/posts/" + postId + "/comments.json?auth=" + token;
   
    axios
      .post(url, newComment)
      .then(response => {
        const modifiedComment = {
          id: response.data.name,
          ...newComment,
          date: new Date(newComment.date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
        };
          dispatch(createCommentSuccess(modifiedComment));
      })
      .catch(error => {
        console.log(error);
          dispatch(createCommentFail(error));
      });
  };
};



export const deleteCommentStart = () => {
  return {
    type: actionTypes.DELETE_COMMENT_START
  };
};

export const deleteCommentSuccess = id => {
  return {
    type: actionTypes.DELETE_COMMENT_SUCCESS,
    id: id
  };
};

export const deleteCommentFail = error => {
  return {
    type: actionTypes.DELETE_COMMENT_FAIL,
    error: error
  };
};

export const deleteComment = (postId, id, token) => {
  return dispatch => {
    dispatch(deleteCommentStart());
    axios
      .delete("/posts/" + postId + "/comments/" + id + ".json?auth=" + token)
      .then(response => {
        dispatch(deleteCommentSuccess(id));
      })
      .catch(error => {
        console.log(error);
        dispatch(deleteCommentFail(error));
      });
  };
};

export const editCommentStart = () => {
  return {
    type: actionTypes.EDIT_COMMENT_START
  };
};

export const editCommentSuccess = (editedComment) => {
  return {
    type: actionTypes.EDIT_COMMENT_SUCCESS,
    editedComment: editedComment
  };
};

export const editCommentFail = (error) => {
  return {
    type: actionTypes.EDIT_COMMENT_FAIL,
    error: error
  };
};

export const editComment = (commentId, postId, token, editedComment) => {
  return dispatch => {
    dispatch(editCommentStart());
    axios.patch('/posts/' + postId + '/comments/' + commentId + '.json?auth=' + token, editedComment)
    .then(response => {
      editedComment = {
        id: commentId,
        ...editedComment
      };
      dispatch(editCommentSuccess(editedComment));
      // other easier alternative dispatch(fetchComments(postId));
    })
    .catch(error => {
      dispatch(editCommentFail(error));
      console.log(error);
    });
  };
};