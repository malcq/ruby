import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatItemLinkComponent } from './chat-item-link.component';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatItemLinkComponent', () => {
  let component: ChatItemLinkComponent;
  let fixture: ComponentFixture<ChatItemLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatItemLinkComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatItemLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
