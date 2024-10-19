import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReportConfgComponent } from './manage-reportconfg.component';

describe('ManageReportConfgComponent', () => {
  let component: ManageReportConfgComponent;
  let fixture: ComponentFixture<ManageReportConfgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReportConfgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReportConfgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
