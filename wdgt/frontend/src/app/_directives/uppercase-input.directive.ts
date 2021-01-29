import {
  Directive,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]'
})
export class UppercaseInputDirective {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  value: string;


  @HostListener('input', ['$event']) onInputChange(event) {
    this.value = event.target.value.toUpperCase();
    this.ngModelChange.emit(this.value);
  }

}
