import { WidgetOptions } from '../config/index';
import * as animationUtils from '../utils/animations';
import * as utils from '../utils/index';

const IFRAME_CLASSNAME = 'tb-widget-iframe';
const IFRAME_CONTAINER_CLASSNAME = 'tb-widget-iframe-container';
const LOADING_CONTAINER_CLASSNAME = 'tb-widget-iframe-container__loading-spinner';
const BODY_FIX_CLASS = 'tb-widget-mobile-expanded';
const FREEZE_META_ID = 'tb-widget-freeze-meta';

const key = 'LjoQFTPgBYqGH0xH';

const VISIBILITY_TYPES = {
  hidden: 'none',
  shown: 'flex',
};

export default class WidgetIframe {
  private config: WidgetOptions;
  private _iframeContainer: HTMLElement = null;
  private _arrow: HTMLElement = null;
  private _iframe: HTMLElement = null;
  private _inputContainer: HTMLElement = null;
  private loaded: boolean = false;
  private loadedPromise: Promise<void>;
  private loadedResolve: () => void = null;
  private fullScreen: boolean = false;

  private scrollPositionX: number;
  private scrollPositionY: number;
  public onChangeScrollMethod: (string) => void;
  public onChangeInputContainer: (HTMLElement) => void;
  private useIphoneScrolling: boolean;
  private isMobile = false;

  constructor(config: WidgetOptions) {
    this.config = config;
  }

  // Parametrize options if needed
   async init(): Promise<void> {
    if(this.loaded) {
      return Promise.resolve();
    }
    if(this.loadedResolve) {
      this.loadedResolve();
    }
    if (this.loadedPromise) { return this.loadedPromise; }
    
    this.loadedPromise = new Promise((resolve, reject) => {
      this.isMobile = utils.getBrowser() == utils.BrowserType.IPHONE;
      this.useIphoneScrolling = this.config.useIphoneScrolling && this.isMobile;
      
      const shade = document.createElement('div');
      shade.classList.add('tb-widget-shade');
      this.config.container.appendChild(shade);

      this._arrow = document.createElement('div');
      this._arrow.classList.add('tb-widget-arrow');
      this.config.container.appendChild(this._arrow);

      this._iframeContainer = this.createIframe(this.config);
      this.config.container.appendChild(this._iframeContainer);

      this._iframeContainer.classList.add('init');

      this.loadedResolve = resolve;
    })
      .then(() => {
        this.loadedPromise = null;
        this.loadedResolve = null;
        this.loaded = true;
        this._iframeContainer.classList.remove('init');
        this._iframeContainer.style.display = VISIBILITY_TYPES.shown;
        
        if (!this.isMobile) {
          this._arrow.style.display = VISIBILITY_TYPES.shown;
        }
      });
  }

  async hideIframe(): Promise<void> {
    if (this.isBodyFreezed()) {
      this.unfreezeBody();
    }

    if (this.isMobile) {
      await animationUtils.animateElementAndHide(
        this._iframeContainer,
        animationUtils.ANIMATION_TYPES.fadeOut
      );
    } else {
      await Promise.all([
        animationUtils.animateElementAndHide(
          this._iframeContainer,
          animationUtils.ANIMATION_TYPES.fadeOut
        ),
        animationUtils.animateElementAndHide(
          this._arrow,
          animationUtils.ANIMATION_TYPES.fadeOut
        )
      ]);
    }
  }

  async showIframe(): Promise<void> {
    if (!this.loaded) {
      await this.init()
    }
    this._iframeContainer.style.display = VISIBILITY_TYPES.shown;

    if (this.isMobile) {
      animationUtils.animateElement(
        this._iframeContainer,
        animationUtils.ANIMATION_TYPES.zoomIn
      )
      .then(() => {
        if (this.isMobile && !this.useIphoneScrolling) {
          this.freezeBody();
        }
      });
    } else {
      this._arrow.style.display = VISIBILITY_TYPES.shown;

      Promise.all([
        animationUtils.animateElement(
          this._arrow,
          animationUtils.ANIMATION_TYPES.zoomIn
        ),
        animationUtils.animateElement(
          this._iframeContainer,
          animationUtils.ANIMATION_TYPES.zoomIn
        )
      ])
      .then(() => {
        if (this.isMobile && !this.useIphoneScrolling) {
          this.freezeBody();
        }
      });
    }
  }

  setLoadingState(): void {
    if(this.loadedResolve) {
      this.loadedResolve();
    }
  }

  get iframe(): HTMLElement {
    return this._iframe;
  }

  get inputContainer(): HTMLElement {
    return this._inputContainer;
  }

  get isInitialized(): boolean {
    return this.loaded;
  }

  get isHidden(): boolean {
    if (!this.loaded) { return true; }
    if (this._iframeContainer.style.display === VISIBILITY_TYPES.hidden) {
      return true;
    }
    return false;
  }

  private createIframeContainer(config: WidgetOptions): HTMLElement {
    const iframeContainer = document.createElement('div');
    iframeContainer.setAttribute('id', config.widgetContainerId + "121");
    iframeContainer.classList.add(IFRAME_CONTAINER_CLASSNAME);
    return iframeContainer;
  }

