import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-text-image',
  templateUrl: './text-image.component.html',
})
export class TextImageComponent {
  @Input() size = 24;
}
