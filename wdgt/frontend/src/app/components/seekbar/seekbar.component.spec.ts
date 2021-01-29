import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekbarComponent } from './seekbar.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('SeekbarComponent', () => {
  let component: SeekbarComponent;
  let fixture: ComponentFixture<SeekbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ SeekbarComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
