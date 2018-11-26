import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import navBarLogo from '../assets/navbar2.png';

class AppNavBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle () {
    this.setState(
      prevState => ({ isOpen: !prevState.isOpen })
    );
  }

  render () {
    const { isOpen } = this.state;
    const { optionActive } = this.props;
    return (
      <Navbar color="info" light expand="md" sticky="top">
        <NavbarBrand href="/">
          <img src={navBarLogo} width="100wv" alt="Logo" />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/" active={optionActive === 'Inicio' ? true : undefined}>
              Inicio
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/events" active={optionActive === 'Eventos' ? true : undefined}>
              Eventos
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret active={optionActive === 'Cuentas' ? true : undefined}>
              Cuentas
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                Mi Cuenta
                </DropdownItem>
                <DropdownItem>
                Administrar cuentas
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default AppNavBar;

AppNavBar.propTypes = {
  optionActive: PropTypes.string.isRequired
};
