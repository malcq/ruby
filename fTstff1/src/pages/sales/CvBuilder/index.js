import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _get from 'lodash/get';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import { connectGlobalUser } from 'store/connections';
import {
  getValueFromSelect,
  getLabelFromSelect
} from 'utils';
import {
  languageOptions,
  employeePositionOptions
} from 'utils/constants';
import { createCV } from 'api/projectApi';

import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
  TextField
} from '@material-ui/core';
import {
  SelectFromDB,
  RadioTwoPicker,
  RichTextBox,
  PdfViewer,
  ProjectActivityEditorModal,
  FormSelect
  // SelectTags
} from 'ui';

class CvBuilder extends Component {
  createArrayUsers = createSelector(
    (props) => props.user,
    (user) => {
      return [user];
    }
  );

  state = {
    language: languageOptions[0],
    fullName: '',
    employeePosition: employeePositionOptions[0],
    farewell: 'Would like to chat? Contact me at welcome@fusion-team.com',
    user: null,
    technologies: [],
    projects: [],
    spinner: false,
    isMyData: 'my',
    specializedOn: [],
    // skills: [],
    skills: `
    <p>Fluent English speaker</p>
    <p>Strong communicator</p>
    <p>Constructive feedback</p>
    <p>Ability to take criticism</p>
    <p>Willingness to grow</p>`,
    education:
      '<b>Master of Computer Science, 2016</b> </p><br> Computer-Aided Design and Software Development<br>Southern Federal University, Taganrog, Russia<br>',
    benefits: '',
    knowledgeTechnology: [],
    numPages: null,
    pageNumber: 1,
    url: null,
    haveUser: true,
    intro: '',
    projectActivitiesEditorVisibility: false
  }

  nextPage = () => {
    const { numPages, pageNumber } = this.state;
    if (numPages !== pageNumber) {
      this.setState((state) => ({ pageNumber: state.pageNumber + 1 }));
    }
  };

  prevPage = () => {
    const { pageNumber } = this.state;
    if (pageNumber > 1) {
      this.setState((state) => ({ pageNumber: state.pageNumber - 1 }));
    }
  };

  onSelectChange = (value, { name }) => {
    this.setState({ [name]: value });
  }

  onInputChange = ({ target: { name, value } = {} } = {}) => {
    this.setState({ [name]: value });
  }

  onKnowledgeTechnologyChange = (knowledgeTechnology) => {
    this.setState({ knowledgeTechnology });
  };

  onBenefitsChange = (benefits) => {
    this.setState({ benefits });
  };

  onIntroChange = (intro) => {
    this.setState({ intro });
  };

  onDocumentLoadSuccess = (numPages) => {
    this.setState({ numPages });
  };

  handleChange = (event) => {
    this.setState({ isMyData: event.target.value });
  };

