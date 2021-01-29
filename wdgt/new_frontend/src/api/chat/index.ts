import io from 'socket.io-client';
import axios from '../axios';

import { widgetService } from '../widget';
import { localStorageService } from '../local-storage';
import { clearSession } from '../user';
import { IServerMessage, IAction, IChatBlock, ISelectedState } from '../../models/chat';
import {
  isServerActionType,
  getChatBlockByServer,
  prepareAnswer,
  prepareHistoryBlock,
} from './messageHelpers';
import { getTokenFromStorage } from '../../utils';
import {
  TIME_BETWEEN_BLOCKS,
} from '../../utils/constants';
import { ISession } from '../../models/user';

import config from '../../config';

enum ChatEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    MESSAGE = 'chat message'
};

const rollbackInfoByBlockId: {
  [key: string]: {stateId: number, messageId: number};
} = {
};

class ChatService {
  private socket: any;
  private readonly version = 'v1';
  private language = "en";
  private sessionId: string = '';
  private graphName: string = '3Back Flow_fc9c712e-410a-4d17-a918-76291aff7e2c';
  private currentBlockId: number = 0;
  private queue: IServerMessage[] = [];
  private receivedNotProcessedMessages: IServerMessage[] = [];
  private messageListener: (messagesBlock: IChatBlock) => void = () => {};
  private subflowByActId: {
    [key: string]: string;
  } = {};
  private currentSubflow?: string;

  async connect({ sessionId, graphName }: ISession): Promise<IChatBlock[]> {
    this.sessionId = sessionId;
    this.graphName = graphName;

    const token = await getTokenFromStorage();
    this.currentSubflow = await localStorageService.getItem('currentSubflow');

    this.socket = io(config.apiUrlApp, {
      query: {
        token,
        session_id: this.sessionId,
      }
    });

    this.socket.on(ChatEvent.CONNECT, () => this.sendQueueToServer());
    this.socket.on(ChatEvent.MESSAGE, (data: IServerMessage) => console.debug('receive', Date.now(), data));

    const { data } = await axios.get(`/chat-bot?session_id=${this.sessionId}&version=${this.version}`);

    const serverMessages: IServerMessage[] = data['messages'];
    if (!serverMessages.length) {
      const initialMessage: IServerMessage = this.getInitMessage();
      this.send(initialMessage);
      return [];
    }

    const blocks: IChatBlock[] = [];
    for(let i=0; i < serverMessages.length; ++i) {
      const data: IServerMessage = serverMessages[i];
      if(data.sender === 'user') {
        await prepareHistoryBlock(blocks[blocks.length-1], data);
      } else {
        await this.getMessageByData(data, (block: IChatBlock) => blocks.push(block));
      }
    }
    return blocks;
  }

  disconnect(): void {
    this.socket.close();
  }

  async replyToBlock(block: IChatBlock, answer: IAction, state: ISelectedState): Promise<void> {
    console.log(answer);
    if (this.subflowByActId[answer.id]) {
      await localStorageService.setItem('currentSubflow', this.subflowByActId[answer.id]);
      this.currentSubflow = this.subflowByActId[answer.id];
      console.debug(`current flow is ${this.subflowByActId[answer.id]}`);
    }
    this.startServerMessagesQueueTimer();
    this.send(await prepareAnswer(block, answer, state, (data: {[id: string]: string}) => this.sendData(data)));
  }
  
  async sendRollback(block: IChatBlock, answer: IAction): Promise<void> {
    const rollbackInfo = rollbackInfoByBlockId[block.id];
    const reqAnswer: any = await axios.post(`/chat-bot/rollback`, {
      session_id: Number.parseInt(this.sessionId),
      state_id: rollbackInfo.stateId,
      message_id: rollbackInfo.messageId,
    });
    if (!reqAnswer || reqAnswer.error) {
      const message = reqAnswer? reqAnswer.message: 'Server unavalible';
      throw new Error(message);
    }
  }

  send(message: IServerMessage): void {
    if (!message) { return; }
    console.debug('send', Date.now(), message);

    this.queue.push(message);
    this.sendQueueToServer();
  }

  private sendQueueToServer(): void {
    if (this.queue.length && this.socket.connected) {
      const message = this.queue.shift();
      const messageForServer: any = message;
      messageForServer.session_id = this.sessionId+'';
      messageForServer.graph_name = this.graphName;
      messageForServer.version = this.version;
      messageForServer.language = this.language;
      if (this.currentSubflow) {
        messageForServer.subflow_name = this.currentSubflow;
      }

      console.debug('send to server', Date.now(), JSON.stringify(messageForServer));

      const encodedMessage = this.encodeMessage(messageForServer);
      this.socket.emit(ChatEvent.MESSAGE, encodedMessage);
      setTimeout(() => {
        this.sendQueueToServer();
      }, 0);
    }
  }

