import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityStudyListComponent } from './feasibility-study-list.component';

describe('FeasibilityStudyListComponent', () => {
  let component: FeasibilityStudyListComponent;
  let fixture: ComponentFixture<FeasibilityStudyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeasibilityStudyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityStudyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
