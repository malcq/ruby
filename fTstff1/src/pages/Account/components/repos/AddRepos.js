import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import { Fab, Typography } from '@material-ui/core';

import EditRepo from './EditRepo';
import InputReposAria from './InputReposAria';

class AddRepos extends Component {
  click = (index) => {
    return index;
  };

  onChangeRepo = () => {
    let { openInput } = this.state;
    openInput = openInput.filter((el) => el);
    const newArr = this.state.src.concat(openInput);
    this.props.onChangeRepo(newArr);
  };

  onChange = (index, newValue) => {
    const { openInput } = this.props;
    openInput[index] = newValue;
    this.props.onChangeInputRepo(openInput);
  };

  addRepo = () => {
    const { openInput } = this.props;
    openInput.push('');
    this.props.onChangeInputRepo(openInput);
  };

  deleteInputRepo = (index) => {
    const { openInput } = this.props;
    openInput.splice(index, 1);
    this.props.onChangeInputRepo(openInput);
  };

  deleteRepo = (index) => {
    const { repo } = this.props;
    repo.splice(index, 1);
    this.props.onChangeRepo(repo);
  };

  render() {
    const { repo, openInput } = this.props;
    return (
      <StyledFormGroup>
        <Typography variant="h6" >
          Добавить репозиторий:
        </Typography>
        <div className="addRepo">
          <Fab
            color="primary"
            aria-label="Add"
            size="small"
            onClick={this.addRepo}
          >
            <AddIcon />
          </Fab>
        </div>

        {openInput.length > 0 &&
          openInput.map((el, index) => (
            <InputReposAria
              // eslint-disable-next-line
              key={index}
              click={this.click(index)}
              deleteInputRepo={this.deleteInputRepo}
              onChange={this.onChange}
              el={el}
            />
          ))}

        <EditRepo src={repo} deleteRepo={this.deleteRepo} />
      </StyledFormGroup>
    );
  }
}

const StyledFormGroup = styled.div`
  margin: 0 0 20px 0;

  .addRepo {
    margin: 5px;
  }
`;

AddRepos.propTypes = {
  onChangeRepo: PropTypes.func,
  openInput: PropTypes.arrayOf(PropTypes.any),
  onChangeInputRepo: PropTypes.func,
  repo: PropTypes.arrayOf(PropTypes.any)
};

AddRepos.defaultProps = {
  onChangeRepo: () => null,
  openInput: [],
  onChangeInputRepo: () => null,
  repo: []
};

export default AddRepos;
