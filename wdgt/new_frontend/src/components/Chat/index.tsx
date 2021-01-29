import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import FlipMove from 'react-flip-move';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { IAction, ISelectedState } from '../../models/chat';
import ChatBlock from './ChatBlock';
import { IChatStore, IAppStore } from '../../store/types';
import {
  EAnimationSteps,
  EActionHeightTypes,
  CHAT_DURATIONS,
} from '../../utils/constants';

type Props = {
  chatStore: IChatStore,
  onActionReply: (
    action: IAction,
    blockId: string,
    state: ISelectedState,
  ) => Promise<any>;
  onRollbackAction: (
    action: IAction,
    blockId: string,
  ) => void;
  setActionDisable: (value: boolean) => void,
}
const Chat: React.FC<Props> = (props) => {
  const {
    chatStore: {
      chatBlockEntities,
      chatBlocks,
    },
  } = props;

  const firstBlockId = chatBlocks.length ? chatBlocks[0] : undefined;

  const blocks = useMemo(() => {
    if (chatBlocks.length > 1) {
      return [
        chatBlocks[chatBlocks.length - 1],
        chatBlocks[chatBlocks.length - 2],
      ]
    }
    if (chatBlocks.length) {
      return [
        chatBlocks[0],
      ]
    }
    return [];
  }, [chatBlocks]);

  function onFlipEnd() {
    props.setActionDisable(false);
  }

  return (
    <ChatContainer>
      <FlipMove
        typeName={null}
        duration={CHAT_DURATIONS.chat.flipAnimation * 1000}
        easing="cubic-bezier(0.39, 0.575, 0.565, 1)"
        onFinishAll={onFlipEnd}
      >
        {blocks.map((chatBlockId: string, index) => {
          const currentAnimationStep = getCurrentAnimationStep(index);
          const chatBlock = chatBlockEntities[chatBlockId];
          const heightType = chatBlock.heightType;

          return (
            <BlockContainer
              className={currentAnimationStep}
              fullWidth={heightType === EActionHeightTypes.fullWindow && currentAnimationStep === 'pristine'}
              key={chatBlockId}
              id={`${currentAnimationStep}_block`}
            >
              <ChatBlock
                onActionReply={props.onActionReply}
                chatBlock={chatBlock}
                animate={currentAnimationStep}
                className={currentAnimationStep}
                onRollbackAction={props.onRollbackAction}
                showAvatar={firstBlockId === chatBlockId}
                heightType={heightType}
              />
            </BlockContainer>
          )
        })}
      </FlipMove>
    </ChatContainer>
  );
}

/**
 * Returns chat block state step by index
 *
 * Bottom element is `pristine`, it has `0` index
 * Middle element is `selected`, it has `1` index
 * 
 * If index is not `0 or 1` return `selected`
 */
const getCurrentAnimationStep = (index: number): EAnimationSteps => {
  switch (index) {
    case 0:
      return EAnimationSteps.pristine;
    case 1:
    default:
      return EAnimationSteps.selected;
  }
};

const ChatContainer = styled.div`
  background-color: ${props => props.theme.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow-x: hidden;
  overflow-y: hidden;
  
  /* 
   * ⚠️ Experimental fix for iphone overflow on scroll
   * Fixes upper selected action cutting
   */
  height: 100%;
  position: static;
`;

type BlockContainerProps = {
  fullWidth: boolean;
};
const BlockContainer = styled.div<BlockContainerProps>`
  /* overflow-x: hidden; */
  width: 100%;
    ${props => props.fullWidth
      ? css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `
      : null
    };

  &.pristine {
    max-height: 100%;

    /* ⚠️ Enabling smooth scroll for iphone */
    -webkit-overflow-scrolling: touch;

    overflow-x: hidden;
    position: absolute;
    bottom: 0;
    z-index: 10;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &.selected {
    overflow-y: hidden;
    position: absolute;
    bottom: 100%;
    transform: translateY(82px);
  }
`;

const mapStateToProps = (state: IAppStore) => {
  return {
    chatStore: state.chatStore,
  }
}

const reduxConnect = connect(
  mapStateToProps,
)

export default compose(
  reduxConnect,
)(Chat);