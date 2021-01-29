import { environment } from '../../environments/environment';

export const URLS = {
  signUp: `${environment.serverUrl}/auth/sign_in`,
  signInCampaign: `${environment.serverUrl}/auth/sign_in_campaign`,
  signInWidget: `${environment.serverUrl}/auth/widget/sign_in`,
  chatbot: `${environment.serverUrl}/chat-bot`,
  setName: `${environment.serverUrl}/chat-bot/add-name`,
  setEmail: `${environment.serverUrl}/chat-bot/add-email`,
  chatRestart: `${environment.serverUrl}/chat-bot/restart`,
  feedbackCategories: `${environment.serverUrl}/feedback-categories`,
  feedback: `${environment.serverUrl}/feedbacks`,
  file: `${environment.serverUrl}/files`,
  productModels: `${environment.serverUrl}/product-models`,
  tag: `${environment.serverUrl}/tags`,
  tagsTop: `${environment.serverUrl}/tags/top/all`,
  chatCategories: `${environment.serverUrl}/categories/search-suggest`,
  user: `${environment.serverUrl}/users`,
  userMe: `${environment.serverUrl}/users/me`,
  userUpdateInfo: `${environment.serverUrl}/users/me/update-info`,
  feedbackSession: `${environment.serverUrl}/feedback-sessions`,
};
