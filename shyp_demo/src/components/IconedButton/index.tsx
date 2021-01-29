import React, { StatelessComponent } from 'react';
import { Button } from '../';

import './styles.scss';

interface IIconedButtonProps{
  icon?: IconType,
  iconPosition?: 'right' | 'useDrawer',
  onClick?: IEventHandler,
  title?: string,
  className?: string,
  color?: string,
}

const IconedButton: StatelessComponent<any> = (props: IIconedButtonProps) => (
  <Button
    onClick={props.onClick}
    color={props.color as any}
    className={`iconed-button ${props.className}`}
  >
    {props.iconPosition === 'right' && props.title}
    <i className={`iconed-button__icon iconed-button__icon_${props.iconPosition} icon ${props.icon}`} />
    {!(props.iconPosition === 'right') && props.title}
  </Button>
);

IconedButton.defaultProps = {
  className: '',
  icon: 'none',
  iconPosition: 'left',
  color: 'white',
  onClick: (event: any) => {},
  title: ''
};

export default IconedButton;