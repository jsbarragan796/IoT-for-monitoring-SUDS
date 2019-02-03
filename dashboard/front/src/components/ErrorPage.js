import React from 'react';
import logo from '../assets/logo.png';

const ErrorPage = () => (
  <div className="main">
    <div className="inicio">
      <img className="logo" src={logo} alt="Logo" />
    </div>
    <div className="center-div">
      <h1>La página no existe.</h1>
    </div>
  </div>
);

export default ErrorPage;
