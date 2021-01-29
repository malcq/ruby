import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DeleteIcon from '@material-ui/icons/Delete';

import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton
} from '@material-ui/core';

class EditItemRepo extends Component {
  state = {};

  deleteRepo = () => {
    const index = this.props.onClick;
    this.props.deleteRepo(index);
  };

  render() {
    const { el } = this.props;
    return (
      <StyledItem>
        <ListItemText primary={el} />
        <ListItemSecondaryAction
          className="deleteButton"
          onClick={this.deleteRepo}
        >
          <IconButton aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </StyledItem>
    );
  }
}

const StyledItem = styled(ListItem)``;

EditItemRepo.propTypes = {
  onClick: PropTypes.func,
  deleteRepo: PropTypes.func,
  el: PropTypes.string
};

EditItemRepo.defaultProps = {
  onClick: () => null,
  deleteRepo: () => null,
  el: ''
};

export default EditItemRepo;
