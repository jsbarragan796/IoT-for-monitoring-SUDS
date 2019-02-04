/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const styles = {
  left: {
    marginLeft: 'auto'
  },
  card: {
    minWidth: 600
  }
};

class EventResult extends Component {
  render() {
    const { event } = this.props;
    const { classes } = this.props;
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const date = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString(
      'es-US',
      options
    );
    return (
      <Grid item>
        <Card className={classes.card}>
          <CardHeader title={`Evento registrado el ${date}`} />
          <CardContent>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Grid item container direction="row">
                  <Grid item container xs={6} direction="column">
                    <Typography color="inherit">Entrada</Typography>
                    <Typography color="inherit">
                      <strong>Volumen :</strong>
                      {` ${Math.ceil(event.volumeInput)} l³`}
                    </Typography>
                  </Grid>
                  <Grid item container xs={6} direction="column">
                    <Typography color="inherit">Salida</Typography>
                    <Typography color="inherit">
                      <strong>Volumen :</strong>
                      {` ${Math.ceil(event.volumeOutput)} l³`}
                    </Typography>
                  </Grid>
                  <Grid item container xs={12} direction="column">
                    <Typography color="inherit">
                      <strong>Eficiencia :</strong>
                      {` ${Math.ceil(event.efficiency)} %`}
                    </Typography>

                    <Typography color="inherit">
                      <strong>Reducción del caudal pico :</strong>
                      {` ${Math.ceil(event.reductionOfPeakFlow)} %`}
                    </Typography>

                    <Typography color="inherit">
                      <strong>Duración:</strong>
                      {` ${Math.floor(event.duration)}:${Math.floor(
                        (event.duration - Math.floor(event.duration)) * 60
                      )} horas`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button className={classes.left} size="small" color="primary">
              <Link to={`/eventos/${event._id}`}>Ver detalle </Link>
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

EventResult.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
  classes: PropTypes.instanceOf(Object).isRequired
};

export default withStyles(styles)(EventResult);
