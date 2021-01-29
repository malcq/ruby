import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { editRequestRequest } from 'api/userRequestApi';
import { getDate } from 'utils';

import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Divider,
  Typography
} from '@material-ui/core';

import RequestInfo from './RequestInfo';
import Modal from './Modal';
import EditRequest from './EditRequest';

class RequestModal extends Component {
  nameSelector = createSelector(
    (from) => from,
    (from) => {
      return getName(from);
    }
  );

  dateSelector = createSelector(
    [
      (props) => props.type,
      (props) => props.data.date,
      (props) => props.data.dates,
      (props) => props.data.dateFrom,
      (props) => props.data.dateTo,
      (props) => props.data.type
    ],
    (type, date, dates, dateFrom, dateTo, typeOfRequest) => {
      return formatDate(type, date, dates, dateFrom, dateTo, typeOfRequest);
    }
  );

  state = {
    showAskIfDeleteModal: false
  };

  onHideElement = () => this.props.onHide();

  inProgress = () => {
    this.onHide('Заявка в процессе выполнения');
    this.setState({ comment: '' });
    this.props.answer('inProgress');
  };

  accept = () => {
    this.onHide('Заявка принята');
    this.setState({ comment: '' });
    this.props.answer('accept');
  };

  completed = () => {
    this.onHide('Заявка выполнена');
    this.setState({ comment: '' });
    this.props.answer('completed');
  };

  denied = () => {
    this.onHide('Заявка отклонена');
    this.props.answer('denied', this.state.comment);
  };

  showInput = () => {
    this.setState({
      showCommentInput: true
    });
  };

  onCommentChange = (e) => {
    this.setState({
      comment: e.target.value
    });
  };

  editInit = () => {
    const { edit } = this.state;
    this.setState({
      edit: !edit
    });
  };

  editRequest = async () => {
    let data = { ...this.state };

    if (!data.oldDate && !data.date) {
      this.setState({
        error: true
      });
      return;
    }

    delete data.error;
    delete data.showCommentInput;
    delete data.edit;
    data.comment = data.userComment;
    delete data.userComment;

    data.type = data.type.value;
    data = dateForServer(data);

    try {
      data.id = this.props.data.id;
      await editRequestRequest(data);
      this.props.onHide({ text: 'Заявка отредактирована' });
      this.props.statusChange();
    } catch (err) {
      console.log(err);
      toast.warn('Что-то пошло не так');
    }
  };

  askIfDelete = () => {
    this.setState({
      showAskIfDeleteModal: true
    });
  };

  cancelDeleting = () => {
    this.setState({
      showAskIfDeleteModal: false
    });
  };

  onHide = (text) => {
    this.props.onHide({ text });
    this.setState({
      showCommentInput: false,
      showAskIfDeleteModal: false,
      edit: false
    });
  };

  editingRequest = (requestData) => {
    const allowed = [
      'date',
      'oldDate',
      'from',
      'title',
      'userComment',
      'deniedComment',
      'type',
      'id'
    ];

    const filtered = Object.keys(requestData)
      .filter((key) => allowed.includes(key))
      .reduce((obj, key) => {
        // eslint-disable-next-line
        obj[key] = requestData[key];
        return obj;
      }, {});

    this.setState({ ...filtered });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    if (!this.props.data.title) {
      return null;
    }
    const {
      data: { type },
      data: request,
      user: { role }
    } = this.props;

    const userName = this.nameSelector(this.props.data.from);
    const date = this.dateSelector(this.props);
    return (
      <StyledModal open={this.props.show} onClose={this.onHide}>
        <Typography variant="h6" id="modal-title" gutterBottom>
          <b>От: </b>
          {userName}
        </Typography>
        <Divider style={style.divider} />
        {!this.state.edit
          ? (
            <RequestInfo request={request} date={date} type={typeName[type]} />
          )
          : (
            <EditRequest request={request} editingRequest={this.editingRequest} />
          )}
        <Divider style={style.divider} />
        <StyledFooter>
          {this.props.type === 'send'
            ? (
              <>
                <Button
                  onClick={this.props.submit}
                  value="accept"
                  className="accept-btn"
                >
                  Отправить заявку
              </Button>

                <Button
                  onClick={this.onHideElement}
                  value="decline"
                  className="decline-btn"
                >
                  Отмена
                </Button>
              </>
            )
            : role === 'admin'
              ? (
                <>
                  <StyledDiv>
                    <>
                      <Button
                        aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        id="response"
                        className="accept-btn"
                        style={{ marginRight: '10px' }}
                      >
                        Ответить
                      </Button>

                      <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                      >
                        <MenuItem className="accept-btn" onClick={this.completed}>
                          Выполнена
                        </MenuItem>
                        <MenuItem onClick={this.inProgress}>В процессе</MenuItem>
                        <MenuItem className="decline-btn" onClick={this.showInput}>
                          Отклонить
                        </MenuItem>
                      </Menu>

                      {!this.state.edit
                        ? (
                          <>
                            <Button
                              onClick={this.editInit}
                              style={{ marginRight: '10px' }}
                            >
                              Редактировать
                            </Button>
                            <Button
                              className="decline-btn"
                              onClick={this.askIfDelete}
                            >
                              Удалить
                            </Button>
                          </>
                        )
                        : (
                          <>
                            <Button className="accept-btn" onClick={this.editRequest}>
                              Принять
                            </Button>

                            <Button onClick={this.editInit} className="decline-btn">
                              Отмена
                            </Button>
                          </>
                        )}
                    </>

                    <CancelButton
                      onClick={this.onHideElement}
                      className="decline-btn"
                      style={{ marginLeft: 'auto' }}
                    >
                      Отмена
                    </CancelButton>
                  </StyledDiv>
                </>
              )
              : (
                <CancelButton
                  onClick={this.onHideElement}
                  className="decline-btn"
                  style={{ marginLeft: 'auto' }}
                >
                  Отмена
                </CancelButton>
              )}
        </StyledFooter>
        {this.state.showCommentInput && (
          <TextField
            label="Причина отказа"
            name="title"
            value={this.state.comment}
            onChange={this.onCommentChange}
            margin="normal"
            variant="outlined"
            style={{ width: '100%', marginBottom: '10px', fontSize: '15px' }}
            multiline
            required
            autoFocus
          />
        )}
        {this.state.showCommentInput && this.state.comment && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={this.denied} className="decline-btn">
              Отклонить
            </Button>
          </div>
        )}
      </StyledModal>
    );
  }
}

