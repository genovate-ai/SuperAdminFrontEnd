/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SiteTreeviewAllSitesV2Component } from './site-treeview-all-sites-v2.component';

describe('SiteTreeviewAllSitesV2Component', () => {
  let component: SiteTreeviewAllSitesV2Component;
  let fixture: ComponentFixture<SiteTreeviewAllSitesV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteTreeviewAllSitesV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteTreeviewAllSitesV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
