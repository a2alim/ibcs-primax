import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalListModalComponent } from './researcher-proposal-list-modal.component';

describe('ResearcherProposalListModalComponent', () => {
  let component: ResearcherProposalListModalComponent;
  let fixture: ComponentFixture<ResearcherProposalListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
