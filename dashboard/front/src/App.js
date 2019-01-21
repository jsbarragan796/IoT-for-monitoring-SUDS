import React, { Component } from 'react'
import './App.css'
import 'typeface-roboto'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Home from './components/Home'
import Events from './components/Events'
import ErrorPage from './components/ErrorPage'
import Auth from './auth/Auth0.js'
import Callback from './auth/Callback'
import HistoricalEvent from './components/HistoricalEvent'

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
})

const auth = new Auth()

class App extends Component {
	constructor () {
		super()
		this.state = {
			user: null,
			auth
		}
	}

	setUser (user) {
		this.setState({
			user: user
		})
	}

	render () {
		return (
			<MuiThemeProvider theme={theme}>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" render={() => <Home user={this.state.user} auth={this.state.auth}/>} />
						<Route exact path="/eventos" render={() => <Events user={this.state.user} auth={this.state.auth}/>}/>
						<Route path="/callback" render={()=><Callback login = {(user) => this.setUser(user)}/>}/>
						<Route path='/eventos/:eventId' component={HistoricalEvent}/>
						<Route component={ErrorPage} />
					</Switch>
				</BrowserRouter>
			</MuiThemeProvider>
		)
	}
}

export default App
