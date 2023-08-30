import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubEconomicCodeComponent } from './sub-economic-code.component';

describe('SubEconomicCodeComponent', () => {
  let component: SubEconomicCodeComponent;
  let fixture: ComponentFixture<SubEconomicCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubEconomicCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubEconomicCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
