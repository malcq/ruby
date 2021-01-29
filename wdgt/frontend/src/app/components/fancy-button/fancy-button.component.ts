import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-fancy-button',
  templateUrl: './fancy-button.component.html',
  styleUrls: ['./fancy-button.component.scss']
})
export class FancyButtonComponent implements OnInit {

  /**
   * Button title
   */
  @Input() title = 'Button';

  /**
   * Button disabled state
   */
  @Input() disabled = false;

  /**
   * Adds 'full-width' class for width equals 100%
   */
  @Input() fullWidth = false;

  /**
   * Increase border-radius to be more rounded at the corners
   */
  @Input() rounded = false;

  /**
   * Change button type
   * e.g. 'button', 'submit', 'reset'
   */
  @Input() type = 'button';

  /**
  * Change button style
  * e.g. 'primary', 'secondary'
  * look at getClassNameByType() for full list
  */
  @Input() viewType = 'primary';

  /**
   * Fires on button click
   */
  @Output() buttonPress = new EventEmitter<any>();

  classNamePrefix = 'fancy-button';
  className = '';

  constructor() {
  }

  ngOnInit() {
    this.className = this.getClassNameByType(this.viewType);
  }

  onClick(e) {
    this.buttonPress.emit(e);
  }

  getClassNameByType(type: string): string {
    const classnamePrefix = this.classNamePrefix;
    console.log(type);
    const typeWhitelist = ['primary', 'secondary'];

    const isTypeSupported = typeWhitelist.includes(type);
    if (isTypeSupported) {
      return `${classnamePrefix}--${type}`;
    }
    return `${classnamePrefix}--primary`;
  }

}
