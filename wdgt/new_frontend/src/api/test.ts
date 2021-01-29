// this is the test api just to show thunk logic
// check store/user/actions.ts

import { User } from '../models/user';
import { IChatBlock, IAction } from '../models/chat';

import { createChatBlockDummyA, createChatBlockDummyB } from '../store/chat/factories';

export function mockedLogin(): Promise<User> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: 'someid'
      })
    })
  })
}

let counter = 1;
export function replyToBlock(action: IAction): Promise<IChatBlock> {

  const dummyBlock = counter % 2 ? createChatBlockDummyA() : createChatBlockDummyB();
  counter++;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(dummyBlock);
    }, 700);
  });
}

export function rollbackAction(action: IAction): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined);
    }, 500);
  });
}