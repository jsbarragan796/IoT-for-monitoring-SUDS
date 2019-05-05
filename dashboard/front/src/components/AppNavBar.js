import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import Help from '@material-ui/icons/HelpOutline';
import Badge from '@material-ui/core/Badge';
import MoreIcon from '@material-ui/icons/MoreVert';
import navBarLogo from '../assets/navbar2.png';
import connectionHandler from '../socketIo';

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
      this.checkRealTimeEvent();
    }
  }

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  checkRealTimeEvent() {
    connectionHandler.subCurrentEvent((bool) => {
      const { RTEvnets } = this.state;
      if (RTEvnets !== bool) {
        this.setState({ RTEvnets: !RTEvnets });
      }
    });
  }

  render() {
    const { mobileMoreAnchorEl, RTEvnets } = this.state;
    const { classes, auth } = this.props;
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const userData = auth.getProfile();
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
            <Badge invisible={!RTEvnets} color="secondary"  badgeContent={' '}>
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
        <MenuItem component={Link} to="/ayuda">
        <IconButton color="inherit">
            <Help />
          </IconButton>
            Ayuda
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
              Hola, {userData? userData.nickname: " " }
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                color="inherit"
                component={Link}
                to="/"
              >
                <Badge invisible={!RTEvnets} color="secondary" badgeContent={'1'}>
                  <RssFeed />
                </Badge>
                <Typography color="inherit" className={classes.grow}>
                    {'Tiempo real'}
                </Typography>
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
              color="inherit"
              component={Link}
              to="/ayuda"
            >
              <Help />
              <Typography color="inherit" className={classes.grow}>
                {'Ayuda'}
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
