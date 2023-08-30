import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalInstituteInfoComponent } from './researcher-proposal-institute-info.component';

describe('ResearcherProposalInstituteInfoComponent', () => {
  let component: ResearcherProposalInstituteInfoComponent;
  let fixture: ComponentFixture<ResearcherProposalInstituteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalInstituteInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalInstituteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
