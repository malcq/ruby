import React from 'react';
import styled from 'styled-components';
import { motion, MotionProps, AnimationProps, Variants } from 'framer-motion';

import Action from './Action';
import {
  IAction,
  ISelectedAction,
  ISelectedState,
} from '../../../models/chat';
import { getActionState } from '../../../utils/index';
import {
  EActionStates,
  CHAT_DURATIONS,
} from '../../../utils/constants';

type Props = {
  actions: IAction[];
  selected?: ISelectedAction;
  blockId: string;
  onActionReply: (
    action: IAction,
    blockId: string,
    state: ISelectedState,
  ) => Promise<any>;
  onRollbackAction: (
    action: IAction,
    blockId: string,
  ) => void;
  animate: any,
}
const InputList: React.FC<Props> = (props) => {
  const {
    actions,
    selected,
    animate
  } = props;

  function onActionReply(action: IAction, state: ISelectedState) {
    return props.onActionReply(action, props.blockId, state);
  }

  function onRollbackAction(action: IAction) {
    return props.onRollbackAction(action, props.blockId);
  }

  return (
    <StyledList className={animate} >
      {actions.map((action) => {
        const isSelectedAction = (selected && selected.actionId) === action.id;
        const actionState = getActionState(action, selected);

        return (
          <motion.div
            key={action.id}
            className={isSelectedAction ? 'chosed' : ''}
            animate={actionState}
            variants={actionVariants}
            transition={actionTransition}
            initial={getActionInitial(isSelectedAction)}
          >
            <Action
              action={action}
              selected={selected}
              onActionReply={onActionReply}
              onRollbackAction={onRollbackAction}
            />
          </motion.div>
        )
      })}
    </StyledList>
  )
}

/**
 * ACTION ANIMATION VARIANTS
 */
const actionVariants: Variants = {
  [EActionStates.notSelected]: {
    translateX: '100%'
  },
  [EActionStates.pristine]: {
    translateX: 0,
  },
  [EActionStates.selected]: {
    translateX: 0,
  },
}

/**
 * ACTION ANIMATION INITIAL
 */
const getActionInitial = (
  isSelectedAction: boolean
): MotionProps['initial'] => {
  if (isSelectedAction) {
    return {
      translateX: 0
    }
  }

  return {
    translateX: '100%'
  }
}

/**
 * ACTION ANIMATION TRANSITION
 */
const actionTransition: AnimationProps['transition'] = {
  type: 'tween',
  duration: CHAT_DURATIONS.actions.duration, 
}

const StyledList = styled.ul`
  /* overflow: hidden; */
  padding: 0;
  margin: 0;
  list-style-type: none;
  /* margin-bottom: 40px; */
  padding-bottom: 40px;

  & > div {
    margin-bottom: ${props => props.theme.distances.actionDistance};
    word-break: break-word;
  }
  
  &.selected > div,
  & > div:last-child {
    margin-bottom: 0;
  }

  &.pristine {
    background: linear-gradient(
      to top,
      rgba(255,255,255,0) 0%,
      rgba(255, 255, 255, 0.7) 10%,
      rgba(255, 255, 255, 0.7) 100%
    );
  }

  &.selected > div {
    /* height: 0; */
    display: none;
  }

  &.selected > .chosed {
    /* height: auto; */
    display: block;
  }
`;

export default InputList;