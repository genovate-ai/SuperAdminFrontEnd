import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRolesUsersComponent } from './view-all-roles-users.component';

describe('ViewAllRolesUsersComponent', () => {
  let component: ViewAllRolesUsersComponent;
  let fixture: ComponentFixture<ViewAllRolesUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllRolesUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllRolesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
