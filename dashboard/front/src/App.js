/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import { Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './components/Home';
import Events from './components/Events';
import ErrorPage from './components/ErrorPage';
import Auth from './auth/Auth0';
import HistoricalEvent from './components/HistoricalEvent';
import Welcome from './components/Welcome';
import Callback from './auth/Callback';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4db6ac'
    },
    secondary: {
      main: '#1e88e5'
    }
  },
  typography: {
    useNextVariants: true
  }
});
const auth = new Auth();
class App extends Component {
  render() {
    let switchRoute = '';
    if (auth.isAuthenticated()) {
      switchRoute = (
        <Switch>
          <Route exact path="/" render={() => <Home auth={auth} />} />
          <Route exact path="/eventos" component={() => <Events auth={auth} />} />
          <Route
            path="/eventos/:eventId"
            component={match => <HistoricalEvent match={match} auth={auth} />}
          />
          <Route render={ErrorPage} />
        </Switch>
      );
    } else {
      switchRoute = (
        <Switch>
          <Route exact path="/inicio" render={() => <Welcome auth={auth} loggingIn={false} />} />
          <Route path="/callback" render={() => <Callback auth={auth} />} />
          <Redirect to="/inicio" />
        </Switch>
      );
    }

    return <MuiThemeProvider theme={theme}>{switchRoute}</MuiThemeProvider>;
  }
}

export default App;
