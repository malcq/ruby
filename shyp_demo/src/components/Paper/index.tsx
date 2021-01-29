import React, { StatelessComponent, ReactNode, ReactNodeArray } from 'react';
import PropTypes from 'prop-types';
import { Paper as MuiPaper } from '@material-ui/core';

import './styles.scss';

interface IPaperProps{
  className?: string;
  children?: ReactNode | ReactNodeArray;
  title?: string;
  icon?: IconType;
  isPadded?: boolean;
}

const Paper: StatelessComponent<any> = (props: IPaperProps) => (
  <MuiPaper
    elevation={1}
    classes={{
      root: `paper mui-override ${props.className} ${props.isPadded ? 'paper_padded' : ''}`,
    }}
  >
    {props.title && <header className="paper__header">
      <i className={`paper__header-icon icon ${props.icon}`} />
      {props.title}
    </header>}
    {props.children}
  </MuiPaper>
);

Paper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
};

Paper.defaultProps = {
  isPadded: false,
  icon: 'none',
  title: '',
  children: '',
  className: '',
};

export default Paper;