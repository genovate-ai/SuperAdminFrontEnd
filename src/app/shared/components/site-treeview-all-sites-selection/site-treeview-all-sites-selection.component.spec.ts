/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SiteTreeviewAllSitesSelectionComponent } from './site-treeview-all-sites-selection.component';

describe('SiteTreeviewAllSitesSelectionComponent', () => {
  let component: SiteTreeviewAllSitesSelectionComponent;
  let fixture: ComponentFixture<SiteTreeviewAllSitesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteTreeviewAllSitesSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteTreeviewAllSitesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
