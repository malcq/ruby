import React from 'react';
import styled from 'styled-components';

import {
  IAction,
  ISelectedAction,
  IStateFreeText,
} from '../../../../models/chat';

import Datepicker from '../../../UI/Datepicker';
import { Button, ContinueButton } from '../../../UI/Buttons';
import RootPortal from '../../../UI/RootPortal';

import { getFancyDate, getActionState } from '../../../../utils';
import { EActionStates } from '../../../../utils/constants';

const getInitialValue = (
  action: IAction,
  selected?: ISelectedAction,
): Date => {
  if (!selected) { return new Date(); }
  if (selected.actionId !== action.id) { return new Date(); }

  const message = (selected.state as IStateFreeText).message;

  if (!message) { return new Date(); }

  const timestamp = Date.parse(message);
  if (isNaN(timestamp)) { return new Date(); }

  return new Date(timestamp);
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateFreeText) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  actionDisabled: boolean;
};
const DateType: React.FC<Props> = (props) => {
  const { action, selected } = props;

  const [date, setDate] = React.useState<Date>(
    () => getInitialValue(action, selected)
  );

  const canSubmit = !!date;

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = state === EActionStates.selected;

  const facnyDateTitle = React.useMemo((): string => {
    return getFancyDate(date);
  }, [date]);

  function mapStateToRedux(value: Date): IStateFreeText {
    return {
      message: value.toUTCString(),
    }
  }

  function onDateChange(date: Date) {
    setDate(date);
  }

  function onActionReply() {
    const state = mapStateToRedux(date);
    props.onActionReply(action, state);
  }

  function onActionRollback() {
    props.onRollbackAction(action);
  }

  return (
    <StyledContainer>
      {!selectedState && (
        <>
          <Datepicker
            selectedDate={date}
            onChange={onDateChange}
          />
          <div className="date-type__divider" />
          <RootPortal>
            <ContinueButton
              disabled={!canSubmit}
              onClick={onActionReply}
            >
              Continue
            </ContinueButton>
          </RootPortal>
        </>
      )}

      {selectedState && (
        <StyledButton
          outlined
          onClick={onActionRollback}
          color="selected"
          disabled={props.actionDisabled}
        >
          {facnyDateTitle}
        </StyledButton>
      )}
    </StyledContainer>
  )
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;

  .date-type__divider {
    width: 100%;
    background-color: rgba(0,0,0,0.10);
    height: 1px;
    margin-bottom: 60px;
    margin-top: 8px;
  }
`;

// const ContinueButton = styled(Button)`
//   min-width: 160px;
//   align-self: flex-end;
//   margin-right: 23px;
//   color: white;
//   border-color: ${props => props.theme.colorValues.primary};
// `;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
  align-self: flex-end;
  margin-right: 23px;
`;

export default DateType;