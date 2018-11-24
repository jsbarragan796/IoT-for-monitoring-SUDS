import React, { Component } from 'react';
import Data from './Data';

class Main extends Component {


  render() {
    return (
      
        <div className="center-div">       
          <h3>
              Has iniciado sesión correctamente. 
          </h3>
          <button onClick={()=>{this.props.auth.logout()}}  className="btn btn-danger btn-lg btn-block">
          cerrar sesión
          </button>
          <Data />
        </div>
    );
  }
}

export default Main;