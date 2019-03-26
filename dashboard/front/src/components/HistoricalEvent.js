import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import FileDownload from 'js-file-download';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppNavBar from './AppNavBar';
import HistogramGraph from './HistogramGraph';
import ConductivityGraph from './ConductivityGraph';
import Hyetograph from './Hyetograph';
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
      errorMessage: '',
      anchorEl: null,
    };
    this.margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    };
    this.loadData = this.loadData.bind(this);
    this.csv = this.csv.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillMount() {
    this.loadData();
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };s

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
            </span>)}
        />
      );
    }
    return '';
  }

  render() {
    const { event, anchorEl } = this.state;
    console.log( anchorEl)

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
      conductivityGraph = (
        <Card>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent>
          <ConductivityGraph data={entryconductivity} data2={exitconductivity} />
        </CardContent>
      </Card>
        
        );
    } else {
      conductivityGraph = (
        <Card>
        <CardContent>
          <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
            <Grid  xs={4}>
              <img src={logo} alt="Logo" width="150" />
            </Grid>
            <Grid item xs={12}>
              <Typography color="inherit" variant="h5">
                    Lo sentimos, este evento no cuenta con datos de conductividad
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      );
    }
    if (event.entryrain && entryrain.length > 0) {
      rainGraph = (
        <Card>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Hyetograph data={entryrain}  />
        </CardContent>
      </Card>
        );
    } else {
      rainGraph = (
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      );
    }
    const { classes, auth } = this.props;
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    const options2 = {
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const date = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString('es-US', options);
    const date2 = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString('es-US', options2).split('/').join('-');
    return (
      <div>
        <AppNavBar auth={auth} optionActive="eventDetail" />
        {this.showErrorMessage()}
        <div className="main">
        <Grid direction="column" container justify="center" spacing={8} >
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <Typography color="inherit" variant="h4" align="left" style={{ paddingTop: 10, paddingBottom: 15}}>
              {`Evento registrado el ${date}`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} >
              <Grid direction="row" container justify="center" spacing={8} >
                <Grid item xs={12}  sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center" >
                      <Grid item xs={12}>
                      <Paper elevation={3} style={{padding:10}}>
                        <Typography color="inherit" variant="h5" align="center">
                          {`${Math.ceil(event.volumeInput) / 1000}`}
                        </Typography>
                        <Typography color="inherit" variant="h6" align="center">
                          {`Volumen entrada m³`}
                        </Typography>  
                      </Paper> 
                      </Grid>
                  </Grid>  
                </Grid>
                <Grid item xs={12}  sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center" >
                      <Grid item xs={12} >
                      <Paper elevation={3} style={{padding:10}}>
                        <Typography color="inherit" variant="h5" align="center">
                        {`${ (event.volumeOutput / 1000).toFixed(2) }`}
                        </Typography>
                        <Typography color="inherit" variant="h6" align="center">
                        {`Volumen salida m³`}
                        </Typography> 
                        </Paper>       
                      </Grid>
                  </Grid> 
                </Grid>
                <Grid item xs={12}  sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center" >
                      <Grid item xs={12} >
                      <Paper elevation={3} style={{padding:10}}>
                        <Typography color="inherit" variant="h5" align="center">
                        {`${ (100 - (event.volumeInput / event.volumeOutput)*100 ).toFixed(2) }`}
                        </Typography>
                        <Typography color="inherit" variant="h6" align="center">
                        {`% reducción volumen`}
                        </Typography> 
                        </Paper>       
                      </Grid>
                  </Grid> 
                </Grid>
                <Grid item xs={12}  sm={12} md={3} lg={3}>
                <Grid container direction="row" justify="center" >
                    <Grid item xs={12} >
                      <Paper elevation={3} style={{padding:10}}>
                        <Typography color="inherit" variant="h5" align="center">
                          {` ${Math.floor(event.duration)}:${Math.floor((event.duration - Math.floor(event.duration)) * 60)}`}
                        </Typography>
                        <Typography color="inherit" variant="h6" align="center">
                          Duración horas
                        </Typography> 
                        </Paper>       
                      </Grid>
                  </Grid> 
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Grid container  direction="row" justify="center" >
                        <Grid item xs={12}>
                        <Paper elevation={3} style={{padding:10}}>
                          <Typography color="inherit" variant="h5" align="center">
                           {`${event.peakImputFlow ? event.peakImputFlow.max.toFixed(2): 0}`}
                          </Typography>    
                          <Typography color="inherit" variant="h6" align="center">
                            {`Caudal pico entrada l/s`}
                          </Typography> 
                          </Paper>          
                        </Grid>
                    </Grid>  
                </Grid> 
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Grid container  direction="row" justify="center" >
                        <Grid item xs={12}>
                        <Paper elevation={3} style={{padding:10}}>
                          <Typography color="inherit" variant="h6" align="center">
                          {`${event.peakOutputFlow ? event.peakOutputFlow.max.toFixed(2): 0}`}
                          </Typography>     
                          <Typography color="inherit" variant="h6" align="center">
                          {`Caudal pico salida l/s`}
                          </Typography> 
                          </Paper>          
                        </Grid>
                    </Grid>  
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Grid container  direction="row" justify="center" >
                        <Grid item xs={12}>
                        <Paper elevation={3} style={{padding:10}}>
                          <Typography color="inherit" variant="h6" align="center">
                            {`${event.efficiency}`}
                          </Typography>     
                          <Typography color="inherit" variant="h6" align="center">
                            Reducción del caudal pico
                          </Typography> 
                          </Paper>          
                        </Grid>
                    </Grid>  
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Grid container  direction="row" justify="center" >
                        <Grid item xs={12}>
                        <Paper elevation={3} style={{padding:10}}>
                          <Typography color="inherit" variant="h6" align="center">
                            {`${date2}`}
                          </Typography>     
                          <Typography color="inherit" variant="h6" align="center">
                            {`Inicio`}
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
                action={
                  <div>
                  <IconButton
                  aria-label="More"
                  aria-owns={Boolean(anchorEl) ? 'menu-1' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                      id="menu-1"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
  
                    >
                    <MenuItem key={"optionOne"} selected={false} onClick={this.handleClose}>
                      {"Descargar datos "}
                    </MenuItem>
                    
                  </Menu>
                  </div>
                }
              />
              <CardContent>
                {histogramGraph}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {conductivityGraph}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
              {rainGraph}
          </Grid>
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
