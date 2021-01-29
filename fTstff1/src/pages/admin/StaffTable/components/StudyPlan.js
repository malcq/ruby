import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { createSelector } from 'reselect';

import {
  createStudyPlanRequest,
  getStudyPlanRequest,
  updateStudyPlanRequest
} from 'api/studyPlanApi';
import { getPlanTaskJobsTimeFrames } from 'api/planTaskJobsApi';
import {
  calcBusinessDays,
  getFullName,
  getValueFromSelect
} from 'utils';

import {
  Typography,
  Button,
  Divider
} from '@material-ui/core';
import { Draggable } from 'react-smooth-dnd';
import {
  Modal,
  SelectFromDB
} from 'ui';
import UserJob from 'pages/Account/components/UserJob';
import DraggableUserJobs from 'pages/admin/StudentsTasks/components/TasksTable/DraggableUserJobs';

class StudyPlan extends Component {
  state = {
    plan: null,
    jobs: [],
    newJobs: [],
    newTasks: [],
    addNew: false,
    edit: false,
    generalQuantityDays: 0,
    generalAvgDays: 0
  }

  async componentDidMount() {
    try {
      const { data: plan } = await getStudyPlanRequest(this.props.user.id);

      if (!plan) {
        const { data: plan } = await createStudyPlanRequest(this.props.user.id);
        this.setState({
          plan,
          edit: true
        });
        return;
      }
      if (!plan.taskJobs.length) {
        this.setState({
          plan,
          edit: true
        });
        return;
      }
      const { taskJobs: jobs, id } = plan;
      const { data: jobsTimeFrames } = await getPlanTaskJobsTimeFrames(
        jobs,
        id
      );
      this.setState({
        plan,
        jobs,
        newJobs: [...jobs],
        jobsTimeFrames
      });
    } catch (err) {
      console.log('Error: ', err);
    }
  }

  getJobs = createSelector(
    [
      (state) => state.newJobs,
      (state) => state.jobsTimeFrames,
      (state) => state.edit
    ],
    (newJobs, jobsTimeFrames = [], edit) => {
      let generalQuantityDays = 0;
      let generalAvgDays = 0;
      return newJobs.map((job, index) => {
        const { id: jobId, plan_taskJob: plan } = job;
        const { id, startTask, finishTask } = plan;
        const countDay = this.getBusinessDaysForTask(startTask, finishTask);
        const avgDay = this.getAverageDaysValue(jobsTimeFrames[jobId]);
        generalQuantityDays += countDay;
        generalAvgDays += +avgDay;
        if (newJobs.length - 1 === index) {
          this.setState({ generalQuantityDays, generalAvgDays });
        }
        if (edit) {
          return (
            <Draggable key={id}>
              <UserJob
                job={job}
                key={id}
                isAdmin
                edit={edit}
                onChange={this.delete}
                avgDay={avgDay}
                countDay={countDay}
                index={index}
              />
            </Draggable>
          );
        }
        return (
          <UserJob
            job={job}
            key={id}
            isAdmin
            edit={edit}
            onChange={this.delete}
            avgDay={avgDay}
            countDay={countDay}
            index={index}
          />
        );
      });
    }
  );

  cancel = () => {
    const { jobs } = this.state;
    this.setState({
      edit: false,
      newJobs: [...jobs],
      newTasks: [],
      addNew: false
    });
  };

  sumTaskTime = (accumulator, Job) => {
    let newAccumulator = accumulator;
    newAccumulator += this.getBusinessDaysForTask(
      Job.plan_taskJob.startTask,
      Job.plan_taskJob.finishTask
    );
    return newAccumulator;
  };

  applyChanges = async () => {
    const { plan, newTasks, jobs, newJobs } = this.state;

    const data = {
      oldChain: getIdFromArray(jobs),
      newChain: getIdFromArray(newJobs),
      jobsToAdd: getValueFromSelect(newTasks)
    };

    try {
      const { data: newPlan } = await updateStudyPlanRequest(plan.id, data);
      this.setState({
        plan: newPlan,
        jobs: [...newPlan.taskJobs],
        newJobs: [...newPlan.taskJobs],
        edit: false,
        newTasks: [],
        addNew: false
      });
      toast.success('Изменения были успешно сохранены');
    } catch (err) {
      console.log(err);
    }
  };

  delete = (index) => {
    const { newJobs } = this.state;
    newJobs.splice(index, 1);
    this.setState({
      newJobs: [...newJobs]
    });
    toast.success('Задание для стажера успешно удалено');
  };

  showTasksSelector = () => {
    const { addNew } = this.state;
    this.setState({
      addNew: !addNew
    });
  };

  onDrop = (dragResult) => {
    if (!this.state.edit) {
      return;
    }
    const { newJobs } = this.state;
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return;

    const result = [...newJobs];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    this.setState({
      newJobs: [...result]
    });
  };

