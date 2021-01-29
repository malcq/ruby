import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { createSelector } from 'reselect';

import Select from 'react-select';
import {
  Button,
  Collapse
} from '@material-ui/core';
import {
  DateRange,
  SelectFromDB
} from 'ui';

import { UserType } from 'utils/types';
import CreateNewRequest from './CreateNewRequest';

class Filters extends Component {
  createArrayUsers = createSelector(
    (props) => props.user,
    (user) => {
      return [user];
    }
  );

  createFilterRequest = createSelector(
    [(data) => data.role, (data) => data.filter],
    (role, filter) => {
      return role !== 'admin' ? filter.slice(0, 3) : filter;
    }
  );

  constructor(props) {
    super(props);
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - 1);
    this.state = {
      openFilter: false,
      dates: {
        from: dateFrom,
        to: new Date()
      },
      from: '',
      type: '',
      status: '',
      showCreateModal: false,
      haveUser: true,
      user: '',
      dateRange: {
        from: '',
        to: ''
      },
      pickedRange: {
        label: 'За всё время',
        value: 'all'
      }
    };
  }

  openFilter = () => {
    const { openFilter } = this.state;
    this.setState({ openFilter: !openFilter });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  typeChange = (option) => {
    let newOption = option;
    if (!newOption) {
      newOption = '';
    }
    this.setState({
      type: newOption
    });
  };

  statusChange = (option) => {
    let newOption = option;
    if (!newOption) {
      newOption = '';
    }
    this.setState({
      status: newOption
    });
  };

  selectedUsers = (user) => {
    this.setState({ user });
  };

  getLoginFromTitle = (title) => {
    return title.match(/\((.*)\)/)[1];
  };

  search = (e) => {
    e.preventDefault();
    const data = {};
    const userLogin = this.state.user
      ? this.getLoginFromTitle(this.state.user.label)
      : null;
    if (this.state.user) data.from = userLogin;
    if (this.state.type) data.type = this.state.type.value;
    if (this.state.status) data.status = this.state.status.value;
    if (this.state.dateRange.from) data.dates = this.state.dateRange;

    this.props.applyFilter(data);
  };

  clear = () => {
    this.setState({
      from: '',
      type: '',
      status: '',
      user: null
    });
    this.props.applyFilter({});
  };

  applySort = () => {
    this.props.applySort(['id', 'DESC']);
  };

  openCreateModal = () => {
    this.setState({
      showCreateModal: true
    });
  };

  hideCreateModal = () => {
    this.setState({
      showCreateModal: false
    });
  };

  changeDateRange = (dates) => {
    const initialDateRange = {
      dateRange: {
        from: '',
        to: ''
      }
    };
    const dateRange = dates || initialDateRange;
    this.setState({
      dateRange
    });
  };

  changePickedRange = async (pickedRange) => {
    const dateFrom = new Date();
    let dateRange;
    switch (pickedRange.value) {
      case 'lastYear':
        dateFrom.setFullYear(dateFrom.getFullYear() - 1);
        dateRange = {
          from: moment().startOf('year'),
          to: moment().endOf('year')
        };
        break;

      case 'lastMonth':
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        dateRange = {
          from: moment().startOf('month'),
          to: moment().endOf('month')
        };
        break;

      case 'lastWeek':
        dateFrom.setDate(dateFrom.getDay() - 7);
        dateRange = {
          from: moment().startOf('week').add('days', 1),
          to: moment().endOf('week').add('days', 1)
        };
        break;

      case 'dateRange':
        dateRange = null;
        break;

      case 'all':
        dateRange = {
          from: moment().year(2018).startOf('year'), // 2018 year - start of the project
          to: moment().add(1, 'y').endOf('year')
        };
        break;

      default:
        break;
    }

    this.setState({
      pickedRange,
      dateRange
    });
  };

  render() {
    const { haveUser, pickedRange } = this.state;
    const { user } = this.props;
    const users = this.createArrayUsers(this.state);
    const filter = this.createFilterRequest({ role: user.role, filter: typeOptions });
    return (
      <StyledContainer>
        <div className="filter-buttons">
          <Button
            variant="outlined"
            style={style.filterButton}
            onClick={this.openFilter}
          >
            Фильтр
          </Button>

          <Button
            variant="outlined"
            style={style.sortButton}
            onClick={this.applySort}
          >
            Сортировать по новизне
          </Button>

          {
            user.role === 'admin' &&
            <Button
              onClick={this.openCreateModal}
              style={style.sortButton}
              variant="outlined"
            >
              +
            </Button>
          }
        </div>

        <CreateNewRequest
          show={this.state.showCreateModal}
          onHide={this.hideCreateModal}
          statusChange={this.props.statusChange}
        />
        <Collapse in={this.state.openFilter}>
          <StyledDiv>
            <CustomWell>
              <form style={style.form} onSubmit={this.search}>
                <FilterContainer>
                  <NameInput>
                    <p>От кого:</p>
                    <SelectFromDB
                      filter={{ status: 'active' }}
                      change={this.selectedUsers}
                      value={users}
                      dataType="users"
                      isMulti={false}
                      isValid={haveUser}
                    />
                  </NameInput>
                  <NameInput>
                    <SelectCase>
                      <p>Тип:</p>
                      <Select
                        placeholder=""
                        value={this.state.type}
                        options={filter}
                        onChange={this.typeChange}
                        styles={style.select}
                        isClearable
                      />
                    </SelectCase>
                  </NameInput>
                  <NameInput>
                    <SelectCase>
                      <p>Статус:</p>
                      <Select
                        placeholder=""
                        value={this.state.status}
                        options={statusOptions}
                        onChange={this.statusChange}
                        styles={style.select}
                        isClearable
                      />
                    </SelectCase>
                  </NameInput>
                  <NameInput>
                    <SelectCase>
                      <p>Диапазон времени:</p>
                      <Select
                        className="col-12 col-sm-10"
                        value={pickedRange}
                        options={selectOptions}
                        onChange={this.changePickedRange}
                        styles={customSelect}
                      />
                      {pickedRange.value === 'dateRange' && (
                        <DateRange
                          userRole="admin"
                          sendRequest={this.changeDateRange}
                        />
                      )}
                    </SelectCase>
                  </NameInput>
                </FilterContainer>
              </form>
              <ClearButton onClick={this.clear} className="decline-btn">
                Сброс
              </ClearButton>
              <ApplyButton
                type="submit"
                onClick={this.search}
                className="accept-btn"
              >
                {String.fromCharCode('0x21B5')}
              </ApplyButton>
            </CustomWell>
          </StyledDiv>
        </Collapse>
      </StyledContainer>
    );
  }
}

