import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportConfgComponent } from './create-reportconfg.component';

describe('CreateReportConfgComponent', () => {
  let component: CreateReportConfgComponent;
  let fixture: ComponentFixture<CreateReportConfgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReportConfgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportConfgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
