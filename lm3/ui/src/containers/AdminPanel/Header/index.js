import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import {
  NavbarBrand,
  Navbar,
  Nav,
  NavItem,
  Collapse,
  NavbarToggler,
} from 'reactstrap';

import { Auth } from 'store';

import { NavLink } from 'components/Link';
// import { Navbar } from 'components/NavBar';

import { ROUTES } from 'constants';
import { PathUtils } from 'utils';

class Header extends PureComponent {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  toggle = () => this.setState(state => ({ isOpen: !state.isOpen }));

  render() {
    const { signOut } = this.props;
    const { isOpen } = this.state;

    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand to="/" tag={Link} />

        <NavbarToggler onClick={this.toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav navbar className="mr-auto">
            <NavItem>
              <NavLink to={ROUTES.ADMIN_PANEL.DASHBOARD} exact>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to={ROUTES.ADMIN_PANEL.USERS.INDEX}>
                Users
              </NavLink>
            </NavItem>
          </Nav>

          <Nav>
            <NavItem>
              <div
                className="logout-link"
                onClick={signOut}
              >
                Log out
              </div>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  signOut: Auth.signOut,
}, dispatch);

export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(Header);
