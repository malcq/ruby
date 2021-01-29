import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UploadComponent } from './upload.component';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

import {
  WallpaperService,
  CurrentFeedbackService,
  AlertService,
  DialogService,
  FileService,
  FileFactory,
} from '../_services';

import {
  wallpaperServiceMock,
  alertServiceMock,
  DummyComponent,
  currentFeedbackServiceMock,
  dialogServiceMock,
  fileFactoryMock,
  fileServiceMock,
} from '../../testing/index.spec';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ UploadComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: UploadComponent},
          {path: 'chat', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: WallpaperService, useValue: wallpaperServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: FileFactory, useValue: fileFactoryMock },
        { provide: FileService, useValue: fileServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
