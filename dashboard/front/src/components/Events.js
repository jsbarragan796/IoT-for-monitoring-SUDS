/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Alert
} from 'reactstrap';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Filter from './Filter';
import HistoricalEvent from './HistoricalEvent';
import AppNavBar from './AppNavBar';

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
  }
};

class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: null,
      errorStatus: false,
      errorMessage: '',
      filter: { pageNumber: 1 }
    };
    this.loadData = this.loadData.bind(this);
    this.allEvents = this.allEvents.bind(this);
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
    const { filter } = this.state;
    axios.post('events/filtered-data', filter)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((err) => {
        this.setState({ errorStatus: true, errorMessage: err.message });
      });
  }

  showErrorMessage () {
    const { errorStatus, errorMessage } = this.state;
    if (errorStatus) {
      return (
        <Alert color="danger">
         Ha ocurrido un problema, comuniquese con el administrador del sistema.
         Por favor comuníquele el siguinte mensaje :
          {' '}
          {errorMessage}
        </Alert>);
    }

    return '';
  }

  allEvents () {
    const { data } = this.state;
    return data.events.map(
      event => (<HistoricalEvent key={event._id} event={event} />)
    );
  }

  render () {
    let events = '';
    const { data } = this.state;
    const { classes } = this.props;
    if (data && data.events.length > 0) {
      events = this.allEvents();
    }
    return (
      <div>
        <AppNavBar optionActive="Eventos" />
        {this.showErrorMessage()}
        <div className="main">
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="inherit">
                  Filtros
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Filter />
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button size="small">
                Cancel
              </Button>
              <Button size="small" color="primary">
            Save
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
          <Grid container spacing={8}>
            {events}
          </Grid>
        </div>
      </div>
    );
  }
}

Events.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired
};
export default withStyles(styles)(Events);
