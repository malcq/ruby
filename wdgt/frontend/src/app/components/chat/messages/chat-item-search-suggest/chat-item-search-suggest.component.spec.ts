import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatItemSearchSuggestComponent } from './chat-item-search-suggest.component';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatItemSearchSuggestComponent', () => {
  let component: ChatItemSearchSuggestComponent;
  let fixture: ComponentFixture<ChatItemSearchSuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatItemSearchSuggestComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatItemSearchSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
