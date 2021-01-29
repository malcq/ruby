import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  /**
   * Enable or disable right arrow icon
   * @type {boolean}
   */
  @Input() showArrow = true;

  /**
   * Adds caption to the top,
   * not required
   * @type {string}
   */
  @Input() headerCaption = '';

  constructor() { }

  ngOnInit() {
  }

}
