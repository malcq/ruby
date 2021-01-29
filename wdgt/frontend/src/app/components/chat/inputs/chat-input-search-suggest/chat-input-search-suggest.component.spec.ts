import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputSearchSuggestComponent } from './chat-input-search-suggest.component';

import {
  TagService
} from '../../../../_services';

import {
  tagServiceMock
} from '../../../../../testing/index.spec';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatInputSearchSuggestComponent', () => {
  let component: ChatInputSearchSuggestComponent;
  let fixture: ComponentFixture<ChatInputSearchSuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [
        ChatInputSearchSuggestComponent,
      ],
      providers: [
        { provide: TagService, useValue: tagServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputSearchSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
