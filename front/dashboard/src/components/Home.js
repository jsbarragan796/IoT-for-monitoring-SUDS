import React, { Component } from 'react';
import logo from '../logo.png';
import Main from './Main';


class Home extends Component {

  render() {
    let resp = ''
    if(this.props.auth.isAuthenticated()===false){
        resp = (
        <div className="center-div">       
          <button onClick={()=>{this.props.auth.login()}}  className="btn btn-dark btn-lg btn-block">
          Iniciar sesión
          </button>
        </div>
        );
    }
    else {
        resp = (<Main auth={this.props.auth} />);
    }
    return (
      <div className="main">
        <div className="center-div">       
          <img className="logo" src={logo} alt="Logo"/>
        </div>
        <div className="center-div">       
          {resp}
        </div>

      </div>
    );
  }
}

export default Home;
