import React, { Component } from 'react';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { saveSvgAsPng } from 'save-svg-as-png';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import DinamicGraph from './DinamicGraph';
import connectionHandler from '../socketIo';
import Radio from '@material-ui/core/Radio';
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
      graphTitle: 'Caudal vs tiempo',
      extraRain:false,
      extraConductivity:false,
      width: 0
    };
    this.getRealTimeEvents = this.getRealTimeEvents.bind(this);
    this.subRealTimeEvents = this.subRealTimeEvents.bind(this);
    this.handleChangeRain = this.handleChangeRain.bind(this);
    this.currentWidth = this.currentWidth.bind(this);
    this.getCsv = this.getCsv.bind(this);
    this.handleAddGraph = this.handleAddGraph.bind(this)
  }

  componentWillMount() {
    this.currentWidth();
    window.addEventListener('resize', this.currentWidth);
  }

  componentDidMount() {
    this.subRealTimeEvents();
    this.getRealTimeEvents();
  }

  componentWillUnmount() {
    connectionHandler.close();
    window.removeEventListener('resize', this.currentWidth);
  }

  handleAddGraph = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  currentWidth() {
    this.setState({ width: window.innerWidth });
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
    this.setState({ showRain: !showRain, graphTitle: !showRain ? 'Caudal y recipitación vs tiempo' : 'Caudal vs tiempo' });

  }

  render() {
    let s = '';
    let fechaInicio = '';
    let w = '';
    let e = '';
    let dif = '';
    let final = '';
    let maxInflow = null;
    let maxOutflow = null;
    const { data, showRain, graphTitle, width, extraConductivity, extraRain } = this.state;

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
      const options2 = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      w = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString(
        'es-US', options ).split('/').join('-');
      fechaInicio = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString(
        'es-US',options2).split('/').join('-');
      e = new Date(
        Number(String(data.events[0].lastMeasurementDate).substr(0, 13))
      ).toLocaleDateString('es-US', options).split('/').join('-');
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
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <Typography color="inherit" variant="h3" align="left" style={{ paddingTop: 10, paddingBottom: 15}}>
              {`Evento en curso`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{maxHeight: width > 960 ? width < 1400 ? 158 : 108 : 1000 }}>
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
              <CardHeader title={`${graphTitle}`}  style={{textAlign:'center'}}/>
              <CardContent>
                {s}
              </CardContent>
              
            </Card>

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{marginBottom:25}}>
            <Paper elevation={3} style={{padding:5}}>
            <Grid container  direction="row" justify="center" >
              <Grid item xs={12} sm={12} md={8} lg={8} >
                <Typography color="inherit" variant="h6" align="center">
                  {`Opciones de gráfica`}
                </Typography>
                <Grid container  direction="row" justify="center" alignItems="center">
                  <Grid item xs={12} sm={12} md={6} lg={6} >
                    <FormControl component="fieldset">
                      <RadioGroup
                        onChange={this.handleChange}
                        value={String(showRain)}    
                        name="graph-selector"
                        onChange={() => {
                          this.handleChangeRain();
                          }}
                        row
                        > 
                        <FormControlLabel value='false' control={<Radio color="primary"/>} label="Caudal vs tiempo" />
                        <FormControlLabel value='true' control={<Radio color="primary"/>} label="Caudal precipitación vs tiempo" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} >
                      <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={extraRain}
                            onChange={this.handleAddGraph('extraRain')}
                            value="checkedB"
                            color="primary"
                          />
                        }
                        label="Ver precipitación"
                      />  
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={extraConductivity}
                            onChange={this.handleAddGraph('extraConductivity')}
                            value="checkedB"
                            color="primary"
                          />
                        }
                        label="Ver conductividad"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid> 
              <Grid item xs={12} sm={12} md={4} lg={4} > 
                <Typography color="inherit" variant="h6" align="center">
                   Descargas 
                </Typography>
                <Grid container  direction="row" justify="center" alignItems="center" spacing={8}>
                  <Grid item xs={12} sm={12} md={3} lg={3} style={{width:120}}>
                    <Button variant="outlined" fullWidth size="medium" onClick={this.getCsv} color="primary">
                      CSV datos
                    </Button>     
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} lg={3} style={{width:120}}>
                    <Button variant="outlined" fullWidth  size="medium" onClick={() => { saveSvgAsPng(document.querySelector('#realTimeGraph'), `${graphTitle} ${fechaInicio}`, { scale: 3 }); }} color="primary">
                       Gráfica
                    </Button>     
                  </Grid>
                </Grid>
              </Grid>
            </Grid>       
            </Paper>          
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
                    Espetando que inicie un evento
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
