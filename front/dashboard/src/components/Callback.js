import React, { Component } from 'react';
import logo from '../logo.png';
import Auth0 from './Auth0';

class Callback extends Component {

  constructor (props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentDidMount(){
    const auth = new Auth0();
    auth.handleAuthentication();
  }

  render() {
    return (
      <div className="main">
        <div className="center-div">       
          <img className="logo" src={logo} alt="Logo"/>
        </div>
        <div className="center-div">       
          <h1 >
            Callback
          </h1>
        </div>

      </div>
    );
  }
}

export default Callback;