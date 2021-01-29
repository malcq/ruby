import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordButtonComponent } from './record-button.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('RecordButtonComponent', () => {
  let component: RecordButtonComponent;
  let fixture: ComponentFixture<RecordButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ RecordButtonComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
