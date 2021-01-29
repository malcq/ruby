import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import { getAllTasksRequest } from 'api/studyTaskApi';
import { getAllUsersRequest } from 'api/userApi';
import { getAllTechnologiesArrRequest } from 'api/technologiesApi';
import { getAllTagsArrRequest } from 'api/articlesTagsApi';
import { getAllSkillsArrRequest } from 'api/skillsApi';
import { getAllProjectsArrRequest } from 'api/projectApi';
import { getFullName } from 'utils';

import Select from 'react-select';

class SelectFromDB extends Component {
  state = {
    options: []
  }

  async componentDidMount() {
    await this.fetchSelectOptions(true);
  }

  async componentDidUpdate(prevProps) {
    if (!isEqual(this.props.filter, prevProps.filter)) {
      await this.fetchSelectOptions();
    }
  }

  fetchSelectOptions = async (isMount = false) => {
    try {
      const { options, selected } = await getSelectState[this.props.dataType](
        this.props.selected,
        this.props.filter,
        this.props.isMulti,
        this.props.globalUser.id
      );

      if (
        isMount &&
        (this.props.selected.length || Object.keys(this.props.selected).length)
      ) {
        this.props.change(selected);
      }
      this.setState({
        options
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const LEGEND_OPTIONS_MODAL_ON = this.props.isMulti ? { isMulti: true } : {};
    const { change, value, title, isValid, closeMenuOnSelect } = this.props;
    const formattedValue = Array.isArray(value) ? typeof value[0] === 'object' ? value : [] : value;

    return (
      <>
        {title && <h4 className="project-field-title">{title}</h4>}
        <Select
          value={formattedValue}
          options={this.state.options}
          onChange={change}
          closeMenuOnSelect={closeMenuOnSelect}
          className={this.props.class}
          placeholder={isValid
            ? '...'
            : (
              <span style={{ color: 'red' }}>Для CV необходим разработчик</span>
            )
          }
          isClearable
          {...LEGEND_OPTIONS_MODAL_ON}
          styles={customStyles}
        />
      </>
    );
  }
}

const customStyles = {
  control: (base) => ({
    ...base,
    boxShadow: 'none',
    minWidth: '195px',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    '&:hover': {
      borderColor: '#101010'
    }
  })
};
const getSelectState = {
  technologies: async (selectedFromProps) => {
    const options = [];
    const selected = [];
    const { data: dataFromDB } = await getAllTechnologiesArrRequest();
    for (let i = 0; i < dataFromDB.length; i++) {
      options.push({
        label: dataFromDB[i].title,
        value: dataFromDB[i].id
      });
    }
    if (selectedFromProps.length) {
      for (let i = 0; i < selectedFromProps.length; i++) {
        selected.push({
          label: selectedFromProps[i].title,
          value: selectedFromProps[i].id
        });
      }
    }
    return {
      selected,
      options
    };
  },

  tags: async (selectedFromProps) => {
    const options = [];
    const selected = [];
    const { data: dataFromDB } = await getAllTagsArrRequest();
    for (let i = 0; i < dataFromDB.length; i++) {
      options.push({
        label: dataFromDB[i].title,
        value: dataFromDB[i].id
      });
    }
    if (selectedFromProps.length) {
      for (let i = 0; i < selectedFromProps.length; i++) {
        selected.push({
          label: selectedFromProps[i].title,
          value: selectedFromProps[i].id
        });
      }
    }
    return {
      selected,
      options
    };
  },

  users: async (selectedFromProps, filter, isMulti) => {
    const options = [];
    let selected = isMulti ? [] : null;
    const { data: dataFromDB } = await getAllUsersRequest(
      ['id', 'ASC'],
      filter
    );
    for (let i = 0; i < dataFromDB.length; i++) {
      const option = {
        label: getFullName(dataFromDB[i]),
        value: dataFromDB[i].id
      };
      options.push(option);
      if (
        !isMulti &&
        selectedFromProps &&
        (option.value === selectedFromProps.id ||
          option.value === selectedFromProps.value)
      ) {
        selected = option;
      }
    }
    if (selectedFromProps && selectedFromProps.length && isMulti) {
      for (let i = 0; i < selectedFromProps.length; i++) {
        selected.push({
          label: getFullName(selectedFromProps[i]),
          value: selectedFromProps[i].id
        });
      }
    }
    return {
      selected,
      options
    };
  },

  tasks: async () => {
    const options = [];
    const { data: dataFromDB } = await getAllTasksRequest();
    for (let i = 0; i < dataFromDB.length; i++) {
      options.push({
        label: dataFromDB[i].title,
        value: dataFromDB[i].id
      });
    }
    return {
      selected: [],
      options
    };
  },

  projects: async (selectedFromProps, filter) => {
    const options = [];
    const newFilter = filter.map((el) => el.value);
    const { data: dataFromDB } = await getAllProjectsArrRequest(['id', 'ASC'], {
      technologies: newFilter
    });

    for (let i = 0; i < dataFromDB.length; i++) {
      options.push({
        label: dataFromDB[i].title,
        value: dataFromDB[i].id,
        role: dataFromDB[i].role,
        technologies: _get(dataFromDB, `[${i}].technologies`, []).map(
          (tech) => ({ label: tech.title, value: tech.id })
        )
      });
    }
    return {
      selected: [],
      options
    };
  },

  skills: async () => {
    try {
      const { data: skills } = await getAllSkillsArrRequest();
      return skills;
    } catch (err) {
      return [];
    }
  }
};

const connectFunction = connect(({ global: { user } }) => ({
  globalUser: user
}));

SelectFromDB.propTypes = {
  dataType: PropTypes.oneOf([
    'technologies',
    'tags',
    'users',
    'tasks',
    'projects',
    'projectsForUser',
    'skills'
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.object
  ]).isRequired,
  selected: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.object
  ]),
  change: PropTypes.func,
  class: PropTypes.string,
  isMulti: PropTypes.bool,
  filter: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.object
  ]),
  title: PropTypes.string,
  isValid: PropTypes.bool,
  globalUser: PropTypes.shape(),
  closeMenuOnSelect: PropTypes.bool
};

SelectFromDB.defaultProps = {
  change: () => null,
  class: '',
  selected: [],
  isMulti: true,
  filter: [],
  title: '',
  isValid: true,
  globalUser: {},
  closeMenuOnSelect: true
};

export default connectFunction(SelectFromDB);
