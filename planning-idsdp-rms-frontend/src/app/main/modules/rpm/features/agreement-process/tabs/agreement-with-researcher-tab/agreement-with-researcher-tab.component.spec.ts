import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementWithResearcherTabComponent } from './agreement-with-researcher-tab.component';

describe('AgreementWithResearcherTabComponent', () => {
  let component: AgreementWithResearcherTabComponent;
  let fixture: ComponentFixture<AgreementWithResearcherTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementWithResearcherTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementWithResearcherTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
