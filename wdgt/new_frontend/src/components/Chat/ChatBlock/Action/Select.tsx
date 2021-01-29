import React from 'react';
import styled from 'styled-components';

import Select from '../../../UI/Select';

import { IAction, ISelectedAction, ISelectedState, IStateSelector } from '../../../../models/chat';

import { IOption } from '../../../../models/select';

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: ISelectedState) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
};
const SelectType: React.FC<Props> = (props) => {

  const { action } = props;

  const { options } = action;

  const selectItems: IOption[] = options.values;

  const initialSelected = React.useMemo(() => {
    const { selected } = props;
    if (!selected) { return []; }
    if (selected.actionId !== action.id) { return []; }
    if (!selected.state) { return []; }
    const state = selected.state as IStateSelector;
    return state.selected;
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.selected]);

  function mapStateToRedux(selected: string[]) {
    return {
      selected,
    }
  }

  function onActionClick(selected: string[]) {
    const state = mapStateToRedux(selected)

    props.onActionReply(action, state)
    // switch (state) {
    //   case EActionStates.selected:
    //     return props.onRollbackAction(action);
    //   case EActionStates.pristine:
    //     return props.onActionReply(action, null);
    //   case EActionStates.notSelected:
    //   default:
    //     return;
    // }
  }

  function onRollbackClick() {
    return props.onRollbackAction(action);
  }

  const isSelectedState = !!props.selected;

  return (
    <StyledContainer>
      <Select
        enableSearch={action.options.enableSearch}
        values={selectItems}
        multiselect={action.options.multiselect}
        searchId={options.searchId}
        onContinue={onActionClick}
        onCancel={onRollbackClick}
        initialSelected={initialSelected}
        selectedState={isSelectedState}
        placeholder={action.options.title}
      />
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  /* height: 550px; */
`;

export default SelectType;
