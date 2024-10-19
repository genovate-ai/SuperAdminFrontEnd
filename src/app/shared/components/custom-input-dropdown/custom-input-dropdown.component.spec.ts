import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputDropdownComponent } from './custom-input-dropdown.component';

describe('CustomInputDropdownComponent', () => {
  let component: CustomInputDropdownComponent;
  let fixture: ComponentFixture<CustomInputDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomInputDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInputDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
