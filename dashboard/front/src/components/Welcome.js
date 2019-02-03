/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WelcomeAppBar from './WelcomeAppNavBar';
import logo from '../assets/logo.png';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      width: null,
      height: null
    };
  }

  render() {
    const { auth } = this.props;
    return (
      <div>
        <WelcomeAppBar optionActive="Inicio" auth={auth} />
        <div className="main">
          <div className="inicio">
            <img className="logo" height="100" src={logo} alt="Logo" />
          </div>
          <h1>hola</h1>
        </div>
      </div>
    );
  }
}
Welcome.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired
};
export default Welcome;
