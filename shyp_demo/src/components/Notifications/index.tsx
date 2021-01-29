import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import { Button, Popover } from 'reactstrap';
import { find, each } from 'lodash';
import { ActionCable } from 'react-actioncable-provider';

import './styles.scss';

interface ICommentAttachment {
  id: number;
  original_filename: string;
  file_url: string;
}

interface INotification {
  author: any;
  comment_attachments: ICommentAttachment[];
  content: string;
  human_time: string;
  shipment_link: string;
  shipment_title: string;
  id: number;
  shipment_id: number;
  is_system: boolean;
}

interface INotificationsState {
  list: INotification[];
  notificationsPopover: boolean;
}

const initialState = {
  list: [],
  notificationsPopover: false,
};

class Notifications extends PureComponent<{}, INotificationsState> {
  public actionCableRef: any;

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public render () {
    return <div>
      <ActionCable
        ref={elem => this.actionCableRef = elem}
        channel={{ channel: 'UserChannel' }}
        onReceived={this.handleReceivedNotifications}
      />
      <Button
        aria-expanded="false"
        className="popover__button"
        type="button"
        id="notificationPopover"
        onClick={this.toggleNotificationPopover}
      >
        <i className="icon notify" />
        {this.state.list.length ? <span className="tasks-counter">{this.state.list.length}</span> : ''}
      </Button>
      <Popover
        placement="bottom"
        isOpen={this.state.notificationsPopover}
        target="notificationPopover"
        className="popover__content popover__content_notification"
        toggle={this.toggleNotificationPopover}
      >
        <div className="popover__header">
          <div className="popover__text">
            Unread Notifications
            <a className="popover__text__link" onClick={this.markAllAsRead}>Mark all as read</a>
          </div>
        </div>
        <div className="popover__body">
          {this._renderNotifications()}
        </div>
      </Popover>
    </div>
  }


  private _renderNotifications() {
    if (this.state.list.length) {
      return <div>{this.state.list.map((notification: INotification, i: number) => this._renderNotification(notification, i))}</div>
    } else {
      return (
        <div className="popover__item empty_tasks">
          <span className="task__icon green">
              <span className="popover__icon icon checked"/>
          </span>
          <span className="task__title">
            <span className="task__text">
              No unread notifications to show
            </span>
          </span>
        </div>
      )
    }
  }

  private _renderNotification(notification: INotification, i: number) {
    return (
      <a href={notification.shipment_link} className="task" key={i}>
        <span className="task__title">
          <span className="task__title__header">{`${notification.author.full_name} (${notification.shipment_title})`}</span>
          <div className="task__title__text">
            <span dangerouslySetInnerHTML={{__html: notification.content}}/>
            {this.prepareAttachments(notification.comment_attachments)}
            </div>
        </span>
        <span className="task__time-ago">{notification.human_time} ago</span>
      </a>
    )
  }

  private prepareAttachments(attachments: ICommentAttachment[]) {
    if (attachments.length) {
      return (
        <div>
          {'Uploaded documents'}
          {
            attachments.map((attachment: ICommentAttachment, i:number) => {
              return <div key={i}>{attachment.original_filename}</div>
            })
          }
        </div>
      )
    } else { return null }
  }

  @bind
  private toggleNotificationPopover(){
    this.setState({notificationsPopover: !this.state.notificationsPopover})
  }

  @bind
  private markAllAsRead() {
    this.actionCableRef.perform('mark_all_read', {})
  }

  @bind
  private handleReceivedNotifications(response: any) {
    if (response.message_type === 'unread_notifications' ) {
      const notificationsCount: number = response.message.data.comments.length;
      if (notificationsCount) { document.title = `(${notificationsCount}) Shypple`; }
      this.setState({list: response.message.data.comments})
    }
  };
}

export default Notifications;
