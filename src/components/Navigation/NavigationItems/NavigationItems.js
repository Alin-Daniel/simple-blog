import React from "react";

import NavigationItem from "./NavigationItem/NavigationItem";
import "./NavigationItems.css";

const navigationItems = props => (
  <ul className={"NavigationItems"}>
    <NavigationItem link="/" exact>
      All Posts
    </NavigationItem>
    {props.isAuthenticated ? <NavigationItem link="/new-post">New Post</NavigationItem> : null}
    {!props.isAuthenticated ? (
      <NavigationItem link="/auth">Authenticate</NavigationItem>
    ) : (
      <NavigationItem link="/logout">Logout</NavigationItem>
    )}
  </ul>
);

export default navigationItems;
