/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
	Alert
} from 'reactstrap'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'


import Filter from './Filter'
import HistoricalEvent from './HistoricalEvent'
import AppNavBar from './AppNavBar'
import logo from '../assets/logo.png'

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
}

class Events extends Component {
	constructor (props) {
		super(props)
		this.state = {
			data: null,
			errorStatus: false,
			errorMessage: '',
			filter: { pageNumber: 1 }
		}
		this.loadData = this.loadData.bind(this)
		this.allEvents = this.allEvents.bind(this)
	}

	componentDidMount () {
		const { filter } = this.state
		this.loadData(filter)
	}

	loadData (filter) {

		axios.post('events/filtered-data', filter)
			.then((response) => {
				this.setState({ data: response.data })
			})
			.catch((err) => {
				this.setState({ errorStatus: true, errorMessage: err.message })
			})}

	setFilter (filter) {
		this.setState({
			filter: filter
		})
		this.loadData(filter)
	}

	showErrorMessage () {
		const { errorStatus, errorMessage } = this.state
		if (errorStatus) {
			return (
				<Alert color="danger">
         Ha ocurrido un problema, comuniquese con el administrador del sistema.
         Por favor comuníquele el siguinte mensaje :
					{' '}
					{errorMessage}
				</Alert>)
		}

		return ''
	}

	allEvents () {
		const { data } = this.state
		return data.events.map(
			event => (<HistoricalEvent key={event._id} event={event} />)
		)
	}

	render () {
		if(this.props.auth.isAuthenticated()===false){
			return (
				<div >
					<AppNavBar optionActive="Inicio" />
					<div className="main">
						<div className="inicio">
							<img className="logo" height="100" src={logo} alt="Logo" />
						</div>
						<button
							onClick={() => {
								this.props.auth.login()
							}}
							className="btn btn-dark btn-lg btn-block"
						>
          Iniciar sesión
						</button>
					</div>		
				</div>
			)
		}
		else {
			let events = ''
			const { data } = this.state
			const { classes } = this.props
			if (data && data.events.length > 0) {
				events = this.allEvents()
			}
			return (
				<div>
					<AppNavBar optionActive="Eventos" />
					{this.showErrorMessage()}
					<div className="main">
						<Filter setFilter = {(filter) => this.setFilter(filter)} />
						<Grid container spacing={8}>
							{events}
						</Grid>
					</div>
				</div>
			)
		}
	}
}

Events.propTypes = {
	classes: PropTypes.instanceOf(Object).isRequired
}
export default withStyles(styles)(Events)
