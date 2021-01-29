import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-camera-control',
  templateUrl: './camera-control.component.html',
  styleUrls: ['./camera-control.component.css']
})
export class CameraControlComponent implements OnInit {
  /**
   * File array from 'input[type=file]'
   */
  @Input() files = [];

  @Input() hintMode = true;
  @Input() updateRequest = false;

  /**
   * Fires when library filled
   */
  @Output() fileChange = new EventEmitter();

  /**
   * Fires when 'remove file' clicks
   */
  @Output() removeFile = new EventEmitter();

  /**
   * Fires when press on 'Confirm' button
   */
  @Output() confirm = new EventEmitter();

  @ViewChild('inputAll') inputAll;
  @ViewChild('inputPicture') inputPicture;

  constructor() { }

  ngOnInit() {
  }

  onFileChange(ev) {
    this.fileChange.emit(ev);
  }

  onFileRemove(ev) {
    this.removeFile.emit(ev);
  }

  onAddFile() {
    this.clickOnLibrary();
  }

  onConfirmSelection() {
    this.confirm.emit();
  }

  onSelectLibraryClick() {
    this.clickOnLibrary();
  }

  onSelectPictureClick() {
    this.clickOnPictures();
  }

  clickOnLibrary() {
    this.inputAll.nativeElement.click();
  }

  clickOnPictures() {
    this.inputPicture.nativeElement.click();
  }

}
