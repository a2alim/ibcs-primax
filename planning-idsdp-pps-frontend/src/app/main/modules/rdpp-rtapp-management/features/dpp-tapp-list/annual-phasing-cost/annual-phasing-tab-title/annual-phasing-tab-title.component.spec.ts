import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPhasingTabTitleComponent } from './annual-phasing-tab-title.component';

describe('AnnualPhasingTabTitleComponent', () => {
  let component: AnnualPhasingTabTitleComponent;
  let fixture: ComponentFixture<AnnualPhasingTabTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPhasingTabTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPhasingTabTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
