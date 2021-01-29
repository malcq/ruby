import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DeleteIcon from '@material-ui/icons/Delete';

import {
  TextField,
  FormControl,
  IconButton
} from '@material-ui/core';

class InputRepos extends Component {
  state = {}

  deleteInput = () => {
    const index = this.props.click;
    this.props.deleteInputRepo(index);
  };

  onChange = (e) => {
    const { value } = e.target;
    const index = this.props.click;
    this.props.onChange(index, value);
  };

  render() {
    return (
      <StyledFormControl required fullWidth>
        <TextField
          variant="outlined"
          minLength="3"
          type="url"
          value={this.props.el}
          className="input_text"
          onChange={this.onChange}
        />
        <IconButton
          aria-label="Delete"
          onClick={this.deleteInput}
          className="delete_button"
        >
          <DeleteIcon />
        </IconButton>
      </StyledFormControl>
    );
  }
}

const StyledFormControl = styled(FormControl)`
  &&& {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .input_text {
    margin: 5px 0;
    width: 90%;
  }
  .delete_button {
    width: 48px;
    height: 48px;
  }
`;

InputRepos.propTypes = {
  click: PropTypes.number,
  deleteInputRepo: PropTypes.func,
  onChange: PropTypes.func,
  el: PropTypes.string
};

InputRepos.defaultProps = {
  click: 0,
  deleteInputRepo: () => null,
  onChange: () => null,
  el: ''
};

export default InputRepos;
