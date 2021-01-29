import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Collapse } from '@material-ui/core';

class DropdownMenu extends PureComponent {
  state = {
    isOpen: false
  }

  componentDidMount() {
    document.addEventListener('click', this.close);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close);
  }

  toggle = (ev) => {
    ev.nativeEvent.stopImmediatePropagation();
    ev.stopPropagation();

    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  outClickHandler = ({ target }) => {
    if (this.dropdown.contains(target)) { return; }
    this.close();
  }

  close = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  createRef = (dropdown) => { this.dropdown = dropdown; }

  render() {
    const {
      className,
      children: [toggler, content]
    } = this.props;
    const { isOpen } = this.state;

    const newToggler = React.cloneElement(toggler, { onClick: this.toggle });

    return (
      <StyledDropdownMenu
        expanded={isOpen}
        className={className}
        ref={this.createRef}
        onClick={this.close}
      >
        {newToggler}

        <Collapse
          in={isOpen}
          classes={collapseClasses}
        >
          {content}
        </Collapse>
      </StyledDropdownMenu>
    );
  }
}

const collapseClasses = {
  container: 'collapse collapse--container',
  wrapper: 'collapse--wrapper',
  wrapperInner: 'collapse--wrapperInner',
};

const StyledDropdownMenu = styled.div`
  position: relative;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    background-color: ${({ theme }) => theme.colors.sidebarContrastBackgroundColor};
    padding: 7px 0;
  }

  li {
    color: ${({ theme }) => theme.colors.sidebarContrastColor};
    font-family: Noto Sans;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;

    white-space: nowrap;
    padding: 7px 29px;
    width: 100%;
    display: block;
    transition: 0.3s;

    :hover {
      background-color: ${({ theme }) => theme.colors.navbarBackground};
    }
  }

  .collapse {
    position: absolute;
    top: calc(100% + 15px);
    left: -11px;
    width: min-content;
  }

  *:first-of-type {
    cursor: pointer;
  }
`;

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

DropdownMenu.defaultProps = {
  className: ''
};

export default DropdownMenu;
