import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorTypeComponent } from './sector-type.component';

describe('SectorTypeComponent', () => {
  let component: SectorTypeComponent;
  let fixture: ComponentFixture<SectorTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
