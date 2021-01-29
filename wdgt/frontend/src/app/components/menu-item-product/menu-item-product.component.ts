import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-menu-item-product',
  templateUrl: './menu-item-product.component.html',
  styleUrls: ['./menu-item-product.component.css']
})
export class MenuItemProductComponent implements OnInit {

  /**
   * Product name
   * @type {string}
   */
  @Input() carName = '';

  /**
   * Product vin
   * @type {string}
   */
  @Input() vin = '';

  /**
   * Feedback type
   * e.g. 'Improvement', 'Issue'
   * @type {string}
   */
  @Input() feedbackType = '';

  constructor() { }

  ngOnInit() {
  }

}
