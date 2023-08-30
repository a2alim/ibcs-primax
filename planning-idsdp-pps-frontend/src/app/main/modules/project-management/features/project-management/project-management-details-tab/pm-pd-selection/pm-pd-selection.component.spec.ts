import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmPdSelectionComponent } from './pm-pd-selection.component';

describe('PmPdSelectionComponent', () => {
  let component: PmPdSelectionComponent;
  let fixture: ComponentFixture<PmPdSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmPdSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmPdSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
