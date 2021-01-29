import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-seekbar',
  templateUrl: './seekbar.component.html',
  styleUrls: ['./seekbar.component.scss']
})
export class SeekbarComponent implements OnInit {

  @Input()
  set value(value) {
    this.seekbarSetpos(value);
    this._value = value;
  }
  get value() {
    return this._value;
  }

  overallTime = 0;

  @Input()
  set currentTime(currentTime) {
    if (!this.isFreezeUpdate) {
      this.value = this._duration ? (currentTime * 100 / this._duration) : 0;
    }
    this.overallTime = this._duration - currentTime;
    this._currentTime = currentTime;
  }
  get currentTime() {
    return this._currentTime;
  }

  @Input()
  set duration(duration) {
    this.value = duration ? (this._currentTime * 100 / duration) : 0;
    this.overallTime = duration - this._currentTime;
    this._duration = duration;
  }
  get duration() {
    return this._duration;
  }
  @Output() valueChange = new EventEmitter();

  private _currentTime = 0;
  private _value = 0;
  private _duration = 0;
  private isFreezeUpdate = false;

  @ViewChild('bar') barRef;
  @ViewChild('btn') btnRef;
  @ViewChild('bg') bgRef;

  constructor() { }

  ngOnInit() {
  }
  /*
   * CLick Function
   */
  onClick(e) {
      const posi = this.seekbarGetpos(e);
      this.value = posi;
      this.onSeekbarChange(posi);
  }

  /*
   * Move or Drag Function
   */
  onMovie(e) {
    if (e.buttons || e.type === 'touchmove') {
      const posi = this.seekbarGetpos(e);
      if (posi >= 0 && posi <= 100) {
          this.value = posi;
          this._currentTime = Math.round(posi * this.duration / 100);
          this.overallTime = this._duration - this._currentTime;
      }
    }
  }

/*
 * Get Position
 */
  seekbarGetpos(e): number {
    const elem = this.barRef.nativeElement;
    if (elem !== undefined && e !== undefined) {
        const prefix = parseInt(elem.offsetLeft, 10);
        let point_e = (((parseInt(e.pageX, 10) - prefix) / parseInt(elem.clientWidth, 10)) * 100);
        if (point_e < 0) {
            point_e = 0;

        } else if (point_e > 100) {
            point_e = 100;
        }
        return Math.round(point_e);
    }
  }

/*
 * Set Position
 */
  seekbarSetpos(posi: number) {
    const btn = this.btnRef.nativeElement;
    const bg = this.bgRef.nativeElement;
    if (btn !== undefined) {
        btn.style.left = posi + '%';
        bg.style.width = posi + '%';
    }
  }

  onSeekStart(ev) {
    this.isFreezeUpdate = true;
  }

  onSeekEnd(ev) {
    this.onSeekbarChange(this._value);
    this.isFreezeUpdate = false;
  }

  onSeekbarChange(value) {
    this.valueChange.emit(Math.round(value * this.duration / 100));
    this.isFreezeUpdate = false;
  }
}


