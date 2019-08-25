import React from "react";

import './Button.css';

const button = props => (
  <button
    type={props.type}
    onClick={props.clicked}
    className={props.btnType}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);

export default button;