  private async processServerMessage(data: IServerMessage | IServerMessage[]): Promise<void> {
    console.debug('process', Date.now(), data);
    if (!(data instanceof Array)) {
      data = [data];
    }

    for(let i=0; i < data.length; ++i) {
      const dataMessage: any = data[i];
      dataMessage.newMessage = true;
      if (dataMessage.type === 'waiting') {
        this.send(this.getWaitingMessage());
      }
      if (dataMessage.type === 'final') {
        // TODO fix after change API and prepare new reload mehanism
        await widgetService.close();
        clearSession();
        window.document.location.reload();
      }
      if(dataMessage.type === 'complex') {
        if(dataMessage.payload) {
          for (let i = 0; i < dataMessage.payload.length; i++) {
            const action = dataMessage.payload[i];
            if(action.next_flow) {
              this.subflowByActId[action.id] = action.next_flow.default;
            }
          }
        }
      }
      await this.getMessageByData(dataMessage, (block: IChatBlock) => this.byServerMessagesQueue(block));
    }
  }

  private serverMessagesQueue: IChatBlock[] = [];
  private serverMessagesQueuePause: boolean = false;
  private byServerMessagesQueue(block: IChatBlock) {
    this.serverMessagesQueue.push(block);
    this.emitMessage();
  }

  private emitMessage() {
    if(!this.serverMessagesQueuePause) {
      const block: IChatBlock | undefined = this.serverMessagesQueue.shift();

      if(block) {
        this.messageListener(block);
        this.startServerMessagesQueueTimer();
      }
    }
  }

  private serverMessagesQueueTimer: number = 0;
  private startServerMessagesQueueTimer() {
      this.serverMessagesQueuePause = true;
      if(this.serverMessagesQueueTimer) {
        clearTimeout(this.serverMessagesQueueTimer);
      }
      this.serverMessagesQueueTimer = window.setTimeout(() => {
        this.serverMessagesQueueTimer = 0;
        this.serverMessagesQueuePause = false;
        this.emitMessage();
      }, TIME_BETWEEN_BLOCKS);
  }

  private getWaitingMessage(): IServerMessage {
    return {
      type: 'waiting',
      payload: {},
      sender: 'user'
    }
  }

  onMessage(messageListener: (messagesBlock: IChatBlock) => void): ChatService {
    this.messageListener = messageListener;
    this.socket.on(ChatEvent.MESSAGE, (data: IServerMessage) => this.processServerMessage(data));
    return this;
  }

  private async getMessageByData(data: IServerMessage, onBlockReady: (messagesBlock: IChatBlock) => void): Promise<void> {
    console.debug(JSON.stringify(data));
    if(data.sender === 'bot') {
      if (isServerActionType(data.type)) {
        const messagesBlock: IChatBlock = await getChatBlockByServer(data, this.receivedNotProcessedMessages);

        this.receivedNotProcessedMessages = [];
        rollbackInfoByBlockId[messagesBlock.id] = {
          stateId: Number.parseInt(data.state_id+'' || '0'),
          messageId: Number.parseInt(data.message_id+'' || '0'),
        };

        onBlockReady(messagesBlock);
      } else {
        this.receivedNotProcessedMessages.push(data);
      }
    }
  }

  fakeMessage(data: IServerMessage) {
    this.processServerMessage(data);
  }

  async restart(): Promise<void> {
    await axios.post(`/chat-bot/restart`, {session_id: this.sessionId});
  }

  async sendData(data: {[id: string]: string}): Promise<void> {
    console.debug(data, Object.keys(data).map(key => ({field_name: key, value: data[key]})));
    const answer: any = await axios.post(`/chat-bot/data`, {
      session_id: this.sessionId,
      data: Object.keys(data).map(key => ({field_name: key, value: data[key]})),
    });
    if (!answer || answer.error) {
      const message = answer? answer.message: 'Server unavalible';
      throw new Error(message);
    }
  }

  private getInitMessage(): IServerMessage {
    return {
      type: "init",
      text: "{}",
      sender: "user",
      start: "true",
      bot_engine_name: "bot"
    }
  }

  private encodeMessage(message: IServerMessage): string {
    /**
     * Socket.IO can disconnect on certain unicode characters (e.g. `é`)
     * This could be related to https://github.com/socketio/socket.io/issues/451
     *
     * To avoid this bug, we should encode message on front and decode on server
     * Incoming messages are ok
     */
    return encodeURI(JSON.stringify(message));
  }
}

export const chatService = new ChatService();
