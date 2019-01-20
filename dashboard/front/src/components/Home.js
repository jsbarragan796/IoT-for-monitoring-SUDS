/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import { Alert } from 'reactstrap'
import AppNavBar from './AppNavBar'
import EventsRealTime from './EventsRealTime'
import logo from '../assets/logo.png'

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: null,
			errorStatus: false,
			errorMessage: '',
		}
		this.loadData = this.loadData.bind(this)
	}

	componentDidMount() {
		this.loadData()
	}

	loadData() {
		axios
			.get('/events/current-events?pageNumber=1')
			.then((response) => {
				this.setState({ data: response.data })
				const { data } = this.state
				console.log(data)
			})
			.catch((err) => {
				this.setState({ errorStatus: true, errorMessage: err.message })
			})
	}

	showErrorMessage() {
		const { errorStatus, errorMessage } = this.state
		if (errorStatus) {
			return (
				<Alert color="danger">
          Ha ocurrido un problema, comuniquese con el administrador del sistema.
          Por favor comuníquele el siguinte mensaje :
					{' '}
					{errorMessage}
				</Alert>
			)
		}
		return ''
	}

	// update () {
	//   setInterval(() => {
	//     this.loadData();
	//     console.log('getting data');
	//   }, 15000);
	// }

	render() {

		if (this.props.auth.isAuthenticated() === false) {
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
		} else {
			let s = ''
			let w = ''
			let e = ''
			const { data } = this.state
			if (data && data.events.length > 0) {
				s = (
					<EventsRealTime
						data={data.events[0].entry}
						data2={data.events[0].exit}
					/>
				)
				const options = {
					weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
				}
				const date = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString('es-US', options)
				w = new Date(Number(String(data.events[0].startDate).substr(0, 13))).toLocaleDateString('es-US', options)
				e = new Date(Number(String(data.events[0].lastMeasurementDate).substr(0, 13))).toLocaleDateString('es-US', options)
			}
			return (
				<div>
					<AppNavBar optionActive="Inicio" />
					{this.showErrorMessage()}
					<div className="main">
						<h2>Datos evento en curso:</h2>
						{s}
						<p>
              Fecha de inicio:
							{' '}
							{w}
						</p>
						<p>
              Fecha último dato recibido:
							{' '}
							{e}
						</p>
					</div>
				</div>
			)
		}
		
	}
}

export default Home
