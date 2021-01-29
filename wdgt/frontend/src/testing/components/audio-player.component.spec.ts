import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  template: ''
})
export class MockAudioPlayerComponent {
  @Input() audioBlob: Blob;
  @Output() audioPaused = new EventEmitter();
}