  onTasksChange = (newTasks) => {
    this.setState({
      newTasks
    });
  };

  getBusinessDaysForTask = (start, end) => {
    if (start && end) {
      return calcBusinessDays(new Date(start), new Date(end)) + 1;
    }
    if (start && !end) {
      return calcBusinessDays(new Date(start));
    }
    return null;
  };

  getAverageDaysValue = (timeFrames) => {
    if (timeFrames) {
      const averageTime =
        timeFrames.reduce((initVal, timeFrame) => {
          return (
            initVal +
            this.getBusinessDaysForTask(
              timeFrame.startTask,
              timeFrame.finishTask
            )
          );
        }, 0) / timeFrames.length;
      return ` ${averageTime.toFixed(1)}`;
    }
    return 0;
  };

  editInit = () => this.setState({ edit: true });

  render() {
    const { user, show, onHide } = this.props;
    const { edit, addNew, generalQuantityDays, generalAvgDays } = this.state;
    return (
      <StyledModal open={show} onClose={onHide}>
        <Typography variant="h6" id="modal-title" gutterBottom>
          Учебный план для {getFullName(user)}
        </Typography>
        <div className="draggableTasks">
          {edit
            ? (
              <DraggableUserJobs onDrop={this.onDrop}>
                {this.getJobs(this.state)}
              </DraggableUserJobs>
            )
            : (
              this.getJobs(this.state)
            )}
        </div>
        {!!generalQuantityDays && (
          <p className="general">{`Общее время : ${generalQuantityDays}(cр: ${generalAvgDays})`}</p>
        )}

        {edit && (
          <React.Fragment>
            <StyledAddTask style={{ marginBottom: '20px' }}>
              <i
                className={`fas fa-${!addNew ? 'plus' : 'times'}-circle`}
                onClick={this.showTasksSelector}
              />
              <span onClick={this.showTasksSelector}>
                {!addNew ? 'Добавить' : 'Отмена'}
              </span>
            </StyledAddTask>
            {addNew && (
              <div style={{ marginBottom: '55px' }}>
                <SelectFromDB
                  dataType="tasks"
                  class="task-select"
                  value={this.state.newTasks}
                  change={this.onTasksChange}
                />
              </div>
            )}
          </React.Fragment>
        )}
        <StyledDivider inset />
        <div className="buttons-wrapper">
          {!this.state.edit && (
            <Button onClick={this.editInit}>Редактировать</Button>
          )}

          {this.state.edit && (
            <React.Fragment>
              <Button
                onClick={this.applyChanges}
                style={{ marginRight: '15px' }}
              >
                Изменить
              </Button>

              <Button onClick={this.cancel} className="decline-btn">
                Отмена
              </Button>
            </React.Fragment>
          )}

          <Button
            onClick={onHide}
            className="decline-btn"
            style={{ marginLeft: 'auto' }}
          >
            Закрыть
          </Button>
        </div>
      </StyledModal>
    );
  }
}

const StyledAddTask = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 0.9;
  }
`;

const StyledModal = styled(Modal)`
  & .editInit,
  & .editButtons {
    float: left;
  }

  .general {
    text-align: right;
  }

  & .drag-start {
    background: #e7f5ff;
    border-color: #b3dfff;
    transition: all 0.18s ease;
    cursor: ns-resize;
  }

  & .drag-end {
    background: #e7f5ff;
    border-color: #b3dfff;
    opacity: 2;
  }

  & .smooth-dnd-ghost {
    left: 15px !important;
  }

  & .fa-plus-circle,
  & .fa-times-circle {
    color: #5cb85c;
    font-size: 25px;
    margin-right: 7px;
    cursor: pointer;
  }

  & .fa-times-circle {
    color: #d9534f;
  }

  & .task-select {
    margin-top: 15px;
  }

  & .selectLabel {
    line-height: 38px;
  }

  .buttons-wrapper {
    display: flex;
    padding-top: 20px;
  }

  .addTasks {
    display: flex;
    align-items: center;
    margin: 20px 0;
    &:hover {
      opacity: 0.7;
    }
    &:active {
      opacity: 0.9;
    }
  }

  .draggableTasks {
    margin: 30px 0;
  }

  &&& .smooth-dnd-draggable-wrapper {
    overflow: visible;
  }
`;
const StyledDivider = styled(Divider)`
  margin-left: 0 !important;
`;

const getIdFromArray = (arr) => {
  const newAtt = [...arr];
  for (let i = 0; i < newAtt.length; i++) {
    newAtt[i] = newAtt[i].plan_taskJob.id;
  }
  return newAtt;
};

StudyPlan.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any)
};

StudyPlan.defaultProps = {
  user: {}
};

export default StudyPlan;
