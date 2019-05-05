/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'material-ui-flat-pagination';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
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

class HistoricalData extends Component {
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
    axios
      .post(`${process.env.REACT_APP_HISTORICAL_SERVING}/events/filtered-data`, filter)
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
              Ha ocurrido un problema, comuniquese con el administrador del sistema y por favor
              comuníquele el siguinte mensaje :
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
    return data.events.map(event => <EventResult key={event._id} event={event} />);
  }

  paginador() {
    const { data } = this.state;
    const { currentPage, totalPages } = data;
    if (totalPages > 1) {
      return (
        <Grid item xs={12}>
          <Pagination
            limit={1}
            offset={currentPage - 1}
            total={totalPages}
            onClick={(e, offset, page) => this.changePage(page)}
          />
        </Grid>
      );
    }
    return '';
  }

  render() {
    let events = (
      <Grid item>
        <Typography variant="h2" color="inherit">
           No se encontraron resultados
        </Typography>
      </Grid>
    );
    let totalEventos = 'No se encontraron resultados';
    let paginador = '';
    const { data } = this.state;
    if (data && data.events.length > 0) {
      events = this.allEvents();
      paginador = this.paginador();
      totalEventos = `${data.numberOfEvents} ${data.numberOfEvents === 1 ? ' resultado ' : ' resultados'}`;
    }
    return (
      <div>
        {this.showErrorMessage()}
        <div className="main">
          <div >
            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
              <Grid item xs={12} sm={12} md={12} lg={5}>
                <Filter foundEvents={totalEventos} setFilter={filter => this.setFilter(filter)} />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={7}>
                <Grid container direction="column" justify="space-between" alignItems="center" spacing={16}>
                  {events}
                  {paginador}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HistoricalData);
