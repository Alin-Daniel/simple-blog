import * as actionTypes from "./actionTypes";
import axios from "../../axios-posts";

export const createPostStart = () => {
  return {
    type: actionTypes.CREATE_POST_START
  };
};

export const createPostSuccess = (newPost, id) => {
  return {
    type: actionTypes.CREATE_POST_SUCCESS,
    newPost: newPost,
    id: id
  };
};

export const createPostFail = error => {
  return {
    type: actionTypes.CREATE_POST_FAIL,
    error: error
  };
};

export const createPost = (newPost, token) => {
  return dispatch => {
    axios
      .post("/posts.json?auth=" + token, newPost)
      .then(response => {
        newPost = {
          ...newPost,
          date: new Date(newPost.date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
        }
        dispatch(createPostSuccess(newPost, response.data.name));
      })
      .catch(error => {
        dispatch(createPostFail(error));
      });
  };
};

export const fetchPostsStart = () => {
  return {
    type: actionTypes.FETCH_POSTS_START
  };
};

export const fetchPostsSuccess = posts => {
  return {
    type: actionTypes.FETCH_POSTS_SUCCESS,
    posts: posts
  };
};

export const fetchPostsFail = error => {
  return {
    type: actionTypes.FETCH_POSTS_FAILED,
    error: error
  };
};

export const fetchPosts = () => {
  return dispatch => {
    dispatch(fetchPostsStart());
    axios
      .get("/posts.json")
      .then(response => {
        if (response.data) {
          const posts = Object.keys(response.data)
            .map(key => {
              return {
                id: key,
                ...response.data[key],
                date: new Date(response.data[key].date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
              };
            })
            .sort();
          dispatch(fetchPostsSuccess(posts));
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchPostsFail(error));
      });
  };
};

export const deletePostStart = () => {
  return {
    type: actionTypes.DELETE_POST_START
  };
};

export const deletePostSuccess = id => {
  return {
    type: actionTypes.DELETE_POST_SUCCESS,
    id: id
  };
};

export const deletePostFail = error => {
  return {
    type: actionTypes.DELETE_POST_FAIL,
    error: error
  };
};

export const deletePost = (id, token) => {
  return dispatch => {
    dispatch(deletePostStart);
    axios
      .delete("/posts/" + id + ".json?auth=" + token)
      .then(response => {
        dispatch(deletePostSuccess(id));
      })
      .catch(error => {
        dispatch(deletePostFail(error));
      });
  };
};

export const fetchSinglePostStart = () => {
  return {
    type: actionTypes.FETCH_SINGLE_POST_START
  };
};

export const fetchSinglePostSuccess = singlePost => {
  return {
    type: actionTypes.FETCH_SINGLE_POST_SUCCESS,
    singlePost: singlePost
  };
};

export const fetchSinglePostFail = error => {
  return {
    type: actionTypes.FETCH_SINGLE_POST_FAIL,
    error: error
  };
};

export const fetchSinglePost = id => {
  return dispatch => {
    dispatch(fetchSinglePostStart());
    axios
      .get('/posts.json?orderBy="$key"&equalTo="' + id + '"')
      .then(response => {
        const singlePost = Object.keys(response.data).map(key => {
          return {
            id: key,
            ...response.data[key],
            date: new Date(response.data[key].date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
          };
        });
        dispatch(fetchSinglePostSuccess(singlePost));
      })
      .catch(error => {
        dispatch(fetchSinglePostFail(error));
      });
  };
};


export const editPostStart = () => {
  return{
    type: actionTypes.EDIT_POST_START
  };
};

export const editPostSuccess = (editedPost) => {
  return{
    type: actionTypes.EDIT_POST_SUCCESS,
    editedPost: editedPost
  };
};

export const editPostFail = (error) => {
  return{
    type: actionTypes.EDIT_POST_FAIL,
    error: error
  };
};

export const editPost = (postId, token, editedPost) => {
  return dispatch => {
    dispatch(editPostStart());
    axios.patch('/posts/' + postId + '.json?auth=' + token, editedPost)
    .then(response => {
      editedPost = {
        id: postId,
        ...editedPost,
        date: new Date(editedPost.date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})
      };
      dispatch(editPostSuccess(editedPost));
    })
    .catch(error => {
      console.log(error);
      dispatch(editPostFail(error));
    });
  };
};