import { upperCaseFirst } from 'change-case';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { MediaFileType, UploadedFile } from '../../_models';

@Component({
  selector: 'app-menu-item-file',
  templateUrl: './menu-item-file.component.html',
  styleUrls: ['./menu-item-file.component.css']
})
export class MenuItemFileComponent implements OnInit {

  public videoFiles: any[] = [];
  public audioFiles: any[] = [];
  public photoFiles: any[] = [];
  public title: string = null;
  public oneFile = true;

  @Input()
  set files(value: UploadedFile[]) {
    this.videoFiles = [];
    this.audioFiles = [];
    this.photoFiles = [];
    value.filter(file => file.fileType === MediaFileType.video).forEach(file => this.videoFiles.push({
      thumbSrc: file.thumbSrc,
      fancyDuration: this.fancyDuration(file)
    }));
    value.filter(file => file.fileType === MediaFileType.audio).forEach(file => this.audioFiles.push({
      thumbSrc: file.thumbSrc,
      fancyDuration: this.fancyDuration(file)
    }));
    value.filter(file => file.fileType === MediaFileType.image).forEach(file => this.photoFiles.push({
      thumbSrc: file.thumbSrc
    }));
    if (!this.videoFiles.length && !this.audioFiles.length && !this.photoFiles.length) {
      this.title = null;
    } else {
      this.title = '';
      if (this.videoFiles.length) {
        this.addTitle('Video');
      }
      if (this.audioFiles.length) {
        this.addTitle('Audio');
      }
      if (this.photoFiles.length) {
        this.addTitle('Photo');
      }
      if (this.videoFiles.length + this.audioFiles.length + this.photoFiles.length > 1) {
        this.oneFile = false;
      }
    }
  }

  @Input() headerCaption: string;
  @Input() getStarted: boolean;
  @Input() isEditable: boolean;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Converts seconds to M:SS format
   * @param duration duration in seconds
   * @returns {string} M:SS duration
   */
  private fancyDuration(file): string {
    const fancySeconds = this.twoDig(file.duration % 60);
    const minutes =  Math.floor(file.duration / 60);

    return `${minutes}:${fancySeconds}`;
  }
  private twoDig(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  private addTitle(title) {
    if (this.title !== '') {
      this.title += '/';
    }
    this.title += title;
  }
}
