import React, { Component } from 'react';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { saveSvgAsPng } from 'save-svg-as-png';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
      eventId:undefined,
      graphTitle: 'Caudal vs tiempo'
    };
    this.getRealTimeEvents = this.getRealTimeEvents.bind(this);
    this.subRealTimeEvents = this.subRealTimeEvents.bind(this);
    this.handleChangeRain = this.handleChangeRain.bind(this);
    this.getCsv = this.getCsv.bind(this);
  }

  componentDidMount() {
    this.subRealTimeEvents();
    this.getRealTimeEvents();
  }

  componentWillUnmount() {
    connectionHandler.close();
  }

  getCsv() {
    const { eventId } = this.state
    axios.get(`${process.env.REACT_APP_HISTORICAL_SERVING}/events/get-csv?eventId=${eventId}`)
      .then((response) => {
        FileDownload(response.data, response.headers.filename);
      })
      .catch((err) => {
        this.setState({ errorStatus: true, errorMessage: err.message });
      });
  }
  subRealTimeEvents() {
    connectionHandler.subRealTimeEvents(async (response) => {
      const { data } = this.state
      Object.keys(response.data).forEach( (key) => {
        if (data.events[0][key] && typeof data.events[0][key] === "object") {
          response.data[key].forEach((n)=>{
            data.events[0][key].push(n)
          })
        }
        if (data.events[0][key] && typeof data.events[0][key] !== "object") {
          data.events[0][key] = response.data[key]
        }       
      });
      this.setState({ data: data });
    }, (response) => {
       if (response) this.getRealTimeEvents();
    })
  }
  getRealTimeEvents() {
    connectionHandler.getRealTimeEvents(1, (response) => {
      console.log(response.events[0])
      this.setState({ data: response, errorStatus: false, eventId: response.events[0]._id});
    })
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
    let maxInflow = null;
    let maxOutflow = null;
    const { data, showRain, graphTitle } = this.state;
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
       
      data.events[0].entrylevel.forEach((element) => {
        if (maxInflow === null ){
          maxInflow = element
        } else {
          maxInflow =  maxInflow.value > element.value ? maxInflow : element
        }
      });
      data.events[0].exitlevel.forEach((element) => {
        if (maxOutflow === null ){
          maxOutflow = element
        } else {
          maxOutflow =  maxOutflow.value > element.value ? maxOutflow : element
        }
      });
      
      final = (
        <div className="main">
        <Grid direction="column" container justify="center" spacing={8} >
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography color="inherit" variant="h3" align="left" style={{ paddingTop: 10, paddingBottom: 15}}>
              {`Evento en curso`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid direction="row" container justify="center" spacing={8} >
                <Grid item xs={12}  sm={12} md={3} lg={3}>
                  <Grid container direction="row" justify="center" >
                      <Grid item xs={12}>
                      <Paper elevation={3} style={{padding:10}}>
                        <Typography color="inherit" variant="h5" align="center">
                          {`${dif} horas`}
                        </Typography>
                        <Typography color="inherit" variant="h6" align="center">
                          {`Duración`}
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
                          {`${w} `}
                        </Typography>
                        <Typography color="inherit" variant="h6" align="center">
                          {`Fecha de inico`}
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
                            {`${e}`}
                          </Typography>    
                          <Typography color="inherit" variant="h6" align="center">
                            {`Último dato recibido`}
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
                            {`Entrada:${maxInflow.value.toFixed(2)} l/s - Salida:${maxOutflow.value.toFixed(2)} l/s`}
                          </Typography>     
                          <Typography color="inherit" variant="h6" align="center">
                            {`Caudales pico registrados`}
                          </Typography> 
                          </Paper>          
                        </Grid>
                    </Grid>  
                </Grid>           
              </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <Card>
              <CardHeader title={`${graphTitle}`} />
              <CardContent>
                {s}
                <Switch
                  checked={showRain}
                  onChange={() => {
                    this.handleChangeRain();
                  }}
                  color="primary"
                />
              </CardContent>
              <Button variant="outlined" size="small" onClick={this.getCsv} color="primary">
                Descargar datos
              </Button>
              <Tooltip title="Descargar gráfica" placement="bottom">
              <IconButton
                onClick={() => { saveSvgAsPng(document.querySelector('#realTimeGraph'), 'caudal', { scale: 3 }); }}
                className="marginRight: 'auto'"
                aria-label="descargar"
              >
                <SaveAlt />
              </IconButton>
            </Tooltip>
            </Card>

          </Grid>
        </Grid>      
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
                    Tan pronto inicie un evento se mostrará
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
