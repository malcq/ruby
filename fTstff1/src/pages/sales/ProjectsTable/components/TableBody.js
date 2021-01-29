import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getName } from 'utils';

import { Link } from 'react-router-dom';
import { TableRow } from '@material-ui/core';
import SizeLimitTd from './SizeLimitTd';
import Project from './Project';

class Body extends Component {
  render() {
    const { projects } = this.props;
    if (!projects.length) {
      return null;
    }

    return (
      <tbody className="usersTable">
        {projects.map((project) => {
          return (
            <StyledTr key={project.id}>
              <SizeLimitTd>
                <Project
                  project={project}
                  refreshProjects={this.props.refreshProjects}
                />
              </SizeLimitTd>

              <SizeLimitTd>
                {project.users.length !== 0
                  ? project.users.map((user, index) => {
                    const id = index;
                    return (
                        <React.Fragment key={id}>
                          <Link to={`/account/${user.login}`}>
                            {getName(user)}
                          </Link>
                          {index !== project.users.length - 1 ? ', ' : '.'}
                        </React.Fragment>
                    );
                  })
                  : '-'}
              </SizeLimitTd>

              <SizeLimitTd>
                {project.technologies.length !== 0
                  ? project.technologies.map((technologi, index) => {
                    const id = index;
                    return (
                        <React.Fragment key={id}>
                          {technologi.title}
                          {index !== project.technologies.length - 1
                            ? ', '
                            : '.'}
                        </React.Fragment>
                    );
                  })
                  : '-'}
              </SizeLimitTd>
            </StyledTr>
          );
        })}
      </tbody>
    );
  }
}

const StyledTr = styled(TableRow)`
  td:not(:last-of-type):hover {
    background-color: #eee;
  }
  &&& td {
    padding-left: 0;
    padding-right: 0;
  }
  &:nth-of-type(even) {
    background-color: #f8f8f8;
  }
`;

Body.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.any).isRequired,
  refreshProjects: PropTypes.func.isRequired
};

export default Body;
