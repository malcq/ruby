import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-photo-image',
  templateUrl: './photo-image.component.html',
})
export class PhotoImageComponent {
  @Input() size = 24;
}
