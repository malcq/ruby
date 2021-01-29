import React, { PureComponent } from 'react'
import { compose, withProps } from "recompose"
import { MentionsInput, Mention } from 'react-mentions'
import bind from 'autobind-decorator';

interface IMentionAreaProps {
  [x:string]: any,
}

interface IMentionAreaState {
  [x:string]: any,
}

const markup: string = "<span class='atwho-custom' data-atwho-id='__id__' data-atwho-type='__type__'>@__display__</span>";

class MentionArea extends PureComponent<IMentionAreaProps, IMentionAreaState> {

  constructor (props, context) {
    super(props, context);
    this.state = {
      value: '',
      mentionables: props.mentionables,
    };
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({ mentionables: nextProps.mentionables });
  }

  public clearInput() {
    this.setState({value: ''})
  }

  public render () {
    return (
      <MentionsInput
        onKeyDown={this.onEnterPress}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        value={this.state.value || ''}
        markup={markup}
        rows={4}
        placeholder="Type your message - use @name to add someone to the conversation"
        className="comments__form__inputs__base__container--input"
        displayTransform={this.transformMention}
      >
        <Mention trigger="@" appendSpaceOnAdd={true} data={this._renderMentionables('admin_users')} type="AdminUser"/>
        <Mention trigger="@" appendSpaceOnAdd={true} data={this._renderMentionables('users')} type="User"/>
      </MentionsInput>
    );
  }

  private _renderMentionables(type: string) {
    return (this.state.mentionables[type] || []).map((user: any) => {
      const name: string = `${user.first_name} ${user.last_name}`;
      return {id: user.id, display: name, type: user.type}
    })
  }

  private transformMention (id: number, display: string, type: string): string {
    return `@${display}`
  }

  @bind
  private onChange(event: any) {
    this.setState({value: event.target.value});
  }

  @bind
  private onBlur(event: any) {
    this.props.onBlur(this.state.value)
  }

  @bind
  private onFocus(event: any) {
    this.props.onFocus(event)
  }

  @bind
  private onEnterPress(event: any) {
    if(event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.props.submit(this.state.value)
    }
  }
}

export default MentionArea;
