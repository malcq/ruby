import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemCategoriesComponent } from './menu-item-categories.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('MenuItemCategoriesComponent', () => {
  let component: MenuItemCategoriesComponent;
  let fixture: ComponentFixture<MenuItemCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ MenuItemCategoriesComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
