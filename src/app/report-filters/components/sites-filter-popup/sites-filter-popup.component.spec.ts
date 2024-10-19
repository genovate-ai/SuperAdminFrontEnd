import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesFilterPopupComponent } from './sites-filter-popup.component';

describe('SitesFilterPopupComponent', () => {
  let component: SitesFilterPopupComponent;
  let fixture: ComponentFixture<SitesFilterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesFilterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
