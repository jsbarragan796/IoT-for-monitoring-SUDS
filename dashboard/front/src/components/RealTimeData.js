import React, { Component } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import DinamicGraph from './DinamicGraph';
import connectionHandler from '../socketIo';
import logo from '../assets/logo.png';

class RealTimeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      errorStatus: false,
      errorMessage: '',
      showRain: false,
      socketIoData: ''
    };
    this.loadData = this.loadData.bind(this);
    this.handleChangeRain = this.handleChangeRain.bind(this);
  }

  componentDidMount() {
    this.update();
    connectionHandler.subscribeToTimer((err, timestamp) => {
      this.setState({ socketIoData: timestamp });
    });
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
    connectionHandler.close();
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
    // this.timer = setInterval(() => {
    //   this.loadData();
    // }, 2000);
  }

  handleChangeRain() {
    const { showRain } = this.state;
    this.setState({ showRain: !showRain });
  }

  render() {
    let s = '';
    let w = '';
    let e = '';
    let dif = '';
    let final = '';
    const { data, showRain, socketIoData } = this.state;
    if (data && data.events && data.events.length > 0) {
      s = (
        <DinamicGraph
          level={{ entry: data.events[0].entrylevel, exit: data.events[0].exitlevel }}
          rain={data.events[0].entryrain}
          showRain={showRain}
          conductivity={{
            entry: data.events[0].entryconductivity,
            exit: data.events[0].exitconductivity
          }}
        />
      );
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
            <CardHeader title="Evento en curso" />
            <CardContent>
              {s}
              <Switch
                checked={showRain}
                onChange={() => {
                  this.handleChangeRain();
                }}
                color="primary"
              />
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
              <Divider />
              <Typography color="inherit" variant="h6">
                {`El último dato se socket :${socketIoData}`}
              </Typography>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      final = (
        <div className="main">
          <Card>
            <CardHeader title="No hay eventos en curso" />
            <CardContent>
              <br />
              <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
                <Grid item xs={6}>
                  <img src={logo} alt="Logo" width="300px" />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="inherit" variant="h6">
                    Tan pronto inicie un evento se mostrará la información
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
