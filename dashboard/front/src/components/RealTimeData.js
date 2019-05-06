/* eslint-disable no-underscore-dangle */
/* global window */
/* global document */
import React, { Component } from 'react';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { saveSvgAsPng } from 'save-svg-as-png';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DinamicGraph from './DinamicGraph';
import connectionHandler from '../socketIo';
import suds from '../assets/SUDS2.png';

class RealTimeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      errorStatus: false,
      errorMessage: '',
      showOption: 'simple',
      eventId: null,
      graphTitle: 'Caudal vs tiempo',
      width: 0,
      menuOptions: null,
    };
    this.subRealTimeEvents = this.subRealTimeEvents.bind(this);
    this.handleChangeRain = this.handleChangeRain.bind(this);
    this.currentWidth = this.currentWidth.bind(this);
    this.getCsv = this.getCsv.bind(this);
    this.handleAddGraph = this.handleAddGraph.bind(this);
  }

  componentDidMount() {
    this.currentWidth();
    this.subRealTimeEvents();
    window.addEventListener('resize', this.currentWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.currentWidth);
  }


  getCsv() {
    const { eventId } = this.state;
    axios.get(`${process.env.REACT_APP_HISTORICAL_SERVING}/events/get-csv?eventId=${eventId}`)
      .then((response) => {
        FileDownload(response.data, response.headers.filename);
      })
      .catch((err) => {
        this.setState({ errorStatus: true, errorMessage: err.message });
      });
  }

  handleAddGraph = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleOption= (name, option, date2, graphTitle) => {
    this.handleClose(name);
    const date = date2.split(' ')[0];
    if (option === 'csv') {
      this.getCsv();
    }
    if (option === 'imagen') {
      saveSvgAsPng(document.querySelector('#realTimeGraph'), `${graphTitle} ${date}`, { scale: 3 });
    }
    if (option === 'flow-vs-time') {
      this.handleChangeRain('simple', 'Caudal vs tiempo');
    }
    if (option === 'flow-and-rain-vs-time') {
      this.handleChangeRain('rain', 'Caudal y recipitación vs tiempo');
    }
    if (option === 'conductivity-vs-time') {
      this.handleChangeRain('conductivity', 'Conductividad vs tiempo ');
    }
  };

  handleClose = (name) => {
    this.setState({ [name]: null });
  };

  handleClick = name => (event) => {
    this.setState({ [name]: event.currentTarget });
  };

  subRealTimeEvents() {
    connectionHandler.subRealTimeEvents(async (response) => {
      const { data } = this.state;
      if (data && data.events[0] && data.events[0].startDate) {
        Object.keys(response.data).forEach((key) => {
          if (data.events[0][key] && typeof data.events[0][key] === 'object') {
            const lastElemtent = data.events[0][key].pop();
            if (lastElemtent) {
              const firstElementGotten = response.data[key].shift();
              if (firstElementGotten) {
                if (lastElemtent.time === firstElementGotten.time) {
                  data.events[0][key].push(firstElementGotten);
                } else {
                  data.events[0][key].push(lastElemtent);
                  data.events[0][key].push(firstElementGotten);
                }
              }
            }
            response.data[key].forEach((n) => {
              data.events[0][key].push(n);
            });
          }
          if (data.events[0][key] && typeof data.events[0][key] !== 'object') {
            data.events[0][key] = response.data[key];
          }
        });
        this.setState({ data });
      }
    }, (response) => {
      this.setState({
        data: response,
        errorStatus: false,
        eventId: response.events.length ? response.events[0]._id : null,
      });
    });
  }


  currentWidth() {
    this.setState({ width: window.innerWidth });
  }

  showErrorMessage() {
    const { errorStatus, errorMessage } = this.state;
    if (errorStatus) {
      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
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

  handleChangeRain(type, title) {
    this.setState({ showOption: type, graphTitle: title });
  }

  render() {
    let s = (
      <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
        <Grid item xs={6}>
          <img src={suds} alt="Logo" className="responsive" />
        </Grid>
        <Grid item xs={6}>
          <Typography color="primary" variant="h6">
        Inició un evento, esperando datos..
          </Typography>
        </Grid>
      </Grid>
    );
    let fechaInicio = '';
    let w = '';
    let e = '';
    let dif = '';
    let final = '';
    let maxInflow = 'Esperando datos';
    let maxOutflow = 'Esperando datos';
    const {
      data, showOption, graphTitle, width, menuOptions,
    } = this.state;

    if (data && data.events && data.events.length > 0) {
      if (data.events[0].entrylevel.length) {
        data.events[0].entrylevel.forEach((element) => {
          if (maxInflow === 'Esperando datos') {
            maxInflow = element;
          } else {
            maxInflow = maxInflow.value > element.value ? maxInflow : element;
          }
        });
      }
      if (data.events[0].exitlevel.length) {
        data.events[0].exitlevel.forEach((element) => {
          if (maxOutflow === 'Esperando datos') {
            maxOutflow = element;
          } else {
            maxOutflow = maxOutflow.value > element.value ? maxOutflow : element;
          }
        });
      }
      if (data.events[0].entrylevel.length && data.events[0].exitlevel.length) {
        s = (
          <DinamicGraph
            level={{ entry: data.events[0].entrylevel, exit: data.events[0].exitlevel }}
            rain={data.events[0].entryrain}
            showOption={showOption}
            conductivity={{
              entry: data.events[0].entryconductivity,
              exit: data.events[0].exitconductivity,
            }}
          />
        );
      }
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      const options2 = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      w = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString(
        'es-US', options,
      ).split('/').join('-');
      fechaInicio = new Date(Number(String(data.events[0].startDate).substr(0, 13)))
        .toLocaleDateString(
          'es-US', options2,
        ).split('/').join('-');
      e = new Date(
        Number(String(data.events[0].lastMeasurementDate).substr(0, 13)),
      ).toLocaleDateString('es-US', options).split('/').join('-');
      dif = Number(String(data.events[0].lastMeasurementDate - data.events[0].startDate));
      dif /= 1e11;
      dif = `${Math.round(dif / 60)}:${String(Math.round(dif % 60)).padStart(2, '0')}`;


      final = (
        <div className="main">
          <Grid direction="column" container justify="center" spacing={8}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography color="primary" variant="h3" align="left" style={{ paddingTop: 10, paddingBottom: 15 }}>
                {'Evento en curso'}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              // eslint-disable-next-line no-nested-ternary
              style={{ maxHeight: width > 960 ? width < 1400 ? 158 : 108 : 1000 }}
            >
              <Grid direction="row" container justify="center" spacing={8}>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={12}>
                      <Paper elevation={3} style={{ padding: 10 }}>
                        <Typography color="secondary" variant="h5" align="center">
                          {`${dif} horas`}
                        </Typography>
                        <Typography color="secondary" variant="h6" align="center">
                          {'Duración'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={12}>
                      <Paper elevation={3} style={{ padding: 10 }}>
                        <Typography color="secondary" variant="h5" align="center">
                          {`${w} `}
                        </Typography>
                        <Typography color="secondary" variant="h6" align="center">
                          {'Fecha de inico'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={12}>
                      <Paper elevation={3} style={{ padding: 10 }}>
                        <Typography color="secondary" variant="h5" align="center">
                          {`${e}`}
                        </Typography>
                        <Typography color="secondary" variant="h6" align="center">
                          {'Último dato recibido'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={12}>
                      <Paper elevation={3} style={{ padding: 10 }}>
                        <Typography color="secondary" variant="h6" align="center">
                          {`Entrada:${maxInflow.value ? maxInflow.value.toFixed(2) : 0} l/s - Salida:${maxOutflow.value ? maxOutflow.value.toFixed(2) : 0} l/s`}
                        </Typography>
                        <Typography color="secondary" variant="h6" align="center">
                          {'Caudales pico registrados'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={`${graphTitle}`}
                  style={{ textAlign: 'center' }}

                  action={(
                    <div>
                      <IconButton
                        aria-owns={menuOptions ? 'menu-1' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick('menuOptions')}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="menu-1"
                        anchorEl={menuOptions}
                        open={Boolean(menuOptions)}
                        onClose={() => { this.handleClose('menuOptions'); }}
                      >
                        <MenuItem key="option1" selected={false} onClick={() => { this.handleOption('menuOptions', 'flow-vs-time', fechaInicio, graphTitle); }}>
                      Ver Caudal vs tiempo
                        </MenuItem>
                        <MenuItem key="option2" selected={false} onClick={() => { this.handleOption('menuOptions', 'flow-and-rain-vs-time', fechaInicio, graphTitle); }}>
                      Ver Caudal y precipitación vs tiempo
                        </MenuItem>
                        <MenuItem key="option3" selected={false} onClick={() => { this.handleOption('menuOptions', 'conductivity-vs-time', fechaInicio, graphTitle); }}>
                  Ver Conductividad vs tiempo
                        </MenuItem>
                        <MenuItem key="option4" selected={false} onClick={() => { this.handleOption('menuOptions', 'csv', fechaInicio, graphTitle); }}>
                      Descargar datos
                        </MenuItem>
                        <MenuItem key="option5" selected={false} onClick={() => { this.handleOption('menuOptions', 'imagen', fechaInicio, graphTitle); }}>
                      Descargar imagen
                        </MenuItem>

                      </Menu>
                    </div>
)}
                />
                <CardContent>
                  {s}
                </CardContent>

              </Card>

            </Grid>

          </Grid>
        </div>
      );
    } else {
      final = (
        <div className="main">
          <Card>

            <CardContent>
              <br />
              <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
                <Grid item xs={6}>
                  <div style={{ textAlign: 'center' }}>
                    <img src={suds} alt="Logo" className="responsive-banner" style={{ marginRight: 5, marginLeft: 5 }} />
                  </div>
                  <Typography color="secondary" align="center" variant="h4">
                    Esperando que inicie un evento
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
