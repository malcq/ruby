import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { BaseFile } from '../../_models/index';

@Component({
  selector: 'app-files-preview',
  templateUrl: './files-preview.component.html',
  styleUrls: ['./files-preview.component.scss']
})
export class FilesPreviewComponent implements OnInit {
  currentFile: BaseFile = null;

  /**
   * Array of files
   */
  @Input()
  set files(value: BaseFile[]) {
    this._files = value;
    setTimeout(() => {
      this.scrollLeft();
    }, 0);
  }

  get files(): BaseFile[] {
    return this._files;
  }

  /**
   * It is request to user for update data
   */
  @Input() updateRequest = false;

  /**
   * Fires by clicking remove button on thumb
   */
  @Output() removeFile = new EventEmitter();

  /**
   * Fires by clicking on 'Add file' button
   */
  @Output() addFile = new EventEmitter();

  @ViewChild('fileList') fileList: ElementRef;
  @ViewChild('list') list;
  private _files: BaseFile[] = [];

  constructor() { }

  ngOnInit() {
  }

  scrollLeft() {
    this.fileList.nativeElement.scrollLeft = 9999;
  }

  onRemoveFile(file) {
    this.removeFile.emit(file);
  }

  onAddFileClick() {
    this.addFile.emit();
  }

  onFileClick(file) {
    this.currentFile = file;
  }

  onModalClose() {
    this.currentFile = null;
  }
}
