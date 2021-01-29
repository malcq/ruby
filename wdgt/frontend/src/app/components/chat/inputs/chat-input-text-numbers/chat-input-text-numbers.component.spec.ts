import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputTextNumbersComponent } from './chat-input-text-numbers.component';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';


describe('ChatInputTextNumbersComponent', () => {
  let component: ChatInputTextNumbersComponent;
  let fixture: ComponentFixture<ChatInputTextNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatInputTextNumbersComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputTextNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
