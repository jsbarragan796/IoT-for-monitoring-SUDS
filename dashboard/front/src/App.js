import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './components/Home';
import Events from './components/Events';
import ErrorPage from './components/ErrorPage';
import Auth from './auth/Auth0';
import Callback from './auth/Callback';
import HistoricalEvent from './components/HistoricalEvent';
import Welcome from './components/Welcome';

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      auth: new Auth(),
      width: null,
      height: null
    };
    this.currentSize = this.currentSize.bind(this);
  }

  componentDidMount() {
    this.currentSize();
    window.addEventListener('resize', this.currentSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.currentSize);
  }

  setUser(user) {
    this.setState({
      user
    });
  }

  currentSize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const {
      user, auth, width, height
    } = this.state;
    let switchRoute = '';

    if (auth.isAuthenticated()) {
      switchRoute = (
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Home width={width} height={height} user={user} auth={auth} />}
          />
          <Route exact path="/eventos" component={() => <Events user={user} auth={auth} />} />
          <Route
            path="/eventos/:eventId"
            component={match => (
              <HistoricalEvent
                match={match}
                width={width}
                height={height}
                user={user}
                auth={auth}
              />
            )}
          />
          <Route render={ErrorPage} />
        </Switch>
      );
    } else {
      switchRoute = (
        <Switch>
          <Route exact path="/" render={() => <Welcome auth={auth} />} />
          <Route
            path="/callback"
            render={() => <Callback login={newUser => this.setUser(newUser)} />}
          />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>{switchRoute}</BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
