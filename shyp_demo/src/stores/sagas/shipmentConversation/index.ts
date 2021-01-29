import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentConversation';
import * as actionCreators from '../../actionCreators/shipmentConversation';
import { simpleGetAndResolve, simplePostAndResolve, simplePatchAndResolve } from '../factories';

const getShipmentConversation = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/conversation`,
  actionCreators.shipmentConversationGetDataSuccess,
  (response) => response.data.data,
);

const getShipmentConversationUsers = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/users_for_chat`,
  actionCreators.shipmentConversationGetUsersSuccess,
  (response) => response.data.data,
);

const attachFileToShipment = simplePostAndResolve(
  (action) => `/api/v1/shipments/${action.shipmentId}/attach_comment_attachment?attachment_id=${action.attachmentId}`,
  actionCreators.shipmentConversationAttachFileSuccess,
  (response) => response.data.data,
);

const pinComment = simplePatchAndResolve(
  (action) => `/api/v1/shipments/${action.shipmentId}/chat_comments/${action.commentId}/unpin`,
  actionCreators.shipmentConversationPinCommentSuccess,
  (response) => response.data.data,
);

const toggleFollow = simplePatchAndResolve(
  (action) => `/api/v1/shipments/${action.id}/toggle_chat_follow?user_id=${action.userId}`,
  actionCreators.toggleChatFollowSuccess,
  (response) => response.data.data,
);

const submitComment = simplePostAndResolve(
  (action) => `/api/v1/shipments/${action.id}/chat_comments`,
  actionCreators.submitChatCommentSuccess,
  (response) => response.data.data,
);


export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_CONVERSATION_GET_DATA, getShipmentConversation);
  yield takeEvery(actions.SHIPMENT_CONVERSATION_GET_USERS, getShipmentConversationUsers);
  yield takeEvery(actions.SHIPMENT_CONVERSATION_ATTACH_FILE, attachFileToShipment);
  yield takeEvery(actions.SHIPMENT_CONVERSATION_PIN_COMMENT, pinComment);
  yield takeEvery(actions.SHIPMENT_CONVERSATION_SUBMIT_COMMENT, submitComment);
  yield takeEvery(actions.SHIPMENT_CONVERSATION_TOGGLE_FOLLOW, toggleFollow);
}