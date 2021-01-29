import { Component, Input, Output, EventEmitter, } from '@angular/core';

import { BaseFile } from '../../app/_models';

@Component({
  selector: 'app-file-preview',
  template: ''
})
export class MockFilePreviewComponent {
  @Input() file: BaseFile;
  @Output() removeFile = new EventEmitter();
  @Output() clickFile = new EventEmitter();
}
