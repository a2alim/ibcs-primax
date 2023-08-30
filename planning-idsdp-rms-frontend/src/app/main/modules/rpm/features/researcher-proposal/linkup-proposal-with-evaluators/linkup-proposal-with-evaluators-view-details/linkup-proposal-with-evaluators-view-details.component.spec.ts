import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkupProposalWithEvaluatorsViewDetailsComponent } from './linkup-proposal-with-evaluators-view-details.component';

describe('LinkupProposalWithEvaluatorsViewDetailsComponent', () => {
  let component: LinkupProposalWithEvaluatorsViewDetailsComponent;
  let fixture: ComponentFixture<LinkupProposalWithEvaluatorsViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkupProposalWithEvaluatorsViewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkupProposalWithEvaluatorsViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
