import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadioButtonV3Component } from './custom-radio-button-v3.component';

describe('CustomRadioButtonV3Component', () => {
  let component: CustomRadioButtonV3Component;
  let fixture: ComponentFixture<CustomRadioButtonV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRadioButtonV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRadioButtonV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
