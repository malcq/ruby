import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { Type } from '@angular/core';

@Injectable()
export class DialogService {
  private subject = new Subject<any>();

  constructor() {}

  open(component: Type<any>, options: any): any {
    const close = new Subject<any>();
    const onClose = new Subject<any>();
    this.subject.next({ component, options, events: { close, onClose } });
    return {
      afterClosed: () => onClose.asObservable(),
      close: (result) => { close.next(result); }
    };
  }

  onOpen(): Observable<any> {
    return this.subject.asObservable();
  }
}
