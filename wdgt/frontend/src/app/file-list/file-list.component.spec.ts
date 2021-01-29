import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  AlertService,
  DialogService,
  FeedbackCategoryService,
  CurrentFeedbackService,
  AuthenticationService,
  DomUtilsService,
} from '../_services/index';

import {
  alertServiceMock,
  currentFeedbackServiceMock,
  dialogServiceMock,
  DummyComponent,
  domUtilsServiceMock,
} from '../../testing/index.spec';

import { FileListComponent } from './file-list.component';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

describe('FileListComponent', () => {
  let component: FileListComponent;
  let fixture: ComponentFixture<FileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ FileListComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: FileListComponent},
          {path: 'record-type', component: DummyComponent}
        ]),
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: DomUtilsService, useValue: domUtilsServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
