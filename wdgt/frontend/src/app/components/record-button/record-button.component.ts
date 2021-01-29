import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-record-button',
  templateUrl: './record-button.component.html',
  styleUrls: ['./record-button.component.scss']
})
export class RecordButtonComponent implements OnInit {

  @Input() recording = false;

  @Output() startCapture = new EventEmitter();

  @Output() stopCapture = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onRecordClick() {
    if (this.recording) {
      return this.stopCapture.emit();
    }
    return this.startCapture.emit();
  }
}
