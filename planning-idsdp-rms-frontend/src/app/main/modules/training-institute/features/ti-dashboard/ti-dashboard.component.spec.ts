import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiDashboardComponent } from './ti-dashboard.component';

describe('TiDashboardComponent', () => {
  let component: TiDashboardComponent;
  let fixture: ComponentFixture<TiDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
