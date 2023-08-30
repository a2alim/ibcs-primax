import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementMethodComponent } from './procurement-method.component';

describe('ProcurementMethodComponent', () => {
  let component: ProcurementMethodComponent;
  let fixture: ComponentFixture<ProcurementMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
