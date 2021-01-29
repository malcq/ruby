import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-play-button-image',
  templateUrl: './play-button-image.component.html',
})
export class PlayButtonImageComponent {
  @Input() size = 50;
}
