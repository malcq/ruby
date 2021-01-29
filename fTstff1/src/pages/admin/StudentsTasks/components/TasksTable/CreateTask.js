import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// pick a date util library
import { createTaskRequest } from 'api/studyTaskApi';
import { createAnnouncement } from 'api/announcementApi';
import { getModalStyle } from 'utils';

import {
  Paper,
  Modal,
  Button
} from '@material-ui/core';
import TaskEditForm from './TaskEditForm';

class CreateTask extends Component {
  state = {}

  componentDidMount() {
    this.refreshState();
  }

  refreshState = () => {
    this.setState({
      title: '',
      description: '',
      hidden: 'see',
      images: [],
      imagesSrc: [],
      visitDate: new Date()
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addImage = (images, imagesSrc) => {
    this.setState({
      images,
      imagesSrc
    });
  };

  onChangeDate = (visitDate) => {
    this.setState({ visitDate });
  };

  onSubmit = async () => {
    try {
      if (this.props.isStudent) {
        const { title, description } = this.state;
        await createTaskRequest({ title, description });
      } else {
        const data = { ...this.state, ...this.props.globalUser };
        await createAnnouncement(data);
      }
      this.refreshState();
      this.props.onHide(true);
      this.props.getTasks();
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = (event) => {
    this.setState({ hidden: event.target.value });
  };

  onHide = (successSubmit, errors = false) => {
    this.refreshState();
    this.props.onHide(successSubmit, errors);
  };

  render() {
    const { show, isStudent } = this.props;
    const { title, description, hidden, visitDate, imagesSrc } = this.state;

    return (
      <StyledModal open={show} onClose={this.onHide}>
        <StyledPaper style={getModalStyle()}>
          <TaskEditForm
            title={title}
            description={description}
            onChange={this.onChange}
            hidden={hidden}
            isStudent={isStudent}
            changeSee={this.handleChange}
            addImage={this.addImage}
            visitDate={visitDate}
            changeTime={this.onChangeDate}
            imagesSrc={imagesSrc}
          />
          <div className="modal-buttons">
            <Button className="accept-btn" onClick={this.onSubmit}>
              Создать
            </Button>

            <Button
              className="decline-btn"
              onClick={() => {
                this.onHide(false);
              }}
            >
              Отмена
            </Button>
          </div>
        </StyledPaper>
      </StyledModal>
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

  & .quill {
    margin-top: 10px;
  }

  margin-top: 5%;

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
    display: flex;
    margin-top: 20px;
    & .decline-btn {
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

CreateTask.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  getTasks: PropTypes.func,
  isStudent: PropTypes.bool,
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired
};

CreateTask.defaultProps = {
  show: false,
  onHide: () => null,
  getTasks: () => null,
  isStudent: true
};

export default CreateTask;
