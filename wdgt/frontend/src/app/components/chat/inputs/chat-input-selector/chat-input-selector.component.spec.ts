import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputSelectorComponent } from './chat-input-selector.component';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatInputSelectorComponent', () => {
  let component: ChatInputSelectorComponent;
  let fixture: ComponentFixture<ChatInputSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatInputSelectorComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
