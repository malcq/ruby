import {
  Injectable,
  NgZone,
} from '@angular/core';

import { WindowRef } from '../_core/window-ref';
import { getConnector, WindowMessage, Listener, inIframe } from '../_parent/connector';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private connector = getConnector();
  constructor(
    private zone: NgZone,
  ) { }
  send(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    return new Promise((resolve, reject) => {
      this.zone.runOutsideAngular(() => {
        this.connector.sendToParent(name, message)
          .then(message => {
            this.zone.run(() => {
              resolve(message);
            });
          }, err => {
            this.zone.run(() => {
              reject(err);
            });
          });
      });
    });
  }
  addEventListener(name: string, listener: Listener) {
    this.connector.addChildrenListener(name, {
      onMessage: (message: WindowMessage): Promise<WindowMessage> => {
        return new Promise((resolve, reject) => {
          this.zone.run(() => {
            listener.onMessage(message).then(resolve, reject);
          });
        });
      }
    });
  }

  inFrame(): boolean {
    return inIframe();
  }
}
