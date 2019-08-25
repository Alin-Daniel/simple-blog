import React, { Component } from "react";
import Aux from "../Auxiliary/Auxiliary";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import  {connect} from 'react-redux';

import "./Layout.css";

class Layout extends Component {
  state = {
    showSideDrawer: false
  };


  sideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return {
        showSideDrawer: !prevState.showSideDrawer
      };
    });
  };

  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false});
  };

  render() {
    return (
      <Aux>
        <Toolbar
          drawerToggleClicked={this.sideDrawerToggleHandler}
          isAuth={this.props.token !== null}
        />
        <SideDrawer
          isAuth={this.props.token !== null}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <main className={"Main--content"}>{this.props.children}</main>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(Layout);
