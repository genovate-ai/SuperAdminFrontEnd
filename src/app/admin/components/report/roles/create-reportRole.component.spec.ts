import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportRoleComponent } from './create-reportRole.component';

describe('CreateReportRoleComponent', () => {
  let component: CreateReportRoleComponent;
  let fixture: ComponentFixture<CreateReportRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateReportRoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
