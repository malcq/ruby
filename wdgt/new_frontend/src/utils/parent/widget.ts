import { getConnector, WindowMessage } from './connector';
import { initConfig } from './config';

type CallbackFunction = () => void;
type NumberCallbackFunction = (i: number) => void;

export const widgetMethod = {
  close: 'widgetClose',
  onLoad: 'widgetOnLoad',
  setIframeHeight: 'widgetSetIframeHeight',
  showInput: 'widgetShowInput',
  hideInput: 'widgetHideInput',
  messageFromInput: 'widgetMessageFromInput',
};

export const widgetEvent = {
  onInputAnswer: 'widgetOnInputAnswer',
  onOpen: 'widgetOnOpen',
  onClose: 'widgetOnClose',
};

class Widget {
  private closeListeners: CallbackFunction[] = [];
  private loadListeners: CallbackFunction[] = [];
  private inputFrameContainer: HTMLElement | null = null;
  private iFrame: HTMLIFrameElement | null = null;
  private inputReqId: number = 0;
  private head: string = '';
  private body: string = '';

  addOnCloseListener(cb: CallbackFunction): Widget {
    this.closeListeners.push(cb);
    return this;
  }

  addOnLoadListener(cb: CallbackFunction): Widget {
    this.loadListeners.push(cb);
    return this;
  }

  setInputFrameContainer(inputFrameContainer: HTMLElement): Widget {
    this.inputFrameContainer = inputFrameContainer;
    return this;
  }

  close(): Promise<void> {
    this.closeListeners.forEach(cb => cb());
    return Promise.resolve();
  }

  onLoad(): Promise<void> {
    this.loadListeners.forEach(cb => cb());
    return Promise.resolve();
  }

  openWidget() {
    getConnector().sendToChildren(widgetEvent.onOpen, {});
  }

  closeWidget() {
    getConnector().sendToChildren(widgetEvent.onClose, {});
  }

  async showInput(head: string, body: string, reqId: number): Promise<void> {
    const config = await initConfig().get();
    if(this.inputFrameContainer && this.iFrame) {
      this.iFrame = document.createElement("iframe");
      this.iFrame.src = `${config.widgetUrl}/input.html`;
      this.inputFrameContainer.innerHTML = "";
      this.head = head;
      this.body = body;
      this.inputReqId = reqId;
      this.inputFrameContainer.appendChild(this.iFrame);
      this.inputFrameContainer.style.display = 'block';
    }
  }

  hideInput(): Promise<void> {
    if(this.inputFrameContainer && this.iFrame) {
      this.iFrame.style.transition = '100ms ease-in-out transform';
      this.iFrame.style.transform = 'translateY(150%)';
      const handleAnimationEnd = () => {
        if(this.inputFrameContainer && this.iFrame) {
          this.iFrame.removeEventListener('animationend', handleAnimationEnd);
          this.inputFrameContainer.style.display = 'none';
        }
      }
      this.iFrame.addEventListener('animationend', handleAnimationEnd);
    }
    return Promise.resolve();
  }

  messageFromInput(data: any): Promise<void> {
    if(this.iFrame && this.iFrame.contentWindow) {
      if(data.type === 'load') {
        this.iFrame.contentWindow.postMessage({
          name: 'show',
          head: this.head,
          body: this.body,
        }, "*");
      }
      if(data.type === 'height') {
        this.iFrame.style.height = `${data.height}px`;
      }
      if(data.type === 'answer') {
        getConnector().sendToChildren(widgetEvent.onInputAnswer, {info: {
          reqId: this.inputReqId,
          message: data.message,
        }});
      }
    }
    return Promise.resolve();
  }
}

let widgetInstance: Widget;

export function initWidget(): Widget {
  if(!widgetInstance) {
    widgetInstance = new Widget();
    const connector = getConnector();
    connector.addParentListener(widgetMethod.close, {onMessage: (message: WindowMessage) => widgetInstance.close().then(() => ({}))});
    connector.addParentListener(widgetMethod.onLoad, {onMessage: (message: WindowMessage) => widgetInstance.onLoad().then(() => ({}))});
    connector.addParentListener(widgetMethod.showInput, {onMessage: (message: WindowMessage) => widgetInstance.showInput(message.info.head, message.info.body, message.info.reqId).then(() => ({}))});
    connector.addParentListener(widgetMethod.hideInput, {onMessage: (message: WindowMessage) => widgetInstance.hideInput().then(() => ({}))});
    connector.addParentListener(widgetMethod.messageFromInput, {onMessage: (message: WindowMessage) => widgetInstance.messageFromInput(message.info).then(() => ({}))});
  
    console.log('widget started');
  }
  return widgetInstance;
}

