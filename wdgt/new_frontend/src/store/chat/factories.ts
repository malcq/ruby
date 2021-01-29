import uuid from 'uuid/v4';

import {
  IAction,
  IChatBlock,
  IMessage,
  ISelectedAction
} from '../../models/chat';
import {
  ACTION_TYPES,
  MESSAGE_TYPES,
} from '../../utils/constants';

import { EActionHeightTypes } from '../../utils/constants';

/**
 * MESSAGE FACTORIES
 */
type MessageFactoryOptions = {
  options?: {
    [key: string]: any,
  },
  id?: string;
  type?: string;
}
export function createMessage(options: MessageFactoryOptions = {}): IMessage {
  const {
    options: messageOptions = {},
    id = `msg-${uuid()}`,
    type = MESSAGE_TYPES.text,
  } = options;

  return {
    options: messageOptions,
    id,
    type,
  }
}

type MessageCommonFactoryOptions = {
  id?: string;
  text?: string;
}
export function createMessageCommon(options: MessageCommonFactoryOptions = {}): IMessage {
  const type = MESSAGE_TYPES.text;
  const {
    id,
    text = 'Sample title lorem ipsum etc and other stuff'
  } = options;

  return createMessage({
    id,
    options: {
      text,
    },
    type,
  });
}

type MessageLinkFactoryOptions = {
  id?: string;
}
export function createMessageLink(options: MessageLinkFactoryOptions = {}): IMessage {
  const type = MESSAGE_TYPES.link;
  const {
    id,
  } = options;

  return createMessage({
    id,
    // options: {
    //   text,
    // },
    type,
  });
}

/**
 * ACTION FACTORIES
 */
type ActionFactoryOptions = {
  options?: {
    [key: string]: any,
  },
  id?: string;
  type?: string;
};
export function createAction(options: ActionFactoryOptions = {}): IAction {
  const {
    id = `act-${uuid()}`,
    options: actionOptions = {},
    type = ACTION_TYPES.button,
  } = options;

  return {
    options: actionOptions,
    id,
    type,
  }
}

type ActionButtonFactoryOptions = {
  title?: string;
  id?: string;
};
export function createActionButton(options: ActionButtonFactoryOptions = {}): IAction {
  const type = ACTION_TYPES.button;
  const {
    id,
    title = 'Sample button',
  } = options;

  return createAction({
    id,
    options: {
      title,
    },
    type,
  });
}

type ActionFreeTextFactoryOptions = {
  title?: string;
  id?: string;
};
export function createActionFreeText(options: ActionFreeTextFactoryOptions = {}): IAction {
  const type = ACTION_TYPES.freeText;
  const {
    id,
    title,
  } = options;


  return createAction({
    id,
    options: {
      title,
    },
    type,
  })
};

type ActionPhoneCallFactoryOptions = {
  phoneNumber?: string;
  id?: string;
  title?: string;
};
export function createActionPhoneCall(options: ActionPhoneCallFactoryOptions): IAction {
  const type = ACTION_TYPES.phoneCall;

  const {
    id,
    phoneNumber = '+1234567890',
    title = 'Call home',
  } = options;

  return createAction({
    id,
    options: {
      phone: phoneNumber,
      title,
    },
    type,
  });
}

/**
 * CHAT BLOCK FACTORIES
 */
type ChatBlockFactoryOptions = {
  id?: string;
  messages?: IMessage[];
  actions?: IAction[];
  selected?: ISelectedAction;
  heightType?: EActionHeightTypes;
};

export function createChatBlock(options: ChatBlockFactoryOptions = {}): IChatBlock {
  const {
    actions = [],
    messages = [],
    id = `cb-${uuid()}`,
    selected,
    heightType = EActionHeightTypes.default,
  } = options;

  return {
    id,
    actions,
    messages,
    selected,
    heightType,
  }
}

let counter = 0;
type ChatBlockDummyAFactoryOptions = {
  id?: string;
};
export function createChatBlockDummyA(options: ChatBlockDummyAFactoryOptions = {}): IChatBlock {
  const {
    id,
  } = options;

  const messages = [
    createMessageCommon({ text: `#${counter++} Ears back wide eyed trip owner up in kitchen i want food or lay on arms` }),
    createMessageLink({})
  ];

  // const actionLength = Math.ceil((Math.random() * 2)) + 1;
  const actionLength = 10;

  const actions = [
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    createActionButton({ title: 'Click me' }),
    // createActionButton({ title: 'Click me twice' }),
    createActionPhoneCall({
      phoneNumber: '+1234567890',
      title: 'Call police',
    }),
  ];

  actions.length = actionLength;

  return createChatBlock({
    id,
    actions,
    messages,
  });
}

type ChatBlockDummyBFactoryOptions = {
  id?: string;
};
export function createChatBlockDummyB(options: ChatBlockDummyBFactoryOptions = {}): IChatBlock {
  const {
    id,
  } = options;

  const messages = [
    createMessageCommon({ text: 'Behind the couch i will ruin the couch with my claws for pretend you want to go out' }),
  ];

  const actions = [
    createActionFreeText({ title: 'Text me, honey' }),
    createActionFreeText({ title: 'Text me, honey' })
  ];

  return createChatBlock({
    id,
    actions,
    messages,
  });
}

// Block with selected input for cheat mode
type ChatBlockDummyCFactoryOptions = {
  id?: string;
};
export function createChatBlockDummyC(options: ChatBlockDummyCFactoryOptions = {}): IChatBlock {
  const {
    id
  } = options;

  const messages = [
    createMessageCommon({ text: 'I am the simple block with selected input' }),
  ];

  const freeTextAction = createActionFreeText({ title: 'Test placeholder' });
  const freeTextValue = 'I am the simple text inside textarea\nCheers and XO'
  const actions = [
    freeTextAction
  ];

  return createChatBlock({
    id,
    actions: actions,
    messages: messages,
    selected: {
      actionId: freeTextAction.id,
      state: {
        message: freeTextValue,
      }
    }
  })

}