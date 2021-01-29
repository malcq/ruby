import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPreviewComponent } from './files-preview.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('FilesPreviewComponent', () => {
  let component: FilesPreviewComponent;
  let fixture: ComponentFixture<FilesPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ FilesPreviewComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
