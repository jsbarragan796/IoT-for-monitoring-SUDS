import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import { BrowserRouter, Route, Switch } from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path="/" render={()=><Home  />}/>
      <Route component={ErrorPage}/>
      </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
