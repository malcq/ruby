import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ActionCable } from 'react-actioncable-provider';
import bind from 'autobind-decorator';
import Dropzone from 'react-dropzone'
import moment from 'moment';
import { Menu, MenuItem } from '@material-ui/core';
import { unionBy, sortBy } from 'lodash';
import { Tooltip } from '@material-ui/core';
import { Link } from "react-router-dom";
import { get, chain, noop } from 'lodash';

import { promisifyAction } from '../../utils';
import { Logger } from '../../utils/Logger';
import { Button, MentionArea, MultiSelector } from '../../components';

import {
  shipmentConversationGetData,
  shipmentConversationGetDataSuccess,
  shipmentConversationGetUsersSuccess,
  shipmentConversationGetUsers,
  attachFileToShipment,
  shipmentConversationPinComment,
  flashSuccess,
  flashError,
  submitChatComment,
  toggleChatFollow,
} from '../../stores/actionCreators';
import './styles.scss';

interface IShipmentsConversationProps {
  match: IMatch | null;
  shipmentId?: number;
  getConversation: IActionPromiseFactory;
  saveConversation: IActionPromiseFactory;
  saveFollowers: IActionPromiseFactory;
  getUsers: IActionPromiseFactory;
  attachFileToShipment: IActionPromiseFactory;
  showSuccess: IActionPromiseFactory;
  showError: IActionPromiseFactory;
  pinComment: IActionPromiseFactory;
  submit: IActionPromiseFactory;
  toggleChatFollow: IActionPromiseFactory;
  impersonator?: string | null;
}

interface IShipmentConversationState {
  [x:string]: any;
}

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getConversation: promisifyAction(dispatch, shipmentConversationGetData),
  saveConversation: promisifyAction(dispatch, shipmentConversationGetDataSuccess),
  saveFollowers: promisifyAction(dispatch, shipmentConversationGetUsersSuccess),
  getUsers: promisifyAction(dispatch, shipmentConversationGetUsers),
  attachFileToShipment: promisifyAction(dispatch, attachFileToShipment),
  showSuccess: promisifyAction(dispatch, flashSuccess),
  showError: promisifyAction(dispatch, flashError),
  pinComment: promisifyAction(dispatch, shipmentConversationPinComment),
  submit: promisifyAction(dispatch, submitChatComment),
  toggleChatFollow: promisifyAction(dispatch, toggleChatFollow),
});

const mapStateToProps = (state: IGlobalState): any => ({
  comments: state.shipmentConversation.comments,
  followers: state.shipmentConversation.followers,
  users: state.shipmentConversation.users,
  mentionables: state.shipmentConversation.mentionables,
  currentUserId: state.user.id,
  impersonator: state.user.impersonator,
});

const initialState = {
  comments: [],
  followers: [],
  users: [],
  mentionables: {
    users: [],
    admin_users: []
  },
  content: '',
  filesToUpload: [],
  failedFiles: [],
  typers: [],
  replyCommentId: null,
  typersNames: [],
};

const prepareForRequest = (state: IShipmentConversationState): any => {
  const formData = new FormData();
  const valid: boolean = state.content || state.filesToUpload.length;

  formData.append("chat_comment[content]", state.content);
  if (state.replyCommentId) {
    formData.append("chat_comment[answered_comment_id]", state.replyCommentId);
  }
  state.filesToUpload.forEach((file, i) => {
    formData.append(`chat_comment[comment_attachments_attributes][${i}][file]`, file)
  });

  return {formData, valid}
};

const pinIcon: string = 'pin';
const replyIcon: string = 'backarrow';
const forbiddenFormats: any = /\.(app|bat|action|bin|csh|exe|ksh|sh|out|run|pyc|pyo|rb)$/i;

