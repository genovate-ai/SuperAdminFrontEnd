import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationOldComponent } from './pagination-old.component';

describe('PaginationComponent', () => {
  let component: PaginationOldComponent;
  let fixture: ComponentFixture<PaginationOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
