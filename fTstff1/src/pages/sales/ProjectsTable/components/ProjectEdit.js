/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import AddIcon from '@material-ui/icons/Add';
import {
  getModalStyle,
  getValueFromSelect
} from 'utils';
import {
  getImagesChange,
  changeCheck,
  getIdArray
} from 'utilsImages';

import {
  Typography,
  Paper,
  Modal,
  Button,
  Fab,
  TextField
} from '@material-ui/core';
import {
  SelectFromDB,
  RichTextBox
} from 'ui';
import ImagesDownload from 'pages/sales/CreateProject/components/ImagesDownload';

class ProjectEdit extends Component {
  constructor(props) {
    super(props);
    const { title, href, description, images, role } = props.project;
    const users = getIdArray(props.project.users);
    const technologies = getIdArray(props.project.technologies);

    this.state = {
      show: props.show,
      title,
      href: href || '',
      description: description || '',
      images: [],
      imagesSrc: images ? [...images] : [],
      newImagesSrc: images ? [...images] : [],
      technologies,
      users,
      role: role || ''
    };
  }

  hide = () => {
    this.setState({
      show: false
    });
    setTimeout(() => {
      this.props.onHide();
    }, 200);
  };

  roleValidate = (array) => {
    return array.every((el) => el.text && el.title);
  };

