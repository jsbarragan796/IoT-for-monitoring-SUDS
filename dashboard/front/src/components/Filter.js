/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});


class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: '',
      beginDate: '',
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
    this.validateInput(name, event.target.value);
    if (name !== 'beginDate' && name !== 'endDate' && name !== 'beginDuration' && name !== 'endDuration') {
      this.setState({
        [name]: Number(event.target.value)
      });
    } else {
      this.setState({
        [name]: (event.target.value)
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
    const state = this.state;
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
      console.log('asdf', state.beginDuration);
      const time = String(state.beginDuration).split(':');
      filter.beginDuration = Number(time[0]) + Number(time[1]) / 60;
    }
    if (state.endDuration !== '') {
      const time = String(state.endDuration).split(':');
      filter.endDuration = Number(time[0]) + Number(time[1]) / 60;
    }

    this.props.setFilter(filter);
  };


  reset = () => {
    this.setState({
      endDate: '',
      beginDate: '',
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
    const { classes } = this.props;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color="inherit">
          Filtros
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Grid item container direction="column" justify="center" alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    id="beginDate"
                    label="Desde "
                    type="date"
                    className={classes.textField}

                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={this.handleChange('beginDate')}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    id="endDate"
                    label="Hasta"
                    type="date"
                    className={classes.textField}

                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={this.handleChange('endDate')}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-beginEfficiency"
                    label="Min eficiencia %"
                    value={this.state.beginEfficiency}
                    onChange={this.handleChange('beginEfficiency')}
                    error={this.state.errbeginEfficiency}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />

                  <TextField
                    id="outlined-endEfficiency"
                    label="Max eficiencia %"
                    value={this.state.endEfficiency}
                    error={this.state.errendEfficiency}
                    onChange={this.handleChange('endEfficiency')}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-beginVolumeInput"
                    label="Min volumen entrada l³"
                    value={this.state.beginVolumeInput}
                    onChange={this.handleChange('beginVolumeInput')}
                    error={this.state.errbeginVolumeInput}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />

                  <TextField
                    id="outlined-endVolumeInput"
                    label="Max volumen entrada l³"
                    value={this.state.endVolumeInput}
                    error={this.state.errendVolumeInput}
                    onChange={this.handleChange('endVolumeInput')}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-beginVolumeOutput"
                    label="Min volumen salida l³"
                    value={this.state.beginVolumeOutput}
                    onChange={this.handleChange('beginVolumeOutput')}
                    error={this.state.errbeginVolumeOutput}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />

                  <TextField
                    id="outlined-endVolumeOutput"
                    label="Max volumen salida l³"
                    value={this.state.endVolumeOutput}
                    error={this.state.errendVolumeOutput}
                    onChange={this.handleChange('endVolumeOutput')}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-beginReductionOfPeakFlow"
                    label="Reducción caudal pico %"
                    value={this.state.beginReductionOfPeakFlow}
                    onChange={this.handleChange('beginReductionOfPeakFlow')}
                    error={this.state.errbeginReductionOfPeakFlow}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />

                  <TextField
                    id="outlined-endReductionOfPeakFlow"
                    label="Reducción caudal pico %"
                    value={this.state.endReductionOfPeakFlow}
                    error={this.state.errendReductionOfPeakFlow}
                    onChange={this.handleChange('endReductionOfPeakFlow')}
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-beginDuration"
                    label="Min Duración (horas)"
                    onChange={this.handleChange('beginDuration')}
                    error={this.state.errbeginDuration}
                    type="time"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />

                  <TextField
                    id="outlined-endDuration"
                    label="Max Duración (horas)"
                    error={this.state.errendDuration}
                    onChange={this.handleChange('endDuration')}
                    type="time"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button size="small" onClick={this.reset}>
            Limpiar
          </Button>
          <Button size="small" onClick={this.sendFilter} color="primary">
            Aplicar
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired
};

export default withStyles(styles)(Filter);
