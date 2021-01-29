import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { MediaFileType, BaseFile } from '../../_models/index';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent implements OnInit, AfterViewInit {

  MediaFileType: typeof MediaFileType = MediaFileType;

  @ViewChild('video') video;

  @Input()
  set file(value: BaseFile) {
    this._file = value;
    this.fileType = value.fileType;
    this.thumbType = value.thumbType;
    this.thumbSrc = value.thumbSrc;
  }

  get file(): BaseFile {
    return this._file;
  }

  public _file: BaseFile = null;
  public fileType: MediaFileType;
  public thumbType: MediaFileType;
  public thumbSrc: string;

  /**
   * Fires by clicking on remove icon
   * @argument file - selected file
   */
  @Output() removeFile = new EventEmitter();

  /**
   * Fires by clicking on file
   * @argument file - selected file
   */
  @Output() clickFile = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.video) {
      this.video.nativeElement.pause();
    }
  }

  onCloseClick(ev) {
    this.removeFile.emit(this.file);
  }

  onFileClick() {
    this.clickFile.emit(this.file);
  }
}
