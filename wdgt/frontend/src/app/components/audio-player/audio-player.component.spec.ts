import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { AudioPlayerComponent } from './audio-player.component';

import { AudioPlayerService } from '../../_services';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  beforeEach(async(() => {
    const audioPlayerServiceMock = jasmine.createSpyObj(
      'AudioPlayerService',
      ['load', 'play', 'pause', 'setCurrentTime', 'backward', 'forward', 'onCurrentTimeChanged']
    );
    audioPlayerServiceMock.load.and.returnValue(of(0));
    audioPlayerServiceMock.onCurrentTimeChanged.and.returnValue(of(0));

    TestBed.configureTestingModule(defaultModules({
      declarations: [
        AudioPlayerComponent,
      ],
      providers: [
        { provide: AudioPlayerService, useValue: audioPlayerServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
