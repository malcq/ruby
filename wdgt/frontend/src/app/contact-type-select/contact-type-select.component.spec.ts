import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTypeSelectComponent } from './contact-type-select.component';

describe('ContactTypeSelectComponent', () => {
  let component: ContactTypeSelectComponent;
  let fixture: ComponentFixture<ContactTypeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactTypeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
