import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationInfoComponent } from './duration-info.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('DurationInfoComponent', () => {
  let component: DurationInfoComponent;
  let fixture: ComponentFixture<DurationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ DurationInfoComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
