import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentConversation';

export const shipmentConversationGetData = (id: number): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_GET_DATA,
  id,
});

export const shipmentConversationGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_GET_DATA_SUCCESS,
  payload,
});

export const shipmentConversationGetUsers = (id: number): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_GET_USERS,
  id,
});

export const shipmentConversationGetUsersSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_GET_USERS_SUCCESS,
  payload,
});

export const attachFileToShipment = (shipmentId: number, attachmentId: number): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_ATTACH_FILE,
  shipmentId,
  attachmentId,
});

export const shipmentConversationAttachFileSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_ATTACH_FILE_SUCCESS,
  payload,
});

export const shipmentConversationPinComment = (shipmentId: number, commentId: number): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_PIN_COMMENT,
  shipmentId,
  commentId,
});

export const shipmentConversationPinCommentSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_PIN_COMMENT_SUCCESS,
  payload,
});

export const submitChatComment = (payload: any, id: number): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_SUBMIT_COMMENT,
  payload,
  id,
});

export const submitChatCommentSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_SUBMIT_COMMENT_SUCCESS,
  payload,
});

export const toggleChatFollow = (id: number, userId: number): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_TOGGLE_FOLLOW,
  id,
  userId,
});

export const toggleChatFollowSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_CONVERSATION_TOGGLE_FOLLOW_SUCCESS,
  payload,
});