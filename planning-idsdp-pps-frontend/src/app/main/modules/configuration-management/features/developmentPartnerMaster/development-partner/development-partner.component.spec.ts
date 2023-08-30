import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentPartnerComponent } from './development-partner.component';

describe('DevelopmentPartnerComponent', () => {
  let component: DevelopmentPartnerComponent;
  let fixture: ComponentFixture<DevelopmentPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevelopmentPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
