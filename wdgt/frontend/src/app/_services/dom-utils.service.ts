import { Injectable, NgZone } from '@angular/core';
import { Subject ,  Observable ,  of ,  from } from 'rxjs';
import * as zenScroll from 'zenscroll';

import { WindowRef } from '../_core/window-ref';

import {
  domUtilsMethod,
  domUtilsEvent,
  ScrollMethod,
  initDomUtils,
} from '../_parent/dom-utils';

import { ParentService } from './parent.service';

export interface Size {
  width: number;
  height: number;
}

export interface NotificationAction {
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomUtilsService {
  private scrollMethod: ScrollMethod = ScrollMethod.LOCAL;
  private onResizeSubject = new Subject<Size>();
  private images: HTMLImageElement[] = [];
  private onlineState = true;
  private onlineStateSubject = new Subject<boolean>();
  private imagesForOfflineLoaded = false;
  private domUtils = initDomUtils();

  constructor(
    private zone: NgZone,
    private win: WindowRef,
    private parentService: ParentService,
  ) {
    this.zone.runOutsideAngular(() => {
      (<any>window).zenscroll = zenScroll;
      this.win.nativeWindow.addEventListener('resize', () => {
        this.onResizeSubject.next(this.getSize());
      });
    });

    this.win.nativeWindow.addEventListener('offline', () => {
      if (this.onlineState) {
        this.onlineState = false;
        this.onlineStateSubject.next(this.onlineState);
      }
    });

    this.win.nativeWindow.addEventListener('online', () => {
      if (!this.onlineState) {
        this.onlineState = true;
        this.onlineStateSubject.next(this.onlineState);
      }
    });
    
    this.parentService.addEventListener(domUtilsEvent.onScrollMethodChanged, {
      onMessage: (message) => {
        console.log(message);
        this.scrollMethod = message.info == 'local'? ScrollMethod.LOCAL: ScrollMethod.PARENT;
        return Promise.resolve({});
      }
    });
  }

  getSize(): Size {
    const document: any = this.win.nativeWindow.document;
    return {
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
    };
  }

  scrollIntoViewByParent(parent, el, duration?, edgeOffset?): Promise<any> {
    return new Promise((resolve) => {
      this.zone.runOutsideAngular(() => {
        const defaultDuration = duration ? duration : 0;
        const defaultEdgeOffset = edgeOffset ? edgeOffset : 0;
        const myScroller = zenScroll.createScroller(parent,  defaultDuration,  defaultEdgeOffset);
        myScroller.to(el, defaultDuration, () => {
          resolve();
        });
      });
    });
  }

  scrollIntoView(destination: HTMLElement, duration: number = 0, easing: string = 'linear'): Observable<void> {
    const elemRect = destination.getBoundingClientRect();
    const destinationOffsetToScroll = elemRect.top;

    return this.scrollToY(destinationOffsetToScroll, duration, easing);
  }

  scrollToY(destinationOffsetToScroll: number, duration: number = 0, easing: string = 'linear'): Observable<void> {
    if(this.scrollMethod == ScrollMethod.LOCAL) {
      return from(
        new Promise((resolve, reject) => {
          this.zone.runOutsideAngular(() => {
            this.domUtils.scrollToY(destinationOffsetToScroll, duration, easing).then(resolve, reject);
          });
      }));
    } else {
      return from(
        this.parentService.send(domUtilsMethod.scrollToY, {info: {destinationOffsetToScroll, duration, easing}})
          .then(message => null)
      );
    }
  }

  stopScrolling(): Observable<void> {
    if (this.scrollMethod === ScrollMethod.LOCAL) {
      return from(this.domUtils.stopScrolling());
    } else {
      return from(
        this.parentService.send(domUtilsMethod.stopScrolling, {})
        .then(message => null)
      );
    }
  }

  setIframeHeight(height: number): Observable<void> {
    return from(
      this.parentService.send(domUtilsMethod.setIframeHeight, {info: height})
        .then(message => null)
    );
  }

  onResize(): Observable<Size> {
    return this.onResizeSubject.asObservable();
  }

  preload(...files: string[]): void {
    files.forEach(file => {
      const image = new Image();
      image.src = file;
      this.images.push(image);
    });
  }

  onOnlineStateChange(): Observable<boolean> {
    return this.onlineStateSubject.asObservable();
  }

  isOnline(): boolean {
    return this.onlineState;
  }

  preloadImagesForOffline(): void {
    if (!this.imagesForOfflineLoaded) {
      this.imagesForOfflineLoaded = true;
      setTimeout(() => {
        this.preload('/assets/img/soundwave.png');
      }, 1000);
    }
  }
}
