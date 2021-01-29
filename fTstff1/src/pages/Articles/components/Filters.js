import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  TextField,
  Button,
  Collapse,
  Tooltip
} from '@material-ui/core';
import { SelectFromDB } from 'ui';
import { getValueFromSelect } from 'utils';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      title: '',
      users: [],
      tags: []
    };
  }

  selectedTags = (tags) => {
    this.setState({
      tags
    });
  };

  selectedUsers = (users) => {
    this.setState({
      users
    });
  };

  openFilter = () => {
    const { openFilter } = this.state;
    this.setState({ openFilter: !openFilter });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  search = (e) => {
    e.preventDefault();
    const data = {
      users: getValueFromSelect(this.state.users),
      title: this.state.title,
      tags: getValueFromSelect(this.state.tags)
    };

    this.props.applyFilter(data);
  };

  clear = () => {
    this.setState({
      title: '',
      users: [],
      tags: []
    });
    this.props.applyFilter({});
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          style={style.filterButton}
          onClick={this.openFilter}
        >
          Фильтр
        </Button>
        <Tooltip id="tip" title="Добавить статью" placement="top">
          <Button
            variant="outlined"
            style={style.newButton}
            onClick={this.props.showModal}
          >
            +
          </Button>
        </Tooltip>
        <Collapse in={this.state.openFilter}>
          <div>
            <CustomWell>
              <form onSubmit={this.search}>
                <FilterContainer>
                  <NameInput>
                    <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                      Название:
                    </p>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.title}
                      name="title"
                      minLength="3"
                      type="text"
                    />
                  </NameInput>

                  <SelectCase>
                    <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                      Добавлено:
                    </p>
                    <SelectFromDB
                      change={this.selectedUsers}
                      value={this.state.users}
                      dataType="users"
                    />
                  </SelectCase>

                  <SelectCase>
                    <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                      Теги:
                    </p>
                    <SelectFromDB
                      change={this.selectedTags}
                      value={this.state.tags}
                      dataType="tags"
                    />
                  </SelectCase>
                </FilterContainer>

                <ApplyButton
                  onSubmit={this.search}
                  className="accept-btn"
                  type="submit"
                >
                  {String.fromCharCode('0x21B5')}
                </ApplyButton>
              </form>

              <ClearButton
                onClick={this.clear}
                className="decline-btn"
                size="small"
              >
                Сброс
              </ClearButton>
            </CustomWell>
          </div>
        </Collapse>
      </div>
    );
  }
}

const style = {
  filterButton: { marginBottom: '10px' },
  newButton: { margin: '0 0 10px 10px' }
};

const SelectCase = styled.div`
  && {
    width: 30%;
    min-width: 170px;
    margin-top: 10px;
  }
`;

const FilterContainer = styled.div`
  && {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
`;

const CustomWell = styled.div`
  && {
    width: 100%;
    margin: 0 auto 10px auto;
    position: relative;
    text-align: center;
    padding-right: 60px;
    background-color: #f5f5f5;
    min-height: 100px;
  }
`;

const NameInput = styled.div`
  display: inline-block;
  margin: 10px 0 0 0;
  b {
    display: block;
    padding-bottom: 7px;
    font-size: 15px;
  }
  input {
    background-color: white;
    max-height: 39px;
    box-sizing: border-box;
  }
`;

const ApplyButton = styled(Button)`
  && {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

const ClearButton = styled(Button)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
  }
`;

Filters.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired
};

export default Filters;
