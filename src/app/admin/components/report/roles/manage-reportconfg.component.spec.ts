import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReportComponent } from './manage-reportconfg.component';

describe('ManageReportComponent', () => {
  let component: ManageReportComponent;
  let fixture: ComponentFixture<ManageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
