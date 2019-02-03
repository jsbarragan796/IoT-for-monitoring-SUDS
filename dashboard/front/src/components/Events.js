/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppNavBar from './AppNavBar';
import EventResult from './EventResult';
import Filter from './Filter';

const styles = {
  root: {
    flexGrow: 1
  },
  filter: {
    'max-width': '25%',
    'min-width': 200

  },
  events: {
    'max-width': '75%',
    'min-width': 300
  },
  card: {
    minWidth: '75%'
  }
};

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      errorStatus: false,
      errorMessage: '',
      filter: { pageNumber: 1 }
    };
    this.loadData = this.loadData.bind(this);
    this.allEvents = this.allEvents.bind(this);
    this.paginador = this.paginador.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    const { filter } = this.state;
    this.loadData(filter);
  }

  setFilter(filter) {
    this.setState({
      filter
    });
    this.loadData(filter);
  }

  loadData(filter) {
    axios.post('events/filtered-data', filter)
      .then((response) => {
        this.setState({ data: response.data, errorStatus: false });
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
          Ha ocurrido un problema, comuniquese con el administrador del sistema y
          por favor comuníquele el siguinte mensaje :
              {' '}
              {errorMessage}

            </span>
)}
        />
      );
    }

    return '';
  }

  changePage(pageNumber) {
    const { filter } = this.state;
    filter.pageNumber = pageNumber;
    this.loadData(filter);
    this.setState({ filter });
  }


  allEvents() {
    const { data } = this.state;
    return data.events.map(
      event => (<EventResult key={event._id} event={event} />)
    );
  }

  paginador() {
    const { data } = this.state;
    const { totalPages, currentPage } = data;

    if (totalPages > 1) {
      if (currentPage === 1) {
        return (
          <Grid item>
            <Card>
              <CardContent>
                <Button size="small" onClick={() => { this.changePage(2); }} color="primary">
              Siguiente
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      } if (currentPage === totalPages) {
        return (
          <Grid item>
            <Card>
              <CardContent>
                <Button size="small" onClick={() => { this.changePage(totalPages - 1); }} color="primary">
              Atrás
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      }
      return (
        <Grid item>
          <Card>
            <CardContent>
              <Button size="small" onClick={() => { this.changePage(currentPage - 1); }} color="primary">
              Atrás
              </Button>
              <Button size="small" onClick={() => { this.changePage(currentPage + 1); }} color="primary">
              Siguiente
              </Button>
            </CardContent>
          </Card>
        </Grid>
      );
    }
    return '';
  }

  render() {
    let events = '';
    let totalEventos = '';
    let paginador = '';
    const { data } = this.state;
    const { classes } = this.props;
    if (data && data.events.length > 0) {
      events = this.allEvents();
      paginador = this.paginador();
      totalEventos = data.numberOfEvents;
    }
    return (
      <div>
        <AppNavBar optionActive="Eventos" />
        {this.showErrorMessage()}
        <div className="main">
          <Filter setFilter={filter => this.setFilter(filter)} />
          <br />
          <Grid container direction="column" justify="center" alignItems="center" spacing={40}>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography color="inherit">
                        Eventos encontrados:
                    {' '}
                    {totalEventos}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {events}
            {paginador}
          </Grid>
        </div>
      </div>
    );
  }
}

Events.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.instanceOf(Object).isRequired
};
export default withStyles(styles)(Events);
