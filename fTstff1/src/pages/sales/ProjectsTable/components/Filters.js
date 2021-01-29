import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getValueFromSelect } from 'utils';

import { Link } from 'react-router-dom';
import {
  TextField,
  FormControl,
  Button,
  Collapse,
  Tooltip
} from '@material-ui/core';
import { SelectFromDB } from 'ui';
import TechModal from './technologies/TechModal';


class Filters extends Component {
  state = {
    openFilter: false,
    techsModal: false,
    title: '',
    users: [],
    technologies: []
  }

  selectedTechnologies = (technologies) => {
    this.setState({
      technologies
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

  toggleTechsModal = () => {
    this.setState((state) => ({ techsModal: !state.techsModal }));
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  search = (e) => {
    e.preventDefault();
    const data = {
      users: getValueFromSelect(this.state.users),
      title: this.state.title,
      technologies: getValueFromSelect(this.state.technologies)
    };

    this.props.applyFilter(data);
  };

  clear = () => {
    this.setState({
      title: '',
      users: [],
      technologies: []
    });
    this.props.applyFilter({});
  };

  render() {
    return (
      <div style={{ margin: 'auto', marginBottom: '35px' }}>
        <Button
          variant="outlined"
          style={styles.show}
          onClick={() => {
            const { open } = this.state;
            this.setState({ open: !open });
          }}
        >
          Фильтр
        </Button>
        <Link to="/createProject">
          <Tooltip title="Создать новый проект" placement="right">
            <Button
              variant="outlined"
              style={{ marginBottom: '10px', marginLeft: '15px' }}
            >
              +
            </Button>
          </Tooltip>
        </Link>

        <Button
          onClick={this.toggleTechsModal}
          variant="outlined"
          style={{ marginBottom: '10px', float: 'right' }}
        >
          Технологии
        </Button>

        <TechModal
          open={this.state.techsModal}
          onClose={this.toggleTechsModal}
        />

        <Collapse in={this.state.open}>
          <StyledContainer>
            <CustomWell>
              <form onSubmit={this.search}>
                <FilterContainer>
                  <NameInput>
                    <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                      Название:
                    </p>
                    <FormControl
                      onChange={this.onChange}
                      value={this.state.title}
                      autoComplete="off"
                      name="title"
                      type="text"
                    >
                      <TextField
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.name}
                        name="title"
                        type="text"
                      />
                    </FormControl>
                  </NameInput>
                  <NameInput>
                    <SelectCase>
                      <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                        Участники:
                      </p>
                      <SelectFromDB
                        change={this.selectedUsers}
                        value={this.state.users}
                        dataType="users"
                        filter={{ status: 'active' }}
                      />
                    </SelectCase>
                  </NameInput>
                  <NameInput>
                    <SelectCase>
                      <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                        Технологии:
                      </p>
                      <SelectFromDB
                        change={this.selectedTechnologies}
                        value={this.state.technologies}
                        dataType="technologies"
                      />
                    </SelectCase>
                  </NameInput>
                </FilterContainer>

                <ApplyButton
                  onSubmit={this.search}
                  className="accept-btn"
                  type="submit"
                >
                  {String.fromCharCode('0x21B5')}
                </ApplyButton>

                <ClearButton
                  onClick={this.clear}
                  className="decline-btn"
                  size="small"
                >
                  Сброс
                </ClearButton>
              </form>
            </CustomWell>
          </StyledContainer>
        </Collapse>
      </div>
    );
  }
}

const StyledContainer = styled.div`
  @media (max-width: 320px) {
    && > div {
      padding-right: 0;
      padding-bottom: 60px;
    }
  }
`;

const styles = {
  show: {
    marginBottom: '10px'
  },
  container: {
    width: '100%',
    margin: '0 auto 10px auto',
    position: 'relative',
    textAlign: 'center',
    paddingRight: '60px'
  },
  name: {
    display: 'inline-block',
    maxWidth: '250px',
    width: '70%'
  }
};

const SelectCase = styled.div`
  min-width: 195px;
  margin-top: 10px;
  margin-right: 10px;
`;

const FilterContainer = styled.div`
  && {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-around;
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
  form {
    padding-top: 20px;
    padding-bottom: 20px;
  }
`;

const NameInput = styled.div`
  display: inline-block;
  max-width: 350px;
  margin: 10px 0 0 0;
  padding: 10px;
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

  @media (max-width: 320px) {
    bottom: 10px !important;
    left: 5px !important;
  }
`;

const ClearButton = styled(Button)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  @media (max-width: 320px) {
    top: inherit !important;
    bottom: 10px !important;
  }
`;

Filters.propTypes = {
  applyFilter: PropTypes.func.isRequired
};

export default Filters;
