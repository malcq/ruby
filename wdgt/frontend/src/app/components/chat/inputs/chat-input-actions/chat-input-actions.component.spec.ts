import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputActionsComponent } from './chat-input-actions.component';

describe('ChatInputActionsComponent', () => {
  let component: ChatInputActionsComponent;
  let fixture: ComponentFixture<ChatInputActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatInputActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
