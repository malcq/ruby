import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-video-image',
  templateUrl: './video-image.component.html',
})
export class VideoImageComponent {
  @Input() size = 24;
}