  private createIframe(config: WidgetOptions): HTMLElement {
    const iframeContainer = this.createIframeContainer(config);
    const iframe = document.createElement('iframe');
    iframe.classList.add(IFRAME_CLASSNAME);
    iframe.setAttribute('src', config.widgetUrl);
    iframe.setAttribute('id', config.widgetIframeId);
    // iframe.style.display = VISIBILITY_TYPES.hidden;

    iframeContainer.appendChild(iframe);
    if(this.useIphoneScrolling) {
      this._inputContainer = document.createElement('div');
      this._inputContainer.classList.add('input-container');
      iframeContainer.appendChild(this._inputContainer);
      if(this.onChangeInputContainer) {
        this.onChangeInputContainer(this._inputContainer);
      }
    }
    this._iframe = iframe;
    return iframeContainer;
  }

  private setLoading() {
    this.iframe.style.display = VISIBILITY_TYPES.hidden;
  }
  
  private setNormal() {
    this.iframe.style.display = VISIBILITY_TYPES.shown;
  }

  private createLoadingSpinner() {
    const template = `
      <div class="${LOADING_CONTAINER_CLASSNAME}">
        <div class="lds-dual-ring"></div>
      </div>
    `;
    return utils.convertStringToHtml(template);
  }

  changeFullScreen(fullScreen: boolean) {
    if(this.useIphoneScrolling) {
      const attrName = `data-style-${key}`;
      if(!this.fullScreen && fullScreen) {
        this.fullScreen = true;
        this.onChangeScrollMethod('parent');
        this.saveBodyScrollPosition();

        this.config.container.classList.add('fullscreen');
        for (var i = 0; i < document.body.children.length; i++) {
          const node = document.body.children[i];
          if(node.getAttribute('id') != this.config.widgetContainerId) {
            if(node.getAttribute('style')) {
              node.setAttribute(attrName, node.getAttribute('style'));
            }
            node.setAttribute('style', 'display: none');
          }
        }
      }
      if(this.fullScreen && !fullScreen) {
        this.fullScreen = false;
        this.onChangeScrollMethod('local');
        this.config.container.classList.remove('fullscreen');
        for (var i = 0; i < document.body.children.length; i++) {
          const node = document.body.children[i];
          if(node.getAttribute('id') != this.config.widgetContainerId) {
            if(node.getAttribute(attrName)) {
              node.setAttribute('style', node.getAttribute(attrName));
            } else {
              node.removeAttribute('style');
            }
          }
        }
        setTimeout(() => {
          this.restoreBodyScrollPosition();
        }, 100);
      }
    }
  }

  setHeight(height: number) {
    if(this.useIphoneScrolling) {

      console.log(`setHeight ${height} ${this.fullScreen}`);
      if(this.fullScreen) {
        if(!height) {
          this.changeFullScreen(false);
          this.config.container.style.height = '100%';
        } else {
          this.config.container.style.height = `${height}px`;
        }
      }
      if(!this.fullScreen && height) {
        this.changeFullScreen(true);
        this.config.container.style.height = `${height}px`;
      }
    }
  }

  /**
   * TODO: Extract body functions to another class or utils file
   */
  private freezeBody() {
    this.saveBodyScrollPosition();
    this.addFreezeMeta();
    this.fixBodyForMobile();
  }

  private unfreezeBody() {
    this.removeBodyFix();
    this.removeFreezeMeta();
    this.restoreBodyScrollPosition();
  }

  private isBodyFreezed() {
    return document.body.classList.contains(BODY_FIX_CLASS);
  }

  private fixBodyForMobile() {
    if (this.isBodyFreezed()) { return; }
    document.body.classList.add(BODY_FIX_CLASS);
  }

  private removeBodyFix() {
    if (!this.isBodyFreezed()) { return; }
    document.body.classList.remove(BODY_FIX_CLASS);
  }

  private saveBodyScrollPosition() {
    this.scrollPositionX = window.pageXOffset;
    this.scrollPositionY = window.pageYOffset;
  }

  private restoreBodyScrollPosition() {
    window.scroll(this.scrollPositionX, this.scrollPositionY);
  }

  private createMetaForFreeze(): HTMLElement {
    const metaEl = document.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=0');
    metaEl.setAttribute('id', `${FREEZE_META_ID}`);
    return metaEl;
  }

  private get isFreezeMetaEnabled(): boolean {
    const metaEl = document.getElementById(FREEZE_META_ID);
    if (metaEl) { return true; }
    return false;
  }

  private addFreezeMeta() {
    if (this.isFreezeMetaEnabled) { return; }
    const freezeMetaEl = this.createMetaForFreeze();
    document.head.appendChild(freezeMetaEl);
  }

  private removeFreezeMeta() {
    if (!this.isFreezeMetaEnabled) { return; }
    const freezeMetaEl = document.getElementById(FREEZE_META_ID);
    freezeMetaEl.remove();
  }

}
