/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HierarchySelectBoxV2Component } from './hierarchy-select-box-v2.component';

describe('HierarchySelectBoxV2Component', () => {
  let component: HierarchySelectBoxV2Component;
  let fixture: ComponentFixture<HierarchySelectBoxV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchySelectBoxV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchySelectBoxV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
