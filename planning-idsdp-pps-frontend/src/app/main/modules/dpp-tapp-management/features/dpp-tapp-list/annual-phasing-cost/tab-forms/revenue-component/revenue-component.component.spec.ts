import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueComponentComponent } from './revenue-component.component';

describe('RevenueComponentComponent', () => {
  let component: RevenueComponentComponent;
  let fixture: ComponentFixture<RevenueComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
