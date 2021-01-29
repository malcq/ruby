import {
  Injectable,
  ElementRef
} from '@angular/core';

import {
  Observable,
  from,
  BehaviorSubject,
} from 'rxjs';

import {
  widgetMethod,
  widgetEvent,
  initWidget,
} from '../_parent/widget';

import { ParentService } from './parent.service';
import { WindowRef } from '../_core/window-ref';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private currentAnswerId = 1;
  private answers = new Map<number, (answer: any) => void>();

  private onOpenEvent = new BehaviorSubject<boolean>(false);
  onOpen$ = this.onOpenEvent.asObservable();

  constructor(
    private win: WindowRef,
    private parentService: ParentService
  ) {
    initWidget();
    this.parentService.addEventListener(widgetEvent.onInputAnswer, {
      onMessage: (message) => {
        this.answers.get(message.info.reqId)(message.info);
        return Promise.resolve({});
      }
    });

    this.parentService.addEventListener(widgetEvent.onOpen, {
      onMessage: () => {
        this.onOpenEvent.next(true);
        return Promise.resolve({});
      }
    })
  }

  isWidget(): boolean {
    return this.parentService.inFrame();
  }

  close(): Observable<void> {
    return from(
      this.parentService.send(widgetMethod.close, {})
        .then(() => {})
    );
  }

  onLoad(): Observable<void> {
    return from(
      this.parentService.send(widgetMethod.onLoad, {})
        .then(() => {})
    );
  }

  getConfig(): Observable<any> {
    return from(
      this.parentService.send(widgetMethod.getConfig, {})
        .then(message => message.info)
    );
  }

  showInput(head: string, body: string, returnedData: (answer: any) => void): Observable<void> {
    const reqId = this.currentAnswerId++;
    this.answers.set(reqId, returnedData);
    return from(
      this.parentService.send(widgetMethod.showInput, {info: {head, body, reqId}})
        .then(() => {})
    );
  }

  showCurrentInput(hostRef: ElementRef, script: string, returnedData: (answer: any) => void): Observable<void> {
    const head = this.win.nativeWindow.document.getElementsByTagName('head')[0].innerHTML +
      `<script type="text/javascript">(${script})();</script>`;
    const input = hostRef.nativeElement.outerHTML.replace('style="visibility: hidden;"', '');
    return this.showInput(head, input, returnedData);
  }

  hideInput(): Observable<void> {
    return from(
      this.parentService.send(widgetMethod.hideInput, {})
        .then(() => {})
    );
  }
}
