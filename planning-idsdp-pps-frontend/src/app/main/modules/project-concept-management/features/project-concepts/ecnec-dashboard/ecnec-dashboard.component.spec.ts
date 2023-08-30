import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcnecDashboardComponent } from './ecnec-dashboard.component';

describe('EcnecDashboardComponent', () => {
  let component: EcnecDashboardComponent;
  let fixture: ComponentFixture<EcnecDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcnecDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcnecDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
