import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalTechnologicalAnalysisComponent } from './technical-technological-analysis.component';

describe('TechnicalTechnologicalAnalysisComponent', () => {
  let component: TechnicalTechnologicalAnalysisComponent;
  let fixture: ComponentFixture<TechnicalTechnologicalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalTechnologicalAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalTechnologicalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
