import {
  OnInit,
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: 'textarea[appAutosize]'
})
export class AutosizeDirective implements OnInit, AfterViewInit {

  @Input() maxHeight = null;

  @HostBinding('rows') rows: string;
  @HostBinding('style.overflow') overflow: string;

  constructor(
    private elem: ElementRef
  ) { }

  ngOnInit() {
    this.rows = '1';
    this.overflow = 'auto';
  }

  public ngAfterViewInit() {
    this.resize();
  }

  @HostListener('input')
  public onInput() {
    this.resize();
  }

  public resize() {
    const textarea = this.elem.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    const { scrollHeight } = textarea;
    if (!this.maxHeight) {
      return textarea.style.height = `${textarea.scrollHeight}px`;
    }

    if (this.maxHeight < scrollHeight) {
      return textarea.style.height = `${this.maxHeight}px`;
    }

    return textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
