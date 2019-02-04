import React, { Component } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import HistogramGraph from './HistogramGraph';
import logo from '../assets/logo.png';

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
      .get(`${process.env.REACT_APP_HISTORICAL_SERVING}/events/current-events?pageNumber=1`)
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
    console.log(process.env.REACT_APP_HISTORICAL_SERVING);
    let s = '';
    let w = '';
    let e = '';
    let dif = '';
    let final = '';
    const { data } = this.state;
    if (data && data.events && data.events.length > 0) {
      s = <HistogramGraph data={data.events[0].entrylevel} data2={data.events[0].exitlevel} />;
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      w = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString(
        'es-US',
        options
      );
      e = new Date(
        Number(String(data.events[0].lastMeasurementDate).substr(0, 13))
      ).toLocaleDateString('es-US', options);
      dif = Number(String(data.events[0].lastMeasurementDate - data.events[0].startDate));
      dif /= 1e11;
      dif = `${Math.round(dif / 60)}:${Math.round(dif % 60)}`;
      final = (
        <div className="main">
          <Card>
            <CardHeader
              title="Evento en curso"
            />
            <CardContent>
              {s}
              <br />
              <Divider />
              <br />
              <Grid container justify="center" alignItems="center" spacing={8}>
                <Grid item xs={4}>
                  <Typography color="inherit" variant="h6">
                    {`Duración  : ${dif} horas`}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="inherit" variant="h6">
                    {`El evento inició : ${w}`}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="inherit" variant="h6">
                    {`El último dato se recibió :${e}`}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      final = (
        <div className="main">
          <Card>
            <CardHeader
              title="No hay enentos en curso"
            />
            <CardContent>
              <br />
              <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
                <Grid item xs={6}>
                  <img src={logo} alt="Logo" width="300px" />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="inherit" variant="h6">
                    Tan pronto  inicie un evento se mostrará la información
                  </Typography>
                </Grid>
              </Grid>
              <br />
            </CardContent>
          </Card>
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
