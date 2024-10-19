import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReportRoleComponent } from './manage-reportRole.component';

describe('ManageReportRoleComponent', () => {
  let component: ManageReportRoleComponent;
  let fixture: ComponentFixture<ManageReportRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageReportRoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReportRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
