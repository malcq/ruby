import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';

import {
  NavbarBrand,
  Navbar,
  Nav,
  NavItem,
  NavbarToggler,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { NavLink } from 'components/Link';

import { ROUTES } from 'constants';
import { PathUtils } from 'utils';

class Header extends PureComponent {
  static propTypes = {
    user: PropTypes.shape({}),
    isAdmin: PropTypes.bool.isRequired,
    onSignOut: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
  }

  state = {
    isOpen: false,
  };

  toggle = () => this.setState(state => ({ isOpen: !state.isOpen }));

  render() {
    const { user, isAdmin, onSignOut } = this.props;
    const { isOpen } = this.state;

    return (
      <header>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand to="/" tag={Link} />
          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink to={ROUTES.MEMBERS.BASE} exact>
                  Home
                </NavLink>
              </NavItem>


            </Nav>

            <Nav navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {`Hello, ${user.firstName}`}
                </DropdownToggle>

                <DropdownMenu right>
                  {isAdmin && (
                    <DropdownItem
                      to={ROUTES.ADMIN_PANEL.DASHBOARD}
                      tag={Link}
                    >
                      Admin panel
                    </DropdownItem>
                  )}
                  <DropdownItem
                    onClick={onSignOut}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default withRouter(Header);
