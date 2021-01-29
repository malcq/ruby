import { TestBed, inject } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { FocusDirective } from './focus.directive';
import { MockElementRef } from '../../testing/index.spec';

describe('FocusDirective', () => {
  let elRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ElementRef, useValue: new MockElementRef()}]
    });

    elRef = TestBed.get(ElementRef);
  });

  it('should create an instance', () => {
    const directive = new FocusDirective(elRef);
    expect(directive).toBeTruthy();
  });
});
