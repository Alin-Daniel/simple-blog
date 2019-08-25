import React from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import "./Post.css";

const post = props => {
  const commentIcon = <FontAwesomeIcon icon= {faComments} />;
  return (
    <Aux>
      <article className={"Post"}>
        <h1 onClick={props.clicked}>{props.title}</h1>
        <div className={"PostBody"}>
          <div className="Post--header">
            <div className={"Post--author"}>By: {props.displayName}</div>
            <span className={"Post--date"}>
              <time dateTime={props.date}>{props.date}</time>
            </span>
            <span className={'Post--counter'}>{commentIcon} {props.totalComments} comments</span>
          </div>
          <div className={"Post--content"}>
            <p>{props.content}</p>
          </div>
        </div>
      </article>
    </Aux>
  );
};

export default post;
