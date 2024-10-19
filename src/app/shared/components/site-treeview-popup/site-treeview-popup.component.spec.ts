import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteTreeviewPopupComponent } from './site-treeview-popup.component';

describe('SiteTreeviewPopupComponent', () => {
  let component: SiteTreeviewPopupComponent;
  let fixture: ComponentFixture<SiteTreeviewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteTreeviewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteTreeviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
