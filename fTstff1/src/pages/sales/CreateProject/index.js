import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { toast } from 'react-toastify';

import AddIcon from '@material-ui/icons/Add';
import { createProjectRequest } from 'api/projectApi';
import { getValueFromSelect } from 'utils';

import {
  Grid,
  Typography,
  TextField,
  Button,
  Fab
} from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import {
  SelectFromDB,
  RichTextBox
} from 'ui';
import ImagesDownload from './components/ImagesDownload';

class CreateProject extends Component {
  state = {
    title: '',
    href: '',
    description: '',
    images: [],
    imagesSrc: [],
    users: [],
    technologies: [],
    role: [{ title: '', text: '' }]
  }

  onDescriptionChange = (description) => {
    this.setState({ description });
  };

  onRoleChange = (roleText, index) => {
    const { role } = this.state;
    role[index].text = roleText;
    this.setState({ role });
  };

  onRoleTitleChange = (event, index) => {
    const { role } = this.state;
    const { value } = event.target;
    role[index].title = value;
    this.setState({ role });
  };

  addRole = () => {
    const { role } = this.state;
    role.push({ title: '', text: '' });
    this.setState({ role });
  };

  deleteRole = (index) => {
    const { role } = this.state;
    role.splice(index, 1);
    this.setState({ role });
  };

  roleValidate = array => array.every(({ text, title } = {}) => text && title);

  hrefValidate = href => {
    return href.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&()*+,;=.]+$/gm);
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addImage = (images, imagesSrc) => {
    this.setState({
      images,
      imagesSrc
    });
  };

  selectedUsers = (users) => {
    this.setState({
      users
    });
  };

  selectedTechnologies = (technologies) => {
    this.setState({
      technologies
    });
  };

  submit = async (e) => {
    e.preventDefault();
    const data = {
      ...this.state,
      users: getValueFromSelect(this.state.users),
      technologies: getValueFromSelect(this.state.technologies)
    };

    const { role = [], href } = data;

    const isHrefValid = this.hrefValidate(href);
    if (!isHrefValid && href) {
      toast('Ссылка на проект должна быть в формате http(s)://staff.com');
      return;
    }

    const isRoleValid = this.roleValidate(role);
    if (!isRoleValid && role) {
      toast('Роль на проекте должна содержать заголовок и текст!');
      return;
    }

    data.role = JSON.stringify(role);
    try {
      await createProjectRequest(data);
      this.props.history.push('/projects');
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { role } = this.state;
    return (
      <StyledContainer className="container">
        <Typography variant="h4" className="pageTitle">
          Создание проекта
        </Typography>
        <form onSubmit={this.submit}>
          <Grid container spacing={24}>
            <Grid item sm={6} xs={12}>
              <TextField
                label="Название проекта"
                name="title"
                value={this.state.title}
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                style={styles.field}
                required
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                label="Ссылка на проект"
                name="href"
                value={this.state.href}
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                style={styles.field}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <RichTextBox
                title="Описание:"
                value={this.state.description}
                onChange={this.onDescriptionChange}
                count
              />
            </Grid>
            <Grid item xs={12}>
              {role.map((el, index) => {
                const { text, title } = el;
                return (
                  <RoleItem key={`roleItem ${index}`}>
                    <RichTextBox
                      key={`roleItem ${index}`}
                      title={index === 0 ? 'Роли в проекте:' : null}
                      value={text}
                      roleTitle={title}
                      onChange={(e) => this.onRoleChange(e, index)}
                      onTitleChange={(e) => this.onRoleTitleChange(e, index)}
                      withTitleInput
                      count
                    />
                    <i
                      className="fa fa-times-circle icon-absolute"
                      aria-hidden="true"
                      onClick={() => this.deleteRole(index)}
                    />
                  </RoleItem>
                );
              })}
              <Fab
                color="secondary"
                className="fab-add"
                aria-label="add"
                onClick={this.addRole}
              >
                <AddIcon />
              </Fab>
            </Grid>

            <Grid item sm={6} xs={12}>
              <h4 className="project-field-title">Используемые технологии</h4>
              <SelectFromDB
                change={this.selectedTechnologies}
                value={this.state.technologies}
                class="col-md-9"
                dataType="technologies"
                closeMenuOnSelect={false}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <h4 className="project-field-title">Разработчики</h4>
              <SelectFromDB
                change={this.selectedUsers}
                value={this.state.users}
                filter={{ notRole: 'student', status: 'active' }}
                class="col-md-9"
                dataType="users"
                closeMenuOnSelect={false}
              />
            </Grid>
            <Grid item xs={12}>
              <ImagesDownload
                addImage={this.addImage}
                images={this.state.images}
                imagesSrc={this.state.imagesSrc}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                className="accept-btn"
                type="submit"
                value="ProjectWasCreated"
                onSubmit={this.submit}
              >
                Создать проект
              </Button>

              <Link to="/projects" style={{ marginLeft: '30px' }}>
                <Button
                  type="button"
                  variant="outlined"
                  className="decline-btn"
                >
                  Отмена
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </StyledContainer>
    );
  }
}

const styles = {
  field: {
    display: 'flex',
    justifyContent: 'center'
  }
};

const RoleItem = styled.div`
  position: relative;
  i {
    cursor: pointer;
    right: 0;
    top: 20px;
    position: absolute;
  }
`;

const StyledContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 150px;
  max-width: 90%;
  margin: 0 auto;

  .fab-add {
    display: flex;
    margin-left: auto;
    margin-right: 20px;
    margin-top: 15px;
  }

  .pageTitle {
    padding-bottom: 30px;
    text-align: center;
  }

  .project-field-title {
    margin-bottom: 9px;
    font-weight: normal;
    color: #414141;
  }
`;

CreateProject.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

export default compose(
  withRouter
)(CreateProject);
