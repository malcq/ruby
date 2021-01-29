import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-library-image',
  templateUrl: './library-image.component.html',
})
export class LibraryImageComponent {
  @Input() size = 24;
}
