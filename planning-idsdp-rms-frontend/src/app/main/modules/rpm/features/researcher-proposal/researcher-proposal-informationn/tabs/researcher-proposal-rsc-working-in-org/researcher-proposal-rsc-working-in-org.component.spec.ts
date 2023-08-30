import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalRscWorkingInOrgComponent } from './researcher-proposal-rsc-working-in-org.component';

describe('ResearcherProposalRscWorkingInOrgComponent', () => {
  let component: ResearcherProposalRscWorkingInOrgComponent;
  let fixture: ComponentFixture<ResearcherProposalRscWorkingInOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalRscWorkingInOrgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalRscWorkingInOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
