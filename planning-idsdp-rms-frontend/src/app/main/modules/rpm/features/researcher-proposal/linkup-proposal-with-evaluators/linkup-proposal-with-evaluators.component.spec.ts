import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkupProposalWithEvaluatorsComponent } from './linkup-proposal-with-evaluators.component';

describe('LinkupProposalWithEvaluatorsComponent', () => {
  let component: LinkupProposalWithEvaluatorsComponent;
  let fixture: ComponentFixture<LinkupProposalWithEvaluatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkupProposalWithEvaluatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkupProposalWithEvaluatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
