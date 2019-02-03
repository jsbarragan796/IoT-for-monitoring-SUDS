import React, { Component } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import EventsRealTime from './EventsRealTime';

class RealTimeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      errorStatus: false,
      errorMessage: ''
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.update();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  loadData() {
    axios
      .get('/events/current-events?pageNumber=1')
      .then((response) => {
        this.setState({ data: response.data, errorStatus: false });
      })
      .catch((err) => {
        this.setState({ errorStatus: true, errorMessage: err.message });
      });
  }

  showErrorMessage() {
    const { errorStatus, errorMessage } = this.state;
    if (errorStatus) {
      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open
          variant="error"
          autoHideDuration={6000}
          message={(
            <span id="message-id">
              {' '}
              Ha ocurrido un problema, comuniquese con el administrador del sistema y por favor
              comuníquele el siguinte mensaje :
              {' '}
              {errorMessage}
            </span>
)}
        />
      );
    }
    return '';
  }

  update() {
    this.loadData();
    this.timer = setInterval(() => {
      this.loadData();
    }, 2000);
  }

  render() {
    let s = '';
    let w = '';
    let e = '';
    let final = '';
    const { data } = this.state;
    if (data && data.events.length > 0) {
      s = (
        <EventsRealTime
          data={data.events[0].entrylevel}
          data2={data.events[0].exitlevel}
        />
      );
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      w = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString(
        'es-US',
        options
      );
      e = new Date(
        Number(String(data.events[0].lastMeasurementDate).substr(0, 13))
      ).toLocaleDateString('es-US', options);
      final = (
        <div className="main">
          <h2>Datos evento en curso:</h2>
          {s}
          <p>
            Fecha de inicio:
            {w}
          </p>
          <p>
            Fecha último dato recibido:
            {e}
          </p>
        </div>
      );
    } else {
      final = (
        <div className="main">
          <h2>No se tienen eventos en curso</h2>
        </div>
      );
    }
    return (
      <div>
        {this.showErrorMessage()}
        {final}
      </div>
    );
  }
}
export default RealTimeData;
