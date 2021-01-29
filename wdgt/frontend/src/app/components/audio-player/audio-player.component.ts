import {
  Component,
  OnInit,
  AfterContentInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AudioPlayerService } from '../../_services';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterContentInit, OnDestroy {

  duration = 0;
  currentTime = 0;
  paused = true;

  @Input() audioBlob: Blob;

  @Output() audioPaused = new EventEmitter();

  private onCurrentTimeChangedSubscription: Subscription;

  constructor(
    private audioPlayerService: AudioPlayerService,
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    const onLoadSubscription = this.audioPlayerService.load(this.audioBlob)
      .subscribe(duration => {
        this.duration = duration;
        onLoadSubscription.unsubscribe();
      });
    this.onCurrentTimeChangedSubscription = this.audioPlayerService.onCurrentTimeChanged()
      .subscribe((currentTime: number) => {
        this.currentTime = currentTime;
        if (currentTime === this.duration) {
          this.paused = true;
          this.audioPaused.emit(this.paused);
        }
      });
  }

  ngOnDestroy(): void {
    this.audioPlayerService.pause();
    this.onCurrentTimeChangedSubscription.unsubscribe();
  }

  onBackwardClick() {
    this.audioPlayerService.backward(10000);
  }

  onForwardClick() {
    this.audioPlayerService.forward(10000);
  }

  onTogglePlay() {
    this.paused = !this.paused;
    if (this.paused) {
      this.audioPlayerService.pause();
    } else {
      this.audioPlayerService.play();
    }
    this.audioPaused.emit(this.paused);
  }

  onPositionChange(position) {
    this.audioPlayerService.setCurrentTime(position);
  }
}
