import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRightsComponent } from './create-rights.component';

describe('CreateRightsComponent', () => {
  let component: CreateRightsComponent;
  let fixture: ComponentFixture<CreateRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
