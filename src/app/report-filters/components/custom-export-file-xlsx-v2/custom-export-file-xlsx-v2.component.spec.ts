import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomExportFileXlsxV2Component } from './custom-export-file-xlsx-v2.component';

describe('CustomExportFileXlsxV2Component', () => {
  let component: CustomExportFileXlsxV2Component;
  let fixture: ComponentFixture<CustomExportFileXlsxV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomExportFileXlsxV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomExportFileXlsxV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
