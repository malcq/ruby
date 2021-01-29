import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-fancy-marker',
  templateUrl: './fancy-marker.component.html',
  styleUrls: ['./fancy-marker.component.css']
})
export class FancyMarkerComponent implements OnInit {

  /**
   * Choose type of marker:
   * @type {string}
   * true - without borders and line
   * false - with borders and line
   */
  @Input() simple = true;

  /**
   * Marker inside text
   * @type {string}
   */
  @Input() title = '';
  constructor() { }

  ngOnInit() {
  }

}
