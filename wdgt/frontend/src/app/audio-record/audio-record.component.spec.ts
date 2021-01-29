import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AudioRecordComponent } from './audio-record.component';
import {
  AlertService,
  CurrentFeedbackService,
  FileFactory,
  DomUtilsService,
} from '../_services';

import {
  DummyComponent,
  alertServiceMock,
  currentFeedbackServiceMock,
  fileFactoryMock,
  domUtilsServiceMock,
} from '../../testing/index.spec';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

describe('AudioRecordComponent', () => {
  let component: AudioRecordComponent;
  let fixture: ComponentFixture<AudioRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [
        AudioRecordComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: AudioRecordComponent},
          {path: 'feedback', component: DummyComponent},
          {path: 'final', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: FileFactory, useValue: fileFactoryMock },
        { provide: DomUtilsService, useValue: domUtilsServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
