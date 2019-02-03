/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WelcomeAppBar from './WelcomeAppNavBar';
import logo from '../assets/logo.png';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      top: 50,
      left: 50
    };
  }

  getModalStyle() {
    const { top, left } = this.state;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  render() {
    const { auth } = this.props;
    return (
      <div>
        <WelcomeAppBar optionActive="Inicio" auth={auth} />
        <div className="main">
          <div className="inicio">
            <img className="logo" src={logo} alt="Logo" height="42" width="42" />
          </div>
          <h1>Bienvenido a motitoreo de SUDS Uniandes</h1>
        </div>
      </div>
    );
  }
}
Welcome.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired
};
export default Welcome;
