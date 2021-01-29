import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CreatableSelect from 'react-select/creatable';
import { getAllTagsArrRequest } from 'api/articlesTagsApi';
import { getAllSkillsArrRequest } from 'api/skillsApi';

class SelectTags extends Component {
  state = {
    options: []
  }

  async componentDidMount() {
    try {
      const { options, selected } = await getSelectState[this.props.dataType](
        this.props.selected
      );
      this.props.getSelected(selected);
      this.setState({
        options
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { title } = this.props;
    return (
      <>
        {title && <h4 className="project-field-title">{title}</h4>}
        <CreatableSelect
          onChange={this.props.change}
          value={this.props.value}
          options={this.state.options}
          closeMenuOnSelect={false}
          className={this.props.class}
          placeholder="..."
          isClearable
          isMulti
          onKeyDown={this.addTag}
          styles={customStyles}
        />
      </>
    );
  }
}

const getSelectState = {
  tags: async (selectedFromProps) => {
    const options = [];
    const selected = [];
    const { data: dataFromDB } = await getAllTagsArrRequest();
    for (let i = 0; i < dataFromDB.length; i++) {
      options.push({
        label: dataFromDB[i].title,
        value: `${dataFromDB[i].id}`
      });
    }
    if (selectedFromProps.length) {
      for (let i = 0; i < selectedFromProps.length; i++) {
        selected.push({
          label: selectedFromProps[i].title,
          value: `${selectedFromProps[i].id}`
        });
      }
    }
    return {
      selected,
      options
    };
  },
  skills: async (selected, filter) => {
    const { data: dataFromDB } = await getAllSkillsArrRequest(['id', 'ASC'], {
      technologies: filter
    });
    const options = dataFromDB.map((el) => {
      const { name: label = '', id: value = '' } = el;
      return { label, value };
    });
    return {
      selected: [],
      options
    };
  }
};

const customStyles = {
  control: (base /* , state */) => ({
    ...base,
    boxShadow: 'none',
    borderColor: '#101010',
    '&:hover': {
      borderColor: '#101010'
    }
    // You can also use state.isFocused to conditionally style based on the focus state
  })
};

SelectTags.propTypes = {
  dataType: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any).isRequired,
  selected: PropTypes.arrayOf(PropTypes.any),
  getSelected: PropTypes.func,
  change: PropTypes.func,
  class: PropTypes.string,
  title: PropTypes.string
};

SelectTags.defaultProps = {
  getSelected: () => null,
  change: () => null,
  class: '',
  selected: [],
  title: ''
};

export default SelectTags;
