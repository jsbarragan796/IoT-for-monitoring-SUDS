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
      <div>
        <WelcomeAppBar optionActive="Inicio" auth={auth} />
        <div>
          <Grid container direction="column" alignItems="center" spacing={8}>
            <Grid item xs={10}>
              <Typography className={classes.title} color="inherit" variant="h4">
                Bienvenido a monitoreo SUDS piloto San Cristotal
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <img src={logo} alt="Logo" width="200" />
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
                    Cuando se este presentando un evento se vizualiza en tiempo real los datos de
                    caudal de encorrentía que entran y salen del SUDS.
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
                    filtro por hasta siete criterios simultaneos.
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <div className="inicio">
                    <div className="center-div">
                      <img src={a3} alt="Logo" width="100wv" />
                    </div>
                  </div>
                  <Typography className={classes.title} color="inherit" variant="subtitle1">
                    Todas las gráficas pueden ser exportadas en archivos .png, tambien las
                    mediciones pueden ser descargadas en un archivo .csv
                  </Typography>
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
