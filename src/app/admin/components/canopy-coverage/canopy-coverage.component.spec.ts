import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanopyCoverageComponent } from './canopy-coverage.component';

describe('CanopyCoverageComponent', () => {
  let component: CanopyCoverageComponent;
  let fixture: ComponentFixture<CanopyCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CanopyCoverageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanopyCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
