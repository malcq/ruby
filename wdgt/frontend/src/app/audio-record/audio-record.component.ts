
import {mergeMap} from 'rxjs/operators';
import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterContentInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  CurrentFeedbackService,
  AlertService,
  DomUtilsService,
  AudioRecorderService,
  FileFactory,
} from '../_services';

import { ROUTES } from '../config/router';

import { BaseFile } from '../_models/index';

const barWidth = 2;
const gapWidth = 4;
const emptyLineHeight = 6;

@Component({
  selector: 'app-audio-record',
  templateUrl: './audio-record.component.html',
  styleUrls: ['./audio-record.component.scss']
})
export class AudioRecordComponent implements OnInit, OnDestroy, AfterContentInit {
  blob: Blob;
  recording = false;
  converting = false;
  isPlayerActive = false;
  isPlayerPaused = true;

  duration = 0;

  @ViewChild('audioIndicator') audioIndicator;

  private maxLevel = 0;
  private onLevelSubscription: Subscription;

  constructor(
    private router: Router,
    private currentFeedbackService: CurrentFeedbackService,
    private alertService: AlertService,
    private domService: DomUtilsService,
    private audioRecorderService: AudioRecorderService,
    private fileFactory: FileFactory,
  ) { }

  ngOnInit() {
    this.domService.preloadImagesForOffline();
    this.audioRecorderService.init()
      .subscribe(() => {}, error => this.alertService.error(error));

  }

  ngAfterContentInit() {
    this.showBuffer([]);
  }

  ngOnDestroy() {
    this.audioRecorderService.stop().subscribe(() => {});
  }

  startCapture() {
    this.audioRecorderService.startCapture()
      .subscribe(() => {
        const levelsBuffer: number[] = [];
        const startTime = (new Date()).getTime();
        this.recording = true;
        this.onLevelSubscription = this.audioRecorderService.onLevel
          .subscribe(level => {
            this.duration = (new Date()).getTime() - startTime;
            const levelsBufferLength = Math.floor(this.audioIndicator.nativeElement.width / (barWidth + gapWidth));
            this.addLevelToBuffer(levelsBuffer, level, levelsBufferLength);
            this.showBuffer(levelsBuffer);
          });
      }, error => this.alertService.error(error));
  }

  addLevelToBuffer(buffer, level, levelsBufferLength) {
    buffer.push(level);
    if (buffer.length > levelsBufferLength) {
      buffer.shift();
    }
  }

  showBuffer(buffer) {
    const maxLevel = this.maxLevel;
    const canvas = this.audioIndicator.nativeElement;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const start = canvas.width - buffer.length * (barWidth + gapWidth);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, (canvas.height) / 2 - emptyLineHeight / 2, start, emptyLineHeight);
    buffer.forEach((bar, i) => {
      if (bar > this.maxLevel) {
        this.maxLevel = bar;
      }
      const height = bar * canvas.height / maxLevel;
      context.fillRect(start + gapWidth + i * (barWidth + gapWidth), (canvas.height - height) / 2, barWidth, height);
    });
  }

  stopCapture() {
    this.converting = true;

    this.audioRecorderService.stopCapture().pipe(
      mergeMap(() => this.audioRecorderService.getBlob()))
      .subscribe(
        (blob: Blob) => {
          this.blob = blob;
          this.converting = false;
          this.recording = false;
          this.onLevelSubscription.unsubscribe();
        },
        error => this.alertService.error(error)
      );
  }

  done() {
    const file = new File(
      [this.blob],
      'filename' + (new Date().toISOString().slice(0, 19).replace(/(-|T|:)/g, '')) + '.wav', {
        type: 'audio/wav',
      }
    );
    this.fileFactory.getBlobFile(file)
      .then(
        blobFile => this.addFiles([blobFile]),
        error => this.alertService.error(error)
      );
  }

  addFiles(files: BaseFile[]): void {
    this.currentFeedbackService.addFiles(files)
      .subscribe(
        () => {
          this.router.navigate([`/${ROUTES.fileList}`]);
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  back() {
    this.router.navigate([`/${ROUTES.recordType}`]);
  }

  togglePlayer() {
    if (this.isPlayerActive) {
      this.showBuffer([]);
      this.duration = 0;
    }
    this.isPlayerActive = !this.isPlayerActive;
  }

  onPlayerPaused(isPaused: boolean) {
    this.isPlayerPaused = isPaused;
  }
}
