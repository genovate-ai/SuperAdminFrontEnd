import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadioButtonV2Component } from './custom-radio-button-v2.component';

describe('CustomRadioButtonV2Component', () => {
  let component: CustomRadioButtonV2Component;
  let fixture: ComponentFixture<CustomRadioButtonV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRadioButtonV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRadioButtonV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
