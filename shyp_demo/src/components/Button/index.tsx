import React, { StatelessComponent, ReactNode, RefObject } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core'

import './styles.scss';

interface IButtonProps{
  onClick?: IEventHandler,
  className?: string,
  id?: string,
  color?: 'red'
    |'blue'
    |'green'
    |'blue-border'
    |'grey-border'
    |'grey-outline'
    |'grey-border-green'
    |'grey-outline-disabled'
    |'white'
    |'mui',
  disabled?: boolean,
  isFullWidth?: boolean,
  children?: ReactNode,
  buttonRef?: RefObject<HTMLElement>,
  'aria-owns'?: string | null,
  'aria-has-popup'?: string | null
}

const Button: StatelessComponent<any> = (props: IButtonProps) => (
  <ButtonBase
    disabled={props.disabled}
    classes={{
      root: `${props.className} button button_${props.color}${props.isFullWidth ? ' button_full-width':''} mui-override`,
      disabled: "button_disabled mui-override"
    }}
    id={props.id}
    onClick={props.onClick}
    buttonRef={props.buttonRef}
  >
    { props.children }
  </ButtonBase>
);

Button.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  'aria-owns': PropTypes.string,
  'aria-has-popup': PropTypes.string,
  buttonRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};

Button.defaultProps = {
  className: '',
  color: 'blue',
  outlineColor: 'none',
  disabled: false,
  isFullWidth: false,
  onClick() { return undefined; },
  children: '',
  'aria-owns': null,
  'aria-has-popup': null,
};

export default Button;
