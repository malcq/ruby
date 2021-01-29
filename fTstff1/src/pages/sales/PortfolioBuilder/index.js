import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { getValueFromSelect } from 'utils';
import { createPortfolio } from 'api/projectApi';

import {
  Grid,
  Button,
  Typography,
  TextField
} from '@material-ui/core';
import {
  SelectFromDB,
  PdfViewer,
  ProjectActivityEditorModal
} from 'ui';

const getInitialState = () => ({
  projects: [],
  pageNumber: 1,
  spinner: false,
  url: '',
  technologies: [],
  mainTitle: '',
  numPages: 1,
  projectActivitiesEditorVisibility: false
});

class PortfolioBuilder extends Component {
  state = getInitialState();

  onCancel = () => this.setState(getInitialState());

  onInputChange = ({ target: { name, value } = {} } = {}) => {
    this.setState({ [name]: value });
  };

  openProjectActivitiesEditor = () => {
    this.setState((state) => ({
      projectActivitiesEditorVisibility: !state.projectActivitiesEditorVisibility
    }));
  };

  selectedProjects = (projects) => {
    this.setState({ projects });
  };

  nextPage = () => {
    if (this.state.pageNumber === this.state.numPages) {
      return;
    }
    this.setState((state) => ({ pageNumber: state.pageNumber + 1 }));
  };

  prevPage = () => {
    if (this.state.pageNumber === 1) {
      return;
    }
    this.setState((state) => ({ pageNumber: state.pageNumber - 1 }));
  };

  onDocumentLoadSuccess = (numPages) => {
    this.setState({ numPages });
  };

  selectedTechnologies = (technologies) => {
    this.setState({ technologies });
  };

  selectedProjects = (projects) => {
    this.setState({ projects });
  };

  getSelectedRole = (projectsArray) => {
    const newArray = projectsArray.map((project) => {
      const newProject = { ...project };
      const { selectedRole = 0 } = newProject;
      newProject.role = newProject.role
        ? newProject.role[selectedRole].text
        : '';
      return newProject;
    });
    return newArray;
  };

  onDrop = (dropResult) => {
    const { removedIndex, addedIndex } = dropResult;
    const { projects } = this.state;
    const b = projects[removedIndex];
    projects[removedIndex] = projects[addedIndex];
    projects[addedIndex] = b;
    this.setState({ projects });
  };

  submit = async (e) => {
    e.preventDefault();
    const { mainTitle, projects } = this.state;

    this.setState({ spinner: true, url: '' });

    const data = {
      projects: getValueFromSelect(projects),
      mainTitle,
      rolesInProjects: this.getSelectedRole(this.state.projects)
    };

    try {
      const url = await createPortfolio(data);
      this.setState({ url, spinner: false });
    } catch (err) {
      this.setState({ spinner: false });
      console.log(err);
    }
  };

  render() {
    const {
      technologies,
      url,
      projects,
      pageNumber,
      numPages,
      mainTitle,
      projectActivitiesEditorVisibility,
      spinner
    } = this.state;

    return (
      <StyledContainer className="container">
        <Typography variant="h4" className="pageTitle">
          Создание портфолио
        </Typography>
        <form onSubmit={this.submit}>
          <ProjectActivityEditorModal
            projects={projects}
            onDrop={this.onDrop}
            open={projectActivitiesEditorVisibility}
            onClose={this.openProjectActivitiesEditor}
            onSubmit={this.selectedProjects}
          />
          <Grid container spacing={24}>
            <Grid item sm={6} xs={12}>
              <TextField
                label="Главный заголовок"
                className="input"
                value={mainTitle}
                name="mainTitle"
                onChange={this.onInputChange}
                variant="outlined"
              />

              <SelectFromDB
                change={this.selectedTechnologies}
                value={technologies}
                class="col-md-9"
                closeMenuOnSelect={false}
                dataType="technologies"
                title="Фильтр проектов по технологиям"
              />

              <SelectFromDB
                change={this.selectedProjects}
                filter={technologies}
                value={projects}
                class="col-md-9"
                dataType="projects"
                closeMenuOnSelect={false}
                title="Проекты"
              />
              <div className="padd-t-20">
                <Button
                  variant="outlined"
                  className="accept-btn"
                  type="button"
                  onClick={this.openProjectActivitiesEditor}
                  disabled={projects && projects.length === 0}
                >
                  Projects editor
                </Button>
              </div>

              <div className="padd-t-20">
                <Button
                  variant="outlined"
                  className="accept-btn"
                  type="submit"
                  value="CVWasCreated"
                  onSubmit={this.submit}
                >
                  Создать портфолио
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  className="decline-btn"
                  onClick={this.onCancel}
                >
                  Отмена
                </Button>
              </div>
            </Grid>

            {spinner && (
              <Grid item sm={6} xs={12}>
                <img className="spinner" src={`${process.env.PUBLIC_URL}/spinner.svg`} alt="" />
              </Grid>
            )}

            {url && !spinner && (
              <Grid item sm={6} xs={12} style={{ marginTop: 21 }}>
                <PdfViewer
                  numPages={numPages}
                  url={url}
                  filename="portfolio.pdf"
                  pageNumber={+pageNumber}
                  onChange={this.onDocumentLoadSuccess}
                  onNext={this.nextPage}
                  onPrev={this.prevPage}
                />
              </Grid>
            )}
          </Grid>
        </form>
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 150px;
  max-width: 90%;
  margin: 0 auto;

  .input {
    margin: 1.33em 0 0;
    width: 100%;

    input {
      text-align: left;
    }
  }

  .flex-container {
    display: flex;
    margin: 55px 0 0 0;
    flex-direction: row;
  }
  .padd-t-20 {
    padding-top: 20px;
  }
  .decline-btn {
    margin-left: 30px;
  }

  .spinner {
    display: flex;
    margin: auto;
  }
`;

PortfolioBuilder.propTypes = {
  history: PropTypes.shape()
};

PortfolioBuilder.defaultProps = {
  history: {}
};

export default compose(
  withRouter
)(PortfolioBuilder);
