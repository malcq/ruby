import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewModalComponent } from './file-preview-modal.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('FilePreviewModalComponent', () => {
  let component: FilePreviewModalComponent;
  let fixture: ComponentFixture<FilePreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ FilePreviewModalComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
