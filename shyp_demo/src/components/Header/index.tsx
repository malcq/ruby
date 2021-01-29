import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import bind from 'autobind-decorator';
import { Drawer } from '@material-ui/core';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { Tasks } from '../../components';
import { Notifications, SideNav } from '../../components';
import logo from '../../assets/images/logo.svg';
import menu from '../../assets/images/menu.svg';
import { AvatarMenu } from '../';
import './styles.scss';
import './PhoneNumber.scss';
import './Popover.scss';
import { DEFAULT_PAGE } from '../../config/constants';

interface IHeaderProps {
  pathname: string,
  impersonator: string,
  uid: string,
  hideButtons?: boolean,
}

interface IHeaderState {
  useDrawer: boolean;
}

const mapStateToProps = (state: IGlobalState): any => ({
  pathname: get(state.routing, 'location.pathname', DEFAULT_PAGE),
  impersonator: state.user.impersonator,
  uid: state.user.uid,
});

class Header extends Component<IHeaderProps, IHeaderState> {

  constructor(props) {
    super(props);
    this.state = {
      useDrawer: false,
    }
  }

  public render() {
    return (
      <header className="header">
        <Drawer anchor="left" open={this.state.useDrawer} onClose={this.toggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer}
            onKeyDown={this.toggleDrawer}
          >
            <SideNav className="header__drawer"/>
          </div>
        </Drawer>
        <div className="header__block">
          <img src={menu} onClick={this.toggleDrawer} className="header__menu" />
          <Link to='/dashboard' className="header__logo">
            <img src={logo} className="header__logo-image" alt="logo" />
          </Link>
          {(this.props.impersonator) && (
            <span className="header__block__impersonate">
              Impersonating {this.props.uid}
            </span>
          )}
        </div>
        <div className="header__block">
          <div className="header__phone-number">
            <span className="phone-number__text">
              Need help? Call us at
            </span>
            <a className="phone-number__link" href="tel: +31-85-066-0000">
              +31 85 066 0000
            </a>
          </div>
          {this._renderUserSection()}
        </div>
      </header>
    );
  }

  private _renderUserSection() {
    if (this.props.hideButtons) {
      return <div className="empty-div"/>
    } else {
      return [
        <Link className="header__button d-sm-hidden" to="/search" key="1">
          Search & Book
        </Link>,
        <div className="header__popover" key="2">
          <Tasks />
        </div>,
        <div className="header__popover" key="3">
          <Notifications />
        </div>,
        <div className="header__avatar" key="4">
          <AvatarMenu />
        </div>
      ]
    }
  }

  @bind
  private toggleDrawer() {
    this.setState(
      (state: IHeaderState): Pick<IHeaderState, 'useDrawer'> =>
      ({ useDrawer: !state.useDrawer })
    )
  };
}

export default connect<any, any, any>(mapStateToProps, null)(Header)