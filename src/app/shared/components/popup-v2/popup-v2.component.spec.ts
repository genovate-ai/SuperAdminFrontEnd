import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupV2Component } from './popup-v2.component';

describe('PopupV2Component', () => {
  let component: PopupV2Component;
  let fixture: ComponentFixture<PopupV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
