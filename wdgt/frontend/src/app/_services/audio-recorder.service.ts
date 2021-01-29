import {
  Injectable,
  NgZone,
} from '@angular/core';
import { Subject ,  Observable ,  from ,  of } from 'rxjs';

import { environment } from '../../environments/environment';
import { BaseFile } from '../_models';
import { WindowRef } from '../_core/window-ref';

import { ParentService } from './parent.service';

import {
  audioRecorderMethod,
  audioRecorderEvent,
  initAudioRecorder,
} from '../_parent/audio-recorder';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {

  private onLevelSource = new Subject<number>();
  onLevel = this.onLevelSource.asObservable();

  constructor(
    private win: WindowRef,
    private zone: NgZone,
    private parentService: ParentService,
  ) {
    initAudioRecorder();
    this.parentService.addEventListener(audioRecorderEvent.onLevel, {
      onMessage: (message) => {
        this.onLevelSource.next(message.info);
        return Promise.resolve({});
      }
    });
  }

  init(): Observable<void> {
    return from(this.parentService.send(audioRecorderMethod.init).then(() => {}));
  }

  stop(): Observable<void> {
    return from(this.parentService.send(audioRecorderMethod.stop).then(() => {}));
  }

  startCapture(): Observable<void> {
    return from(this.parentService.send(audioRecorderMethod.startCapture).then(() => {}));
  }

  stopCapture(): Observable<void> {
    return from(this.parentService.send(audioRecorderMethod.stopCapture).then(() => {}));
  }

  getBlob(): Observable<Blob> {
    return from(this.parentService.send(audioRecorderMethod.getBlob).then(message => {
      return new Blob([message.data], {type: 'audio/wav'});
    }));
  }
}
