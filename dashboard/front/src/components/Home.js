import React, { Component } from 'react';
import axios from 'axios';
import { Alert } from 'reactstrap';
import AppNavBar from './AppNavBar';
import EventsRealTime from './EventsRealTime';
import logo from '../assets/logo.png';

class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: null,
      errorStatus: false,
      errorMessage: ''
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
    axios.get('events/current-events?pageNumber=1')
      .then((response) => {
        this.setState({ data: response.data });
        const { data } = this.state;
        console.log(data);
      })
      .catch((err) => {
        this.setState({ errorStatus: true, errorMessage: err.message });
      });
  }

  showErrorMessage () {
    const { errorStatus, errorMessage } = this.state;
    if (errorStatus) {
      return (
        <Alert color="danger">
         Ha ocurrido un problema, comuniquese con el administrador del sistema.
         Por favor comuníquele el siguinte mensaje :
          {' '}
          {errorMessage}
        </Alert>);
    }

    return '';
  }

  update () {
    setInterval(() => {
      this.loadData();
      console.log('getting data');
    }, 15000);
  }

  render () {
    this.update();
    let s = '';
    let w = '';
    let e = '';
    if (this.state.data && this.state.data.events.length > 0) {
      s = <EventsRealTime data={this.state.data.events[0].entry} data2={this.state.data.events[0].exit} />;
      w = new Date((this.state.data.events[0].startDate) / 1e6).toString();
      e = new Date((this.state.data.events[0].lastMeasurementDate) / 1e6).toString();
    }
    return (
      <div>
        <AppNavBar optionActive="Inicio" />
        {this.showErrorMessage()}
        <div className="main">
          <div className="inicio">
            <img className="logo" height="100" src={logo} alt="Logo" />
          </div>
          <h2>
            Datos evento en curso:
          </h2>
          {s}
          <p>
            Fecha de inicio:
            {' '}
            {w}
          </p>
          <p>
            Fecha último dato recibido:
            {' '}
            {e}
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
