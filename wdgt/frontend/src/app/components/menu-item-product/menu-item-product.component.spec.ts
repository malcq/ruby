import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemProductComponent } from './menu-item-product.component';

import {
  defaultModules,
} from '../../../testing/default-modules.spec';

describe('MenuItemProductComponent', () => {
  let component: MenuItemProductComponent;
  let fixture: ComponentFixture<MenuItemProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ MenuItemProductComponent ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
