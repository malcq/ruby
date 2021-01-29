import { getConnector, WindowMessage } from './connector';

type NumberCallbackFunction = (i: number) => void;

const easings: any = {
  linear(t: number): number {
    return t;
  },
  easeInQuad(t: number): number {
    return t * t;
  },
  easeOutQuad(t: number): number {
    return t * (2 - t);
  },
  easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic(t: number): number {
    return t * t * t;
  },
  easeOutCubic(t: number): number {
    return (--t) * t * t + 1;
  },
  easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart(t: number): number {
    return t * t * t * t;
  },
  easeOutQuart(t: number): number {
    return 1 - (--t) * t * t * t;
  },
  easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  easeInQuint(t: number): number {
    return t * t * t * t * t;
  },
  easeOutQuint(t: number): number {
    return 1 + (--t) * t * t * t * t;
  },
  easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
};

export const domUtilsMethod = {
  setIframeHeight: 'domUtilsSetIframeHeight',
  scrollToY: 'domUtilsScrollToY',
  stopScrolling: 'domUtilsStopScrolling',
};

export const domUtilsEvent = {
  onScrollMethodChanged: 'domUtilsOnScrollMethodChanged'
};

export enum ScrollMethod {
    LOCAL = 'local',
    PARENT = 'parent'
}

class DomUtils {
  
  private iframeHeightListeners: NumberCallbackFunction[] = [];
  private isScrolling: boolean = false;
  private currentScrolling: Promise<void> = Promise.resolve();

  constructor() {}

  addOnIframeHeightChangeListener(cb: NumberCallbackFunction): DomUtils {
    this.iframeHeightListeners.push(cb);
    return this;
  }

  setIframeHeight(height: number): Promise<void> {
    this.iframeHeightListeners.forEach(cb => cb(height));
    return Promise.resolve();
  }

  scrollToY(destinationOffsetToScroll: number, duration: number = 0, easing: string = 'linear'): Promise<void> {
    console.log(`scrollToY ${destinationOffsetToScroll}`);
    destinationOffsetToScroll -= window.innerHeight;
    if(destinationOffsetToScroll<0) {
      destinationOffsetToScroll = 0;
    }
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    this.isScrolling = false;

    this.currentScrolling = this.currentScrolling.then(() => {
      if ('requestAnimationFrame' in window === false || duration == 0) {
        window.scroll(0, destinationOffsetToScroll);
        return;
      }
      this.isScrolling = true;

      return new Promise<void>((resolve, reject) => {
        const scroll = () => {
          if(this.isScrolling) {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if(scrollableHeight < destinationOffsetToScroll) {
              destinationOffsetToScroll = scrollableHeight;
            }
            const now = 'now' in window.performance ? performance.now() : new Date().getTime();
            const time = Math.min(1, ((now - startTime) / duration));
            const timeFunction = easings[easing](time);
            window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

            if (Math.abs(window.pageYOffset - destinationOffsetToScroll) < 1) {
              resolve();
              return;
            }

            window.requestAnimationFrame(scroll);
          }
        };

        scroll();
      });
    })
      .then(() => {
        this.isScrolling = false;
        this.currentScrolling = Promise.resolve();
      });
    return this.currentScrolling;
  }

  stopScrolling(): Promise<void> {
    this.isScrolling = false;
    return Promise.resolve();
  }

  setScrollMethod(method: string) {
    getConnector().sendToChildren(domUtilsEvent.onScrollMethodChanged, {info: method});
  }
}

let domUtilsInstance: DomUtils;

export function initDomUtils(): DomUtils {
  if(!domUtilsInstance) {
    domUtilsInstance = new DomUtils();
    const connector = getConnector();
    connector.addParentListener(domUtilsMethod.setIframeHeight, {onMessage: (message: WindowMessage) => domUtilsInstance.setIframeHeight(message.info).then(() => ({}))});
    connector.addParentListener(
      domUtilsMethod.scrollToY, {
        onMessage: (message: WindowMessage) => domUtilsInstance.scrollToY(
          message.info.destinationOffsetToScroll,
          message.info.duration,
          message.info.easing
        ).then(() => ({}))
      }
    );
    connector.addParentListener(domUtilsMethod.stopScrolling, {onMessage: (message: WindowMessage) => domUtilsInstance.stopScrolling().then(() => ({}))});
  
    console.log('dom utils started');
  }
  return domUtilsInstance;
}
