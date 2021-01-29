import React, { PureComponent, RefObject } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Menu } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { push } from 'react-router-redux'
import { Dispatch } from 'redux';
import { LocationDescriptor } from 'history';
import { v4 as getID } from 'uuid';
import { trim, get } from 'lodash';
import bind from 'autobind-decorator';

import { IconedMenuItem, ForbiddenLinkHider } from '../';
import { promisifyAction } from "../../utils";
import { userSignOut, userUnubscribeToBrowserNotifications } from '../../stores/actionCreators'

import './styles.scss';

interface IAvatarMenuProps {
  avatarUrl: string;
  name: string;
  lastName: string;
  toLocation: (location: LocationDescriptor) => void;
  logout: () => void;
  unsubscribe: (subscription) => void;
}

interface IAvatarMenuState {
  anchorEl: HTMLElement | null;
}

const mapStateToProps = (state: IGlobalState): any => ({
  avatarUrl: state.user.avatar || '',
  name: state.user.firstName,
  lastName: state.user.lastName,
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  toLocation(location: LocationDescriptor ): void { dispatch(push(location)) },
  logout(event: any): void { dispatch(userSignOut()) },
  unsubscribe: promisifyAction(dispatch, userUnubscribeToBrowserNotifications),
});

const urlB64ToUint8Array = (base64String: string): any  => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

class AvatarMenu extends PureComponent<IAvatarMenuProps, IAvatarMenuState> {

  public static propTypes = {
    avatarUrl: PropTypes.string,
    toLocation: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    name: PropTypes.string,
  };

  public static defaultProps = {
    avatarUrl: '',
    name: '',
    lastName: '',
  };

  private id: string;
  private toAccountPage: IEventHandler;
  private toAddressBook: IEventHandler;
  private avatarRef: RefObject<HTMLDivElement>;

  constructor (props, context) {
    super(props, context);
    this.toAccountPage = this.makeLocationHandler('/account');
    this.toAddressBook = this.makeLocationHandler('/contacts');
    this.id = `AvatarMenu_${getID()}`;
    this.state = { anchorEl: null };
    this.avatarRef = React.createRef();
  }

  public render () {
    const { avatarUrl } = this.props;
    const isOpen = !!this.state.anchorEl;
    const firstLetter = get(trim(this.props.name), 0, '');
    const secondLetter = get(trim(this.props.lastName), 0, '');
    return (
      <div>
        <div
          className="avatar-menu"
          onClick={this.handleClick}
        >
          <div
            className="avatar-menu__anchor"
            aria-owns={isOpen ? this.id : undefined}
            aria-haspopup="true"
            ref={this.avatarRef}
          >
            <Avatar
              className="avatar-menu__avatar mui-override"
              src={avatarUrl}
            >
              {avatarUrl ? null : `${firstLetter}${secondLetter}`}
            </Avatar>
          </div>
        </div>
        <Menu
          id={this.id}
          getContentAnchorEl={null}
          anchorEl={this.state.anchorEl}
          open={isOpen}
          elevation={0}
          marginThreshold={0}
          transitionDuration={0}
          classes={{
            paper: 'avatar-menu__menu-paper mui-override'
          }}
          MenuListProps={{
            classes:{
              root: 'avatar-menu__menu mui-override',
            }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={this.handleClose}
        >
          <header className="avatar-menu__header">
            {this.props.name} {this.props.lastName}
          </header>
          <Link className="avatar-menu__link" to="/account">
            <ForbiddenLinkHider path="/account">
              <IconedMenuItem
                icon="account"
                title="Account"
                onClick={this.toAccountPage}
              />
            </ForbiddenLinkHider>
          </Link>
          <Link className="avatar-menu__link" to="/contacts">
            <ForbiddenLinkHider path="/contacts">
              <IconedMenuItem
                icon="address-book"
                title="Address book"
                onClick={this.toAddressBook}
              />
            </ForbiddenLinkHider>
          </Link>
          <IconedMenuItem
            icon="logout"
            title="Logout"
            onClick={this.logout}
          />
        </Menu>
      </div>
    );
  }

  private makeLocationHandler(location: LocationDescriptor): IEventHandler{
    return (event: any) => {
      this.setState({ anchorEl: null });
    }
  }

  @bind
  private logout(event: any): void {
    const { logout, toLocation } = this.props;
    if(toLocation){
      toLocation('/login');
    }
    if(logout) {
      const that = this;
      navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
        .then((sw) => {
          sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array('BMFS9x6B3aemM-w-Sy8GkPQA_ERwKshEx5q_kGhCyDveZwrENvAF-MJXJMrAo_sngnfHg5yQMo8PRCQu1GIZIRo=')
          }).then((subscription) => {
            that.unsubscribe(subscription);
            logout();
          })
        })
        .catch((error) => {
          console.log('ServiceWorker did not registered!', error);
          logout();
        });
    }
  }

  private async unsubscribe(subscription: any): Promise<any>{
    try {
      await this.props.unsubscribe({ subscription })
    } catch(error) {
      console.log(error);
    }
  }

  @bind
  private handleClick(event: any): void {
    this.setState({ anchorEl: this.avatarRef.current });
  }

  @bind
  private handleClose(event: any): void {
    this.setState({ anchorEl: null });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarMenu);
