import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get, values } from 'lodash';

import { SideNavButton } from '../';
import './styles.scss';
import { isRouteAllowed, permissionStatus } from '../../config/permissions';

interface ISideNavProps{
  className: string,
  permissions: string,
}

interface ISideNavButtonProps{
  to: string,
  icon: string,
  title: string,
  className?: string,
  additionalContent?: ReactNode,

}

interface ISideNavVariants{
  [x: string]: ISideNavButtonProps[]
}

const sideNavMap: ISideNavVariants = {
  [permissionStatus.full]: [
    {
      to: '/search',
      icon: 'searchandbook',
      title: 'Search & Book',
      className: 'sidenav__item--search'
    },
    { to: '/dashboard', icon: 'dashboard', title: 'Dashboard' },
    { to: '/shipments', icon: 'shipments', title: 'Your shipments' },
    { to: '/quotes', icon: 'request-quote', title: 'Your quotes' },
    {
      to: '/rates',
      icon: 'rates',
      title: 'Your rates',
      additionalContent: (
        <span className="sidenav__feature">new</span>
      )
    },
    { to: '/map_overviews', icon: 'map-overviews', title: 'Track & Trace' },
  ]
};


// creating list of tabs for user groups based on their allowed routes
values(permissionStatus).forEach((permissionType: string): void => {
  if (permissionType !== permissionStatus.full) {
    sideNavMap[permissionType] = sideNavMap[permissionStatus.full]
      .filter(({ to }: ISideNavButtonProps):boolean => isRouteAllowed(to, permissionType))
  }
});

const mapStateToProps = (state: IGlobalState): any => ({
  permissions: state.user.permission,
});

const renderSidenav = ({
  to,
  icon,
  title,
  className = '',
  additionalContent = '',
}: ISideNavButtonProps) => (
  <SideNavButton
    key={to}
    className={className}
    to={to}
    icon={icon}
    title={title}
  />
);

class SideNav extends Component<ISideNavProps> {
  public static defaultProps = {
    className: ''
  };

  public render() {
    return (
      <nav aria-expanded="false" className={`sidenav ${this.props.className}`}>
        {
          get(
            sideNavMap,
            this.props.permissions,
            sideNavMap[permissionStatus.full],
          ).map(renderSidenav)
        }
      </nav>
    );
  }
}

export default connect<any, any, any>(mapStateToProps)(SideNav)
