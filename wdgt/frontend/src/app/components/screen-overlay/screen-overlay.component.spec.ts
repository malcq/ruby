import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenOverlayComponent } from './screen-overlay.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('ScreenOverlayComponent', () => {
  let component: ScreenOverlayComponent;
  let fixture: ComponentFixture<ScreenOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ScreenOverlayComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
