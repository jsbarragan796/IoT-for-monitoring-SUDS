import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { saveSvgAsPng } from 'save-svg-as-png';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HistogramGraph from './HistogramGraph';
import ConductivityGraph from './ConductivityGraph';
import Hyetograph from './Hyetograph';
import logo from '../assets/logo.png';

class HistoricalEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      errorStatus: false,
      errorMessage: '',
      menuFlow: null,
      menuRain: null,
      menuConductivity: null
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

  componentWillMount() {
    this.loadData();
  }

  handleClick = name => (event) => {
    this.setState({ [name]: event.currentTarget });
  };

  handleClose = (name) => {
    this.setState({ [name]: null });
  };

  handleOption= (name,option, date2) => {
    this.handleClose(name)
    const date = date2.split(' ')[0]
    if (option === 'flowImagen') {
      saveSvgAsPng(document.querySelector('#histogramGraph'), `Caudal vs tiempo ${date}`, { scale: 3 });
    }
    if (option === 'csv') {
      this.csv()
    }
    if (option === 'rainImagen') {
      saveSvgAsPng(document.querySelector('#histogramGraph'), `Precipitación vs tiempo ${date}`, { scale: 3 });
    }
    if (option === 'conductivityImagen') {
      saveSvgAsPng(document.querySelector('#conductivity'), `Conductividad ${date}`, { scale: 3 });
    }
    
  };

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
    const { event, menuFlow, menuRain, menuConductivity  } = this.state;

    const {
      entrylevel, exitlevel, entryconductivity, exitconductivity, entryrain
    } = event;
    let histogramGraph = '';
    let conductivityGraph = '';
    let rainGraph = '';
    const date2 = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString('es-US', options2).split('/').join('-');
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
            <div>
              <IconButton
                aria-label="Más conductividad"
                aria-owns={Boolean(menuConductivity) ? 'menu-1' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick("menuConductivity")}
              >
                <MoreVertIcon />
              </IconButton>
                <Menu
                  id="menu-1"
                  anchorEl={menuConductivity}
                  open={Boolean(menuConductivity)}
                  onClose={()=> {this.handleClose("menuConductivity")}}
                >
                <MenuItem key={"option1"} selected={false} onClick={() => {this.handleOption('menuConductivity','csv', date2)}}>
                  Descargar datos
                </MenuItem>
                <MenuItem key={"option2"} selected={false} onClick={() => {this.handleOption('menuConductivity','conductivityImagen', date2)}}>
                  Descargar imagen 
                </MenuItem>              
              </Menu>
            </div>
            
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
            <Grid  item xs={4}>
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
            <div>
              <IconButton
                aria-label="Más precipitación"
                aria-owns={Boolean(menuRain) ? 'menu-1' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick("menuRain")}
              >
                <MoreVertIcon />
              </IconButton>
                <Menu
                  id="menu-1"
                  anchorEl={menuRain}
                  open={Boolean(menuRain)}
                  onClose={()=> {this.handleClose("menuRain")}}
                >
                <MenuItem key={"option1"} selected={false} onClick={() => {this.handleOption('menuRain','csv', date2)}}>
                  Descargar datos
                </MenuItem>
                <MenuItem key={"option2"} selected={false} onClick={() => {this.handleOption('menuRain','rainImagen', date2)}}>
                  Descargar Imagen 
                </MenuItem>              
              </Menu>
          </div>
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
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    const options2 = {
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const date = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString('es-US', options);
    return (
      <div>
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
                        {`${ Number(event.volumeOutput / 1000).toFixed(2) }`}
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
                        {`${ Number(event.volumeEfficiency).toFixed(2) }`}
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
                          {` ${Math.floor(event.duration / 60)}:${Math.floor((event.duration - Math.floor(event.duration / 60)) * 60)}`}
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
                            {`${event.peakFlowEfficiency}`}
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
                    aria-label="Más"
                    aria-owns={Boolean(menuFlow) ? 'menu-1' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick("menuFlow")}
                  >
                    <MoreVertIcon />
                  </IconButton>
                    <Menu
                      id="menu-1"
                      anchorEl={menuFlow}
                      open={Boolean(menuFlow)}
                      onClose={()=> {this.handleClose("menuFlow")}}
                    >
                    <MenuItem key={"option1"} selected={false} onClick={() => {this.handleOption('menuFlow','csv', date2)}}>
                      Descargar datos
                    </MenuItem>
                    <MenuItem key={"option2"} selected={false} onClick={() => {this.handleOption('menuFlow','flowImagen', date2)}}>
                      Descargar Imagen 
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
  match: PropTypes.instanceOf(Object).isRequired,
};

export default HistoricalEvent ;
