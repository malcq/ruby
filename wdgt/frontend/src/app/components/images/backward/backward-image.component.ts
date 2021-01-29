import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-backward-image',
  templateUrl: './backward-image.component.html',
})
export class BackwardImageComponent {
  @Input() size = 50;
}
