import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherAnalysisComponent } from './other-analysis.component';

describe('OtherAnalysisComponent', () => {
  let component: OtherAnalysisComponent;
  let fixture: ComponentFixture<OtherAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
