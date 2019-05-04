/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import WelcomeAppBar from './WelcomeAppNavBar';
import Paper from '@material-ui/core/Paper';
import tools from '../assets/tools.png';
import suds from '../assets/suds.png';
import highLevelArchitecture from '../assets/highLevelArchitecture.png';
import suds2 from '../assets/SUDS2.png';

const styles = theme => ({
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
});

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      top: 50,
      left: 50
    };
  }

  render() {
    const { auth } = this.props;
    return (
      <div >
        <WelcomeAppBar optionActive="Inicio" auth={auth} />
        <div className="main">
        <Grid container direction="column" alignItems="center" spacing={16} marginBottom="14px">
        <Grid item xs={12}>
          <Typography color="primary" variant="h3" align ="center">
            MISUDS
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="primary" variant="h5" align ="center">
            Una herramienta para el Monitoreo Inteligente de Sistemas Urbanos de Drenaje Sostenible
          </Typography>
        </Grid>
        <Grid item xs={12}>
        <div style={{textAlign: 'center'}}>
        <img src={suds2} alt="Logo" className="responsive-banner" style={{marginRight:5, marginLeft:5 }}/>
        </div>           
        </Grid>
        
        <Grid item xs={12}>

              <Grid container direction="column" justify="center" alignItems="center" spacing={16}>
                <Grid item  xs={12} sm={12} md={8} lg={10}>
<Paper style={{paddingLeft:20, paddingRight:20, paddingTop:20, paddingBottom:20}}>
                <Typography color="primary" align='center' variant="h4">
                ¿ En qué consiste ?
                </Typography>
                <div style={{textAlign: 'center'}}>
                <img src={highLevelArchitecture} alt="Logo" className="responsive" style={{marginRight:5, marginLeft:5 }}/> 
                </div> 
                <Typography color="secondary" align ="justify" variant="h5">
                    MISUDS es un sistema que empodera con internet de las cosas (IoT) el monitoreo de SUDS. A partir de 
                    la instalación de entidades físicas es posible medir  
                    parámetros como la conductividad, caudal y precipitación. Dichas entidades 
                    están acondicionadas para transmitir datos por medio de SigFox, un proveedor de comunicación especializado en IoT . 
                    Una vez los datos llegan al proveedor estos son dirigidos a MISUDS donde son procesados y almacenados.                  
                  </Typography>

                  </Paper>
                </Grid>
                <Grid item  xs={12} sm={12} md={8} lg={10}>
                <Paper style={{paddingLeft:20, paddingRight:20, paddingTop:20, paddingBottom:20}}>
                <Typography color="primary"  align='center' variant="h4">
                 Motivación 
                </Typography>
                <div style={{textAlign: 'center'}}>
                <img src={suds} alt="Logo" className="responsive" style={{marginRight:5, marginLeft:5 }}/>
                </div> 
                  <Typography color="secondary" align ="justify" variant="h5">
                  El Centro de Investigaciones en Ingeniería Ambiental, CIIA desarrolló una 
                  investigación en la que realizó la construcción y el monitoreo de un 
                  piloto de SUDS en el Parque Metropolitano San Cristóbal Sur de Bogotá. 
                  El objetivo del monitoreo era determinar el desempeño de las estructuras que lo componen,
                  evaluando la eficiencia de reducción de contaminantes, la disminución de 
                  volúmenes y caudales pico de escorrentía. Dicho monitoreo requería que los investigadores tuvieran que
                  desplazarse hasta el lugar para colectar la información manualmente. Con MISUDS se busca que el investigador
                  tenga acceso a la información remotamente y en tiempo real.   
                  </Typography>
                  </Paper>
                </Grid>
                
                <Grid item  xs={12} sm={12} md={8} lg={10}>
                <Paper style={{paddingLeft:20, paddingRight:20, paddingTop:20, paddingBottom:20}}>
                <Typography color="primary"  align='center' variant="h4">
                  Funcionalidades    
                </Typography>
                <div style={{textAlign: 'center'}}>
                  <img src={tools} alt="Logo" className="responsive" style={{marginRight:5, marginLeft:5 }}/> 
                </div>
                 <Typography color="secondary" align ="justify" variant="h5">
                   Cuando se está presentando un evento de precipitación MISUDS
                   muestra en tiempo real una gráfica con la los datos de caudal, 
                   conductividad y precipitación. Cuando el evento termina MISUDS procesa los datos y el evento puede 
                   ser consultado en los eventos históricos, los cuales pueden ser fácilmente filtrados. Todos 
                   los datos pueden ser exportados  
                   en formato CSV y las gráficas 
                   pueden guardarse en formato PNG, ideal para informes. 
                 </Typography>
                 </Paper>
                </Grid>
              </Grid>
 
              </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
Welcome.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  auth: PropTypes.instanceOf(Object).isRequired
};
export default withStyles(styles)(Welcome);
