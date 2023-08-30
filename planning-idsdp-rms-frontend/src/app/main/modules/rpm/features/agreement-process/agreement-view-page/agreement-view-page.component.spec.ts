import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementViewPageComponent } from './agreement-view-page.component';

describe('AgreementViewPageComponent', () => {
  let component: AgreementViewPageComponent;
  let fixture: ComponentFixture<AgreementViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementViewPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
