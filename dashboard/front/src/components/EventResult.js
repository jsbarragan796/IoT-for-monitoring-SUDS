import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const styles = {
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	}
}

class EventResult extends Component {
	constructor (props) {
		super(props)
		this.margin = {
			top: 20,
			right: 30,
			bottom: 30,
			left: 40
		}
	}

	render () {
		const { event } = this.props
		const options = {
			weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
		}
		const date = new Date(Number(String(event.startDate).substr(0, 13))).toLocaleDateString('es-US', options)
		return (
			<Grid item sx={6}>

				<Card>
					<CardHeader
						title={`Evento registrado el ${date}`}
					/>

					<CardContent>
						<Grid container spacing={8}>
							<Grid item xs={12}>
								<Grid item container direction="row">
									<Grid item container xs={6} direction="column">
										<Typography variant="h5" color="inherit">
                      Entrada
										</Typography>
										<Typography variant="h6" color="inherit">
											<strong>
                          Volumen :
											</strong>
											{` ${Math.ceil(event.volumeInput)} l³`}
										</Typography>
										<Typography variant="h6" color="inherit">
											<strong>
                          Caudal pico :
											</strong>
											{` ${Math.ceil(event.peakInputFlow)} l/s`}
										</Typography>
									</Grid>
									<Grid item container xs={6} direction="column">
										<Typography variant="h5" color="inherit">
                      Salida
										</Typography>
										<Typography variant="h6" color="inherit">
											<strong>
                          Volumen :
											</strong>
											{` ${Math.ceil(event.volumeOutput)} l³`}
										</Typography>
										<Typography variant="h6" color="inherit">
											<strong>
                          Caudal pico :
											</strong>
											{` ${Math.ceil(event.peakOutFlow)} l/s`}
										</Typography>

									</Grid>
									<Grid item container xs={12} direction="column">
										<Typography variant="h6" color="inherit">
											<strong>
                          Eficiencia :
											</strong>
											{` ${Math.ceil(event.efficiency)} %`}
										</Typography>

										<Typography variant="h6" color="inherit">
											<strong>
                          Reducción del caudal pico :
											</strong>
											{` ${Math.ceil(event.reductionOfPeakFlow)} %`}
										</Typography>

										<Typography variant="h6" color="inherit">
											<strong>
                          Duración:
											</strong>
											{` ${Math.floor(event.duration)}:${Math.floor((event.duration - Math.floor(event.duration)) * 60)} horas`}
										</Typography>

									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		)
	}
}

EventResult.propTypes = {
	event: PropTypes.instanceOf(Object).isRequired,
	classes: PropTypes.instanceOf(Object).isRequired
}

export default withStyles(styles)(EventResult)
