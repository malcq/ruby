import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { connectGlobalUser } from 'store/connections';
import {
  TextField,
  Button,
  Collapse
} from '@material-ui/core';
import CreateTask from './CreateTask';

class Filters extends Component {
  state = {
    openFilter: false,
    title: '',
    showModal: false
  }

  openFilter = () => {
    const { openFilter } = this.state;
    this.setState({ openFilter: !openFilter });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  search = (e) => {
    e.preventDefault();
    const data = { title: this.state.title };
    this.props.applyFilter(data);
  };

  clear = () => {
    this.setState({ title: '' });
    this.props.applyFilter({ title: '' });
  };

  openCreateModal = () => {
    this.setState({ showModal: true });
  };

  hideModal = (successSubmit = false, errors = false) => {
    this.setState({ showModal: false });
    if (errors === 'backdropClick') return null;

    if (successSubmit) {
      const { isStudentTasks } = this.props;
      const message = isStudentTasks ? 'Задание для стажеров' : 'Объявление';
      toast.success(`${message} успешно создано`);
    }
    if (errors) {
      toast.error('Ошибка');
    }
    return null;
  };

  render() {
    const { getTasks, isStudentTasks, user } = this.props;
    const { showModal, openFilter, title } = this.state;
    return (
      <div>
        <Button
          variant="outlined"
          style={styles.show}
          onClick={this.openFilter}
        >
          Фильтр
        </Button>
        <Button
          variant="outlined"
          style={{ marginBottom: '10px', marginLeft: '20px' }}
          onClick={this.openCreateModal}
        >
          +
        </Button>
        <CreateTask
          show={showModal}
          onHide={this.hideModal}
          getTasks={getTasks}
          isStudent={isStudentTasks}
          globalUser={user}
        />

        <Collapse in={openFilter}>
          <div>
            <CustomWell>
              <form onSubmit={this.search}>
                <FilterContainer>
                  <NameInput style={{ position: 'relative', left: '20px' }}>
                    <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                      Название:
                    </p>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={title}
                      name="title"
                      type="text"
                    />
                  </NameInput>
                </FilterContainer>

                <ApplyButton
                  onSubmit={this.search}
                  className="accept-btn"
                  type="submit"
                >
                  {String.fromCharCode('0x21B5')}
                </ApplyButton>
              </form>

              <ClearButton onClick={this.clear} className="decline-btn">
                Сброс
              </ClearButton>
            </CustomWell>
          </div>
        </Collapse>
      </div>
    );
  }
}

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
  },
  apply: {
    position: 'absolute',
    bottom: '5px',
    right: '5px'
  },
  clear: {
    position: 'absolute',
    top: '5px',
    right: '5px'
  }
};

const FilterContainer = styled.div`
  && {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
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
  getTasks: PropTypes.func.isRequired,
  isStudentTasks: PropTypes.bool,
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired
};

Filters.defaultProps = {
  isStudentTasks: true
};

export default connectGlobalUser(Filters);
