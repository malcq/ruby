import React, { StatelessComponent } from 'react';
import { MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';

import './styles.scss';

interface IIconedMenuItemProps{
  icon: IconType,
  title: string,
  value?: any,
  onClick?: (event: any) => void,
}

const IconedMenuItem: StatelessComponent<any> = (props: IIconedMenuItemProps) => (
  <MenuItem
    classes={{
      root: 'iconed-menu-item mui-override',
      selected: 'iconed-menu-item__selected mui-override',
    }}
    onClick={props.onClick}
  >
    <i className={`iconed-menu-item__icon icon ${props.icon}`}/>
    <span className="iconed-menu-item__title">
      {props.title}
    </span>
  </MenuItem>
);

IconedMenuItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.any,
  onClick: PropTypes.func,
};

IconedMenuItem.defaultProps = {
  icon: 'none',
  title: '',
  value: '',
  onClick(){},
};

export default IconedMenuItem;