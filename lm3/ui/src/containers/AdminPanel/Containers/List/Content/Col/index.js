import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

const Col = ({ children, className, ...props }) => (
  <td className={cx(className)} {...props}>
    {children}
  </td>
);

Col.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

Col.defaultProps = {
  className: null,
  children: null,
};

export default Col;
