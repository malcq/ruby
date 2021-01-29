import { TestBed } from '@angular/core/testing';

import { FileStorageService } from './file-storage.service';

import { WindowRef } from '../_core/window-ref';

import { windowRefMock } from '../../testing/index.spec';

describe('FileStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileStorageService,
        { provide: WindowRef, useValue: windowRefMock },
      ]
    });
  });

  it('should be created', () => {
    const service: FileStorageService = TestBed.get(FileStorageService);
    expect(service).toBeTruthy();
  });
});
