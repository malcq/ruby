import uuid from 'uuid/v4';
import {
  initSearch,
  search,
  getPosition,
  getByPosition,
} from '../search';

import {
  ACTION_TYPES,
  MESSAGE_TYPES,
  EActionHeightTypes,
} from '../../utils/constants';

import {
  IServerMessage,
  IAction,
  IMessage,
  IChatBlock,
  ISelectedState,
  IStateSelector,
  IStateFreeText,
  IStateFile,
  IStateRoller,
  IStateFullName,
  IStateCustomForm,
} from '../../models/chat';
import { IOption } from '../../models/select';

import * as chatFactories from '../../store/chat/factories';
import { BaseFile } from '../../models/file/BaseFile';
import { fileService } from '../file';

export const SERVER_ACTION_TYPES: string[] = [
  'complex',
  'actions',
  'input',
  'selector',
  'input-numbers',
  'search'
];

export const SERVER_HIDDEN_MESSAGES: string[] = [
  'init',
];

export const SEARCH_ACTIONS: string[] = [
  'select',
  'autocomplete',
  'singleselect',
  'linkselect',
];

const FULL_WINDOW_ACTIONS: string[] = [
  ACTION_TYPES.autocomplete,
  ACTION_TYPES.selectWithRouting,
  ACTION_TYPES.select,

];
const BIG_WINDOW_ACTIONS: string[] = [
  ACTION_TYPES.timepicker,
];

export const FREE_TEXT_ACTIONS: string[] = [
  ACTION_TYPES.freeText,
  ACTION_TYPES.autocomplete,
  ACTION_TYPES.timepicker,
  ACTION_TYPES.datepicker,
  ACTION_TYPES.dataType,
  ACTION_TYPES.bicNumber,
  ACTION_TYPES.ibanNumber,
];

export const SERVER_TO_MESSAGE_TYPES: {
  [key: string]: any;
} = {
  'text': MESSAGE_TYPES.text,
  'link': MESSAGE_TYPES.link,
};

export const isServerActionType = (type: string): boolean => SERVER_ACTION_TYPES.includes(type);
export const isFullWindowActionType = (action: IAction): boolean => {
  const { options, type } = action;
  if (ACTION_TYPES.selectWithRouting === type ||
      ACTION_TYPES.select === type
    ) {
      return options?.enableSearch ?? false;
    }

  return FULL_WINDOW_ACTIONS.includes(action.type);
}
export const isMessage = (type: string): boolean => !SERVER_HIDDEN_MESSAGES.includes(type) && SERVER_TO_MESSAGE_TYPES[type];

const setActionsByServer = async (messagesBlock: IChatBlock, data: IServerMessage): Promise<void> => {
  const result: IAction[] = [];
  if (data.type === 'complex') {
    for(let i=0; i < data.payload.length; ++i) {
      const actionOptions: any = data.payload[i];
      if (SEARCH_ACTIONS.includes(actionOptions.type)) {
        const searchId = await initSearch(actionOptions.type, actionOptions.options.options);
        const values = await search(searchId, '');
        actionOptions.options.searchId = searchId;
        actionOptions.options.values = values;
        delete actionOptions.options.options;
      }
      if (actionOptions.type === 'roller') {
        const values: IOption[] = [];
        actionOptions.options.options.forEach((elem: any) => {
          const { value } = elem;
          const option = {
            id: `opt-${uuid()}`,
            title: value,
          };
          values.push(option);
        });
        actionOptions.options.values = values;
        delete actionOptions.options.options;
      }
      result.push(chatFactories.createAction(actionOptions));
    }
  } else if (data.type === 'actions') {
    let actions = [];
    if (data.payload) {
      actions = data.payload.actions;
    } else {
      actions = data.actions || [];
    }
    actions.forEach((actionOptions: any) => {
      actionOptions.type = 'btn';
      result.push(chatFactories.createAction(actionOptions));
    });
  } else {
    const action = chatFactories.createAction(data);
    result.push(action);
  }
  if(result.some(action => BIG_WINDOW_ACTIONS.includes(action.type))) {
    messagesBlock.heightType = EActionHeightTypes.big;
  }
  if(result.some(action => isFullWindowActionType(action))) {
    messagesBlock.heightType = EActionHeightTypes.fullWindow;
  }
  messagesBlock.actions = result;
};

const getMessagesByServer = async (messages: IServerMessage[]): Promise<IMessage[]> => {
  const result: IMessage[] = [];
  for(let i=0; i < messages.length; i++) {
    const messageOptions = messages[i];
    const type = messageOptions.text.type;
    if(isMessage(type)) {
      messageOptions.text.type = SERVER_TO_MESSAGE_TYPES[type];
      const message = chatFactories.createMessage(messageOptions.text);
      result.push(message);
    }
  }
  return result;
};

export const getChatBlockByServer = async (data: IServerMessage, receivedNotProcessedMessages: IServerMessage[]): Promise<IChatBlock> => {
  const messagesBlock: IChatBlock = chatFactories.createChatBlock();

  await setActionsByServer(messagesBlock, data);
  messagesBlock.messages = await getMessagesByServer(receivedNotProcessedMessages);
  return messagesBlock;
};

