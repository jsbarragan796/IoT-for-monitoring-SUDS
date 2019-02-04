import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/icons/Timeline';
import RssFeed from '@material-ui/icons/RssFeed';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Badge from '@material-ui/core/Badge';
import MoreIcon from '@material-ui/icons/MoreVert';
import navBarLogo from '../assets/navbar2.png';

const styles = theme => ({
  root: {
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
});

class AppNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMoreAnchorEl: null,
      RTEvnets: false
    };
  }

  componentDidMount() {
    const { optionActive } = this.props;
    if (optionActive !== 'realtime') {
      this.update();
    }
  }

  componentWillUnmount() {
    const { optionActive } = this.props;
    if (optionActive !== 'realtime') {
      clearInterval(this.timer);
    }
  }


  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  checkRealTimeEvent() {
    axios
      .get('/events/are-current-events')
      .then((response) => {
        const { RTEvnets } = this.state;
        if (RTEvnets !== response.data.RTEvnets) {
          this.setState({ RTEvnets: !RTEvnets });
        }
      })
      .catch();
  }

  update() {
    this.checkRealTimeEvent();
    this.timer = setInterval(() => {
      this.checkRealTimeEvent();
    }, 1500);
  }

  render() {
    const { mobileMoreAnchorEl, RTEvnets } = this.state;
    const { classes, auth } = this.props;
    const userdata = auth.getProfile();
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem component={Link} to="/">
          <IconButton color="inherit">
            <Badge variant="dot" invisible={!RTEvnets} color="secondary">
              <RssFeed />
            </Badge>
          </IconButton>
          Tiempo Real
        </MenuItem>
        <MenuItem component={Link} to="/eventos">
          <IconButton color="inherit">
            <Timeline />
          </IconButton>
            Histórico
        </MenuItem>
        <MenuItem onClick={auth.logout}>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
            Cerrar Sesión
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Home">
              <img src={navBarLogo} width="100wv" alt="Logo" />
            </IconButton>
            <Typography className={classes.title} color="inherit" noWrap>
              SUDS Uniandes
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                color="inherit"
                component={Link}
                to="/"
              >
                <Badge variant="dot" invisible={!RTEvnets} color="secondary">
                  <RssFeed />
                  <Typography color="inherit" className={classes.grow}>
                    {'Tiempo real'}
                  </Typography>
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                component={Link}
                to="/eventos"
              >
                <Timeline />
                <Typography color="inherit" className={classes.grow}>
                  {'Histórico'}
                </Typography>
              </IconButton>
              <IconButton
                onClick={auth.logout}
                color="inherit"
              >
                <ExitToApp />
                <Typography color="inherit" className={classes.grow}>
                  {'Cerrar Sesión'}
                </Typography>
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

AppNavBar.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  auth: PropTypes.instanceOf(Object).isRequired,
  optionActive: PropTypes.string.isRequired
};

export default withStyles(styles)(AppNavBar);
