import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryAppraisalFormComponent } from './ministry-appraisal-form.component';

describe('MinistryAppraisalFormComponent', () => {
  let component: MinistryAppraisalFormComponent;
  let fixture: ComponentFixture<MinistryAppraisalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinistryAppraisalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryAppraisalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
