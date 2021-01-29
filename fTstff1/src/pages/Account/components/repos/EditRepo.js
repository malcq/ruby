import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  List,
  Grid
} from '@material-ui/core';
import EditItemRepo from './EditItemRepo';

class EditRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  click = (index) => {
    return index;
  };

  render() {
    const { src } = this.props;
    return (
      <Grid>
        <List>
          {src.map((el, index) => (
            <EditItemRepo
              el={el}
              index={index}
              onClick={() => this.click(index)}
              deleteRepo={this.props.deleteRepo}
              // eslint-disable-next-line
              key={index}
            />
          ))}
        </List>
      </Grid>
    );
  }
}

EditRepo.propTypes = {
  src: PropTypes.arrayOf(PropTypes.any),
  deleteRepo: PropTypes.func
};

EditRepo.defaultProps = {
  src: [],
  deleteRepo: () => null
};

export default EditRepo;
