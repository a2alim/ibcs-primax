import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalUploadDocComponent } from './researcher-proposal-upload-doc.component';

describe('ResearcherProposalUploadDocComponent', () => {
  let component: ResearcherProposalUploadDocComponent;
  let fixture: ComponentFixture<ResearcherProposalUploadDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalUploadDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalUploadDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
