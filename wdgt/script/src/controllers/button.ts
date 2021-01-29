import { WidgetOptions } from '../config';
import * as animationUtils from '../utils/animations';
import * as utils from '../utils/index';

export default class ChatButton {
  private config: WidgetOptions;
  _instance: HTMLElement = null;

  constructor(config: WidgetOptions) {
    this.config = config;
  }

  init() {
    this._instance = this.config.button || this.createButton();
  }

  get initialized() {
    return !!this._instance;
  }

  get isInitialized(): boolean {
    if (this._instance) {
      return true;
    }
    return false;
  }

  get isHidden(): boolean {
    if (this._instance.style.display === 'block') {
      return false;
    }
    return true;
  }

  destroy() {
    this.removeButton();
  }

  showButton() {
    this._instance.style.display = 'block';
  }

  hideButton() {
    this._instance.style.display = 'none';
  }

  addEvent(type: string, cb: () => void) {
    this._instance.addEventListener(type, cb);
  }

  async toOpenState(): Promise<void> {
    this._instance.classList.remove('visible');
  }
  
  async toCloseState(): Promise<void> {
    this._instance.classList.add('visible');
  }

  private createButton(): HTMLElement {
    const template = `
      <button id="${this.config.widgetButtonId}" class="tb-button visible">
        <div class="top-bubble">
          <div class="top-bubble__bubble"></div>
          <div class="top-bubble__content">
            <div class="top-bubble__dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="top-bubble__description">
              Help
            </div>
          </div>
        </div>

        <div class="bottom-bubble">
          <div class="bottom-bubble__dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="bottom-bubble__cross-icon">
            <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="1.0-Desktop-Selection-Single-Bubble" transform="translate(-1343.000000, -971.000000)">
                  <g id="ic-/-close" transform="translate(1338.000000, 966.000000)">
                    <g id="baseline-close-24px">
                      <polygon id="Path" fill="#FFFFFF" points="19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12"></polygon>
                      <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </button>
    `;
    const button = utils.convertStringToHtml(template);
    this.config.container.appendChild(button);
    return button;
  }

  private removeButton() {
    if (!this.isInitialized) {
      return;
    }
    this._instance.remove();
  }
}

