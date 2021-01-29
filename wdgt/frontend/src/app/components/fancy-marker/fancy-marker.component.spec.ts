import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyMarkerComponent } from './fancy-marker.component';

describe('FancyMarkerComponent', () => {
  let component: FancyMarkerComponent;
  let fixture: ComponentFixture<FancyMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
