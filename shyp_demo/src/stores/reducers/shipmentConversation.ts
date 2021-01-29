import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipmentConversation';
import { AnyAction } from "redux";
import { unionBy, sortBy } from 'lodash';

declare global{
  interface IShipmentConversationState{
    comments: IComment[],
    followers: IFollower[],
    users: IUser[],
    mentionables: any,
  }

  interface ICommentAttachment {
    id: number;
    original_filename: string;
    file_url: string;
    created_at: string;
  }

  interface IFollower {
    id: number;
    color: string;
    first_name: string;
    full_name: string;
    last_name: string;
    mini_thumb: string;
  }

  interface IComment {
    id: number;
    deleted_at?: string;
    deleted_by?: string;
    is_system: boolean;
    pinned: boolean;
    content: string;
    link: string;
    answered_comment_id?: number;
    created_at: string;
    updated_at: string;
    shipment_id: number;
    shipment_title: string;
    human_time: string;
    author: {
      id: number;
      type: string;
      full_name: string;
      first_name: string;
      last_name: string;
      avatar_thumb: string;
      color: string;
    };
    comment_attachments: ICommentAttachment[]
  }
}
export const initialShipmentConversationState = {
  comments: [],
  followers: [],
  users: [],
  mentionables: {},
};

const receiveConversationList: Reducer<IShipmentConversationState, AnyAction> = (state, action) => ({
  ...state,
  comments: action.payload.chat_comments
});

const receiveUsersList: Reducer<IShipmentConversationState, AnyAction> = (state, action) => ({
  ...state,
  followers: action.payload.followers.followers,
  users: action.payload.users,
  mentionables: action.payload.mentionables,
});

const dontChangeState: Reducer<IShipmentConversationState, AnyAction> = (state, action) => ({
  ...state,
});

export default createReducer(initialShipmentConversationState, {
  [actions.SHIPMENT_CONVERSATION_GET_DATA_SUCCESS]: receiveConversationList,
  [actions.SHIPMENT_CONVERSATION_GET_USERS_SUCCESS]: receiveUsersList,
  [actions.SHIPMENT_CONVERSATION_ATTACH_FILE_SUCCESS]: dontChangeState,
  [actions.SHIPMENT_CONVERSATION_PIN_COMMENT_SUCCESS]: dontChangeState,
  [actions.SHIPMENT_CONVERSATION_SUBMIT_COMMENT_SUCCESS]: dontChangeState,
  [actions.SHIPMENT_CONVERSATION_TOGGLE_FOLLOW_SUCCESS]: dontChangeState,
})