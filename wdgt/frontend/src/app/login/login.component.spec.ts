import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactsComponent } from './contacts.component';

import {
  AlertService,
  CurrentFeedbackService,
  AuthenticationService,
  WallpaperService,
  GeolocationService,
  CompanyService,
} from '../_services/index';

import {
  alertServiceMock,
  currentFeedbackServiceMock,
  authenticationServiceMock,
  wallpaperServiceMock,
  geolocationServiceMock,
  mockCompanyService,
  DummyComponent,
} from '../../testing/index.spec';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ContactsComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: ContactsComponent},
          {path: 'record-type', component: DummyComponent}
        ]),
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: WallpaperService, useValue: wallpaperServiceMock },
        { provide: GeolocationService, useValue: geolocationServiceMock },
        { provide: CompanyService, useValue: mockCompanyService },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
