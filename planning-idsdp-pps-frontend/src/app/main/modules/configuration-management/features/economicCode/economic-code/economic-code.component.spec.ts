import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicCodeComponent } from './economic-code.component';

describe('EconomicCodeComponent', () => {
  let component: EconomicCodeComponent;
  let fixture: ComponentFixture<EconomicCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomicCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
