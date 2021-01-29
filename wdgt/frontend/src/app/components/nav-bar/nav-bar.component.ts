import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @Input() blue = false;
  @Input() xButton = false;
  @Input() hideBack = false;

  @Input() title: string = null;

  @Input() rightButtonTitle: string = null;

  @Output() leftButtonPress = new EventEmitter();

  @Output() rightButtonPress = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onLeftButtonClick() {
    this.leftButtonPress.emit();
  }

  onRightButtonClick() {
    this.rightButtonPress.emit();
  }

}
