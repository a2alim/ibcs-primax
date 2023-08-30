import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalComponent } from './researcher-proposal.component';

describe('ResearcherProposalComponent', () => {
  let component: ResearcherProposalComponent;
  let fixture: ComponentFixture<ResearcherProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
