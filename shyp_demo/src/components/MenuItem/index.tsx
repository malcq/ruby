import React, { ReactElement, StatelessComponent } from 'react'
import PropTypes from 'prop-types';

import { MenuItem as MuiMenuItem } from '@material-ui/core';

const MenuItem: StatelessComponent<any> = (props: IMenuItem): ReactElement<any> => (
  <MuiMenuItem
    key={props.id}
    value={props.id}
  >
    {props.title}
  </MuiMenuItem>
);

MenuItem.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  title: PropTypes.string,
};

MenuItem.defaultProps = {
  title: '',
};

export default MenuItem;