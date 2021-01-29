import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTypeCardComponent } from './feedback-type-card.component';

import {
  testFeedback,
} from '../../../testing/index.spec';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('FeedbackTypeCardComponent', () => {
  let component: FeedbackTypeCardComponent;
  let fixture: ComponentFixture<FeedbackTypeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ FeedbackTypeCardComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackTypeCardComponent);
    component = fixture.componentInstance;
    component.feedback = testFeedback;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
