import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorDivisionComponent } from './sector-division.component';

describe('SectorDivisionComponent', () => {
  let component: SectorDivisionComponent;
  let fixture: ComponentFixture<SectorDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
