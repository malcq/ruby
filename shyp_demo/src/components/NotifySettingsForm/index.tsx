import React, { PureComponent, ReactNode, ReactNodeArray } from 'react';
import bind from 'autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { entries, chain } from 'lodash';

import { FormLayout, FormFieldGroup, FormCheck } from '../';
import { withoutNullFields, promisifyAction } from "../../utils";
import { flashSuccess, userSubmitNotifications } from '../../stores/actionCreators';
import './styles.scss';

type IGroups = Map<string, IUserNotification[]>

interface INotificationRequestEntry{
  id: string | number,
  enabled: boolean,
}

const serializeForRequest = ([id, enabled]: [string | number, boolean]):INotificationRequestEntry => ({ id, enabled });

interface INotifySettingsFormProps {
  submit: IActionPromiseFactory;
  showNotificationUpdated: (message: string) => void;
  notifications: IUserNotification[];
}

interface INotifySettingsFormState {
  notifications: { [x:string]: boolean | null };
  busy: boolean;
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, userSubmitNotifications),
  showNotificationUpdated(message: string): void{ dispatch(flashSuccess(message)); },
});


const mapStateToProps = (state: IGlobalState): any => ({
  notifications: state.user.notifications,
});


const groupOrder: any = {
  'Shipping': 1,
  'Quote': 2,
  'Conversation': 3,
  'Other': 4,
};

const groupSorting = ( g1: any[] ): number => groupOrder[g1[0]] || 0;

const initialState = { notifications: {}, busy: false };


class NotifySettingsForm extends PureComponent<INotifySettingsFormProps, INotifySettingsFormState> {

  public static propTypes = {
    submit: PropTypes.func.isRequired,
    showNotificationUpdated: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      typeId: PropTypes.string,
      name: PropTypes.string,
      group: PropTypes.string,
      enabled: PropTypes.bool,
    })),
  };

  public static defaultProps = {
    notifications: []
  };

  constructor (props, context) {
    super(props, context);
    this.state=initialState;
  }

  public render () {
    return (
      <FormLayout
        label="Notification settings"
        buttonText="Update notification settings"
        icon="restaurant"
        submit={this.submit}
      >
        {this.renderGroups()}
      </FormLayout>
    );
  }

  @bind
  private renderField(notification: IUserNotification): ReactNode{
    return(
      <div
        className="notify-settings-form__check-field"
        key={notification.id}
      >
        <FormCheck
          field={notification.id}
          label={notification.name}
          value={this.state.notifications[notification.id]}
          fallbackValue={notification.enabled}
          onChange={this.handleFieldChange}
        />
      </div>
    )
  }

  @bind
  private renderGroups(){
    return chain(this.props.notifications)
      .sortBy('typeId')
      .groupBy('group')
      .entries()
      .sortBy(groupSorting)
      .map(([group, notifications]: any[]): any => (
        <FormFieldGroup
          key={group}
          label={group}
        >
          <div className="notify-settings-form__group-content">
            {notifications.map(this.renderField)}
          </div>
        </FormFieldGroup>
      ))
      .value()
  }

  @bind
  private handleFieldChange(field: string | number, value: any): void{
    this.setState((state: INotifySettingsFormState): Pick<INotifySettingsFormState, "notifications"> => ({
      notifications: { ...state.notifications, [field]: value }
    }))
  }

  @bind
  private async submit(): Promise<any>{
    this.setState({ busy: true });
    try {
      await this.props.submit({
        notifications: entries(withoutNullFields(this.state.notifications))
          .map(serializeForRequest)
      });
      this.setState(initialState);
      this.props.showNotificationUpdated('Notification settings updated');
    } catch(error) {
      this.setState({ busy: false });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifySettingsForm);
