import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from 'reactstrap';

const BooleanBadge = ({ value }) => (
  <Badge color={value ? 'success' : 'secondary'}>
    {value ? 'Yes' : 'No'}
  </Badge>
);

BooleanBadge.propTypes = {
  value: PropTypes.bool,
};

BooleanBadge.defaultProps = {
  value: false,
};

export default BooleanBadge;
