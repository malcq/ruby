import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { Button, Popover } from 'reactstrap';
import { Dispatch } from "redux";
import { find, each } from 'lodash';

import { tasksGetData,} from '../../stores/actionCreators';
import { promisifyAction, Logger } from "../../utils";
import './styles.scss';

interface ITasksProps {
  getData: IActionPromiseFactory;
}

interface ITask {
  shipment_id: number;
  task: string;
  title: string;
  text: string;
  created_ago: string;
}

interface ITasksState {
  list: ITask[];
  tasksPopover: boolean;
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  getData: promisifyAction(dispatch, tasksGetData),
});

const mapStateToProps = (state: IGlobalState): any => ({
  list: state.tasks.list,
});

const initialState = {
  list: [],
  tasksPopover: false,
};


class Tasks extends PureComponent<ITasksProps, ITasksState> {

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    try {
      await this.props.getData();
    } catch(error) {
      Logger.log(error)
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({ list: nextProps.list });
  }

  public render () {
    return <div>
      <Button
        aria-expanded="false"
        className="popover__button"
        type="button"
        id="taskPopover"
        onClick={this.toggleTaskPopover}
      >
        <i className="icon inbox" />
        {this.state.list.length ? <span className="tasks-counter">{this.state.list.length}</span> : ''}
      </Button>
      <Popover
        placement="bottom"
        isOpen={this.state.tasksPopover}
        target="taskPopover"
        className="popover__content popover__content_task"
        toggle={this.toggleTaskPopover}
      >
        <div className="popover__header">
          <div className="popover__text">
            Open Tasks
          </div>
        </div>
        <div className="popover__body">
          {this._renderTasks()}
        </div>
      </Popover>
    </div>
  }

  private _renderTasks() {
    if (this.state.list.length) {
      return <div>{this.state.list.map((task, i) => this._renderTask(task, i))}</div>
    } else {
      return (
        <div className="popover__item empty_tasks">
          <span className="task__icon green">
              <span className="popover__icon icon checked"/>
          </span>
          <span className="task__title">
            <span className="task__text">
              No tasks to show
            </span>
          </span>
        </div>
      )
    }
  }

  private _renderTask(task, i) {
    return (
      <a href={`/shipments/${task.shipment_id}/overview`} className="task" key={i}>
        <i className={`icon task__icon ${task.task === 'upload_documentation' ? 'shipments' : 'address-book'}`} />
        <span className="task__title">
          <span className="task__title__header">{task.title}</span>
          <div className="task__title__text">{task.text.split('_').join(' ')}</div>
        </span>
        <span className="task__time-ago">{task.created_ago} ago</span>
      </a>
    )
  }

  @bind
  private toggleTaskPopover(){
    this.setState({tasksPopover: !this.state.tasksPopover})
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Tasks);
