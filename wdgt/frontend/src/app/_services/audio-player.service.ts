import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';

import { WindowRef } from '../_core/window-ref';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio: HTMLMediaElement;
  private loadedMetadata = new Subject<number>();
  private timeUpdate = new Subject<number>();
  private prevTime: number;
  private prevPlayerTime: number;
  private timeout;
  private duration: number;

  constructor(
    private win: WindowRef,
  ) {
    this.audio = <HTMLMediaElement>(this.win.nativeWindow.document.createElement('audio'));
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = Math.round(this.audio.duration * 1000);
      this.loadedMetadata.next(this.duration);
    }, false);
    this.audio.addEventListener('timeupdate', () => {
      this.prevPlayerTime = Math.min(this.duration, Math.round(this.audio.currentTime * 1000));
      this.prevTime = this.now();
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeUpdate.next(this.prevPlayerTime);
      this.timeout = setTimeout(() => {
        this.fakeTimeUpdate();
      }, 10);
    }, false);
  }

  load(blob: Blob): Observable<number> {
    this.audio.src = URL.createObjectURL(blob);
    return this.loadedMetadata.asObservable();
  }

  play(): void {
    this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  setCurrentTime(currentTime): void {
    console.debug('set current time', currentTime);
    this.audio.currentTime = currentTime / 1000;
  }

  backward(time): void {
    this.audio.currentTime = Math.max(0, this.audio.currentTime - time / 1000);
  }

  forward(time): void {
    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + time / 1000);
  }

  onCurrentTimeChanged(): Observable<number> {
    return this.timeUpdate.asObservable();
  }

  private fakeTimeUpdate() {
    if (!this.audio.paused) {
      const time = this.prevPlayerTime + this.now() - this.prevTime;
      if (time < this.duration) {
        this.timeUpdate.next(time);
        this.timeout = setTimeout(() => {
          this.fakeTimeUpdate();
        }, 10);
      }
    }
  }

  private now() {
    return new Date().getTime();
  }
}
