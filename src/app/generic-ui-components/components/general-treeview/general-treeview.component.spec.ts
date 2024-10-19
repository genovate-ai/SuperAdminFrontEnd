import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTreeviewComponent } from './general-treeview.component';

describe('GeneralTreeviewComponent', () => {
  let component: GeneralTreeviewComponent;
  let fixture: ComponentFixture<GeneralTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
