import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { opacify } from 'polished';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import cornerDownImage from 'ui/images/corner--down.svg';
import { updateSidebarStatus } from 'store/global/actions';

import { Collapse } from '@material-ui/core';
import { RoleCheck } from 'utils/protector';
import NavItem from './NavItem';
import NavItemIcon from './NavItemIcon';

class LinksGroup extends PureComponent {
  isCurrentAddressContained = ({ isInitial = false } = {}) => {
    const {
      isSidebarOpen,
      links,
      location: { pathname }
    } = this.props;

    let isCurrent = false;

    for (let i = 0; i < links.length; i++) {
      const regExp = new RegExp(`^${links[i].to}${links[i].exact !== false ? '$' : ''}`);
      if (regExp.test(pathname)) {
        isCurrent = true;
        break;
      }
    }

    return isCurrent && (!isSidebarOpen || isInitial);
  }

  state = {
    isOpenCollapse: this.isCurrentAddressContained({ isInitial: true })
  }

  toggleCollapse = () => {
    const {
      updateSidebarStatus,
      isSidebarOpen
    } = this.props;
    if (!isSidebarOpen) {
      updateSidebarStatus();
    }

    this.setState(({ isOpenCollapse }) => ({ isOpenCollapse: !isOpenCollapse }));
  }

  render() {
    const {
      title,
      links,
      icon,
      forRole,
      isSidebarOpen
    } = this.props;
    const { isOpenCollapse } = this.state;
    const isOpen = isOpenCollapse && isSidebarOpen;
    const togglerClassName = classnames('collapse-toggler', 'navbar-item', {
      'navbar-item--opened': isOpen,
      'navbar-item--current-address': this.isCurrentAddressContained()
    });

    return (
      <RoleCheck forRole={forRole}>
        <StyledGroup
          open={isOpen}
          isSidebarOpen={isSidebarOpen}
        >
          <p
            onClick={this.toggleCollapse}
            className={togglerClassName}
          >
            <NavItemIcon icon={icon} />

            {title}

            <img src={cornerDownImage} alt="corner-icon" />
          </p>

          <Collapse
            in={isOpen}
            classes={classes}
          >
            {links.map((link) => (
              <NavItem
                key={link.to}
                {...link}
              />
            ))}
          </Collapse>
        </StyledGroup>
      </RoleCheck>
    );
  }
}

const classes = {
  wrapperInner: 'collapse-list'
};

const StyledGroup = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  .collapse-toggler {
    img {
      transition: 0.3s;
      margin-left: 28px;
      ${({ open }) => (!open ? '' : css`
        transform: rotate(180deg);
      `)}
      ${({ isSidebarOpen }) => (isSidebarOpen ? '' : css`
        opacity: 0;
      `)}
    }
  }

  .collapse-list {
    display: flex;
    flex-direction: column;

    .navbar-item {
      padding-left: 63px;
      box-shadow: none;
    }
  }

  ${({ open }) => (!open ? '' : css`
    .collapse-list,
    .collapse-toggler,
    .collapse-toggler:hover {
      background-color: ${(({ theme }) => opacify(-0.8, theme.colors.sidebarContrastBackgroundColor))};
    }
  `)}
`;

LinksGroup.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  forRole: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  links: PropTypes.arrayOf(PropTypes.object),
  isSidebarOpen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  updateSidebarStatus: PropTypes.func.isRequired
};

LinksGroup.defaultProps = {
  title: '',
  forRole: 'any',
  links: [],
  icon: ''
};

const connectFunction = connect(
  ({ global: { isSidebarOpen } }) => ({ isSidebarOpen }),
  { updateSidebarStatus }
);

export default connectFunction(withRouter(LinksGroup));
