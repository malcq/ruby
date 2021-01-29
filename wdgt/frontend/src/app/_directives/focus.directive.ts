import {Directive, OnInit, Input, EventEmitter, ElementRef, Inject} from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnInit {
  @Input('appFocus') appFocus: EventEmitter<boolean>;

  constructor(@Inject(ElementRef) private element: ElementRef) {
  }

  ngOnInit() {
    this.appFocus.subscribe(event => {
      this.element.nativeElement.focus();
    });
  }
}
