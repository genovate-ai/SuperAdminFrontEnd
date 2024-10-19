import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomExportPngComponent } from './custom-export-png.component';

describe('CustomExportPngComponent', () => {
  let component: CustomExportPngComponent;
  let fixture: ComponentFixture<CustomExportPngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomExportPngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomExportPngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
