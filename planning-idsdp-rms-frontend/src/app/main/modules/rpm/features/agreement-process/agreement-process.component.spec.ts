import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementProcessComponent } from './agreement-process.component';

describe('AgreementProcessComponent', () => {
  let component: AgreementProcessComponent;
  let fixture: ComponentFixture<AgreementProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
