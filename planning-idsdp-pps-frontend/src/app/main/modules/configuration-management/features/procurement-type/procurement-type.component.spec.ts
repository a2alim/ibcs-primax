import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementTypeComponent } from './procurement-type.component';

describe('ProcurementTypeComponent', () => {
  let component: ProcurementTypeComponent;
  let fixture: ComponentFixture<ProcurementTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
