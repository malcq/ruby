import { call, CallEffect } from 'redux-saga/effects';

import { Logger } from "../../../utils"

// Class is an abstraction around Local Storage of the remembered user
class UserStorage {
  public static setEmail(email: string): CallEffect {
    return call([this, '_setEmail'], email)
  }

  public static getEmail(): CallEffect {
    return call([this, '_getEmail'])
  }

  public static removeEmail(): CallEffect {
    return call([this, '_removeEmail'])
  }

  public static *_getEmail(): Iterator<any> {
    return yield call([localStorage, 'getItem'], this.localStorageKey);
  }

  public static *_removeEmail(): Iterator<any> {
    yield call([localStorage, 'removeItem'], this.localStorageKey)
  }

  public static *_setEmail(email: string): Iterator<any> {
    yield call([localStorage, 'setItem'], this.localStorageKey, email);
  }

  private static localStorageKey = 'rememberedUser';
}

export default UserStorage