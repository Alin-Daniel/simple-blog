import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';


const initialState = {
    posts: [],
    loading: false,
    error: false,
    singlePost: []
};

const createPostStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const createPostSuccess = (state, action) => {
    const newPost = updateObject(action.newPost, {id: action.id});
    return updateObject(state, {
        posts: state.posts.concat(newPost),
        loading: false
    });
};

const createPostFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const fetchPostsStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const fetchPostsSuccess = (state, action) => {
    return updateObject(state, {
        posts: action.posts,
        loading: false
    })
};

const fetchPostsFailed = (state, action) => {
    return updateObject(state, {loading: false, error: action.error});
};

const deletePostStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const deletePostSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        singlePost: [...state.singlePost].filter(post => post.id !== action.id),
        posts: [...state.posts].filter(post => post.id !== action.id)
    });
};

const deletePostFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    });
};

const fetchSinglePostStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const fetchSinglePostSuccess = (state, action) => {
    return updateObject(state, {loading: false, singlePost: action.singlePost});
};

const fetchSinglePostFail = (state, action) => {
    return updateObject(state, {loading: false, error: action.error});
};

const editPostStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const editPostSuccess = (state, action) => {
    const updatedPost = [...state.singlePost];
    updatedPost[0] = action.editedPost;

    return updateObject(state, {
        singlePost: updatedPost,
        loading: false
    });
};

const editPostFail = (state, action) => {
    return updateObject(state, {loading: false, error: action.error});
};


const reducer = (state=initialState, action) => {
    switch(action.type) {
        case actionTypes.CREATE_POST_START: return createPostStart(state,action);
        case actionTypes.CREATE_POST_SUCCESS: return createPostSuccess(state,action);
        case actionTypes.CREATE_POST_FAIL: return createPostFail(state, action);
        case actionTypes.FETCH_POSTS_START: return fetchPostsStart(state, action);
        case actionTypes.FETCH_POSTS_SUCCESS: return fetchPostsSuccess(state, action);
        case actionTypes.FETCH_POSTS_FAILED: return fetchPostsFailed(state, action);
        case actionTypes.DELETE_POST_START: return deletePostStart(state,action);
        case actionTypes.DELETE_POST_SUCCESS: return deletePostSuccess(state, action);
        case actionTypes.DELETE_POST_FAIL: return deletePostFail(state,action);
        case actionTypes.FETCH_SINGLE_POST_START: return fetchSinglePostStart(state, action);
        case actionTypes.FETCH_SINGLE_POST_SUCCESS: return fetchSinglePostSuccess(state, action);
        case actionTypes.FETCH_SINGLE_POST_FAIL: return fetchSinglePostFail(state, action);
        case actionTypes.EDIT_POST_START: return editPostStart(state, action);
        case actionTypes.EDIT_POST_SUCCESS: return editPostSuccess(state, action);
        case actionTypes.EDIT_POST_FAIL: return editPostFail(state, action);
        default: return state;
    };
};

export default reducer;