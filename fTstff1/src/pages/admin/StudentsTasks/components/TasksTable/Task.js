import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { connectGlobalUser } from 'store/connections';
import { updateTaskRequest, deleteTaskRequest } from 'api/studyTaskApi';
import {
  updateAnnouncement,
  deleteAnnouncement
} from 'api/announcementApi';
import { getImagesChange, changeCheck } from 'utilsImages';
import { getModalStyle } from 'utils';

import {
  Typography,
  Paper,
  Modal,
  Button
} from '@material-ui/core';
import TaskEditForm from './TaskEditForm';

class Task extends Component {
  state = {}

  componentDidMount() {
    this.refreshState();
  }

  refreshState = () => {
    const { task, isStudentTasks } = this.props;
    const { hidden, visitDate } = task;
    const isHidden = hidden ? 'hidden' : 'see';
    this.setState((state) => ({
      hidden:
        state.hiddenInitial !== undefined ? state.hiddenInitial : isHidden,
      hiddenInitial:
        state.hiddenInitial === undefined ? isHidden : state.hiddenInitial,
      showModal: false,
      showAskIfDeleteModal: false,
      edit: false,
      oldTaskData: {
        title: task.title,
        description: task.description ? task.description : ''
      },
      title: task.title,
      description: task.description ? task.description : '',
      images: [],
      imagesSrc: isStudentTasks ? [] : [...task.images],
      oldImages: isStudentTasks ? [] : [...task.images],
      visitDate: state.visitDate
        ? state.visitDate
        : visitDate
          ? new Date(visitDate)
          : new Date()
    }));
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    const { title, description } = this.state;
    const { user } = this.props;
    try {
      if (this.props.isStudentTasks) {
        const { data: res } = await updateTaskRequest(this.props.task.id, {
          title,
          description
        });
        this.changeRes(res);
        this.setState({
          showModal: false,
          edit: false
        });
        this.props.getTasks();
        toast.success('Задание для стажеров успешно изменено');
      } else {
        const data = {
          images: this.state.images,
          title: this.state.title,
          description: this.state.description,
          oldImages: this.state.oldImages,
          author_id: user.id,
          visitDate: this.state.visitDate,
          hidden: this.state.hidden === 'hidden'
        };
        data.changedImages = getImagesChange(
          data.oldImages,
          this.state.imagesSrc
        );

        if (!changeCheck({ ...this.props.task }, data)) {
          this.closeModal();
          return;
        }

        const { data: res } = await updateAnnouncement(
          this.props.task.id,
          data
        );
        this.changeRes(res);
        toast.success('Объявление успешно изменено');
      }
    } catch (err) {
      console.log(err);
    }
  };

  changeRes = (res) => {
    const { title, description, hidden } = res;
    this.setState({
      edit: false,
      hiddenInitial: hidden ? 'hidden' : 'see',
      oldTaskData: { title, description },
      title,
      description
    });
  };

  editInit = () => {
    this.setState({
      edit: true
    });
  };

  cancelEdit = () => {
    this.refreshState();
    const { title, description } = this.state.oldTaskData;
    this.setState({
      edit: false,
      title,
      description
    });
  };

  openModal = () => {
    this.setState({
      showModal: true
    });
  };

  closeModal = () => {
    this.refreshState();
    this.setState({
      showModal: false,
      showAskIfDeleteModal: false,
      edit: false
    });
  };

  addImage = (images, imagesSrc) => {
    this.setState({ images, imagesSrc });
  };

