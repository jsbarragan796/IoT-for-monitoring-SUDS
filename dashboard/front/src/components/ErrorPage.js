import React, { Component } from 'react';
import logo from '../assets/logo.png';


class ErrorPage extends Component {

  render() {
    return (
      <div className="main">
        <div className="inicio">       
          <img className="logo" src={logo} alt="Logo"/>
        </div>
        <div className="center-div">       
          <h1 >
          La pagina no existe. 
          </h1>
        </div>

      </div>
    );
  }
}

export default ErrorPage;
