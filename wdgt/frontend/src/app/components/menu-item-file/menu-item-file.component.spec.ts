import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemFileComponent } from './menu-item-file.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('MenuItemFileComponent', () => {
  let component: MenuItemFileComponent;
  let fixture: ComponentFixture<MenuItemFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ MenuItemFileComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
