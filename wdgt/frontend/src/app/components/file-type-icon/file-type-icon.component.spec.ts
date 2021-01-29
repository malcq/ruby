import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTypeIconComponent } from './file-type-icon.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('FileTypeIconComponent', () => {
  let component: FileTypeIconComponent;
  let fixture: ComponentFixture<FileTypeIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ FileTypeIconComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
