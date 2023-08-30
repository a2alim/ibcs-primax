import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalTabComponent } from './proposal-tab.component';

describe('ProposalTabComponent', () => {
  let component: ProposalTabComponent;
  let fixture: ComponentFixture<ProposalTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
