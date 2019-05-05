import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import WelcomeAppBar from '../components/WelcomeAppNavBar';
import logo from '../assets/SUDS2.png';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class Callback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 50,
      left: 50
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    setTimeout(auth.handleAuthentication, 1000);
  }

  getModalStyle() {
    const { top, left } = this.state;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  render() {
    const { classes, auth } = this.props;
    return (
      <div>
        <WelcomeAppBar optionActive="Inicio" auth={auth} />
        <div className="inicio">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open
        >
          <div style={this.getModalStyle()} className={classes.paper}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h6" id="modal-title">
                Iniciando Sesión
              </Typography>
              <CircularProgress size={68} className={classes.progress} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
Callback.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
  classes: PropTypes.instanceOf(Object).isRequired
};
export default withStyles(styles)(Callback);
// export default Callback;
