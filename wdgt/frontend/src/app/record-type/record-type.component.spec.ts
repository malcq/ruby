import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RecordTypeComponent } from './record-type.component';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

import {
  AlertService,
  CurrentFeedbackService,
  DialogService,
  FileFactory,
  DomUtilsService,
} from '../_services';

import {
  alertServiceMock,
  DummyComponent,
  currentFeedbackServiceMock,
  dialogServiceMock,
  fileFactoryMock,
  domUtilsServiceMock,
} from '../../testing/index.spec';

describe('RecordTypeComponent', () => {
  let component: RecordTypeComponent;
  let fixture: ComponentFixture<RecordTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ RecordTypeComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: RecordTypeComponent},
          {path: 'chat', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: FileFactory, useValue: fileFactoryMock },
        { provide: DomUtilsService, useValue: domUtilsServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
