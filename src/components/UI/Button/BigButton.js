import React from "react";

import "./BigButton.css";

const bigButton = props => {
  const btnClasses = ["BigButton"];
  if (props.btnType) {
    btnClasses.push(props.btnType);
  }
  return (
    <button
      disabled={props.disabled}
      style={props.style}
      className={btnClasses.join(" ")}
    >
      {props.children}
    </button>
  );
};

export default bigButton;
