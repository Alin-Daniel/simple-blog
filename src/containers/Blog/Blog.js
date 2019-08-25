import React, { Component } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Posts from "./Posts/Posts";
import "./Blog.css";

class Blog extends Component {
  render() {
    return (
      <Aux>
        <div className={"Blog"}>
          <Posts />
        </div>
      </Aux>
    );
  }
}

export default Blog;
