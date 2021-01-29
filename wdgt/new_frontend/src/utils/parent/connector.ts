const ANSWER_TIMEOUT = 30000;

export interface WindowMessage {
  info?: any;
  data?: ArrayBuffer | null;
}

export interface Listener {
  onMessage(message: WindowMessage): Promise<WindowMessage>;
}

interface PromiseAnswer {
  resolve(result: WindowMessage): void;
  reject(err: any): void;
}

abstract class Connector {
  parentListeners = new Map<string, Listener>();
  childrenListeners = new Map<string, Listener>();

  init(): void {
    console.log('Connector inited.');
  }

  addParentListener(name: string, listener: Listener): void {
    this.parentListeners.set(name, listener);
  }

  addChildrenListener(name: string, listener: Listener): void {
    this.childrenListeners.set(name, listener);
  }

  abstract sendToParent(name: string, message: WindowMessage): Promise<WindowMessage>;
  abstract sendToChildren(name: string, message: WindowMessage): Promise<WindowMessage>;
}

class LocalConnector extends Connector {
  sendToParent(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    const listener = this.parentListeners.get(name);
    if(!listener) {
      return Promise.reject(new Error(`parent listener '${name}' not found`));
    }
    return listener.onMessage(message);
  }

  sendToChildren(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    const listener = this.childrenListeners.get(name);
    if(!listener) {
      return Promise.reject(new Error(`children listener '${name}' not found`));
    }
    return listener.onMessage(message);
  }
}

abstract class FrameConnector extends Connector {
  private answers = new Map<number, PromiseAnswer>();
  private currentAnswerId = 1;
  constructor() {
    super();
    addMessageListener((event: any) => {
      const { name } = event.data;
      if(name) {
        const message: WindowMessage  = {};
        if (event.data.info) {
          message.info = event.data.info;
        }
        if (event.data.data) {
          message.data = event.data.data;
        }
        if (event.data.answerId) {
          const answer = this.answers.get(event.data.answerId);
          if (answer) {
            this.answers.delete(event.data.answerId);
            if (event.data.err) {
              answer.reject(new Error(event.data.err));
            } else {
              answer.resolve(message);
            }
          }
        } else if (event.data.reqId) {
          this.onMessage(name, message)
            .then((message: WindowMessage) => {
              this.sendAnswer(event, message);
            })
            .catch(err => {
              this.sendError(event, err);
            });
        } else if (name) {
          this.onMessage(name, message);
        }
      }
    });
  }

  sendRequest(target: any, name: string, message: WindowMessage, resolve: (result: WindowMessage) => void, reject: (err: any) => void) {
    const answer: PromiseAnswer = {resolve, reject};
    const reqId = this.currentAnswerId++;
    this.answers.set(reqId, answer);
    setTimeout(() => {
      if(this.answers.has(reqId)) {
        this.answers.delete(reqId);
        answer.reject(new Error(`postMessage '${name}' answer timeout`));
      }
    }, ANSWER_TIMEOUT);

    if (message.data) {
      target.postMessage({
        reqId,
        name,
        info: message.info,
        data: message.data,
      }, '*', [message.data]);
    } else {
      target.postMessage({
        reqId,
        name,
        info: message.info,
      }, '*');
    }
  }

  sendAnswer(event: any, message: WindowMessage) {
    if (message.data) {
      event.source.postMessage({
        answerId: event.data.reqId,
        name: 'answer',
        info: message.info,
        data: message.data,
      }, '*', [message.data]);
    } else {
      event.source.postMessage({
        answerId: event.data.reqId,
        name: 'answer',
        info: message.info,
      }, '*');
    }
  }

  sendError(event: any, err: Error) {
    console.log(err);
    event.source.postMessage({
      answerId: event.data.reqId,
      err: err.message,
    }, '*');
  }

  abstract onMessage(name: string, message: WindowMessage): Promise<WindowMessage>;
}

class FrameParentConnector extends FrameConnector {
  onMessage(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    const listener = this.parentListeners.get(name);
    if(listener) {
      return listener.onMessage(message);
    } else {
      return Promise.reject(new Error(`Parent method ${name} not found`));
    }
  }

  sendToParent(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    const err = new Error(`Parent send message to parent ${name}, ${message}`);
    console.log(err);
    return Promise.reject(err);
  }

  sendToChildren(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    return new Promise<WindowMessage>((resolve, reject) => {
      const { iframe } = (window as any)['TBWidget'];
      this.sendRequest( iframe.contentWindow, name, message, resolve, reject );
    });
  }
}

class FrameChildrenConnector extends FrameConnector {
  onMessage(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    const listener = this.childrenListeners.get(name);
    if(listener) {
      return listener.onMessage(message);
    } else {
      return Promise.reject(new Error(`Children method ${name} not found`));
    }
  }

  sendToParent(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    return new Promise<WindowMessage>((resolve, reject) => {
      this.sendRequest( window.parent, name, message, resolve, reject );
    });
  }

  sendToChildren(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    const err = new Error(`Children send message to children ${name}, ${message}`);
    console.log(err);
    return Promise.reject(err);
  }
}

export function inIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function addMessageListener(listener: (event: any) => void) {
  window.addEventListener('message', listener);
}

let connectorInstance: Connector;

export function getConnector(): Connector {
  if(!connectorInstance) {
    if (inIframe()) {
      connectorInstance = new FrameChildrenConnector();
    } else {
      if ((window as any)['TBWidget']) {
        connectorInstance = new FrameParentConnector();
      } else {
        connectorInstance = new LocalConnector();
      }
    }
  }
  return connectorInstance;
}
