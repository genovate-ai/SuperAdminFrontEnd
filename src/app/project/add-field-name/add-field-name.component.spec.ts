import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldNameComponent } from './add-field-name.component';

describe('AddFieldNameComponent', () => {
  let component: AddFieldNameComponent;
  let fixture: ComponentFixture<AddFieldNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFieldNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
