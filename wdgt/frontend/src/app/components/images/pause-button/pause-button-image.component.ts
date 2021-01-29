import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-pause-button-image',
  templateUrl: './pause-button-image.component.html',
})
export class PauseButtonImageComponent {
  @Input() size = 50;
}
