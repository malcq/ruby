import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-menu-item-simple',
  templateUrl: './menu-item-simple.component.html',
  styleUrls: ['./menu-item-simple.component.css']
})
export class MenuItemSimpleComponent implements OnInit {

  /**
   * Icon from 'assets/svg' name (without .svg)
   * (not required)
   */
  @Input() icon = '';

  /**
   * Menu title
   * @type {string}
   */
  @Input() title = '';

  /**
   * Menu description
   * (not required)
   * @type {string}
   */
  @Input() description = '';

  /**
   * Disables component
   * @type {boolean}
   */
  @Input() disabled = false;

  constructor() { }

  ngOnInit() {
  }

}
