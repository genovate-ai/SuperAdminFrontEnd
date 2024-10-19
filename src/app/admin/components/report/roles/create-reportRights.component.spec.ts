import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportRightsComponent } from './create-reportRights.component';

describe('CreateReportRightsComponent', () => {
  let component: CreateReportRightsComponent;
  let fixture: ComponentFixture<CreateReportRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReportRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