const StyledModal = styled(Modal)`
  margin-top: 5%;

  & img {
    width: 100%;
  }
  & button {
  }
  .project-description {
    margin-bottom: 20px;

    & pre {
      color: rgba(0, 0, 0, 0.87);
      padding-left: 10px;
    }
  }
  .modal-buttons {
    display: flex;
    margin-top: 20px;
    & .decline-btn {
      margin-left: auto;
    }
  }
`;

const StyledDiv = styled.div`
  display: flex;

  width: 100%;
  color: red;

  @media (max-width: 355px) {
    flex-direction: column;

    button {
      margin-left: 0 !important;
    }
  }
`;

const style = {
  commentArea: {
    marginTop: '20px'
  },
  modal: {
    marginTop: '80px'
  },
  buttongroup: {
    width: 'fit-content'
  },
  divider: {
    margin: '20px 0'
  }
};

const typeName = {
  technical: 'технический',
  common: 'бытовой',
  dayOff: 'отгул',
  timeOff: 'отгул',
  documents: 'документы',
  vacation: 'отпуск',
  medical: 'больничный'
};

const CancelButton = styled(Button)`
  float: right;

  @media (max-width: 610px) {
    margin-top: 15px;
  }
`;

const StyledFooter = styled.div`
  text-align: left;
  display: flex;
  justify-content: space-between;

  @media (max-width: 610px) {
    text-align: center;

    & .btn-group {
      width: auto;
      display: inline-block;
    }
  }
`;

const getName = (from) => {
  const newFrom = from;
  if (!newFrom.firstName) {
    newFrom.firstName = '';
  }

  if (!newFrom.lastName) {
    newFrom.lastName = '';
  }
  let userName = `${newFrom.firstName} ${newFrom.lastName}`;
  if (userName === ' ') {
    userName = newFrom.login;
  }

  return userName;
};

const formatDate = (type, date, dates, dateFrom, dateTo, typeOfRequest) => {
  let newDate = date;
  newDate = {
    dateFrom,
    dateTo,
    dates
  };
  newDate = getDate(newDate, 'server', typeOfRequest);
  return newDate;
};

const dateForServer = (data) => {
  const newData = { ...data };
  switch (newData.type) {
    case 'technical':
    case 'common':
    case 'documents':
      newData.dateTo = newData.date;
      newData.dateFrom = null;
      newData.dates = null;
      break;

    case 'medical':
    case 'vacation': {
      const { date, oldDate } = newData;
      const source = date || oldDate;
      newData.dateFrom = source.from;
      newData.dateTo = source.to;
      newData.dates = null;
      break;
    }

    case 'dayOff':
      newData.dates = newData.date;
      newData.dateFrom = null;
      newData.dateTo = null;
      break;

    default:
      break;
  }

  return newData;
};

const connectFunction = connect(
  (state) => ({
    user: state.global.user
  }),
  null
);

RequestModal.propTypes = {
  user: PropTypes.shape(),
  show: PropTypes.bool,
  type: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  submit: PropTypes.func,
  answer: PropTypes.func,
  delete: PropTypes.func,
  statusChange: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any).isRequired
};

RequestModal.defaultProps = {
  user: {},
  show: false,
  submit: () => null,
  delete: () => null,
  answer: () => null,
  statusChange: () => null
};

export default connectFunction(RequestModal);
