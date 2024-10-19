import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckboxListComponent } from './custom-checkbox-list.component';

describe('CustomCheckboxListComponent', () => {
  let component: CustomCheckboxListComponent;
  let fixture: ComponentFixture<CustomCheckboxListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCheckboxListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCheckboxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
