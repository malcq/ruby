import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { updateProjectRequest } from 'api/projectApi';

import ProjectInfoModal from './ProjectInfoModal';
import ProjectEdit from './ProjectEdit';

class Project extends Component {
  state = {
    showInfo: false,
    showEdit: false
  }

  showInfoModal = () => {
    const open = this.state.showInfo;
    this.setState({
      showInfo: !open
    });
  };

  editInit = () => {
    this.setState({
      showInfo: false,
      showEdit: true
    });
  };

  closeEdit = () => {
    this.setState({
      showEdit: false,
      showInfo: true
    });
  };

  applyEdit = async (data) => {
    this.setState({
      showInfo: true,
      showEdit: false
    });

    try {
      await updateProjectRequest(this.props.project.id, data);
      this.props.refreshProjects();
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { project, refreshProjects } = this.props;

    return (
      <>
        <A onClick={this.showInfoModal}>{project.title}</A>

        {this.state.showInfo && (
          <ProjectInfoModal
            show={this.state.showInfo}
            onHide={this.showInfoModal}
            project={project}
            editInit={this.editInit}
            refreshProjects={refreshProjects}
          />
        )}

        {this.state.showEdit && (
          <ProjectEdit
            show={this.state.showEdit}
            applyEdit={this.applyEdit}
            onHide={this.closeEdit}
            project={project}
          />
        )}
      </>
    );
  }
}

const A = styled.a`
  cursor: pointer;
  height: 48px;
  margin: -4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

Project.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  refreshProjects: PropTypes.func.isRequired
};

export default Project;
