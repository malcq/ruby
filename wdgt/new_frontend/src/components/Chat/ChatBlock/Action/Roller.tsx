import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  IAction,
  ISelectedAction,
  IStateRoller,
} from '../../../../models/chat';

import { IOption } from '../../../../models/select';
import { IAppStore } from '../../../../store/types';

import RollerDesktop from '../../../UI/RollerDesktop';
import RollerMobile from '../../../UI/RollerMobile';

import { Button } from '../../../UI/Buttons';

import { getActionState } from '../../../../utils';
import { EActionStates } from '../../../../utils/constants';

const getInitialOption = (
  isMobile: boolean,
  action: IAction,
  selected?: ISelectedAction,
): IOption | undefined => {
  const values: IOption[] = action.options.values;

  if (isMobile) {
    if (!selected) { return undefined; }
    if (action.id !== selected.actionId) {
      return undefined;
    }

    const selectedOption = (selected.state as IStateRoller).option;

    const item = values.find((option) => option.title === selectedOption.title);
    if (!item) { return values[0]; }
    return item;
  } else {

    if (!selected) { return undefined; }
    if (action.id !== selected.actionId) {
      return undefined;
    }

    const selectedOption = (selected.state as IStateRoller).option;

    const item = values.find((option) => option.title === selectedOption.title);
    if (!item) { return values[0]; }
    return item;
  }

}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateRoller) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  isMobile: boolean;
};
const Roller: React.FC<Props> = (props) => {
  const { isMobile, action, selected } = props;

  const { options } = action;

  const selectItems: IOption[] = options.values;

  const [selectedValue, setSelectedValue] = React.useState<IOption | undefined>(
    () => getInitialOption(isMobile, action, selected)
  );

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = state === EActionStates.selected;
  const selectedTitle = React.useMemo((): string => {
    if (!selectedValue) { return ''; }
    if (selectedValue.title) { return selectedValue.title; }
    return '';
  }, [selectedValue]);

  const canSubmit = !!selectedValue;

  function mapStateToRedux(value: IOption): IStateRoller {
    return {
      option: value,
    }
  }

  function onValueChange(option: IOption) {
    setSelectedValue(option);
  }

  function onActionClicked() {
    if (selectedState) {
      return props.onRollbackAction(action);
    }

    if (!selectedValue) { return; }

    const state = mapStateToRedux(selectedValue);
    return props.onActionReply(action, state);
  }

  return (
    <StyledContainer selected={selectedState}>
      {!selectedState && (
        <>
          {!isMobile 
            ? (
              <RollerDesktop
                values={selectItems}
                placeholder="Select item"
                selectedValue={selectedValue}
                onChange={onValueChange}
              />
            )
            : (
              <RollerMobile
                values={selectItems}
                selectedValue={selectedValue}
                onChange={onValueChange}
              />
            )
          }
          <ContinueButton
            disabled={!canSubmit}
            onClick={onActionClicked}
          >
            Continue
          </ContinueButton>
        </>
      )}
      {selectedState && (
        <StyledButton
          outlined
          onClick={onActionClicked}
          color="selected"
        >
          {selectedTitle}
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
  margin-top: 30px;
  min-width: 160px;
  align-self: flex-end;
  color: white;
  border-color: ${props => props.theme.colorValues.primary};
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
`;

const mapStateToProps = (state: IAppStore) => ({
  isMobile: state.widgetStore.isMobile,
});

const reduxConnect = connect(
  mapStateToProps,
);



export default compose(
  reduxConnect,
)(Roller);
