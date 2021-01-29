import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-duration-info',
  templateUrl: './duration-info.component.html',
  styleUrls: ['./duration-info.component.scss']
})
export class DurationInfoComponent implements OnInit {

  @Input() duration = 0;

  constructor() { }

  ngOnInit() {
  }

}
