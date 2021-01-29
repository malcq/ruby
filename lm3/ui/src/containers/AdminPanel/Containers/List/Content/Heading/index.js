import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

const Heading = ({ children, className }) => (
  <th className={cx(className)}>
    {children}
  </th>
);

Heading.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

Heading.defaultProps = {
  className: null,
  children: null,
};

export default Heading;
