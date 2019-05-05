/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppNavBar from './AppNavBar';
import HistoricalEvent from './HistoricalEvent';

class HistoricalEventWrapper extends Component {
  render() {
    const { auth, match } = this.props;
    return (
      <div className="main">
        <AppNavBar auth={auth} optionActive="eventDetail" />
        <HistoricalEvent match={match} />
      </div>
    );
  }
}

HistoricalEventWrapper.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
};
export default HistoricalEventWrapper;
