import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-forward-image',
  templateUrl: './forward-image.component.html',
})
export class ForwardImageComponent {
  @Input() size = 50;
}
