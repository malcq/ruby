// const data = {
//   data: [],
//   row: [{
//     title: '',
//     sort: '',
//     field: ''
//   }],
//   page: 1,
//   totalPages: 1,
//   sort: '',
//   sortDirection: ''
// };
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import moment from 'moment';
import DateFnsUtils from '@date-io/moment';

import { RoleCheck } from 'utils/protector';

import {
  MuiPickersUtilsProvider,
  TimePicker
} from 'material-ui-pickers';
import {
  Button,
  TextField,
} from '@material-ui/core';
import {
  SingleDate,
  SelectFromDB,
} from 'ui';

class EnhancedForm extends React.Component {
  constructor(props) {
    super(props);
    const { data } = props;

    this.state = {
      id: data.id || undefined,
      description: data.description || '',
      start: data.start || new Date(),
      end: data.end || new Date(),
      author: data.author || {},
      date: data.date || new Date(),
    };
  }

  onDateChoose = (date) => {
    this.setState({ date, showControls: true });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, showControls: true });
  };

  handleStartDateChange = (start) => {
    if (new Date(start) > new Date(this.state.end)) {
      toast.warn('Время начала не может быть больше времени конца');
      return;
    }
    const newStart = start.format();
    this.setState({ start: newStart, showControls: true });
  };

  handleEndDateChange = (end) => {
    if (new Date(end) < new Date(this.state.start)) {
      toast.warn('Время конца не может быть меньше времени начала');
      return;
    }
    const newEnd = end.format();
    this.setState({ end: newEnd, showControls: true });
  };

  onAuthorChange = (author) => {
    this.setState({ author, showControls: true });
  };

  onSubmit = () => {
    const {
      submitForm,
    } = this.props;

    if (!this.state.description) {
      toast.warn('Заполните поле "Описание"');
    }

    submitForm(this.state);
  };

  render() {
    const {
      showControls,
      id,
      description,
      start,
      end,
      author,
      date
    } = this.state;
    const {
      onClose
    } = this.props;

    const momentDate = moment(date)
      .utc()
      .toDate();

    return (
      <StyledGrid>
        <div>
          <SingleDate
            selectedDate={momentDate}
            onDateChoose={this.onDateChoose}
            disabledDays={{ after: new Date() }}
          />
        </div>

        <div className="form">
          <div className="left-col">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div className="left-col-dates">
                <StyledTimePicker
                  ampm={false}
                  margin="normal"
                  value={start}
                  onChange={this.handleStartDateChange}
                  autoOk
                  variant="outlined"
                  placeholder="Начало"
                />

                <span className="dates-decide">
                  &minus;
                </span>

                <StyledTimePicker
                  ampm={false}
                  margin="normal"
                  value={end}
                  onChange={this.handleEndDateChange}
                  autoOk
                  variant="outlined"
                  placeholder="Конец"
                />
              </div>
            </MuiPickersUtilsProvider>

            <RoleCheck forRole='admin'>
              <div className="select">
                <label>Автор:</label>
                <SelectFromDB
                  change={this.onAuthorChange}
                  filter={{ notRole: 'student', status: 'active' }}
                  value={author}
                  class="col-md-9"
                  isMulti={false}
                  dataType="users"
                />
              </div>
            </RoleCheck>

            <StyledTextField
              name="description"
              value={description}
              onChange={this.onInputChange}
              margin="normal"
              variant="outlined"
              multiline={true}
              placeholder="Описание"
              required
            />
          </div>

          <div className="bottom-block">
            <Controls showControls={showControls}>
              <Button
                variant="outlined"
                onClick={this.onSubmit}
                className="accept-btn"
                color="primary"
              >
                {id ? 'Сохранить' : 'Добавить'}
              </Button>

              <Button
                variant="outlined"
                className="close-btn"
                onClick={onClose}
              >
                {'Отмена'}
              </Button>
            </Controls>
          </div>
        </div>
      </StyledGrid>
    );
  }
}

const StyledTextField = styled(TextField)`
  &&  {
    width: 100%;
    margin: 0;
    margin-top: 28px;
  }

  && > div {
    padding: 15px 14px;
    /* padding: 15px 14px; */
  }
`;

const StyledTimePicker = styled(TimePicker)`
  &&  {
    margin: 0;
  }

  input {
      padding: 10.5px 14px;    
  }
`;

const StyledGrid = styled.div`
  & {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 76px;
      @media (max-width: 860px) {
      grid-template-columns: 1fr;
      grid-gap: 47px;
        &&& .modal-content-wrapper {
          padding: 23px 28px 40px 27px;
        }
        &&& .form {
          height: 100%;
        }
        &&& .bottom-block {
          margin-top:100px;
        }
      }
      @media (max-width: 425px) {
        &&& .form {
          width: 100%;
          padding: 0 20px;
        }
      }
  }
  .left-col-dates{
    text-align: center;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-gap: 17px;
  }

  .dates-decide{
    margin: auto;
  }

  #modal-title {
    text-align: center;
    text-transform: uppercase;
  }

  .modal-head{
    background: #F9F8FB;
    align-items: center;
    position: relative;
  }

  .bottom-block {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    &.controls {
      justify-content: space-between;
    }

    input {
      text-align: left;
    }
  }

  & img {
    width: 100%;
  }

  && .form {
    height: 388px;
    width: 334px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  && button {
    background: #b163ff;
    color: #fff;
    border: none;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    padding: 10px;
  }

  .project-description {
    & pre {
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .modal-buttons {
    & .decline-btn {
      margin-left: auto;
    }

    && .close-btn {
      background-color: #000;
      font-size:22px;
    }
  }
  && .close-btn {
      background-color: #C4C4C4;
    }

  && .accept-btn {
        background-color: #B163FF;
    }

  .select {
    background-color: inherit;
    label {
      display: block;
    }
  }

  .left-col {
    justify-content: space-between;
    flex-direction: row;
  }
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: 53% 1fr;
  grid-gap: 15px;
  width: 100%;
  transition: 0.5s;
  opacity: ${props => (props.showControls ? 1 : 0)};
`;

EnhancedForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  submitForm: PropTypes.func,
};

EnhancedForm.defaultProps = {
  data: {},
  submitForm: () => null,
};

export default EnhancedForm;
