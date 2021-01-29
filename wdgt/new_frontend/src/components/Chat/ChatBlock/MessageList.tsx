import * as React from 'react';
import styled from 'styled-components';
import {
  motion,
  Variants,
  MotionProps,
} from 'framer-motion';

import Message from './Message';

import { CHAT_DURATIONS } from '../../../utils/constants';
import { IMessage } from '../../../models/chat';

type Props = {
  messages: IMessage[],
  animate: string;
}
const MessageList: React.FC<Props> = (props) => {
  const { messages } = props;

  return (
    <StyledContainer
      variants={messageListVariants}
      initial={messageListInitial}
      animate={props.animate}
      className={props.animate}
    >
      {messages.map((message, index) => (
        <MessageContainer key={message.id} message={messages[index + 1]}>
          <Message
            message={message}
          />
        </MessageContainer>
        )
      )}
    </StyledContainer>
  )
}

const StyledContainer = styled(motion.div)`
  padding-bottom: 30px;
  /* flex-grow: 1; */

  &.pristine {
    background: linear-gradient(
      to bottom, rgba(255,255,255,0) 0%,
      rgba(255, 255, 255, 0.7) 10%,
      rgba(255, 255, 255, 0.7) 100%
    );
  }

  & > div:last-child {
    margin-bottom: 0 !important;
  }
`;

type MessageContainerProps = {
  message?: IMessage;
}
const MessageContainer = styled.div<MessageContainerProps>`
  margin-bottom: 15px;
`;

/**
 * MESSAGES ANIMATION VARIANTS
 */
const messageListVariants: Variants = {
  pristine: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'tween',
      duration: CHAT_DURATIONS.messageList.pristine,
    }
  },
  selected: {
    opacity: 0.3,
    scale: 0.8,
    transition: {
      type: 'tween',
      duration: CHAT_DURATIONS.messageList.selected,
    },
  },
}

/**
 * MESSAGES ANIMATION INITIAL
 */
const messageListInitial: MotionProps["initial"] = {
  opacity: 0,
  scale: 0.9,
}

export default MessageList;