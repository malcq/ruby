import { TestBed, inject } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { FancyGradientPipe } from './fancy-gradient.pipe';

describe('FancyGradientPipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new FancyGradientPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
