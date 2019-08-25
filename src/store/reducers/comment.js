import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  comments: [],
  loading: false,
  error: false,
  commenting: false
};

const commenting = (state, action) => {
  return updateObject(state, { commenting: action.commenting });
};

const fetchCommentsStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCommentsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    comments: action.comments
  });
};

const fetchCommentsFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const createCommentStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const createCommentSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    comments: state.comments.concat(action.comment)
  });
};

const createCommentFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const deleteCommentStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const deleteCommentSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    comments: state.comments.filter(comment => comment.id !== action.id)
  });
};

const deleteCommentFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const editCommentStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const editCommentSuccess = (state, action) => {
  const index = state.comments.findIndex(
    comment => comment.id === action.editedComment.id
  );
  const updatedComments = state.comments.slice(0);
  updatedComments[index].content = action.editedComment.content;

  return updateObject(state, {
    loading: false,
    comments: updatedComments
  });
};

const editCommentFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COMMENTING:
      return commenting(state, action);
    case actionTypes.FETCH_COMMENTS_START:
      return fetchCommentsStart(state, action);
    case actionTypes.FETCH_COMMENTS_SUCCESS:
      return fetchCommentsSuccess(state, action);
    case actionTypes.FETCH_COMMENTS_FAILED:
      return fetchCommentsFail(state, action);
    case actionTypes.CREATE_COMMENT_START:
      return createCommentStart(state, action);
    case actionTypes.CREATE_COMMENT_SUCCESS:
      return createCommentSuccess(state, action);
    case actionTypes.CREATE_COMMENT_FAIL:
      return createCommentFail(state, action);
    case actionTypes.DELETE_COMMENT_START:
      return deleteCommentStart(state, action);
    case actionTypes.DELETE_COMMENT_SUCCESS:
      return deleteCommentSuccess(state, action);
    case actionTypes.DELETE_COMMENT_FAIL:
      return deleteCommentFail(state, action);
    case actionTypes.EDIT_COMMENT_START:
      return editCommentStart(state, action);
    case actionTypes.EDIT_COMMENT_SUCCESS:
      return editCommentSuccess(state, action);
    case actionTypes.EDIT_COMMENT_FAIL:
      return editCommentFail(state, action);  
    default:
      return state;
  }
};

export default reducer;
