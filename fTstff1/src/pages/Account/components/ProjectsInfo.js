import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Project from './Project';

class ProjectsInfo extends Component {
  render() {
    const { projects } = this.props;

    return (
      <>
        {!projects.length ? (
          <b>Нет проектов</b>
        ) : (
          projects.map((project, index) => {
            const id = index;
            return <Project project={project} key={id} />;
          })
        )}
      </>
    );
  }
}

ProjectsInfo.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default ProjectsInfo;
