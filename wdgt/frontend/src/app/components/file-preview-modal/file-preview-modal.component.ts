import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { MediaFileType, BaseFile } from '../../_models';

@Component({
  selector: 'app-file-preview-modal',
  templateUrl: './file-preview-modal.component.html',
  styleUrls: ['./file-preview-modal.component.css']
})
export class FilePreviewModalComponent implements OnInit, AfterViewInit {

  MediaFileType: typeof MediaFileType = MediaFileType;
  fileType: MediaFileType;
  fileSrc: string;

  @ViewChild('video') video;

  @Input()
  set file(value: BaseFile) {
    this._file = value;
    this.fileType = value.fileType;
    this.fileSrc = value.fileSrc;
  }

  get file(): BaseFile {
    return this._file;
  }

  @Output() close = new EventEmitter();

  private _file: BaseFile = null;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.video) {
      this.video.nativeElement.pause();
    }
  }

  onCloseClick() {
    this.close.emit();
  }
}
