import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsSummaryComponent } from './fs-summary.component';

describe('FsSummaryComponent', () => {
  let component: FsSummaryComponent;
  let fixture: ComponentFixture<FsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
