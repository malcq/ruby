import { Injectable } from '@angular/core';
import { Feedback } from '../_models/feedback';
import {
  Message,
  MessageInit,
  MessageText,
  MessageQuestionWithAnswers,
  MessageEmailConfirm,
  MessageLogin,
  MessageInput,
  MessageLink,
  MessageAnswer,
  MessageAction,
  MessageInputNumbers,
  MessageEmail,
  MessageUsername,
  MessageSelector,
  MessageSearchSuggest,
  MessageAnswerSuggestion,
  MessageWaiting,
} from '../_models/message';

@Injectable()
export class MessageFactory {

  getInitMessage(feedback: Feedback): Message {
    return MessageInit.createForFeedback(feedback);
  }

  getEmailConfirmMessage(text: string): Message {
    return MessageEmailConfirm.create(text);
  }

  getUserTextMessage(text: string): Message {
    return MessageText.createForUser(text);
  }

  getUserAnswerMessage(answer: MessageAction): Message {
    return MessageAnswer.createForUser(answer);
  }
  getUserAnswerSuggestionMessage(text: string, categories: string): Message {
    return MessageAnswerSuggestion.createForUser(text, categories);
  }
  getWaitingMessage(): Message {
    return MessageWaiting.createAnswer();
  }

  getByData(data: any): Message {
    switch (data.type) {
       case 'init':
        return new MessageInit(data);
       case 'message':
        return new MessageText(data);
       case 'actions':
        return new MessageQuestionWithAnswers(data);
       case 'login':
        return new MessageLogin(data);
       case 'input':
        return new MessageInput(data);
       case 'link':
        return new MessageLink(data);
       case 'email-confirm':
        return new MessageEmailConfirm(data);
       case 'input-numbers':
        return new MessageInputNumbers(data);
       case 'email':
        return new MessageEmail(data);
       case 'username':
        return new MessageUsername(data);
       case 'selector':
        return new MessageSelector(data);
       case 'search':
        return new MessageSearchSuggest(data);
       case 'waiting':
        return new MessageWaiting(data);
       default:
        return new MessageAnswer(data);
    }
  }

}
