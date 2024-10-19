import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesFilterPopupAlertComponent } from './sites-filter-popup.component';

describe('SitesFilterPopupAlertComponent', () => {
  let component: SitesFilterPopupAlertComponent;
  let fixture: ComponentFixture<SitesFilterPopupAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesFilterPopupAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesFilterPopupAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
