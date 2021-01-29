import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { updateTaskStatusRequest } from 'api/studyTaskApi';

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Icon,
  Button
} from '@material-ui/core';

class UserStudyPlan extends Component {
  start = this.props.job.plan_taskJob.startTask;

  end = this.props.job.plan_taskJob.finishTask;

  constructor(props) {
    super(props);
    this.state = {
      job: this.props.job
    };
  }

  startJob = async () => {
    try {
      const {
        job,
        job: {
          plan_taskJob: { id }
        }
      } = this.state;

      const { data: plan_taskJob } = await updateTaskStatusRequest(id, {
        startTask: new Date()
      });
      job.plan_taskJob = plan_taskJob;

      this.setState({
        job
      });
    } catch (err) {
      console.log(err);
    }
  };

  endJob = async () => {
    try {
      const {
        job,
        job: {
          plan_taskJob: { id }
        }
      } = this.state;

      const { data: plan_taskJob } = await updateTaskStatusRequest(id, {
        finishTask: new Date()
      });
      job.plan_taskJob = plan_taskJob;

      this.setState({
        job
      });
    } catch (err) {
      console.log(err);
    }
  };

  delete = () => {
    this.props.onChange(this.props.index);
  };

  render() {
    const { job } = this.state;
    const { title, description } = job;
    const start = this.state.job.plan_taskJob.startTask;
    const end = this.state.job.plan_taskJob.finishTask;
    const { isAdmin, edit, avgDay, countDay } = this.props;
    return (
      <StyledJob edit={edit ? 'edit' : undefined}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className="mainWrapper">
            <div className="statusAndNameWrapper">
              {start && !end ? (
                <InProgressIcon
                  className={`far fa${end ? '-check' : ''}-circle`}
                />
              ) : (
                <CompleteIcon
                  className={`far fa${end ? '-check' : ''}-circle`}
                />
              )}
              {title}
              {!isAdmin && (
                <>
                  <Button disabled={start} onClick={this.startJob} size="small">
                    Начать
                  </Button>

                  <Button
                    disabled={end || !start}
                    onClick={this.endJob}
                    size="small"
                  >
                    Закончить
                  </Button>
                </>
              )}
            </div>
            {isAdmin && (
              <div className="status-task">
                {this.start && (
                  <p className="numOfDaysPassed">
                    {`${
                      this.end ? 'Затрачено дней:  ' : 'Дней в работе: '
                    }${countDay}`}
                  </p>
                )}
                {!!avgDay && (
                  <p className="numOfDaysPassed">{`(в ср: ${avgDay})`}</p>
                )}
              </div>
            )}
            {edit && (
              <i
                className="fas fa-times-circle close-btn"
                onClick={this.delete}
              />
            )}
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {description ? (
            <div
              className="insertHTML"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <div />
          )}
        </ExpansionPanelDetails>
      </StyledJob>
    );
  }
}

const StyledJob = styled(ExpansionPanel)`
  && {
    border-radius: 4px;
  }

  border-top: 1px solid rgba(128, 128, 128, 0.2);
  margin-bottom: 5px;

  &::before {
    display: none;
  }

  & :last-child {
    right: ${(props) => (props.edit ? '40px' : '5px')};
  }
  .status-task {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .status-task :last-child {
    margin-left: 10px;
  }
  .numOfDaysPassed {
    margin: 0;
  }
  && .mainWrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding-right: ${(props) => (props.edit ? '60px' : '30px')};
  }
  .statusAndNameWrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  && :last-child .close-btn {
    top: 12px;
    left: unset;
    right: 8px;
    padding-right: 0;
  }
  & i {
    font-size: 30px;
    position: absolute;
    top: 50px;
    left: 5px;
    color: #5cb85c;
  }

  & .insertHTML ul {
    margin-top: 10px;
    list-style: initial;
    padding-left: 40px;
  }

  & b {
    margin-right: 20px;
    word-break: break-all;
    cursor: pointer;
  }

  & b:hover {
    text-decoration: underline;
  }
`;

const InProgressIcon = styled(Icon)`
  color: #ec971f;
  margin-right: 10px;
`;

const CompleteIcon = styled(Icon)`
  color: #5cb85c;
  margin-right: 10px;
`;

UserStudyPlan.propTypes = {
  job: PropTypes.objectOf(PropTypes.any).isRequired,
  isAdmin: PropTypes.bool,
  edit: PropTypes.bool,
  onChange: PropTypes.func,
  avgDay: PropTypes.number,
  countDay: PropTypes.number,
  index: PropTypes.number
};

UserStudyPlan.defaultProps = {
  edit: false,
  isAdmin: false,
  onChange: () => {},
  avgDay: 0,
  countDay: 0,
  index: 0
};

export default UserStudyPlan;
