import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputTextComponent } from './chat-input-text.component';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatInputTextComponent', () => {
  let component: ChatInputTextComponent;
  let fixture: ComponentFixture<ChatInputTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatInputTextComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
