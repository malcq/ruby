import axios from './axios';

import { localStorageService } from './local-storage';
import { getCountry } from './geolocation';

import {
  INACTIVE_SESSION_LIFETIME,
} from '../utils/constants';
import { ISession } from '../models/user';

let currentUser: any;
let activityInterval: any;

export const signIn = async (name: string, password: string) => {
  let userInfo = {
    username: null,
    role: null,
  };

  const { data } = await axios.post('/api/user/token', { username: name, password });

  if (!data) {
    await localStorageService.removeItem('jwtToken');
    throw new Error(data.message);
  }

  if (data && data.access) {
    // userInfo = parseJwt(data.access);
    await localStorageService.setItem('jwtToken', data.access);
  }

  return userInfo;
};

export const clearSession = async (): Promise<void> => {
  await localStorageService.removeItem('sessionId');
  await localStorageService.removeItem('graphName');
};

export const getStoredSession = async (): Promise<ISession> => {
  const sessionId = await localStorageService.getItem('sessionId');
  const graphName = await localStorageService.getItem('graphName');
  return {
    sessionId,
    graphName,
  };
};

export const checkSession = async (): Promise<boolean> => {
  const lastActivityTime = Number.parseInt(await localStorageService.getItem('lastActivityTime') || '0');
  const difference = Date.now() - lastActivityTime;
  if(difference<0 || difference>INACTIVE_SESSION_LIFETIME) {
    await clearSession();
  }
  const { sessionId, graphName } = await getStoredSession();
  const hasSession: boolean = !!(sessionId && graphName);
  return hasSession;
};

export const signInByHash = async (code: string): Promise<ISession> => {
  await logout();
  const country =  await getCountry();
  const { data } = await axios.post('/auth/widget/sign_in', { code, country });

  await checkError(data);

  if (data && data.token) {
    await localStorageService.setItem('jwtToken', data.token);
  }

  const sessionId: string = await createSession();
  const graphName = data.flow.graph_name;
  currentUser = data.user;
  await localStorageService.setItem('sessionId', sessionId);
  await localStorageService.setItem('graphName', graphName);
  await localStorageService.setItem('lastActivityTime', Date.now());

  return {
    graphName,
    sessionId
  }
};

export const logout = async (): Promise<void> => {
  await localStorageService.removeItem('jwtToken');
};

async function createSession(): Promise<string> {
  const { data } = await axios.post('/feedback-sessions', {});

  await checkError(data);

  return data.feedback_session.id;
}

async function checkError(data: any): Promise<void> {
  if (!data || data.error) {
    await localStorageService.removeItem('jwtToken');
    const message = data? data.message: 'Server unavalible';
    throw new Error(message);
  }
}

export function activeOn(): void {
  activityInterval = setInterval(() => {
    localStorageService.setItem('lastActivityTime', Date.now());
  }, 600000);
}

export function activeOff(): void {
  if(activityInterval) {
    clearInterval(activityInterval);
  }
}