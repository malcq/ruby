import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-fancy-header',
  templateUrl: './fancy-header.component.html',
  styleUrls: ['./fancy-header.component.scss']
})
export class FancyHeaderComponent implements OnInit {

  /**
   * Header title
   */
  @Input() title = '';

  /**
   * Headers subtitle
   */
  @Input() subtitle = '';

  /**
   * Header description
   */
  @Input() description = '';

  /**
   * Fill text with black color
   */
  @Input() blacked = true;

  /**
   * Makes title blue
   */
  @Input() blueTitle = false;

  /**
   * Set description font size, in px
   */
  @Input() descriptionSize = 15;

  /**
   * Centers title
   */
  @Input() centerTitle = false;

  /**
   * Raise title for 12px
   */
  @Input() raiseTitle = false;

  @Input() smallDescription = false;

  constructor() { }

  ngOnInit() {
  }

}
