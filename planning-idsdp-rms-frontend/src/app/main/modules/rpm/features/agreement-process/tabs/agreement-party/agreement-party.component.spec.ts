import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementPartyComponent } from './agreement-party.component';

describe('AgreementPartyComponent', () => {
  let component: AgreementPartyComponent;
  let fixture: ComponentFixture<AgreementPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementPartyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
