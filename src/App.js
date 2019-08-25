import React, { Component } from "react";

import Layout from "./hoc/Layout/Layout";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import { Route, Switch, Redirect } from "react-router-dom";
import Blog from "./containers/Blog/Blog";
import NewPost from "./containers/Blog/NewPost/NewPost";
import SinglePost from "./containers/Blog/SinglePost/SinglePost";

import {connect} from 'react-redux';
import * as actions from './store/actions/index';

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  // login = (token, userId, displayName) => {
  //   this.setState({ token: token, userId: userId, displayName: displayName });
  // };

  // logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("expirationDate");
  //   localStorage.removeItem("userId");
  //   localStorage.removeItem("displayName");
  //   this.setState({ token: null, userId: null, displayName: null });
  // };

  // setAuthRedirectPath = (path, commenting) => {
  //   this.setState({ authRedirectPath: path, commenting: commenting });
  // };

  // checkAuthTimeout = expirationTime => {
  //   setTimeout(() => {
  //     this.logout();
  //   }, expirationTime * 1000);
  // };

  // authCheckState = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     this.logout();
  //   } else {
  //     const expirationDate = new Date(localStorage.getItem("expirationDate"));
  //     if (expirationDate > new Date()) {
  //       const userId = localStorage.getItem("userId");
  //       const displayName = localStorage.getItem("displayName");
  //       this.login(token, userId, displayName);
  //       this.checkAuthTimeout(
  //         (expirationDate.getTime() - new Date().getTime()) / 1000
  //       );
  //     } else {
  //       this.logout();
  //     }
  //   }
  // };

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/posts/:id" component={SinglePost} exact />
        <Route path="/" component={Blog} exact />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.token !== null) {
      routes = (
        <Switch>
          <Route path="/new-post" component={NewPost} /> }
          <Route path="/logout" component={Logout} />
          <Route path="/auth" component={Auth} />
          <Route path="/posts/:id" component={SinglePost} exact />
          <Route path="/" component={Blog} exact />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div>
          <Layout>
            {routes}
          </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
