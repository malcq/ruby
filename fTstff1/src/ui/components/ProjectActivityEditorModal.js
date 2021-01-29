import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  DialogActions,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import { Container, Draggable } from 'react-smooth-dnd';
import {
  Modal,
  SelectFromDB,
  RichTextBox
} from 'ui';

class ProjectActivityEditorModal extends Component {
  state = {
    projects: [],
    roles: {},
    dragging: false
  }

  componentDidUpdate(prevProps) {
    const { projects } = this.props;
    const { roles } = this.state;
    if (projects !== prevProps.projects) {
      projects.forEach((element, index) => {
        roles[index] = 0;
      });

      this.setState({
        projects,
        roles
      });
    }
  }

  onSubmit = () => {
    const { onSubmit, onClose } = this.props;
    const { projects } = this.state;
    onSubmit(projects);
    onClose();
  };

  onRoleSelect = (event, projectIndex) => {
    const { roles } = this.state;
    const { value } = event.target;
    roles[projectIndex] = value;
    this.setState({ roles });
  };

  onChangeRole = (projectId, value, projectIndex) => {
    const { projects, roles } = this.state;
    const roleIndex = roles[projectIndex];
    projects[projectIndex].role[roleIndex].text = value;
    projects[projectIndex].selectedRole = roleIndex;
    this.setState({
      projects
    });
  };

  onTechChange = (technologies, index) => {
    const { projects } = this.state;
    projects[index] = {
      ...projects[index],
      technologies
    };
    this.setState({
      projects
    });
  };

  onDrag = () => {
    const { dragging } = this.state;
    this.setState({ dragging: !dragging });
  };

  render() {
    const { open, projects, onClose } = this.props;

    const { roles, dragging } = this.state;

    return (
      <Modal open={open} onClose={onClose}>
        <DialogTitle id="form-dialog-title">Edit projects data</DialogTitle>
        <Container
          onDrop={this.props.onDrop}
          dragHandleSelector=".drag-handler"
        >
          {projects.map((project, projectIndex) => {
            const roleObject =
              project.role && project.role[roles[projectIndex]]
                ? project.role[roles[projectIndex]]
                : {};

            return (
              <StyledDraggableContainer key={project.value}>
                <StyledDraggableItem>
                  <InputLabel htmlFor="role" style={{ marginRight: '10px' }}>
                    Role
                  </InputLabel>
                  <Select
                    value={roles[projectIndex]}
                    name="role"
                    onChange={(event) => this.onRoleSelect(event, projectIndex)}
                    variant="outlined"
                  >
                    {Array.isArray(project.role) &&
                      project.role.map((el, roleIndex) => {
                        return (
                          <MenuItem
                            key={`selectOption${el.title}`}
                            value={roleIndex}
                          >
                            {el.title}
                          </MenuItem>
                        );
                      })}
                  </Select>

                  <RichTextBox
                    value={roleObject.text}
                    title={`${project.label} - ${roleObject.title}`}
                    onChange={(text) => this.onChangeRole(project.value, text, projectIndex)
                    }
                    count
                  />

                  <SelectFromDB
                    value={project.technologies}
                    dataType="technologies"
                    change={(val) => this.onTechChange(val, projectIndex)}
                    closeMenuOnSelect={false}
                  />
                  <i
                    className={`fas fa-arrows-alt fa-2x drag-handler ${
                      dragging
                        ? 'dragging'
                        : ''}`
                    }
                    onMouseDown={this.onDrag}
                    onMouseLeave={this.onDrag}
                  />
                </StyledDraggableItem>
              </StyledDraggableContainer>
            );
          })}
        </Container>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Modal>
    );
  }
}

const StyledDraggableItem = styled.div`
  position: relative;
  border: 1px solid silver;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 5px;

  .quill {
    margin-bottom: 19px;
  }

  .drag-handler {
    color: silver;
    cursor: grab;
    position: absolute;
    right: 25px;
    top: 20px;

    &.dragging {
      cursor: grabbing;
    }
  }
`;

const StyledDraggableContainer = styled(Draggable)`
  &&&& {
    overflow: visible;
  }
`;

ProjectActivityEditorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  projects: PropTypes.arrayOf(PropTypes.any).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};

ProjectActivityEditorModal.defaultProps = {};

export default ProjectActivityEditorModal;
