/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppNavBar from './AppNavBar';
import HistoricalData from './HistoricalData';

class Events extends Component {
  render() {
    const { auth } = this.props;
    return (
      <div>
        <AppNavBar auth={auth} optionActive="historicalEvents" />
        <HistoricalData />
      </div>
    );
  }
}

Events.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
};
export default Events;