const style = {
  filterButton: { marginBottom: '10px' },
  sortButton: { margin: '0 0 10px 10px' },
  form: { display: 'flex', alignItems: 'flex-start' },
  select: {
    control: (base) => ({
      ...base,
      boxShadow: 'none',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      '&:hover': {
        borderColor: '#101010'
      }
    })
  }
};

const StyledContainer = styled.div`
  margin: 0;
  margin-bottom: 35px;

  .filter-buttons {
    display: flex;
  }

  @media (max-width: 405px) {
    .filter-buttons {
      width: 100%;
      flex-direction: column;
      /* align-items: flex-start; */
    }

    .filter-buttons button {
      margin: 0 !important;
      margin-bottom: 10px !important;
    }
  }
`;

const StyledDiv = styled.div`
  @media (max-width: 320px) {
    && > div {
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 60px;
    }
  }
`;

const typeOptions = [
  {
    label: 'Отгул',
    value: 'dayOff'
  },
  {
    label: 'Отпуск',
    value: 'vacation'
  },
  {
    label: 'Больничный',
    value: 'medical'
  },
  {
    label: 'Технический',
    value: 'technical'
  },
  {
    label: 'Бытовой',
    value: 'common'
  },
  {
    label: 'Документы',
    value: 'documents'
  }
];

const statusOptions = [
  {
    label: 'Ожидает ответа',
    value: 'wait'
  },
  {
    label: 'Выполняется',
    value: 'inProgress'
  },
  {
    label: 'Одобрена',
    value: 'accept'
  },
  {
    label: 'Отклонена',
    value: 'denied'
  }
];

const selectOptions = [
  {
    label: 'За год',
    value: 'lastYear'
  },
  {
    label: 'За месяц',
    value: 'lastMonth'
  },
  {
    label: 'За неделю',
    value: 'lastWeek'
  },
  {
    label: 'За выбранный промежуток',
    value: 'dateRange'
  },
  {
    label: 'За всё время',
    value: 'all'
  }
];

const customSelect = {
  control: (base) => ({
    ...base,
    boxShadow: 'none',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    '&:hover': {
      borderColor: '#101010'
    }
  })
};

const SelectCase = styled.div`
  min-width: 195px;

  p {
    margin-bottom: 2px;
    font-size: 14px;
  }
`;

const CustomWell = styled.div`
  && {
    padding-right: 60px;
    position: relative;
    text-align: center;
    background-color: #f5f5f5;
    padding-left: 20px;
  }
  & form {
    padding: 40px 0;

    p {
      margin: 0;
      margin-bottom: 2px;
    }
  }
`;

const NameInput = styled.div`
  display: inline-block;
  margin-top: 20px;
  
  p {
    font-size: 14px;
  }
  
  input {
    background-color: white;
    max-height: 39px;
    box-sizing: border-box;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const ApplyButton = styled(Button)`
  position: absolute !important;
  bottom: 5px;
  right: 5px;

  @media (max-width: 320px) {
    bottom: 10px !important;
    left: 5px !important;
  }
`;

const ClearButton = styled(Button)`
  position: absolute !important;
  top: 5px;
  right: 5px;

  @media (max-width: 320px) {
    top: inherit !important;
    bottom: 10px !important;
  }
`;

Filters.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  applySort: PropTypes.func.isRequired,
  // sort: PropTypes.arrayOf(PropTypes.any).isRequired,
  statusChange: PropTypes.func.isRequired,
  user: UserType,
};

export default Filters;
