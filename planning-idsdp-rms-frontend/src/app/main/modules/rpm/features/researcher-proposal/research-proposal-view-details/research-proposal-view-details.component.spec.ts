import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchProposalViewDetailsComponent } from './research-proposal-view-details.component';

describe('ResearchProposalViewDetailsComponent', () => {
  let component: ResearchProposalViewDetailsComponent;
  let fixture: ComponentFixture<ResearchProposalViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchProposalViewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchProposalViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
