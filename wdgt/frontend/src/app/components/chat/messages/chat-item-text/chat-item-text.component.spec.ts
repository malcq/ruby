import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatItemTextComponent } from './chat-item-text.component';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatItemTextComponent', () => {
  let component: ChatItemTextComponent;
  let fixture: ComponentFixture<ChatItemTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatItemTextComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatItemTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
