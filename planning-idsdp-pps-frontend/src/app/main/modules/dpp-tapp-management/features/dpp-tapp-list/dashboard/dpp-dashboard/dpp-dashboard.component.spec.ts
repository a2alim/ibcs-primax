import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DppDashboardComponent } from './dpp-dashboard.component';

describe('DppDashboardComponent', () => {
  let component: DppDashboardComponent;
  let fixture: ComponentFixture<DppDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