class ShipmentsConversation extends PureComponent<IShipmentsConversationProps, IShipmentConversationState> {
  public static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  };
  public static defaultProps = {};
  public actionCableRef: any;
  public mentionAreaRef: any;
  public actionCableShipmentRef: any;
  public commentsContainer: any;
  public page: any;
  public fileInput: any;
  public commentsForm: any;
  public commentDate: any;

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    this.setState(initialState);
    try {
      await this.props.getUsers(this.props.shipmentId || this.props.match!.params.id);
      await this.props.getConversation(this.props.shipmentId || this.props.match!.params.id);
    } catch(error) {
      Logger.log(error)
    }
    if (!this.props.impersonator) {
      if (this.actionCableRef){
        this.actionCableRef.perform(
          'mark_shipment_comments_read',
          { shipment_id: this.props.shipmentId || this.props.match!.params.id }
        );
      }
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({
      comments: nextProps.comments,
      followers: nextProps.followers,
      users: nextProps.users,
      mentionables: nextProps.mentionables,
      currentUserId: nextProps.currentUserId,
    }, () => {
      this.chatScrollBottom();
    });
  }

  public render () {
    this.commentDate = null;
    return (
      <Dropzone
        disableClick
        style={{position: "relative"}}
        onDrop={this.onDrop}
        onDragEnter={this.onDrag}
        onDragLeave={this.onDragOut}
      >
        <article ref={elem => this.page = elem}>
          <ActionCable
            ref={this.getActionCableRef}
            channel={{ channel: 'UserChannel' }}
            onReceived={this.onReceived}
          />
          <ActionCable
            channel={{ channel: 'ShipmentChannel', shipment_id: this.props.shipmentId || this.props.match!.params.id }}
            ref={this.getActionCableShipmentRef}
            onReceived={this.onReceivedShipment}
          />
          <div className={`comments ${this.state.hover ? 'hovered' : ''}`}>
            <div className="comments__container" ref={elem => this.commentsContainer = elem}>
              {this._renderChat()}
            </div>
            <div className="comments__form" ref={elem => this.commentsForm = elem}>
              {this._renderTypers()}
              <div className="comments__form__inputs">
                <div className="comments__form__inputs__attachment">
                  <Tooltip title='Attach files to comment'>
                    <label htmlFor="comments__form__inputs__attachment__input">+</label>
                  </Tooltip>
                  <input
                    id="comments__form__inputs__attachment__input"
                    ref={elem => this.fileInput = elem}
                    className="hidden"
                    type="file"
                    multiple={true}
                    onChange={this.uploadFile}
                  />
                </div>
                <div className="comments__form__inputs__base">
                  {this._renderFailedFiles()}
                  {this._renderUploadedFiles()}
                  <div className={`comments__form__inputs__base__container ${this.state.invalid ? 'invalid' : ''}`}>
                    {this._renderReplyComment()}
                    <div className="flex">
                      <MentionArea
                        ref={elem => this.mentionAreaRef = elem}
                        value={this.state.content}
                        mentionables={this.state.mentionables}
                        submit={this.mentionAreaSubmit.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        onFocus={this.onFocus.bind(this)}
                      />
                      <Button className="comments__form__inputs__base__container--submit" color='blue-border' onClick={this.submit}>Send</Button>
                    </div>
                  </div>
                  <div className="comments__form__inputs__base--tips">
                    <span className="comments__form__inputs__base--tips__badge">Shift + Enter</span>
                    <span>  for a new line,  </span>
                    <span className="comments__form__inputs__base--tips__badge">Enter</span>
                    <span>  to send a message</span>
                  </div>
                  {this._renderFollowers()}
                </div>
              </div>
            </div>
          </div>
        </article>
      </Dropzone>
    );
  }

  private _renderTypers(): any {
    if (this.state.typers.length) {
      const article: string =  this.state.typers.length === 1 ? ' is ' : ' are ';
      return (
        <div className="comments__form__inputs__base--typers">
          {this.state.typers.map((typer: any) => {
            return typer.full_name
          })}
          {article} typing <span>.</span><span>.</span><span>.</span>
        </div>
      )
    }
  }

  @bind
  private getActionCableRef(elem: HTMLElement): void {
    this.actionCableRef = elem
  }

  @bind
  private getActionCableShipmentRef(elem: HTMLElement): void {
    this.actionCableShipmentRef = elem
  }

  private _renderChat() {
    return this.state.comments.map((comment: IComment, i: number) => {
      let dateItem: any = null;
      const date: string = moment(comment.created_at).format('D MMMM YYYY');
      if (this.commentDate !== date) {
        this.commentDate = date;
        dateItem = <div className="comments__container__date" key={`${comment.id}-date`}>
          <span className="comments__container__date__item">{date}</span>
        </div>;
      }
      return [ dateItem, this._renderCommentByType(comment, i) ];
    })
  }

  private _renderCommentByType(comment: IComment, i: number) {
    let commentEl: any;
    let className: string;
    if (comment.author.id === this.state.currentUserId) {
      className = 'outgoing';
      commentEl = comment.is_system ? this._renderSystem(comment) : this._renderOutgoing(comment, i);
    } else {
      className = 'incoming';
      commentEl = comment.is_system ? this._renderSystem(comment) : this._renderIncoming(comment, i);
    }
    return <div key={i} id={`chat-comment-${comment.id}`} className={`comments__container__item ${className}`}>{commentEl}</div>
  }

  private _renderSystem(comment: IComment) {
    return (
      <div className="system-comment">
        <span className="system-comment__time">{moment(comment.created_at).format('hh:mm')}</span>
        <span className="system-comment__author">{comment.author.id === this.state.currentUserId ? 'You' : comment.author.full_name}</span>
        {
          comment.link
          ? <Link
              className="system-comment__link"
              to={`/shipments/${(this.props.shipmentId || this.props.match!.params.id) + comment.link}`}
            >
              <span dangerouslySetInnerHTML={{__html: comment.content}} />
            </Link>
          : <span dangerouslySetInnerHTML={{__html: comment.content}} />
        }

      </div>
    )
  }

  private _renderOutgoing(comment: IComment, i: number) {
    return (
      <div>
        <div className="flex">
          {this._renderActions(comment)}
          {this._renderCommentContent(comment, true, i)}
        </div>
        <div className="comments__container__item__author">
          {this._renderAuthorPhoto(comment, i)}
        </div>
      </div>
    )
  }

  private _renderIncoming(comment: IComment, i: number) {
    return (
      <div>
        <div className="comments__container__item__author">
          {this._renderAuthorPhoto(comment, i)}
        </div>
        <div className="flex">
          {this._renderCommentContent(comment, false, i)}
          {this._renderActions(comment)}
        </div>
      </div>
    )
  }

  private _renderAuthorPhoto(comment: IComment, i: number) {
    if (this.state.comments.length !== i + 1 &&
      !this.state.comments[i+1].is_system &&
      moment(comment.created_at).format('D MMMM YYYY') === moment(this.state.comments[i+1].created_at).format('D MMMM YYYY') &&
      comment.author.id === this.state.comments[i+1].author.id
    ) { return null }

    if (comment.author.avatar_thumb) {
      return <img className="comments__container__item__author--avatar" src={comment.author.avatar_thumb} />
    } else {
      const authorInitials: string = `${comment.author.first_name[0] || ''}${comment.author.last_name[0] || ''}`;
      return <div className="comments__container__item__author--initials">{authorInitials}</div>
    }
  }

  private _renderCommentContent(comment: IComment, ownComment: boolean, i: number) {
    const mentioned: string = (
      comment.content.includes(`<span class='atwho-custom' data-atwho-id='${this.state.currentUserId}' data-atwho-type='User'>`) ||
      comment.content.includes(`<span class="atwho-custom" data-atwho-id="${this.state.currentUserId}" data-atwho-type="User">` )
    ) ? 'mentioned' : '';
    return (
      <div>
        <div className={`comments__container__item__content ${mentioned} flex`}>
          {ownComment ? this._renderUnpinIcon(comment) : null}
          <div className="flex-1">
            {this._renderReplyToComment(comment)}
            <span dangerouslySetInnerHTML={{__html: comment.content}}/>
            {comment.comment_attachments.map((attachment: ICommentAttachment, i: number) => this._renderAttachment(attachment) )}
          </div>
          {ownComment ? null : this._renderUnpinIcon(comment)}
        </div>
        {
          this.state.comments.length !== i + 1 &&
          !this.state.comments[i+1].is_system &&
          moment(comment.created_at).format('D MMMM YYYY') === moment(this.state.comments[i+1].created_at).format('D MMMM YYYY') &&
          comment.author.id === this.state.comments[i+1].author.id
          ? null
          : <div className="comments__container__item__references">
              <span className="comments__container__item__references--time">{moment(comment.created_at).format('hh:mm')}</span>
              {comment.author.id === this.state.currentUserId ? 'You' : comment.author.full_name}
            </div>
        }
      </div>
    )
  }

  private _renderUnpinIcon(comment: IComment): any {
    if (comment.pinned) {
      return (
        <div className="comments__container__item__content__unpin">
          <i className={`icon ${pinIcon}`} onClick={this.pinMessage.bind(this, comment)}/>
        </div>
      )
    }
  }

  private _renderReplyToComment(comment: IComment): any {
    if (comment.answered_comment_id) {
      const parentComment: IComment = this.state.comments.find((c: IComment) => c.id === comment.answered_comment_id);
      if (parentComment) {
        return (
          <div className="comments__container__item__content__reply">
            <div dangerouslySetInnerHTML={{ __html: `${parentComment.author.full_name}: ${parentComment.content}`}}/>
            {parentComment.comment_attachments.map((attach: ICommentAttachment) => <div key={attach.id}>{attach.original_filename}</div> )}
          </div>
        )
      }
    }
  }

  private _renderAttachment(attachment: ICommentAttachment, isReply?: boolean) {
    let fileName: string = attachment.original_filename;
    const stateName: string = `dropdown-${attachment.id}`;
    if (fileName.length >= 30) {
      fileName = `${fileName.substring(0,20)}...${fileName.substring(fileName.length - 6, fileName.length)}`
    }

    return (
      <span key={attachment.id} className="comments__container__item__content__attachment">
        <i className="icon paperclip"/>
        {
          isReply
            ? <span>{fileName}</span>
            :
              <span>
                <a href={attachment.file_url} target="_blank">{fileName}</a>
                <span
                  className="select-icon"
                  aria-owns={this.state[stateName]}
                  onClick={this.handleClick.bind(this, stateName)}
                  aria-haspopup="true"
                >‹</span>
        <Menu
          id="simple-menu"
          anchorEl={this.state[stateName]}
          open={Boolean(this.state[stateName])}
          onClose={this.handleClose.bind(this, stateName)}
        >
          <MenuItem onClick={this.handleItemClick.bind(this, attachment.id, stateName)}>Assign to Shipment</MenuItem>
        </Menu>
            </span>
        }
      </span>
    )
  }

  private _renderActions(comment: IComment) {
    return (
      <div className="comments__container__item__actions">
        {
          comment.pinned
            ? null
            : <i className={`icon ${pinIcon}`} onClick={this.pinMessage.bind(this, comment)}/>
        }
        <i className={`icon ${replyIcon}`} onClick={this.replyComment.bind(this, comment.id)}/>
      </div>
    )
  }

  private _renderFailedFiles(): any {
    if (this.state.failedFiles.length) {
      return (
        <div className="comments__form__inputs__base__invalid-files">
          {
            this.state.failedFiles.map((file: any) => {
              return <span className="file" key={file.name}>{`Invalid File extension at  ${file.name}`}</span>
            })
          }
        </div>
      )
    }
  }

  private _renderUploadedFiles(): any {
    if (this.state.filesToUpload.length) {
      return (
        <div className="comments__form__inputs__base__valid-files">
          {
            this.state.filesToUpload.map((file: any, i: number) => {
              return (
                <span key={i} className="file">
                  <i className="icon paperclip"/>
                  {file.name}
                  <i className="icon close" onClick={this.deleteFile.bind(this, i)}/>
                </span>
              )
            })
          }
        </div>
      )
    }
  }

  private _renderFollowers():any {
    return (
      <div className="comments__form__inputs__base--followers__thumbs">
        <div className="comments__form__inputs__base--followers">
          <style dangerouslySetInnerHTML={{__html: `
            .menu-button__menu {padding-bottom: 10px;}
            .menu-button__menu::before {opacity: 0}
            .menu-button__menu::after { content: '';
                                        width: 0.8rem;
                                        height: 0.8rem;
                                        left: 50%;
                                        bottom: -5px;
                                        border: 1px solid #ebedf0;
                                        -webkit-transform: rotate(45deg);
                                        -ms-transform: rotate(45deg);
                                        transform: rotate(45deg);
                                        position: absolute;
                                        background-color: white;
                                        border-left: none;
                                        border-top: none;
                                      }
          `}} />
          {this.state.followers.map((follower: IFollower, i: number) => this._renderSingleFollower(follower, i))}
          {
            this.state.followersSelect
            ? <MultiSelector
                onCancel={this.onFollowersSelectToggle}
                onClose={this.onFollowersSelectToggle}
                placement="top"
                title="Followers"
                fieldName="followers"
                options={this.state.users.map((follower: IFollower) => {
                  return [`${follower.first_name} ${follower.last_name}`,  follower.id]
                })}
                pickedOptionIds={this.state.followers.map((follower: IFollower) => follower.id)}
                onPickOption={this.setFollow.bind(this)}
              />
            : <i className="icon pencil" onClick={this.onFollowersSelectToggle}/>
          }
        </div>
        <div className="comments__form__inputs__base--followers__self">
          {
            this.state.followers.find((f) => f.id === this.state.currentUserId)
              ? <span>Following shipment. <a onClick={this.setFollow.bind(this, this.state.currentUserId)}><i className="icon notify"/> Unfollow </a></span>
              : <a onClick={this.setFollow.bind(this, this.state.currentUserId)}><i className="icon notify"/> Follow this shipment </a>
          }

        </div>
      </div>
    )
  }

  private _renderSingleFollower(follower: IFollower, i: number): any {
    const authorInitials: string = `${follower.first_name[0] || ''}${follower.last_name[0] || ''}`;
    return (
      <Tooltip title={follower.full_name} key={i}>
        {
          follower.mini_thumb
          ? <img className='thumb' src={follower.mini_thumb} key={i}/>
          : <span key={i} className="thumb" style={{backgroundColor: follower.color}}>{authorInitials}</span>
        }
      </Tooltip>
    )
  }

  private _renderReplyComment(): any {
    if (this.state.replyCommentId) {
      const replyComment: IComment = this.state.comments.find((c) => c.id === this.state.replyCommentId);
      return (
        <div className="comments__form__inputs__base__container__reply-comment">
          <i className="icon close" onClick={this.clearReply}/>
          <span dangerouslySetInnerHTML={{__html: replyComment.content}}/>
          {replyComment.comment_attachments.map((attachment: ICommentAttachment) => this._renderAttachment(attachment, true) )}
        </div>
      )
    }
  }

  @bind
  private IEScroll(x: number, y: number): void {
    this.commentsContainer.scrollTop = y;
  }

  private chatScrollBottom() {
    const messageId = get(this.props.match, 'params.messageId', -1);
    const messageElement = document.getElementById(`chat-comment-${messageId}`);

    let scrollTo: (x?: number, y?: number) => any = noop;
    if (this.commentsContainer.scrollTo){
      scrollTo = this.commentsContainer.scrollTo.bind(this.commentsContainer);
    } else {
      scrollTo = this.IEScroll;
    }


    if (messageElement) {
      const splitter: string = '/conversations';
      const url: string = window.location.href.split(splitter)[0];
      window.history.replaceState({}, document.title, `${url}${splitter}`);
      if(messageElement.getBoundingClientRect){
        scrollTo(0, messageElement.getBoundingClientRect().top - 300);
      }
    } else {
      scrollTo(0, this.commentsContainer.scrollHeight);
    }
  }

  private handleClose(state: string, event: any): void {
    this.setState({ [state]: null });
  }

  private handleClick(state: string, event: any): void {
    this.setState({ [state]: event.currentTarget });
  }

  private deleteFile(index: number) {
    const filesToUpload = this.state.filesToUpload.map((e) => e);
    filesToUpload.splice(index, 1);
    this.setState({ filesToUpload })
  }

  private handleUploadedFiles(files: any) {
    const filesToUpload: any = [].concat(this.state.filesToUpload);
    const failedFiles: any = [].concat(this.state.failedFiles);
    if (files) {
      Object.keys(files).forEach((key: any) => {
        const file: any = files[key];
        const valid: boolean = forbiddenFormats.test(file.name);
        valid ? failedFiles.push(file) : filesToUpload.push(file);
      })
    }
    this.setState({ filesToUpload, failedFiles }, () => {
      this.fileInput.value = null;
      setTimeout(() => { this.setState({ failedFiles: [] }) }, 6000)
    })
  }

  private replyComment(replyCommentId: number) {
    this.setState({ replyCommentId }, () => {
      window.scrollTo(0, document.body.scrollHeight);
    })
  }

  private async handleItemClick(attachmentId: string, stateName: string, event: any): Promise<any>{
    this.handleClose(stateName, event);
    try {
      await this.props.attachFileToShipment(this.props.shipmentId || this.props.match!.params.id, attachmentId);
      this.props.showSuccess('Comment Attachment save to Shipment Documents')
    } catch(error) {
      Logger.log(error)
    }
  }

  private async pinMessage(comment: IComment, event: any): Promise<any> {
    try {
      await this.props.pinComment(this.props.shipmentId || this.props.match!.params.id, comment.id);
      this.props.showSuccess(`Comment successfully ${comment.pinned ? 'Unpinned' : 'Pinned'}`)
    } catch(error) {
      Logger.log(error)
    }
  }

  private async setFollow(userId: number, event: any): Promise<any> {
    const user: any = this.state.users.find((f) => f.id === userId);
    const userFullName: string = userId === this.state.currentUserId ? 'You have' : `${user.first_name} ${user.last_name} has`;
    if (!!this.state.followers.find((f) => f.id === userId)) {
      this.props.showError(`${userFullName} has been removed from chat followers.`);
    } else {
      this.props.showSuccess(`${userFullName} been added to this chat as a follower.`);
    }

    try {
      await this.props.toggleChatFollow(this.props.shipmentId || this.props.match!.params.id, userId);

    } catch(error) {
      Logger.log(error)
    }
  }

  private onBlur(content: string, event: any): any {
    clearInterval(this.state.interval);
    this.setState({ content, interval: null })
  }

  private onFocus(event: any):any {
    this.setState({ interval: setInterval(() => { this.actionCableShipmentRef.perform('typing', {}) }, 2000)})
  }

  private mentionAreaSubmit(content: string, event: any): any {
    this.setState({ content }, () => { this.submit() })
  }

  @bind
  private onReceived(data) {
    if (!this.props.impersonator) {

      if (data.message_type === 'unread_count') {
        if (data.message > 0) {
          this.actionCableRef.perform('mark_shipment_comments_read', {shipment_id: this.props.shipmentId || this.props.match!.params.id});
        }
      } else if (data.message_type === 'unread_notifications') {
        this.actionCableRef.perform('mark_shipment_comments_read', {shipment_id: this.props.shipmentId || this.props.match!.params.id});
      }
    }
  }

  @bind
  private onReceivedShipment(data) {
    switch(data.message_type) {
      case 'chat_message': {
        const comments = unionBy(this.state.comments, [data.message.data.comment], 'id');
        this.props.saveConversation({chat_comments: comments});
        break;
      }

      case 'deleted_message': {
        const comments = this.state.comments.filter((c: IComment) => c.id !== data.message.data.comment.id);
        this.props.saveConversation({chat_comments: comments});
        break;
      }

      case 'pin_comment': {
        const chat_comments: IComment[] = this.state.comments.map((comment: IComment) => {
          if (comment.id === data.message.data.comment.id) {
            comment.pinned = data.message.data.comment.pinned
          }
          return comment;
        });
        this.props.saveConversation({ chat_comments });
        break;
      }

      case 'followers': {
        const { mentionables, users } = this.state;
        this.props.saveFollowers({ followers: { followers: data.message.followers }, mentionables, users });
        break;
      }

      case 'typing': {
        if (data.message.user_id !== this.state.currentUserId && data.message.user_type !== 'User') {
          const typerName: string = data.message.full_name;
          const typersNames = this.state.typersNames.slice();
          typersNames.push(typerName);
          this.setState({
            typers: unionBy(this.state.typers, [data.message], 'user_id', 'user_type'),
            typersNames,
          }, () => {
            setTimeout(() => {
              const index = this.state.typersNames.indexOf(typerName);
              let typersNames = this.state.typersNames.slice();
              typersNames.splice(index, 1);
              this.setState({ typersNames, typers: this.state.typers.filter(typer => typersNames.includes(typer.full_name)) })
            }, 3000)
          })
        }
        break;
      }

      default: {
        Logger.log('Broadcast for: ', data.message_type);
        break;
      }
    }
  }

  @bind
  private uploadFile(event: any) {
    this.handleUploadedFiles(event.target.files)
  }

  @bind
  private onDrag() {
    if (!this.state.hover) {this.setState({hover:true})}
  }

  @bind
  private onDragOut() {
    if (this.state.hover) {this.setState({hover:false})}
  }

  @bind
  private onFollowersSelectToggle() {
    this.setState({followersSelect: !this.state.followersSelect})
  }

  @bind
  private onDrop(files) {
    this.handleUploadedFiles(files);
    this.setState({hover:false});
  }

  @bind
  private clearReply(event: any) {
    this.setState({replyCommentId: null})
  }

  @bind
  private async submit(): Promise<any>{
    try {
      const {formData, valid} = prepareForRequest(this.state);
      if (valid) {
        this.mentionAreaRef.clearInput();
        this.setState({ filesToUpload: [], failedFiles: [], replyCommentId: null });
        await this.props.submit(
          formData,
          this.props.shipmentId || this.props.match!.params.id
        );
      } else {
        this.setState({invalid: true}, () => {
          setTimeout(() => { this.setState({invalid: false}) }, 2000)
        })
      }
    } catch(error) {
      Logger.log(error)
    }
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(ShipmentsConversation);
