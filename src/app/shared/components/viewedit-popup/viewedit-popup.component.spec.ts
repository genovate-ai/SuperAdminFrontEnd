import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweditPopupComponent } from './viewedit-popup.component';

describe('VieweditPopupComponent', () => {
  let component: VieweditPopupComponent;
  let fixture: ComponentFixture<VieweditPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VieweditPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VieweditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
