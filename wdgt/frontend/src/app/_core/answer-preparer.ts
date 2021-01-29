import { Injectable } from '@angular/core';
import { camelCase } from 'change-case';

@Injectable()
export class AnswerPreparer {
  public static normaliseObjectNames(answerObject: any) {
    if (Array.isArray(answerObject)) {
      const result = [];
      answerObject.forEach((child) => {
        result.push(AnswerPreparer.normaliseObjectNames(child));
      });
      return result;
    }
    if (answerObject !== null && typeof answerObject === 'object') {
      const result = {};
      Object.keys(answerObject).forEach((name) => {
        const child = answerObject[name];
        result[camelCase(name)] = AnswerPreparer.normaliseObjectNames(child);
      });
      return result;
    }
    return answerObject;
  }
}
