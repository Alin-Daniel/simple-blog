import React from "react";
import blogLogo from "../../assets/images/react-logo.png";
import './Logo.css';

const logo = (props) => (
  <div className={'Logo'}>
    <img src={blogLogo} alt="logo" />
  </div>
);

export default logo;
