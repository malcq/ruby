import { WidgetOptions } from '../config/index';

import Button from './button';
import WidgetIframe from './iframe';

export default class Widget {
  private config: WidgetOptions;
  private _button: Button = null;
  private _iframe: WidgetIframe = null;
  private openWidgetCb: () => void = () => undefined;
  private closeWidgetCb: () => void = () => undefined;

  constructor(config: WidgetOptions) {
    this.config = config;
    this._button = new Button(config);
    this._iframe = new WidgetIframe(config);
  }

  init() {
    this._iframe.init();
  }

  async openWidget(): Promise<void> {
    this.config.blurredElements.forEach((element: HTMLElement) => element.classList.add('checkit-blurred-section'));
    await this._iframe.showIframe()
    this._button.toOpenState();
    this.config.container.classList.add('open');
    this.openWidgetCb();
  }

  async closeWidget(): Promise<void> {
    this.config.blurredElements.forEach((element: HTMLElement) => element.classList.remove('checkit-blurred-section'));
    await Promise.all([
      this._button.toCloseState(),
      this._iframe.hideIframe(),
    ])
    this.config.container.classList.remove('open');
    this.closeWidgetCb();
  }

  private initButton() {
    this._button.init();
    this._button.addEvent('click', () => {
      if(this._iframe.isHidden) {
        this.openWidget();
      } else {
        this.closeWidget();
      }
    });
  }

  get iframe(): HTMLElement {
    return this._iframe.iframe;
  }

  get inputContainer(): HTMLElement {
    return this._iframe.inputContainer;
  }

  setLoadingState() {
    if (!this._button.initialized) {
      this.initButton();
    }
  }

  setIframeHeight(height: number) {
    this._iframe.setHeight(height);
  }

  setOnChangeScrollMethod(event: (string) => void): Widget {
    this._iframe.onChangeScrollMethod = event;
    return this;
  }

  setOnChangeInputContainer(event: (HTMLElement) => void): Widget {
    this._iframe.onChangeInputContainer = event;
    return this;
  }

  setOnOpenWidget(ev: () => void) {
    this.openWidgetCb = ev;
    return this;
  }

  setOnCloseWidget(ev: () => void) {
    this.closeWidgetCb = ev;
    return this;
  }
}