  applyEdit = async () => {
    const data = {
      ...this.state,
      technologies: getValueFromSelect(this.state.technologies),
      users: getValueFromSelect(this.state.users)
    };
    data.changedImages = getImagesChange(data.imagesSrc, data.newImagesSrc);
    data.oldImages = data.imagesSrc;

    const { role = [] } = data;

    const isRoleValid = this.roleValidate(role);

    if (!isRoleValid && role) {
      toast('Роль на проекте должна содержать заголовок и текст!');
      return;
    }

    data.role = JSON.stringify(data.role);

    if (!changeCheck({ ...this.props.project }, data)) {
      this.props.onHide();
      return;
    }
    delete data.newImagesSrc;
    this.props.applyEdit(data);
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onDescriptionChange = (description) => {
    this.setState({
      description
    });
  };

  onRoleTextChange = (text, index) => {
    const { role } = this.state;
    role[index].text = text;
    this.setState({ role });
  };

  onRoleTitleChange = (event, index) => {
    event.preventDefault();
    const { role } = this.state;
    const { value } = event.target;
    role[index].title = value;
    this.setState({ role });
  };

  onTechnologiesChange = (technologies) => {
    this.setState({
      technologies
    });
  };

  onUsersChange = (users) => {
    this.setState({
      users
    });
  };

  addImage = (images, newImagesSrc) => {
    this.setState({
      images,
      newImagesSrc
    });
  };

  getSelectedTechnologies = (technologies) => {
    this.setState({
      technologies
    });
  };

  getSelectedUsers = (users) => {
    this.setState({
      users
    });
  };

  addRole = () => {
    const { role = [] } = this.state;
    role.push({ title: '', text: '' });
    this.setState({ role });
  };

  deleteRole = (index) => {
    const { role = [] } = this.state;
    if (role && role.length) {
      role.splice(index, 1);
    }
    this.setState({ role });
  };

  render() {
    const { project } = this.props;
    const {
      role,
      description,
      href,
      title,
      users,
      technologies,
      images,
      newImagesSrc
    } = this.state;

    return (
      <StyledModal onClose={this.hide} open={this.state.show}>
        <StyledPaper style={getModalStyle()}>
          <StyledForm>
            <Typography
              variant="h6"
              id="modal-title"
              gutterBottom
              style={{ marginBottom: '35px' }}
            >
              Редактирование проекта:
            </Typography>
            <div className="edit-project__input-field">
              <TextField
                label="Название проекта"
                name="title"
                value={title}
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                style={styles.field}
                required
                autoFocus
              />
            </div>
            <div className="edit-project__input-field">
              <TextField
                label="Ссылка на проект"
                name="href"
                value={href}
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                style={styles.field}
                required
              />
            </div>
            <Typography gutterBottom noWrap>
              <b>Описание:</b>
            </Typography>
            <div className="edit-project__input-field">
              <RichTextBox
                value={description}
                onChange={this.onDescriptionChange}
              />
            </div>
            <Typography gutterBottom noWrap>
              <b>Роли:</b>
            </Typography>
            {role.map((el, index) => {
              const { text, title } = el;
              return (
                <div
                  className="edit-project__input-field relative"
                  key={`roleItem ${index}`}
                >
                  <RichTextBox
                    value={text}
                    roleTitle={title}
                    onChange={(e) => this.onRoleTextChange(e, index)}
                    onTitleChange={(e) => this.onRoleTitleChange(e, index)}
                    withTitleInput
                  />
                  <i
                    className="fa fa-times-circle icon-absolute"
                    aria-hidden="true"
                    onClick={() => this.deleteRole(index)}
                  />
                </div>
              );
            })}
            <Fab
              color="secondary"
              aria-label="add"
              className="fab-add"
              onClick={this.addRole}
            >
              <AddIcon />
            </Fab>
            <div className="edit-project__input-field">
              <ImagesDownload
                style={{
                  box: 'row',
                  label: 'col-md-2 col-12',
                  imagesBox: 'col-md-10 col-12'
                }}
                imagesSrc={newImagesSrc}
                images={images}
                addImage={this.addImage}
              />
            </div>
            <div className="edit-project__input-field">
              {/* eslint-disable-next-line */}
              <label
                htmlFor="project-techonologies"
                className="edit-project__input-label"
              >
                Технологии:
              </label>
              <SelectFromDB
                id="project-techonologies"
                getSelected={this.onTechnologiesChange}
                change={this.onTechnologiesChange}
                selected={project.technologies}
                value={technologies}
                class="col-sm-10 col-12"
                dataType="technologies"
              />
            </div>
            <div className="edit-project__input-field">
              {/* eslint-disable-next-line */}
              <label
                htmlFor="project-devs"
                className="edit-project__input-label"
              >
                Разработчики:
              </label>
              <SelectFromDB
                id="project-devs"
                getSelected={this.onUsersChange}
                change={this.onUsersChange}
                value={users}
                selected={project.users}
                class="col-sm-10 col-12"
                dataType="users"
              />
            </div>
            <div className="edit-project__buttons">
              <Button className="accept-btn" onClick={this.applyEdit}>
                Изменить
              </Button>
              <Button onClick={this.hide} className="decline-btn">
                Отмена
              </Button>
            </div>
          </StyledForm>
        </StyledPaper>
      </StyledModal>
    );
  }
}

const styles = {
  field: {
    display: 'flex',
    justifyContent: 'center'
  }
};

const StyledForm = styled.form`
  & input,
  & label {
    text-align: left;
  }

  .fab-add {
    display: flex;
    margin-left: auto;
    margin-right: 20px;
  }

  .icon-absolute {
    position: absolute;
    right: 0;
    top: 0;
    background: white;
    border-radius: 10px 10px 10px 10px;
    cursor: pointer;
  }

  & .form-group {
    margin: 0;
  }

  & .applyButton {
    float: left;
  }
  .edit-project__input-field {
    margin-bottom: 30px;

    & .relative {
      position: 'relative';
    }
  }
  .edit-project__input-label {
    display: block;
    margin-bottom: 13px;
  }
  .edit-project__buttons {
    display: flex;
    justify-content: space-between;
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

const StyledPaper = styled(Paper)`
  position: fixed;
  padding: 20px;
  font-size: 16px;
  min-width: 700px;
  max-height: 600px;
  overflow-y: scroll;

  @media (max-width: 701px) {
    min-width: auto;
    width: 98%;
  }
`;

ProjectEdit.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  applyEdit: PropTypes.func.isRequired
};

ProjectEdit.defaultProps = {};

export default ProjectEdit;
