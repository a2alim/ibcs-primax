import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalInfoComponent } from './researcher-proposal-info.component';

describe('ResearcherProposalInfoComponent', () => {
  let component: ResearcherProposalInfoComponent;
  let fixture: ComponentFixture<ResearcherProposalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
