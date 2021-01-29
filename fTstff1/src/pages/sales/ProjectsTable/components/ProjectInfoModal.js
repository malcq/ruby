import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { getModalStyle, getName } from 'utils';
import { deleteProject } from 'api/projectApi';

import {
  Typography,
  Paper,
  Modal,
  Button
} from '@material-ui/core';
import { ProjectCarousel } from 'ui';

class ProjectInfoModal extends Component {
  state = {
    show: this.props.show
  }

  hide = () => {
    this.setState({
      show: false
    });
    setTimeout(() => {
      this.props.onHide();
    }, 200);
  };

  deleteProject = async () => {
    try {
      await deleteProject(this.props.project.id);
      toast.success('Удаление, произошло успешно');
      this.props.refreshProjects();
    } catch (e) {
      toast.warn('Ошибка, попробуйте позднее');
    }
  };

  render() {
    const { project, isProject, editInit } = this.props;
    const { role, title, href, description, technologies, users } = project;
    return (
      <StyledModal open={this.state.show} onClose={this.hide}>
        <StyledPaper style={getModalStyle()}>
          <Typography variant="h6" id="modal-title" gutterBottom>
            <b>{title}</b>
          </Typography>
          <ProjectCarousel project={project} />
          <br />
          {href && (
            <>
              <Typography gutterBottom noWrap>
                <b className="bold-title">Ссылка:</b>
                <a href={href}>{href}</a>
              </Typography>
            </>
          )}

          {description && (
            <div className="project-description">
              <Typography gutterBottom noWrap>
                <b className="bold-title">Описание:</b>
                {description.length > 20 && <br />}
              </Typography>
              <div
                className="insertHTML"
                dangerouslySetInnerHTML={
                  { __html: description } // eslint-disable-next-line
                }
              />
            </div>
          )}
          {role && role.length && (
            <div>
              <Typography gutterBottom noWrap>
                <b className="bold-title">Роли: </b>
              </Typography>
              {role.map((el) => {
                const { text, title } = el;
                if (text && title) {
                  return (
                    <RoleItem
                      className="project-description"
                      key={`role${title}`}
                    >
                      <span className="role-title">{title}:</span>
                      <div
                        className="insertHTML"
                        dangerouslySetInnerHTML={
                          { __html: text } // eslint-disable-next-line
                        }
                      />
                    </RoleItem>
                  );
                }
                return null;
              })}
            </div>
          )}

          {technologies && technologies[0] && (
            <Typography gutterBottom noWrap>
              <b className="bold-title">Технологии:</b>
              {technologies.map((technology, index) => {
                return ` ${technology.title}${
                  index < technologies.length - 1 ? ', ' : '.'}`;
              })}
            </Typography>
          )}

          {users && users[0] && (
            <Typography gutterBottom noWrap>
              <b className="bold-title">Разработчики: </b>
              {users.map((user, index) => {
                return (
                  <React.Fragment key={user.login}>
                    <Link to={`/account/${user.login}`}>{getName(user)}</Link>
                    {`${index < users.length - 1 ? ', ' : '.'}`}
                  </React.Fragment>
                );
              })}
            </Typography>
          )}
          {isProject && (
            <div className="modal-buttons">
              <div>
                <Button
                  variant="outlined"
                  style={style.editButton}
                  onClick={editInit}
                >
                  Редактировать
                </Button>
                <StyledButton
                  variant="outlined"
                  style={style.editButton}
                  onClick={this.deleteProject}
                >
                  Удалить
                </StyledButton>
              </div>

              <Button
                variant="outlined"
                onClick={this.hide}
                className="decline-btn"
              >
                Закрыть
              </Button>
            </div>
          )}
        </StyledPaper>
      </StyledModal>
    );
  }
}

const style = {
  editButton: { float: 'left' },
  description: {
    wordBreak: 'break-all',
    marginBottom: '10px'
  }
};

const RoleItem = styled.div`
  border: 1px solid black;
  border-radius: 15px;
  padding: 10px 15px;

  p {
    margin: 0;
  }

  .role-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
`;

const StyledModal = styled(Modal)`
  margin-top: 5%;

  & img {
    width: 100%;
  }
  & button {
    margin-top: 10px;
  }
  .project-description {
    margin-bottom: 20px;

    & pre {
      color: rgba(0, 0, 0, 0.87);
      padding-left: 10px;
    }
  }
  .modal-buttons {
    display: flex;
    margin-top: 20px;
    & .decline-btn {
      margin-left: auto;
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    margin-left: 5px;
  }
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  padding: 20px;
  font-size: 16px;
  min-width: 700px;
  max-height: 600px;
  overflow-y: scroll;

  .bold-title {
    margin-right: 5px;
  }

  @media (max-width: 701px) {
    min-width: auto;
    width: 98%;
  }
`;

ProjectInfoModal.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  editInit: PropTypes.func,
  isProject: PropTypes.bool,
  refreshProjects: PropTypes.func
};

ProjectInfoModal.defaultProps = {
  editInit: () => null,
  isProject: true,
  refreshProjects: () => null
};

export default ProjectInfoModal;
