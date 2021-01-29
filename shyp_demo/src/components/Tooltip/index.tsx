import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';
import MuiTooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { get } from 'lodash';

import './styles.scss'

const Tooltip: StatelessComponent<any> = ({ children, classes, ...rest }: TooltipProps) => (
  <MuiTooltip
    classes={{
      ...classes,
      tooltip: `tooltip mui-override ${get(classes, 'tooltip', '')}`,
      popper: `tooltip-popper mui-override ${get(classes, 'popper', '')}`,
    }}
    {...rest}
  >
    {children}
  </MuiTooltip>
);


export default Tooltip;