  selectedUsers = (user) => {
    this.setState({
      user,
      fullName: _get(user, 'label', '').replace(/\([^)]*\)/, '').trim()
    });
  };

  selectedTechnologies = (technologies) => {
    this.setState({ technologies });
  };

  selectedProjects = (projects) => {
    this.setState({ projects });
  };

  onSkillsChange = (skills) => {
    this.setState({ skills });
  };

  onEducationChange = (education) => {
    this.setState({ education });
  };

  selectedSpecialization = (technologies) => {
    this.setState({ specializedOn: technologies });
  };

  onFarewellChange = (farewell) => {
    this.setState({ farewell });
  };

  getSelectedRole = (projectsArray) => {
    return (projectsArray || []).map((project) => {
      const newProject = { ...project };
      const { selectedRole = 0 } = newProject;
      newProject.role = newProject.role[selectedRole].text;
      return newProject;
    });
  };

  submit = async (e) => {
    e.preventDefault();

    this.setState({ pageNumber: 1, url: '', spinner: true });

    if (this.state.user) {
      const data = {
        ...this.state,
        user: {
          name: this.state.fullName,
          id: _get(this.state.user, 'value')
        },
        employeePosition: _get(this.state.employeePosition, 'value', employeePositionOptions[0].value),
        technologies: getValueFromSelect(this.state.technologies),
        projects: getValueFromSelect(this.state.projects),
        specializedOn: getLabelFromSelect(this.state.specializedOn),
        knowledgeTechnology: getLabelFromSelect(this.state.knowledgeTechnology),
        rolesInProjects: this.getSelectedRole(this.state.projects),
        language: _get(this.state, 'language.value', 'en')
      };
      try {
        const url = await createCV(data);
        this.setState({ url, spinner: false });
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({ haveUser: false, spinner: false });
    }
  };

  onDrop = (dropResult) => {
    const { removedIndex, addedIndex } = dropResult;
    const { projects } = this.state;
    const b = projects[removedIndex];
    projects[removedIndex] = projects[addedIndex];
    projects[addedIndex] = b;
    this.setState({ projects });
  };

  openProjectActivitiesEditor = () => {
    this.setState((state) => ({
      projectActivitiesEditorVisibility: !state.projectActivitiesEditorVisibility
    }));
  };

  render() {
    const {
      language,
      fullName,
      employeePosition,
      user,
      isMyData,
      technologies,
      specializedOn,
      skills,
      url,
      projects,
      education,
      pageNumber,
      numPages,
      haveUser,
      knowledgeTechnology,
      // benefits,
      farewell,
      intro,
      spinner,
      projectActivitiesEditorVisibility
    } = this.state;

    const users = this.createArrayUsers(this.state);
    return (
      <StyledContainer className="container">
        <Typography variant="h4" className="pageTitle">
          СV's creating
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
              <SelectFromDB
                filter={{ notRole: 'student', status: 'active' }}
                change={this.selectedUsers}
                value={users}
                class="col-md-9"
                dataType="users"
                isMulti={false}
                title="Developer"
                isValid={haveUser}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <RadioTwoPicker
                value={isMyData}
                onChange={this.handleChange}
                firstValue="my"
                firstLabel={"Developer's projects"}
                secondValue="general"
                secondLabel="Database"
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <FormSelect title="CV language">
                <Select
                  options={languageOptions}
                  classNamePrefix="select"
                  value={language}
                  name="language"
                  onChange={this.onSelectChange}
                />
              </FormSelect>

              <div>
                <h4>Full name</h4>
                <TextField
                  value={fullName}
                  name="fullName"
                  onChange={this.onInputChange}
                  fullWidth
                  variant="standard"
                  placeholder="Full name"
                />
              </div>

              <FormSelect title="Employee position">
                <Select
                  options={employeePositionOptions}
                  classNamePrefix="select"
                  value={employeePosition}
                  name="employeePosition"
                  onChange={this.onSelectChange}
                />
              </FormSelect>

              <SelectFromDB
                change={this.selectedTechnologies}
                value={technologies}
                class="col-md-9"
                dataType="technologies"
                closeMenuOnSelect={false}
                title="Filter projects by technologies"
              />

              {isMyData === 'general' && (
                <>
                  <SelectFromDB
                    change={this.selectedProjects}
                    value={projects}
                    class="col-md-9"
                    dataType="projects"
                    filter={technologies}
                    closeMenuOnSelect={false}
                    title="Projects"
                  />
                  <div className="padd-t-20">
                    <Button
                      variant="outlined"
                      className="accept-btn"
                      type="button"
                      onClick={() => this.openProjectActivitiesEditor()}
                      disabled={projects.length === 0}
                    >
                      Projects editor
                    </Button>
                  </div>
                </>
              )}
              <SelectFromDB
                change={this.selectedSpecialization}
                value={specializedOn}
                class="col-md-9"
                closeMenuOnSelect={false}
                dataType="technologies"
                title="Specializes in"
              />
              <RichTextBox
                value={intro}
                title="Intro"
                onChange={this.onIntroChange}
                globalUser={this.props.user}
                count
              />

              <RichTextBox
                value={skills}
                title="Soft skills"
                onChange={this.onSkillsChange}
                globalUser={this.props.user}
                count
              />
              {/* <SelectTags
                change={this.onSkillsChange}
                value={skills}
                dataType="skills"
                title="Skills"
                closeMenuOnSelect={false}
              /> */}

              <RichTextBox
                value={education}
                title="Education"
                onChange={this.onEducationChange}
                globalUser={this.props.user}
                count
              />

              {/* <RichTextBox
                value={benefits}
                title="Benefits"
                onChange={this.onBenefitsChange}
                globalUser={this.props.user}
                count
              /> */}

              <SelectFromDB
                change={this.onKnowledgeTechnologyChange}
                value={knowledgeTechnology}
                class="col-md-9"
                dataType="technologies"
                closeMenuOnSelect={false}
                title="Technologies"
              />

              <RichTextBox
                value={farewell}
                title="Farewell"
                onChange={this.onFarewellChange}
                globalUser={this.props.user}
                count
              />

              <div className="padd-t-20">
                <Button
                  variant="outlined"
                  className="accept-btn"
                  type="submit"
                  value="CVWasCreated"
                  onSubmit={this.submit}
                >
                  Create CV
                </Button>

                <Link to="/staff" style={{ marginLeft: '30px' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    className="decline-btn"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </Grid>

            {spinner && (
              <Grid item sm={6} xs={12}>
                <img className="spinner" src={`${process.env.PUBLIC_URL}/spinner.svg`} alt="" />
              </Grid>
            )}

            {url && !spinner && (
              <Grid item sm={6} xs={12}>
                <PdfViewer
                  numPages={numPages}
                  url={url}
                  filename={`${
                    user.label
                      ? user.label.replace(/\(.*\)/, '').trim()
                      : ''} CV.pdf`}
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

  .flex-container {
    display: flex;
    margin: 55px 0 0 0;
    flex-direction: row;
  }
  .padd-t-20 {
    padding-top: 20px;
  }

  .spinner {
    display: flex;
    margin: auto;
  }

  input {
    text-align: left;
  }
`;

CvBuilder.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.shape().isRequired
};

CvBuilder.defaultProps = {
  user: null
};

export default compose(
  withRouter,
  connectGlobalUser
)(CvBuilder);
