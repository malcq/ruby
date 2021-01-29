import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Typography } from '@material-ui/core';

class AccountField extends Component {
  render() {
    if (!this.props.value) { return null; }

    return (
      <StyledListItem>
        <Typography component="span">
          <b>
            {this.props.title}
            {': '}
          </b>
          {this.props.value.length > 30 && <br />}
          <pre>{this.props.value}</pre> {this.props.children}
        </Typography>
      </StyledListItem>
    );
  }
}

const StyledListItem = styled.li`
  margin-bottom: 4px;
`;

AccountField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  children: PropTypes.node
};

AccountField.defaultProps = {
  value: null,
  children: null
};

export default AccountField;
