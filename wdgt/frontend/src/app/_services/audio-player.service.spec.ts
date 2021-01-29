import { TestBed } from '@angular/core/testing';

import { AudioPlayerService } from './audio-player.service';

import { WindowRef } from '../_core/window-ref';

describe('AudioPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AudioPlayerService,
        WindowRef,
      ]
    });
  });

  it('should be created', () => {
    const service: AudioPlayerService = TestBed.get(AudioPlayerService);
    expect(service).toBeTruthy();
  });
});
