import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { IAction, ISelectedAction, ISelectedState } from '../../../../models/chat';
import {
  ACTION_TYPES
} from '../../../../utils/constants';

import ButtonAction from './ButtonAction';
import FreeText from './FreeText';
import CallButton from './CallButton';
import Media from './Media';
import Autocomplete from './Autocomplete';
import DataType from './DataType';
import Roller from './Roller';
import TimeType from './TimeType';
import DateType from './DateType';
import Select from './Select';
import FullNameType from './FullNameType';
import BicType from './BicType';
import IbanType from './IbanType';
import CustomFormType from './CustomFormType';


import { IAppStore } from '../../../../store/types';

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: ISelectedState) => Promise<any>;
  onRollbackAction: (action: IAction) => any;
  actionDisabled: boolean,
};
const Input: React.FC<Props> = (props) => {
  const {
    action,
    selected,
  } = props;

  switch (action.type) {
    case ACTION_TYPES.button:
      return (
        <ButtonAction
          actionDisabled={props.actionDisabled}
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
        />
      );
    case ACTION_TYPES.freeText:
      return (
        <FreeText
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
          actionDisabled={props.actionDisabled}
        />
      );
    case ACTION_TYPES.phoneCall:
      return (
        <CallButton
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
        />
      );
    case ACTION_TYPES.media:
      return (
        <Media
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
        />
      );
    case ACTION_TYPES.autocomplete:
      return (
        <Autocomplete
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
        />
      );
    case ACTION_TYPES.dataType:
      return (
        <DataType
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
          actionDisabled={props.actionDisabled}
        />
      );
    case ACTION_TYPES.roller:
      return (
        <Roller
          action={action}
          selected={selected}
          onActionReply={props.onActionReply}
          onRollbackAction={props.onRollbackAction}
        />
      );
    case ACTION_TYPES.timepicker:
      return (
        <TimeType
          action={action}
          selected={selected}
          onRollbackAction={props.onRollbackAction}
          onActionReply={props.onActionReply}
          actionDisabled={props.actionDisabled}
        />
      );
    case ACTION_TYPES.datepicker:
      return (
        <DateType
          action={action}
          selected={selected}
          onRollbackAction={props.onRollbackAction}
          onActionReply={props.onActionReply}
          actionDisabled={props.actionDisabled}
        />
      );
    case ACTION_TYPES.select:
    case ACTION_TYPES.selectWithRouting:
    case ACTION_TYPES.selectLink:
        return (
          <Select
            onActionReply={props.onActionReply}
            selected={selected}
            onRollbackAction={props.onRollbackAction}
            action={props.action}
          />
        );
    case ACTION_TYPES.fullnameForm:
        return (
          <FullNameType
            action={props.action}
            actionDisabled={props.actionDisabled}
            selected={selected}
            onRollbackAction={props.onRollbackAction}
            onActionReply={props.onActionReply}
          />
        );
      case ACTION_TYPES.bicNumber:
        return (
          <BicType
            action={props.action}
            actionDisabled={props.actionDisabled}
            selected={selected}
            onRollbackAction={props.onRollbackAction}
            onActionReply={props.onActionReply}
          />
        );
      case ACTION_TYPES.ibanNumber:
        return (
          <IbanType
            action={props.action}
            actionDisabled={props.actionDisabled}
            selected={selected}
            onRollbackAction={props.onRollbackAction}
            onActionReply={props.onActionReply}
          />
        );
      case ACTION_TYPES.customForm:
        return (
          <CustomFormType
            action={props.action}
            actionDisabled={props.actionDisabled}
            selected={selected}
            onRollbackAction={props.onRollbackAction}
            onActionReply={props.onActionReply}
          />
        );
    default:
      return null;
  }
};

const mapStateToProps = (state: IAppStore) => {
  return {
    actionDisabled: state.chatStore.disableActions,
  }
}

const reduxConnect = connect(
  mapStateToProps
);

export default compose(
  reduxConnect,
)(Input);
