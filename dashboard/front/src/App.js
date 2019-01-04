import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './components/Home';
import Events from './components/Events';
import ErrorPage from './components/ErrorPage';

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
  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/eventos" render={() => <Events />} />
            <Route component={ErrorPage} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
