import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-voice-image',
  templateUrl: './voice-image.component.html',
})
export class VoiceImageComponent {
  @Input() size = 24;
}
