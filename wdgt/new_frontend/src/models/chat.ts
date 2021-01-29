import { BaseFile } from './file/BaseFile';
import { IOption } from './select';
import { EActionHeightTypes } from '../utils/constants';
import { ICustomFormField } from './custom-form';

export interface IMessage {
  id: string;
  type: string;
  options: {
    [key: string]: any;
  };
}

export interface IAction {
  id: string;
  type: string;
  options: {
    [key: string]: any;
  };
}

export interface IUplodedFile {
  type: string;
  link: string;
}

export interface IConstantStringObject {
  [key: string]: string;
}

/**
 * Action options
 */
export interface IOptionsMedia {
  video?: {
    enabled: boolean
  },
  photo?: {
    enabled: boolean
  },
  documents?: {
    enabled: boolean,
  },
  text?: {
    enabled?: boolean,
    placeholder?: string,
  },
}


export interface IOptionsCustomForm {
  title: string,
  fields: ICustomFormField[],
};

/**
 * Selected types
 */
export interface IStateFreeText {
  message: string;
}

export interface IStateFile {
  files?: BaseFile[];
  text?: string;
}

export interface IStateSelector {
  selected: string[],
};

export interface IStateRoller {
  option: IOption,
};

export interface IStateFullName {
  first_name: string,
  second_name: string,
};

export interface IStateCustomForm {
  [data_type: string]: string,
}

export type ISelectedState =
  IStateFreeText |
  IStateFile |
  IStateSelector |
  IStateRoller |
  IStateFullName |
  IStateCustomForm |
  null;

export interface ISelectedAction {
  actionId: string;
  state: ISelectedState;
}

export interface IChatBlock {
  id: string;
  messages: IMessage[];
  actions: IAction[];
  selected?: ISelectedAction;
  heightType: EActionHeightTypes;
}

export interface IServerMessage {
  position?: string;
  type: string;
  sender: string;
  newMessage?: boolean;
  text?: any;
  data?: any;
  payload?: any;
  actions?: any[];
  files?: any[];
  start?: string;
  options?: string[];
  bot_engine_name?: string;
  language?: string;
  state_id?: number;
  message_id?: number;
  value?: string;
}
