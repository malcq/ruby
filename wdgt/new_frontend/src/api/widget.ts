import {
  widgetMethod,
  widgetEvent,
  initWidget,
} from '../utils/parent/widget';

import {
  configMethod,
  initConfig,
} from '../utils/parent/config';

import { parentService } from './parent';

type CallbackFunction = () => void;

class WidgetService {
  private currentAnswerId = 1;
  private answers = new Map<number, (answer: any) => void>();

  private openListeners: CallbackFunction[] = [];
  private closeListeners: CallbackFunction[] = [];

  constructor(
  ) {
    initWidget();
    initConfig();
    parentService.addEventListener(widgetEvent.onInputAnswer, {
      onMessage: (message) => {
        const answer = this.answers.get(message.info.reqId);
        if(answer) {
          answer(message.info);
        }
        return Promise.resolve({});
      }
    });

    parentService.addEventListener(widgetEvent.onOpen, {
      onMessage: () => {
        this.openListeners.forEach(cb => cb());
        return Promise.resolve({});
      }
    })

    parentService.addEventListener(widgetEvent.onClose, {
      onMessage: () => {
        this.closeListeners.forEach(cb => cb());
        return Promise.resolve({});
      }
    })
  }

  addOnOpenListener(cb: CallbackFunction): WidgetService {
    this.openListeners.push(cb);
    return this;
  }


  addOnCloseListener(cb: CallbackFunction): WidgetService {
    this.closeListeners.push(cb);
    return this;
  }


  isWidget(): boolean {
    return parentService.inFrame();
  }

  close(): Promise<void> {
    return parentService.send(widgetMethod.close, {})
      .then(() => {});
  }

  onLoad(): Promise<void> {
    return parentService.send(widgetMethod.onLoad, {})
      .then(() => {});
  }

  async getConfig(): Promise<any> {
    const message = await parentService.send(configMethod.get, {});
    return message.info;
  }

  showInput(head: string, body: string, returnedData: (answer: any) => void): Promise<void> {
    const reqId = this.currentAnswerId++;
    this.answers.set(reqId, returnedData);
    return parentService.send(widgetMethod.showInput, {info: {head, body, reqId}})
      .then(() => {});
  }

  /*showCurrentInput(hostRef: ElementRef, script: string, returnedData: (answer: any) => void): Promise<void> {
    const head = this.win.nativeWindow.document.getElementsByTagName('head')[0].innerHTML +
      `<script type="text/javascript">(${script})();</script>`;
    const input = hostRef.nativeElement.outerHTML.replace('style="visibility: hidden;"', '');
    return this.showInput(head, input, returnedData);
  }*/

  hideInput(): Promise<void> {
    return parentService.send(widgetMethod.hideInput, {})
      .then(() => {});
  }
}

export const widgetService = new WidgetService();