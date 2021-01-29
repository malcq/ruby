import React from 'react';

import TextMessage from './TextMessage';
import LinkMessage from './LinkMessage';

import { IMessage } from '../../../../models/chat';
import { MESSAGE_TYPES } from '../../../../utils/constants';

type Props = {
  message: IMessage;
};

const Message: React.FC<Props> = (props) => {
  const { message } = props;

  switch (message.type) {
    case MESSAGE_TYPES.link:
      return (
        <LinkMessage
          message={message}
        />
      );
    case MESSAGE_TYPES.text:
    default:
      return (
        <TextMessage
          message={message}
        />
      )
  } 
}

export default Message;
