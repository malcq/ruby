import * as utils from '../utils/index';
import { Themes, IframeOptions, IFRAME_DEFAULT_CONFIG, initConfig } from '../../../new_frontend/src/utils/parent/config';

const DOM_ELEMENT_PREFIX = 'tb-widget';

export interface InitialOptions {
  hiddenOnStart?: boolean;
  widgetContainerId?: string;
  widgetIframeId?: string;
  widgetButtonId?: string;
  blurredElements?: HTMLElement[];
  container?: HTMLElement;
  button?: HTMLElement;
  useIphoneScrolling?: boolean;
  theme?: Themes;
  hashcode?: string;
}

export interface WidgetOptions {
  widgetUrl: string;
  hiddenOnStart: boolean;
  widgetContainerId: string;
  widgetIframeIdContainer: string;
  widgetIframeId: string;
  widgetButtonId: string;
  widgetBodyMobileClass: string;
  blurredElements: HTMLElement[];
  container: HTMLElement;
  iframeConfig: any;
  useIphoneScrolling: boolean;
  button?: HTMLElement;
  theme?: Themes;
}

const DEFAULT_CONFIG = {
  widgetUrl: IFRAME_DEFAULT_CONFIG.widgetUrl,
  hiddenOnStart: false,
  blurredElements: [],
  useIphoneScrolling: IFRAME_DEFAULT_CONFIG.useIphoneScrolling,
  // ids
  widgetContainerId: DOM_ELEMENT_PREFIX,
  widgetIframeIdContainer: `${DOM_ELEMENT_PREFIX}-iframe`,
  widgetIframeId: `${DOM_ELEMENT_PREFIX}-iframe`,
  widgetButtonId: `${DOM_ELEMENT_PREFIX}-open-btn`,
  widgetBodyMobileClass: `${DOM_ELEMENT_PREFIX}-mobile-expanded`,
};

const DEV_CONFIG = {
  // widgetUrl: 'http://192.168.0.113:3000',
  widgetUrl: 'http://localhost:3000',
};

const MAX_CONFIG = {
  widgetUrl: 'https://webapp2.pashkovy.ru',
};

const PROD_CONFIG = {
  widgetUrl: 'https://devwidget.3back.ai',
  // widgetUrl: 'http://localhost:4200',
};

function getContainer(
  widgetContainerId: string,
  useIphoneScrolling: boolean,
  { theme = Themes.default } = {}
): HTMLElement {
  let container: HTMLElement = document.getElementById(widgetContainerId);
  if(!container) {
    container = document.createElement('div');
    container.setAttribute('id', widgetContainerId);
    container.classList.add('tb-widget');
    if(useIphoneScrolling) {
      container.classList.add('iphone-scrolling');
    }
    if (theme !== Themes.default) {
      container.classList.add(`${theme}-theme`);
    }
    container.setAttribute('name', 'xz35ehp0');
    document.body.appendChild(container);
  }
  return container;
}

export async function createConfig(): Promise<WidgetOptions> {
  let clientOptions: InitialOptions = window['tbwidgetConfig'];
  let hashcode: string | null = null;

  try {
    const currentScript = document.currentScript.getAttribute('src');
    const currentScriptUrl = new URL(currentScript);
    clientOptions = { hashcode }
  } catch (err) {
    clientOptions = { hashcode:  (window['tbwidgetConfig'] as any).hashcode }
  }

  try {
    const options: InitialOptions = clientOptions || {};
    let widgetUrl: string;
    if (__ENV__ === 'development') {
      widgetUrl = DEV_CONFIG.widgetUrl;
    } else if (__ENV__ === 'maxim') {
      widgetUrl = MAX_CONFIG.widgetUrl;
    } else {
      widgetUrl = PROD_CONFIG.widgetUrl;
    }

    const widgetContainerId: string = options.widgetContainerId || DEFAULT_CONFIG.widgetContainerId;

    const useIphoneScrolling = (options.useIphoneScrolling === undefined? DEFAULT_CONFIG.useIphoneScrolling: options.useIphoneScrolling) && utils.getBrowser() == utils.BrowserType.IPHONE;

    const theme = options.theme || Themes.default;
    const configurer = initConfig();
    const defaultConfig = await configurer.get();

    const iframeConfig: IframeOptions = {
      ...defaultConfig,
      useIphoneScrolling,
      widgetUrl,
      theme,
      hashcode: options.hashcode || null,
    };
    configurer.set(iframeConfig);

    const container: HTMLElement = (useIphoneScrolling || !options.container)
      ? getContainer(widgetContainerId, useIphoneScrolling, { theme })
      : options.container;

    return {
      widgetUrl,
      hiddenOnStart: options.hiddenOnStart || DEFAULT_CONFIG.hiddenOnStart,
      widgetContainerId,
      widgetIframeId: options.widgetIframeId || DEFAULT_CONFIG.widgetIframeId,
      widgetButtonId: options.widgetButtonId || DEFAULT_CONFIG.widgetButtonId,
      blurredElements: options.blurredElements || DEFAULT_CONFIG.blurredElements,
      useIphoneScrolling,
      container,
      button: options.button,
      widgetIframeIdContainer: DEFAULT_CONFIG.widgetIframeIdContainer,
      iframeConfig,
      widgetBodyMobileClass: DEFAULT_CONFIG.widgetBodyMobileClass,
      theme
    }
  } catch (err) {
    console.error('Config build error', err);
    DEFAULT_CONFIG.useIphoneScrolling = DEFAULT_CONFIG.useIphoneScrolling && utils.getBrowser() == utils.BrowserType.IPHONE;
    const container: HTMLElement = getContainer(DEFAULT_CONFIG.widgetContainerId, DEFAULT_CONFIG.useIphoneScrolling);
    return {
      ...DEFAULT_CONFIG,
      iframeConfig: IFRAME_DEFAULT_CONFIG,
      container
    };
  }
};
