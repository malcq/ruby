import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  IAction,
  ISelectedAction,
  IStateFreeText,
} from '../../../../models/chat';

import { IAppStore } from '../../../../store/types';

import TimePickerDesktop from '../../../UI/TimePickerDesktop';
import TimePickerMobile from '../../../UI/TimePickerMobile';

import { Button } from '../../../UI/Buttons';

import { getFancyTime, getActionState } from '../../../../utils';
import { EActionStates } from '../../../../utils/constants';

const getInitialValue = (
  action: IAction,
  selected?: ISelectedAction,
): string | undefined => {
  if (!selected) { return undefined; }
  if (selected.actionId !== action.id) { return undefined; }

  const message = (selected.state as IStateFreeText).message;

  return message;
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateFreeText) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  isMobile: boolean;
  actionDisabled: boolean;
};
const TimeType: React.FC<Props> = (props) => {
  const { isMobile, action, selected } = props;

  const [time, setTime] = React.useState<string|undefined>(
    () => getInitialValue(action, selected)
  );

  const placeholder = "Select time";

  const canSubmit = !!time;

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = state === EActionStates.selected;

  const fancyTimeTitle = React.useMemo((): string => {
    return getFancyTime(time);
  }, [time]);

  function mapStateToRedux(value: string): IStateFreeText {
    return {
      message: value,
    }
  }

  function onTimeChange(time: string) {
    setTime(time);
  }

  function onActionReply() {
    const state = mapStateToRedux(time||'');
    props.onActionReply(action, state);
  }

  function onActionRollback() {
    props.onRollbackAction(action);
  }

  return (
    <StyledContainer selected={selectedState}>
      {!selectedState && (
        <>
          {!isMobile 
            ? (
              <TimePickerDesktop
                placeholder={placeholder}
                selectedValue={time}
                onChange={onTimeChange}
              />
            )
            : (
              <TimePickerMobile
                placeholder={placeholder}
                selectedValue={time}
                onChange={onTimeChange}
              />
            )
          }
          <ContinueButton
            disabled={!canSubmit}
            onClick={onActionReply}
          >
            Continue
          </ContinueButton>
        </>
      )}

      {selectedState && (
        <StyledButton
          outlined
          onClick={onActionRollback}
          color="selected"
          disabled={props.actionDisabled}
        >
          {fancyTimeTitle}
        </StyledButton>
      )}
    </StyledContainer>
  );
}
type StyledContainerProps = {
  selected?: boolean;
}
const StyledContainer = styled.div<StyledContainerProps>`
  padding: 0 24px;
  display: flex;
  flex-direction: column;

  align-items: ${props => props.selected ? 'flex-end' : 'stretch'};
`;


const ContinueButton = styled(Button)`
  min-width: 160px;
  align-self: flex-end;
  margin-top: 30px;
  margin-right: 0;
  color: white;
  border-color: ${props => props.theme.colorValues.primary};
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
  align-self: flex-end;
  margin-right: 23px;
`;

const mapStateToProps = (state: IAppStore) => ({
  isMobile: state.widgetStore.isMobile,
});

const reduxConnect = connect(
  mapStateToProps,
);

export default compose(
  reduxConnect,
)(TimeType);
