import * as actionTypes from "./actionTypes";
import axios from "../../axios-posts";
import config from '../../config';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId, displayName) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId,
    displayName: displayName
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const createUserStart = () => {
  return {
    type: actionTypes.CREATE_USER_START
  };
};

export const createUserSuccess = () => {
  return {
    type: actionTypes.CREATE_USER_SUCCESS
  };
};

export const createUserFail = error => {
  return {
    type: actionTypes.CREATE_USER_START,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("displayName");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");

  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const checkUserExistsStart = () => {
  return {
    type: actionTypes.CHECK_USER_EXISTS_START
  };
};

export const checkUserExistsSuccess = () => {
  return {
    type: actionTypes.CHECK_USER_EXISTS_SUCCESS
  };
};

export const checkUserExistsFail = (error) => {
  return {
    type: actionTypes.CHECK_USER_EXISTS_FAIL,
    error: error
  };
};

export const checkUserExists = displayName => {
  return dispatch => {
    dispatch(checkUserExistsStart());
      return axios.get("https://mini-blog-c3c8a.firebaseio.com/users.json").then(
      response => {
        if(response.data){
          const users = Object.keys(response.data).map(key => {
            return {
              id: key,
              ...response.data[key]
            };
          });
          const index = users.findIndex(user => user.displayName === displayName);
          if (index > -1) {
            throw new Error("username already exists");
          }
          dispatch(checkUserExistsSuccess());
        }
      },
      error => {
        throw error;
      }
    );
  };
};

export const createUser = displayName => {
  return dispatch => {
    dispatch(createUserStart());
    axios
      .post("https://mini-blog-c3c8a.firebaseio.com/users.json", {
        displayName: displayName
      })
      .then(response => {
        dispatch(createUserSuccess());
      })
      .catch(error => {
        dispatch(createUserFail(error));
        console.log(error);
      });
  };
};

export const makeAuthRequest = (url, authData, dispatch) => {
  axios
    .post(url, authData)
    .then(response => {
      const expirationDate = new Date(
        new Date().getTime() + response.data.expiresIn * 1000
      );
      localStorage.setItem("token", response.data.idToken);
      localStorage.setItem("expirationDate", expirationDate);
      localStorage.setItem("userId", response.data.localId);
      localStorage.setItem("displayName", response.data.displayName);
      dispatch(
        authSuccess(
          response.data.idToken,
          response.data.localId,
          response.data.displayName
        )
      );
      dispatch(checkAuthTimeout(response.data.expiresIn));
    })
    .catch(error => {
      dispatch(authFail(error.response.data.error));
    });
};

export const auth = (email, password, displayName, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      displayName: displayName,
      returnSecureToken: true
    };
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + config.key;
    if (!isSignUp) {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + config.key;
    }

    if (isSignUp) {
      return dispatch(checkUserExists(displayName))
        .then(() => {
          makeAuthRequest(url, authData, dispatch);
          dispatch(createUser(displayName));
        })
        .catch(error => {
          dispatch(checkUserExistsFail(error));
        });
    }
    makeAuthRequest(url, authData, dispatch);
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (new Date() < expirationDate) {
        const userId = localStorage.getItem("userId");
        const displayName = localStorage.getItem("displayName");
        dispatch(authSuccess(token, userId, displayName));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      } else {
        dispatch(logout());
      }
    }
  };
};
