/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import WelcomeAppBar from './WelcomeAppNavBar';
import logo from '../assets/logo.png';
import a2 from '../assets/1.png';
import a3 from '../assets/2.png';
import a4 from '../assets/3.png';
import suds from '../assets/suds.png';
import parque from '../assets/1.jpg';

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

  getModalStyle() {
    const { top, left } = this.state;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  render() {
    const { auth, classes } = this.props;
    return (
      <div >
        <WelcomeAppBar optionActive="Inicio" auth={auth} />
        <div  className="main">
          <Grid container direction="column" alignItems="center" spacing={16}>
            <Grid item xs={10}>
              <Typography className={classes.title} color="inherit" variant="h3" align ="center">
                Bienvenido a monitoreo en tiempo real SUDS piloto San Cristótal
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <img src={logo} alt="Logo" width="300" />
            </Grid>
            <Grid item xs={12}>
            
              <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                <Grid item xs={3}>
                  <div className="inicio">
                    <div className="center-div">
                      <img src={a2} alt="Logo" width="100wv" />
                    </div>
                  </div>
                  <Typography className={classes.title} color="inherit" variant="subtitle1">
                  Cuando se este presentando un evento se visualiza en tiempo real los datos de
                  caudal de escorrentía que entran y salen del SUDS.
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <div className="inicio">
                    <div className="center-div">
                      <img src={a4} alt="Logo" width="100wv" />
                    </div>
                  </div>
                  <Typography className={classes.title} color="inherit" variant="subtitle1">
                    Explora la información histórica de todos los eventos se les puede aplicar un
                    filtro por hasta siete criterios simultáneos.
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <div className="inicio">
                    <div className="center-div">
                      <img src={a3} alt="Logo" width="100wv" />
                    </div>
                  </div>
                  <Typography className={classes.title} color="inherit" variant="subtitle1">
                    Todas las gráficas pueden ser exportadas en archivos .png, también las
                    mediciones pueden ser descargadas en un archivo .csv
                  </Typography>
                </Grid>
              </Grid>

            </Grid>

            <Grid item xs={12}>
                <div className="intro">
                <Typography color="inherit" variant="h4">
                Introducción
                  </Typography>
                  <Grid container direction="row" justify="center" alignItems="stretch" > 
                    <Grid item xs={12}> 
                      <img src={suds} alt="Logo" className="responsive" style={{float:"left", marginRight:5, marginLeft:5 }}/> 
                      <Typography color="inherit" variant="subtitle1">
                      La Empresa de Acueducto, Alcantarillado y Aseo de Bogotá, EAB-ESP y la Secretaría Distrital de Ambiente, SDA, mediante convenio interadministrativo No. EAB ESP 9-07-26200-0912-2013, SDA 01269 de 2013 establecieron la necesidad de propender por un sistema urbano de drenaje que busque la adecuada calidad del agua de 
                      la escorrentía que drena hacia ríos, quebradas y humedales, que promueva el aprovechamiento del agua lluvia para usos no potables y paisajísticos y que tienda a condiciones pre-urbanas del ciclo hidrológico para 
                      prevenir y/o mitigar inundaciones. Por consiguiente, a través del mencionado convenio, la EAB-ESP contrató a la Universidad de los Andes para desarrollar la “Investigación de las tipologías y/o tecnologías de Sistemas Urbanos de Drenaje Sostenible (SUDS) que más se adapten a las condiciones de la ciudad de Bogotá D. C.”.
                       El Centro de Investigaciones en Ingeniería Ambiental, CIIA, de la Facultad de Ingeniería, es el ejecutor de esta investigación. Como parte de la investigación se realizó la construcción y el monitoreo de un 
                      piloto de SUDS en el Parque Metropolitano San Cristóbal Sur, el cual está compuesto por una cuneta verde conectada aguas abajo con una cuenca seca de drenaje extendido. 
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
            </Grid>

            <Grid item xs={12}>
                <div className="intro">
                <Typography color="inherit" variant="h4">
                  CONTEXTO DEL SITIO 
                </Typography>
                  <Grid container direction="row" justify="center" alignItems="stretch" > 
                    <Grid item xs={12}> 
                      <img src={parque} alt="Logo" className="responsive" style={{float:"right", marginRight:5, marginLeft:5 }}/> 
                      <Typography color="inherit" variant="subtitle1">
                      El Parque Metropolitano San Cristóbal Sur se encuentra ubicado en el suroriente de Bogotá, en la localidad de San Cristóbal, 
                      y abarca un área de aproximadamente 11 hectáreas. Se localiza sobre la Calle 18 sur y es contiguo al Parque Primero de Mayo, 
                      por lo que en conjunto conforman uno de los complejos deportivos y recreativos más importantes de la ciudad. Una fracción del 
                      parque fue desarrollada en el año 1951, momento en el que se construyó el Velódromo Primero de Mayo; sin embargo, 
                      la reestructuración y adecuación del parque tal como se mantiene en la actualidad se concretó en el año 1998. 
                      Dentro del equipamiento de estos parques se cuenta con un velódromo, un coliseo deportivo, un estadio, canchas múltiples de
                      baloncesto, voleibol y fútbol, pistas de trote, senderos, plazoletas y juegos infantiles. En la Figura 1 se observa una de 
                      las áreas potenciales del parque identificadas para la intervención con SUDS.
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
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
