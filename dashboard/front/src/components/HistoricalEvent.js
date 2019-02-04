import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import FileDownload from 'js-file-download';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import AppNavBar from './AppNavBar';
import HistogramGraph from './HistogramGraph';
import ConductivityGraph from './ConductivityGraph';
import logo from '../assets/logo.png';

const styles = theme => ({
  left: {
    margin: theme.spacing.unit
  }
});

class HistoricalEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      errorStatus: false,
      errorMessage: ''
    };
    this.margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    };
    this.loadData = this.loadData.bind(this);
    this.csv = this.csv.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { match } = this.props;
    if (match.match && match.match.params) {
      const { eventId } = match.match.params;
      axios.get(`${process.env.REACT_APP_HISTORICAL_SERVING}/events/data?eventId=${eventId}`)
        .then((response) => {
          this.setState({ event: response.data, errorStatus: false });
        })
        .catch((err) => {
          this.setState({ errorStatus: true, errorMessage: err.message });
        });
    }
  }

  csv() {
    const { match } = this.props;
    const { eventId } = match.match.params;
    axios.get(`${process.env.REACT_APP_HISTORICAL_SERVING}/events/get-csv?eventId=${eventId}`)
      .then((response) => {
        console.log("headeras", response);
        FileDownload(response.data, response.headers.filename);
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

  render() {
    const { event } = this.state;
    const {
      entrylevel, exitlevel, entryconductivity, exitconductivity, entryrain
    } = event;
    let histogramGraph = '';
    let conductivityGraph = '';
    let rainGraph = '';

    if (entrylevel) {
      histogramGraph = (<HistogramGraph data={entrylevel} data2={exitlevel} />);
    } else {
      histogramGraph = (<h1>Cargando</h1>);
    }
    if (entryconductivity && entryconductivity.length > 0) {
      conductivityGraph = (<ConductivityGraph data={entryconductivity} data2={exitconductivity} />);
    } else {
      conductivityGraph = (
        <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
          <Grid item xs={4}>
            <img src={logo} alt="Logo" width="200" />
          </Grid>
          <Grid item xs={12}>
            <Typography color="inherit" variant="h5">
                  Lo sentimos, este evento no cuenta con datos de conductividad
            </Typography>
          </Grid>
          
        </Grid>
      );
    }
    if (event.entryrain && entryrain.length > 0) {
      rainGraph = (<ConductivityGraph data={entryconductivity} data2={exitconductivity} />);
    } else {
      rainGraph = (
        <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
          <Grid item xs={4}>
            <img src={logo} alt="Logo" width="200" />
          </Grid>
          <Grid item xs={8}>
            <Typography color="inherit" variant="h5">
                  Lo sentimos, este evento no cuenta con datos de precipitación
            </Typography>
          </Grid>
        </Grid>
      );
    }
    const { classes, auth } = this.props;
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    const date = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString('es-US', options);
    return (
      <div>
        <AppNavBar auth={auth} optionActive="eventDetail" />
        {this.showErrorMessage()}
        <div className="main">
          <Grid item sx={6}>
            <Card>
              <CardHeader
                title={`Evento registrado el ${date}`}
              />
              <CardContent>
                {histogramGraph}
                <br />
                <Divider />
                <br />
                <Grid container justify="center" alignItems="center" spacing={8}>
                  <Grid item xs={8}>
                    <Typography color="inherit" variant="h5">
                        Resumen
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid item container direction="row">
                      <Grid item container xs={6} direction="column">
                        <Typography color="inherit">
                        Entrada
                        </Typography>
                        <Typography color="inherit">
                          <strong>
                          Volumen :
                          </strong>
                          {` ${Math.ceil(event.volumeInput)} l³`}
                        </Typography>
                        <Typography color="inherit">
                          <strong>
                          Caudal pico :
                          </strong>
                          {` ${Math.ceil(event.peakImputFlow)} l/s`}
                        </Typography>
                      </Grid>
                      <Grid item container xs={6} direction="column">
                        <Typography color="inherit">
                          Salida
                        </Typography>
                        <Typography color="inherit">
                          <strong>
                            Volumen :
                          </strong>
                          {` ${Math.ceil(event.volumeOutput)} l³`}
                        </Typography>
                        <Typography color="inherit">
                          <strong>
                            Caudal pico :
                          </strong>
                          {` ${Math.ceil(event.peakOutputFlow)} l/s`}
                        </Typography>
                        <Button className={classes.left} variant="outlined" size="small" onClick={this.csv} color="primary">
                          Descargar datos
                        </Button>
                      </Grid>
                      <Grid item container xs={12} direction="column">
                        <Typography color="inherit">
                          <strong>
                          Eficiencia :
                          </strong>
                          {` ${Math.ceil(event.efficiency)} %`}
                        </Typography>

                        <Typography color="inherit">
                          <strong>
                          Reducción del caudal pico :
                          </strong>
                          {` ${Math.ceil(event.reductionOfPeakFlow)} %`}
                        </Typography>

                        <Typography color="inherit">
                          <strong>
                          Duración:
                          </strong>
                          {` ${Math.floor(event.duration)}:${Math.floor((event.duration - Math.floor(event.duration)) * 60)} horas`}
                        </Typography>

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <br />
                <Divider />
                <br />
                {conductivityGraph}
                <br />
                <Divider />
                <br />
                {rainGraph}
              </CardContent>
            </Card>
          </Grid>
        </div>

      </div>
    );
  }
}

HistoricalEvent.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  auth: PropTypes.instanceOf(Object).isRequired
};

export default withStyles(styles)(HistoricalEvent);
