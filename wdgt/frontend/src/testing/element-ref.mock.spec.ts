import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class MockElementRef extends ElementRef {
  constructor() { super(null); }
}
