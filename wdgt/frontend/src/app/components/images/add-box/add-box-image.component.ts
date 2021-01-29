import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-add-box-image',
  templateUrl: './add-box-image.component.html',
})
export class AddBoxImageComponent {
  @Input() size = 20;
}
