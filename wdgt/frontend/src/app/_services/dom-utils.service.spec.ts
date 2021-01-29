import { TestBed } from '@angular/core/testing';

import { DomUtilsService } from './dom-utils.service';
import { WindowRef } from '../_core/window-ref';

import { windowRefMock } from '../../testing/index.spec';

describe('DomUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DomUtilsService,
        { provide: WindowRef, useValue: windowRefMock },
      ]
    });
  });

  it('should be created', () => {
    const service: DomUtilsService = TestBed.get(DomUtilsService);
    expect(service).toBeTruthy();
  });
});