  deleteTask = async () => {
    try {
      if (this.props.isStudentTasks) {
        await deleteTaskRequest(this.props.task.id);
        toast.success('Задание для стажеров успешно удалено');
      } else {
        await deleteAnnouncement(this.props.task.id);
        toast.success('Объявление успешно удалено');
      }
      this.setState({
        showModal: false,
        edit: false
      });
      this.props.getTasks();
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = (event) => {
    this.setState({ hidden: event.target.value });
  };

  askIfDelete = () => {
    this.setState({
      showAskIfDeleteModal: true
    });
  };

  onChangeDate = (visitDate) => {
    this.setState({ visitDate });
  };

  render() {
    const {
      showModal,
      edit,
      title,
      description,
      hidden,
      images,
      imagesSrc = [],
      visitDate
    } = this.state;
    const { isStudentTasks } = this.props;

    return (
      <>
        <StyledSpan onClick={this.openModal}>
          {!isStudentTasks
            ? (
              <p>
                <i
                  className="far fa-eye circle-margin"
                  style={{ opacity: `${hidden === 'hidden' ? 0.1 : 0.7}` }}
                />
                {title}
              </p>
            )
            : (
              <p>{title}</p>
            )}
        </StyledSpan>
        {showModal && (
          <StyledModal open={showModal} onClose={this.closeModal}>
            <StyledPaper style={getModalStyle()}>
              {!edit && (
                <Typography variant="h6" id="modal-title" gutterBottom>
                  <b>Название: </b>
                  {title}
                </Typography>
              )}

              {edit
                ? (
                  <TaskEditForm
                    title={title}
                    description={description}
                    onChange={this.onChange}
                    hidden={hidden}
                    isStudent={isStudentTasks}
                    changeSee={this.handleChange}
                    images={images}
                    imagesSrc={imagesSrc}
                    addImage={this.addImage}
                    visitDate={visitDate}
                    changeTime={this.onChangeDate}
                  />
                )
                : (
                  <>
                    <Typography gutterBottom>
                      <b>Описание: </b>
                    </Typography>

                    <div
                      className="insertHTML"
                      dangerouslySetInnerHTML={
                        { __html: description } // eslint-disable-next-line
                      }
                    />
                  </>
                )}
              <div className="modal-buttons">
                {edit && (
                  <>
                    <Button className="accept-btn" onClick={this.onSubmit}>
                      Изменить
                    </Button>

                    <Button onClick={this.cancelEdit}>Отмена</Button>
                  </>
                )}

                {!edit && (
                  <>
                    <Button onClick={this.editInit}>Редактировать</Button>
                    <Button className="decline-btn" onClick={this.askIfDelete}>
                      Удалить
                    </Button>
                  </>
                )}
                <Button className="decline-btn" onClick={this.closeModal}>
                  Закрыть
                </Button>
              </div>
            </StyledPaper>
          </StyledModal>
        )}
      </>
    );
  }
}

const StyledModal = styled(Modal)`
  & .left-btn {
    float: left;
  }

  & label {
    line-height: 34px;
  }

  & input {
    text-align: left;
  }

  & .insertHTML {
    margin: 0 10px;
    font-size: 14px;
    line-height: 17px;
  }

  & .quill {
    margin-top: 10px;

    .ql-toolbar {
      border-radius: 5px 5px 0 0;
    }

    .ql-container {
      border-radius: 0 0 5px 5px;
    }
  }

  & img {
    width: 100%;
  }

  & button {
    margin-top: 10px;
  }

  .project-description {
    margin-bottom: 20px;

    & pre {
      color: rgba(0, 0, 0, 0.87);
      padding-left: 10px;
    }
  }

  .modal-buttons {
    button:first-of-type {
      margin-right: 15px;
    }
    display: flex;
    margin-top: 20px;
    & .decline-btn:last-of-type {
      margin-left: auto;
    }
  }
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  padding: 20px;
  font-size: 16px;
  min-width: 700px;
  max-height: 600px;
  overflow-y: scroll;

  @media (max-width: 701px) {
    min-width: auto;
    width: 98%;
  }
`;

const StyledSpan = styled.span`
  color: black;
  cursor: pointer;

  .row-space-between {
    display: flex;
    justify-content: space-between;
  }

  .circle-margin {
    margin: -2px 0px;
    font-size: 14px;
    width: 30px;
  }
`;

Task.propTypes = {
  task: PropTypes.objectOf(PropTypes.any),
  getTasks: PropTypes.func.isRequired,
  isStudentTasks: PropTypes.bool,
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired
};

Task.defaultProps = {
  isStudentTasks: true,
  task: {}
};

export default connectGlobalUser(Task);
