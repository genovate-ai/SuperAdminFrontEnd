import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatePopupComponent } from './custom-date-popup.component';

describe('CustomDatePopupComponent', () => {
  let component: CustomDatePopupComponent;
  let fixture: ComponentFixture<CustomDatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
