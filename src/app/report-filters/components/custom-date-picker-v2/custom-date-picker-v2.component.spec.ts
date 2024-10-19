import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatePickerV2Component } from './custom-date-picker-v2.component';

describe('CustomDatePickerV2Component', () => {
  let component: CustomDatePickerV2Component;
  let fixture: ComponentFixture<CustomDatePickerV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDatePickerV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatePickerV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
