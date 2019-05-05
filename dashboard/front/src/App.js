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
import HistoricalEventWrapper from './components/HistoricalEventWrapper';
import Welcome from './components/Welcome';
import Help from './components/Help';
import Callback from './auth/Callback';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3aa9d4',
    },
    secondary: {
      main: '#08465f',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Segoe UI',
  },
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
          <Route exact path="/ayuda" component={() => <Help auth={auth} />} />
          <Route
            path="/eventos/:eventId"
            component={match => <HistoricalEventWrapper match={match} auth={auth} />}
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
