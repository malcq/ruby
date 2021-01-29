import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyHeaderComponent } from './fancy-header.component';

describe('FancyHeaderComponent', () => {
  let component: FancyHeaderComponent;
  let fixture: ComponentFixture<FancyHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