export const prepareAnswer = async (block: IChatBlock, answer: IAction, state: ISelectedState, sendData: (data: {[id: string]: string}) => Promise<void>): Promise<IServerMessage> => {
  let position = 0;
  block.actions.forEach((action: IAction, index: number) => {
    if (action.id === answer.id) {
      position = index;
    }
  });

  const message: IServerMessage = {
    position: position+'',
    type: 'message',
    sender: 'user'
  };

  if (FREE_TEXT_ACTIONS.includes(answer.type) && state) {
    message.text = (state as IStateFreeText).message;
  } else if (answer.type === ACTION_TYPES.button) {
    message.text = answer.options.title;
  } else if (answer.type === ACTION_TYPES.media && state) {
    const fileState = state as IStateFile;
    if (fileState.text) {
      message.text = fileState.text;
    } else if (fileState.files) {
      const fileIds: number[] = [];
      fileState.files.forEach(file => {
        fileIds.push(file.getServerId());
      });
      message.files = fileIds;
    }
  } else if ([
    ACTION_TYPES.select,
    ACTION_TYPES.selectWithRouting,
    ACTION_TYPES.selectLink,
  ].includes(answer.type) && state) {
    const optionsIds: string[] = (state as IStateSelector).selected;
    const positions: number[] = [];
    const options: IOption[] = [];

    for (let i = 0; i<optionsIds.length; i++) {
      const position = await getPosition(answer.options.searchId, optionsIds[i]);
      positions.push(position);
      const option = await getByPosition(answer.options.searchId, position);
      options.push(option);
    }
    message.position += ' '+positions.join(',');
    message.text = options.map(option => option.title).join(',');

    if ([
      ACTION_TYPES.selectWithRouting,
      ACTION_TYPES.selectLink,
    ].includes(answer.type)) {
      message.value = options[0].id;
    }
  } else if (answer.type === ACTION_TYPES.roller && state) {
    const selected: IOption = (state as IStateRoller).option;
    let position: number = 0;
    answer.options.values.forEach((option: IOption, i: number) => {
      if(option.id === selected.id) {
        position = i;
      }
    });

    message.position += ' '+position;
    message.text = selected.title;
  } else if(answer.type === ACTION_TYPES.fullnameForm && state) {
    const {first_name, second_name} = (state as IStateFullName);
    const data: {[id: string]: string} = {
      first_name,
      second_name
    }
    await sendData(data);
    message.position += ' '+JSON.stringify(data);
    message.text = `${first_name} ${second_name}`;
  } else if (answer.type === ACTION_TYPES.customForm && state) {
    const data = state as IStateCustomForm;
    await sendData(data);
    message.position += ' '+JSON.stringify(data);
    message.text = Object.values(data).join(' ');
  }
  
  if (answer.type === ACTION_TYPES.bicNumber && state) {
    const data = {
      bic_number: message.text,
    };
    await sendData(data);
  }

  if (answer.type === ACTION_TYPES.ibanNumber && state) {
    const data = {
      iban_number: message.text,
    };
    await sendData(data);
  }

  if (answer.type === ACTION_TYPES.dataType && state) {
    const data: {[id: string]: string} = {};
    data[answer.options.data_type] = message.text;
    await sendData(data);
  }

  return message;
};

export const prepareHistoryBlock = async (block: IChatBlock, answer: IServerMessage): Promise<IChatBlock> => {
  const [position, ...rest] = ((answer.text || {}).position || '0').split(' ');
  const payload = rest.join(' ');

  const answerPos = Number.parseInt(position) || 0;
  const selectedAction = block.actions[answerPos];
  let state: ISelectedState = null;
  if(FREE_TEXT_ACTIONS.includes(selectedAction.type)) {
    state = { message: (answer.text || {}).text || '' };
  } else if (selectedAction.type === ACTION_TYPES.media && (answer.text || {}).files) {
    const files: BaseFile[] = await Promise.all((answer.text || {}).files.map((fileId: number) => fileService.get(fileId)));
    state = { files };
  } else if (selectedAction.type === ACTION_TYPES.media && (answer.text || {}).text) {
    state = { text: answer.text.text }
  } else if([
    ACTION_TYPES.select,
    ACTION_TYPES.selectWithRouting, 
    ACTION_TYPES.selectLink
  ].includes(selectedAction.type) && payload) {
    const sel = (payload || '0').split(',');
    const selected: string[] = [];

    for(let i=0; i < sel.length; i++) {
      const pos =  Number.parseInt(sel[i]);
      const option: any = await getByPosition(selectedAction.options.searchId, pos);
      selected.push((option as IOption).id);
    }
    
    state = { selected };
  } else if(selectedAction.type === ACTION_TYPES.roller && payload) {
    const sel = (payload || '0');
    
    const pos =  Number.parseInt(sel);
    const option: IOption = selectedAction.options.values[pos];
    
    state = { option };
  } else if(selectedAction.type === ACTION_TYPES.fullnameForm && payload) {
    state = JSON.parse(payload);
  } else if (selectedAction.type === ACTION_TYPES.customForm && payload) {
    state = JSON.parse(payload);
  }

  block.selected = {
    actionId: selectedAction.id,
    state
  }
  return block;
};
