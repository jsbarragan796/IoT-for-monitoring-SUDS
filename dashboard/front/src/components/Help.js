/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AppNavBar from './AppNavBar';
import menu1 from '../assets/Inicio1.png';
import menu2 from '../assets/inicio4.png';
import menu3 from '../assets/wating.png';
import histo from '../assets/historico realtime.png';
import date from '../assets/dat4.png';


class Help extends Component {
  render() {
    const { auth } = this.props;
    return (
      <div>
        <AppNavBar auth={auth} optionActive="help" />
        <div className="main">
          <Grid container direction="column" alignItems="center" spacing={16}>
            <Grid item xs={12}>
              <Typography color="primary" variant="h3" align="center">
            MISUDS
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="primary" variant="h4" align="center">
                Guía de usuario
              </Typography>
              <Typography color="secundary" variant="p" align="justify">
              Esta es una guía donde se exponen cada uno de los menús de la 
              aplicación con sus respectivas funcionalidades. Las taps principales son tiempo real e histórico. 
              Estas son visibles en la parte superior en la barra de navegación.
              </Typography>
            </Grid>
            <div style={{ marginBottom: 60 }} />
            <Grid item xs={11} sm={11} md={11} lg={9}>
            <Grid container direction="column" justify="center" alignItems="center" spacing={16}>
            <Grid item xs={12} sm={12} md={12} lg={10}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography color="primary" align="center" variant="h4">
                        Tiempo real 
                    </Typography>
                    <div style={{ marginBottom: 30 }} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Typography color="secondary" align="justify" variant="p">
                    En este menú se encuentra los datos colectados
                    de un evento  que está en curso. En la parte superior se encuentra 
                    la fecha de inicio del evento , la duración , la fecha del ultimo dato recibido 
                     y	los caudales pido tanto de entrada como de salida. 
                    </Typography>
                    <div style={{ marginBottom: 60 }} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={8}>
                    <div style={{ textAlign: 'center' }}>
                        <img src={menu1} width="500wv" alt="realtime 1" />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                <Grid item xs={12} sm={12} md={12} lg={4}>
                  <div style={{ marginBottom: 30 }} />
                  <Typography color="secondary" align="justify" variant="p">
                  En la esquina  superior derecha de la gráfica se encuentra
                  un menú de opciones, que  permiten: cambio de datos a visualizar,
                  descarga de la gráfica en png y de los datos en csv.  
                  </Typography>
                  <div style={{ marginBottom: 60 }} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8}>
                  <div style={{ textAlign: 'center' }}>
                      <img src={menu2} width="500wv" alt="realtime 2" />
                  </div>
                </Grid>
               </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                <Grid item xs={12} sm={12} md={12} lg={4}>
                  <div style={{ marginBottom: 30 }} />
                  <Typography color="secondary" align="justify" variant="p">
                  Cuando un evento finaliza o no hay eventos en curso estos, se muestra la siguiente 
                  pantalla de espera. Todo evento al finalizar se puede visualizar en el menú de 
                  históricos.     
                  </Typography>
                  <div style={{ marginBottom: 60 }} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8}>
                  <div style={{ marginBottom: 30 }} />
                  <div style={{ textAlign: 'center' }}>
                      <img src={menu3} width="500wv" alt="realtime 3" />
                  </div>
                </Grid>
               </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={10}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography color="primary" align="center" variant="h4">
                        Eventos Históricos
                    </Typography>
                    <div style={{ marginBottom: 30 }} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Typography color="secondary" align="justify" variant="p">
                    Todos los eventos finalizados están disponibles para búsqueda. En la parte izquierda 
                    se encuentra el área de filtros. Cada una de las filas es un mismo criterio de búsqueda y cada columna
                    es el rango del parámetro. En la ultima fila está un menú desplegable con opciones 
                    de ordenamiento de los datos. Para borrar los filtros en la parte inferior
                    se encuentra la opción limpiar . En la parte superior si algún evento está en curso,
                    un área circular se encontrará sobre el menú de tiempo real.  
                    </Typography>
                    <div style={{ marginBottom: 60 }} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={8}>
                    <div style={{ textAlign: 'center' }}>
                        <img src={histo} width="500wv" alt="histo 1" />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Typography color="secondary" align="justify" variant="p">
                      Para agilizar la busqueda de fechas, hacer click en el año sobre  el selector 
                      despliega un scroll con los años.
                    </Typography>
                    <div style={{ marginBottom: 60 }} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={8}>
                    <div style={{ textAlign: 'center' }}>
                        <img src={date} width="400wv" alt="histo 1" />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
            </Grid>
          <div style={{ marginBottom: 60 }} />
        </div>
      </div>
    );
  }
}
Help.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
};
export default Help;
