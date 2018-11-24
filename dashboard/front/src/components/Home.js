import React, { Component } from 'react'
import logo from '../assets/logo.png'
import navBarLogo from '../assets/navbar2.png'
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
  DropdownItem } from 'reactstrap'

class Home extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    return (
      <div>
        <Navbar color='info' light expand='md' sticky='top' >
          <NavbarBrand href='/'>
            <img src={navBarLogo} width='100wv' alt='Logo' />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink href='/' active>Inicio</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/events'>Eventos</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
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
        <div className='main'>
          <div className='inicio'>
            <img className='logo' src={logo} alt='Logo' />
          </div>
          <div className='inicio'>
            <img className='logo' src={logo} alt='Logo' />
          </div>
          <div className='inicio'>
            <img className='logo' src={logo} alt='Logo' />
          </div>
          <div className='inicio'>
            <img className='logo' src={logo} alt='Logo' />
          </div>
          <div className='center-div' />

        </div>
      </div>
    )
  }
}

export default Home
