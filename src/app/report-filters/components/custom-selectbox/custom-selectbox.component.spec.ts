import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectboxComponent } from './custom-selectbox.component';

describe('CustomSelectboxComponent', () => {
  let component: CustomSelectboxComponent;
  let fixture: ComponentFixture<CustomSelectboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSelectboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
