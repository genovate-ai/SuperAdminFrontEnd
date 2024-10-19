import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportTextboxComponent } from './custom-report-textbox.component';

describe('CustomReportTextboxComponent', () => {
  let component: CustomReportTextboxComponent;
  let fixture: ComponentFixture<CustomReportTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomReportTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReportTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
