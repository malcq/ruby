import { getConnector, WindowMessage } from './connector';

const MOBILE_RESOLUTION_MAX = 576;
export enum Themes {
  default = 'default',
  blue = 'blue'
}

export interface IframeOptions {
  company: string;
  widgetUrl: string;
  useIphoneScrolling: boolean;
  theme: Themes;
  hashcode?: string;
  isMobile?: boolean;
}

export const IFRAME_DEFAULT_CONFIG: IframeOptions = {
  company: '3back',
  widgetUrl: 'https://devapp.3back.ai',
  useIphoneScrolling: false,
  theme: Themes.default
};

export const configMethod = {
  get: 'configGet',
};

export const configEvent = {
};

class Config {
  private config: IframeOptions = IFRAME_DEFAULT_CONFIG;
  constructor() {
    const hashcodeMatch = /(?:\?|&)hashcode=([^&]+)/.exec(window.location.search);
    if(hashcodeMatch && hashcodeMatch[1]) {
      this.config.hashcode = hashcodeMatch[1];
    }

    const themeMatch = /(?:\?|&)theme=([^&]+)/.exec(window.location.search);
    if(themeMatch && themeMatch[1]) {
      if(themeMatch[1] === 'blue') {
        this.config.theme = Themes.blue;
      }
    }

    this.config.isMobile = document.documentElement.clientWidth < MOBILE_RESOLUTION_MAX;
  }

  set(config: IframeOptions) {
    this.config = config;
  }

  get(): Promise<IframeOptions> {
    return Promise.resolve(this.config);
  }
}

let configInstance: Config;

export function initConfig(): Config {
  if(!configInstance) {
    configInstance = new Config();
    const connector = getConnector();
    connector.addParentListener(configMethod.get, {onMessage: (message: WindowMessage) => configInstance.get().then(config => ({info: config}))});

    console.log('config started');
  }
  return configInstance;
}
