import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemSimpleComponent } from './menu-item-simple.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('MenuItemSimpleComponent', () => {
  let component: MenuItemSimpleComponent;
  let fixture: ComponentFixture<MenuItemSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ MenuItemSimpleComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
