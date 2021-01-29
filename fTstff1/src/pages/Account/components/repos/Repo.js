import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { repo } = this.props;
    const matches = repo.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    const domain = matches && matches[1];
    return (
      <StyledTableCellFlex href={repo} target="_blank">
        <Button>
          <i className={`${getGitIcon(domain)}`} />
          <span>{repo}</span>
        </Button>
      </StyledTableCellFlex>
    );
  }
}

const StyledTableCellFlex = styled.a`
  display: flex;
  align-items: center;
  justify-content: left;
  /* padding: 5px 10px; */
  color: #000;

  i {
    font-size: 24px;
    margin-right: 10px;
  }

  &:last-of-type {
    margin-bottom: 5px;
  }

  button {
    background: transparent;
    height: 100%;
    width: 100%;
    border-radius: 0;
    border: none;
    text-align: left;
    padding: 5px 10px;
    justify-content: flex-start;

    :hover {
      text-decoration: none;
      background-color: #dddddd;
    }
  }
`;

const getGitIcon = (domain) => {
  switch (domain) {
    case 'bitbucket.org':
      return 'fab fa-bitbucket fa-3x';
    case 'github.com':
      return 'fab fa-github fa-3x';
    case 'gitlab.com':
      return 'fab fa-gitlab';
    case 'gitter.im':
      return 'fab fa-gitter';
    case 'www.gitkraken.com':
      return 'fab fa-gitkraken';
    default:
      return 'fab fa-git';
  }
};

Repo.propTypes = {
  repo: PropTypes.string
};

Repo.defaultProps = {
  repo: ''
};

export default Repo;
