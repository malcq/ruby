import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import styled from "styled-components";
import Repo from './Repo';

class Repos extends Component {
  render() {
    const { repos } = this.props;
    // eslint-disable-next-line
    return repos.map((repo, index) => <Repo repo={repo} key={index} />);
  }
}

Repos.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.string)
};

Repos.defaultProps = {
  repos: []
};

export default Repos;
