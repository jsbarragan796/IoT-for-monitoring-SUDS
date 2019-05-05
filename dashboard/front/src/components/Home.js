/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppNavBar from './AppNavBar';
import RealTimeData from './RealTimeData';

class Home extends Component {
  render() {
    const { auth } = this.props;
    return (
      <div>
        <AppNavBar auth={auth} optionActive="realtime" />
        <RealTimeData />
      </div>
    );
  }
}
Home.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
};
export default Home;
