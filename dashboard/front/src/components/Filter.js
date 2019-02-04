/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import esLocale from 'date-fns/locale/es';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 150
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  grid: {
    width: '100%'
  }
});


class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: null,
      beginDate: null,
      beginEfficiency: '',
      endEfficiency: '',
      beginVolumeInput: '',
      endVolumeInput: '',
      beginVolumeOutput: '',
      endVolumeOutput: '',
      beginReductionOfPeakFlow: '',
      endReductionOfPeakFlow: '',
      beginDuration: '',
      endDuration: '',
      errbeginEfficiency: false,
      errendEfficiency: false,
      errbeginVolumeInput: false,
      errendVolumeInput: false,
      errbeginVolumeOutput: false,
      errendVolumeOutput: false,
      errbeginReductionOfPeakFlow: false,
      errendReductionOfPeakFlow: false,
      errbeginDuration: false,
      errendDuration: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.reset = this.reset.bind(this);
    this.sendFilter = this.sendFilter.bind(this);
  }


  handleChange = name => (event) => {
    const value = event.target ? event.target.value : event;
    this.validateInput(name, value);
    if (name !== 'beginDate' && name !== 'endDate') {
      this.setState({
        [name]: Number(value)
      });
    } else {
      this.setState({
        [name]: (value)
      });
    }
  };

  validateInput = (name, value) => {
    if (name !== 'beginDate' && name !== 'endDate' && Number(value) < 0) {
      this.setState({
        [`err${name}`]: true
      });
    } else {
      this.setState({
        [`err${name}`]: false
      });
    }
  };

  sendFilter = () => {
    const { state, props } = this;
    const filter = {
      endDate: undefined,
      beginDate: undefined,
      beginEfficiency: undefined,
      endEfficiency: undefined,
      beginVolumeInput: undefined,
      endVolumeInput: undefined,
      beginVolumeOutput: undefined,
      endVolumeOutput: undefined,
      beginReductionOfPeakFlow: undefined,
      endReductionOfPeakFlow: undefined,
      beginDuration: undefined,
      endDuration: undefined,
      pageNumber: 1
    };
    if (state.beginEfficiency !== '') {
      filter.beginEfficiency = Number(state.beginEfficiency);
    }
    if (state.endEfficiency !== '') {
      filter.endEfficiency = Number(state.endEfficiency);
    }
    if (state.beginDate !== '') {
      filter.beginDate = state.beginDate;
    }
    if (state.endDate !== '') {
      filter.endDate = state.endDate;
    }
    if (state.beginVolumeInput !== '') {
      filter.beginVolumeInput = Number(state.beginVolumeInput);
    }
    if (state.endVolumeInput !== '') {
      filter.endVolumeInput = Number(state.endVolumeInput);
    }
    if (state.beginVolumeOutput !== '') {
      filter.beginVolumeOutput = Number(state.beginVolumeOutput);
    }
    if (state.endVolumeOutput !== '') {
      filter.endVolumeOutput = Number(state.endVolumeOutput);
    }
    if (state.beginReductionOfPeakFlow !== '') {
      filter.beginReductionOfPeakFlow = Number(state.beginReductionOfPeakFlow);
    }
    if (state.endReductionOfPeakFlow !== '') {
      filter.endReductionOfPeakFlow = Number(state.endReductionOfPeakFlow);
    }
    if (state.beginDuration !== '') {
      const time = String(state.beginDuration).split(':');
      filter.beginDuration = Number(time[0]) + Number(time[1]) / 60;
    }
    if (state.endDuration !== '') {
      const time = String(state.endDuration).split(':');
      filter.endDuration = Number(time[0]) + Number(time[1]) / 60;
    }
    props.setFilter(filter);
  };


  reset = () => {
    this.setState({
      endDate: null,
      beginDate: null,
      beginEfficiency: '',
      endEfficiency: '',
      beginVolumeInput: '',
      endVolumeInput: '',
      beginVolumeOutput: '',
      endVolumeOutput: '',
      beginReductionOfPeakFlow: '',
      endReductionOfPeakFlow: '',
      beginDuration: '',
      endDuration: '',
      errbeginEfficiency: false,
      errendEfficiency: false,
      errbeginVolumeInput: false,
      errendVolumeInput: false,
      errbeginVolumeOutput: false,
      errendVolumeOutput: false,
      errbeginReductionOfPeakFlow: false,
      errendReductionOfPeakFlow: false,
      errbeginDuration: false,
      errendDuration: false
    });
  }


  render() {
    const { classes, foundEvents } = this.props;
    const { state } = this;
    return (
      <Grid container spacing={24} direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h5" color="inherit">
            Filtros
          </Typography>
          <Typography variant="h6" color="inherit">
            {foundEvents}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            <Grid container justify="center" spacing={16}>
              <Grid item xs={6}>
                <DatePicker
                  id="beginDate"
                  margin="normal"
                  label="Desde"
                  emptyLabel=""
                  className={classes.textField}
                  format="MM/dd/yyyy"
                  mask={value => (value !== '' ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])
                }
                  value={state.beginDate}
                  onChange={this.handleChange('beginDate')}
                />
              </Grid>
              <Grid item xs={6}>

                <DatePicker
                  id="endDate"
                  margin="normal"
                  label="Hasta"
                  emptyLabel=""
                  className={classes.textField}
                  format="MM/dd/yyyy"
                  mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])
            }
                  value={state.endDate}
                  onChange={this.handleChange('endDate')}
                />
              </Grid>

            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <Typography color="inherit">
              Eficiencia %
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-beginEfficiency"
            label="Min %"
            value={state.beginEfficiency}
            onChange={this.handleChange('beginEfficiency')}
            error={state.errbeginEfficiency}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}


          />

          <TextField
            id="outlined-endEfficiency"
            label="Max %"
            value={state.endEfficiency}
            error={state.errendEfficiency}
            onChange={this.handleChange('endEfficiency')}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}


          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="inherit">
              Volumen de entrada l³
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-beginVolumeInput"
            label="Min l³"
            value={state.beginVolumeInput}
            onChange={this.handleChange('beginVolumeInput')}
            error={state.errbeginVolumeInput}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}

          />

          <TextField
            id="outlined-endVolumeInput"
            label="Max l³"
            value={state.endVolumeInput}
            error={state.errendVolumeInput}
            onChange={this.handleChange('endVolumeInput')}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}

          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="inherit">
              Volumen de salida l³
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-beginVolumeOutput"
            label="Min l³"
            value={state.beginVolumeOutput}
            onChange={this.handleChange('beginVolumeOutput')}
            error={state.errbeginVolumeOutput}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}

          />
          <TextField
            id="outlined-endVolumeOutput"
            label="Max l³"
            value={state.endVolumeOutput}
            error={state.errendVolumeOutput}
            onChange={this.handleChange('endVolumeOutput')}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="inherit">
              Reducción caudal pico %
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-beginReductionOfPeakFlow"
            label="Min %"
            value={state.beginReductionOfPeakFlow}
            onChange={this.handleChange('beginReductionOfPeakFlow')}
            error={state.errbeginReductionOfPeakFlow}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="outlined-endReductionOfPeakFlow"
            label="Max %"
            value={state.endReductionOfPeakFlow}
            error={state.errendReductionOfPeakFlow}
            onChange={this.handleChange('endReductionOfPeakFlow')}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}

          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="inherit">
               Duración del evento h
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-beginDuration"
            label="Min h"
            onChange={this.handleChange('beginDuration')}
            error={state.errbeginDuration}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            id="outlined-endDuration"
            label="Max h"
            error={state.errendDuration}
            onChange={this.handleChange('endDuration')}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button size="small" onClick={this.reset}>
            Limpiar
          </Button>
          <Button size="small" onClick={this.sendFilter} color="primary">
            Aplicar
          </Button>
        </Grid>
      </Grid>

    );
  }
}

Filter.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  setFilter: PropTypes.func.isRequired,
  foundEvents: PropTypes.string.isRequired
};

export default withStyles(styles)(Filter);
