import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';


const initialState = {
    token: null,
    userId: null,
    displayName: null,
    authRedirectPath: '/',
    loading: false,
    error: null
};

const authStart = (state=initialState, action) => {
    return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        userId: action.userId,
        displayName: action.displayName,
        error: null,
        loading: false
    });
};

const authFail = (state,action) => {
    return updateObject(state, {
        error: action.error,
         loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        userId: null,
        displayName: null
    });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, {authRedirectPath: action.path});
};

const createUserStart = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

const createUserSuccess = (state, action) => {
    return updateObject(state, {
        loading: false
    });
};

const createUserFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    });
};

const checkUserExistsStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const checkUserExistsSuccess = (state, action) => {
    return updateObject(state, {loading: false});
};

const checkUserExistsFail = (state, action) => {
    return updateObject(state, {loading: false, error: action.error});
};

const reducer = (state= initialState, action)=>{
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        case actionTypes.CREATE_USER_START: return createUserStart(state, action);
        case actionTypes.CREATE_USER_SUCCESS: return createUserSuccess(state, action);
        case actionTypes.CREATE_USER_FAIL: return createUserFail(state, action);
        case actionTypes.CHECK_USER_EXISTS_START: return checkUserExistsStart(state, action);
        case actionTypes.CHECK_USER_EXISTS_SUCCESS: return checkUserExistsSuccess(state, action);
        case actionTypes.CHECK_USER_EXISTS_FAIL: return checkUserExistsFail(state, action);
        default: return state;
    };
};

export default reducer;