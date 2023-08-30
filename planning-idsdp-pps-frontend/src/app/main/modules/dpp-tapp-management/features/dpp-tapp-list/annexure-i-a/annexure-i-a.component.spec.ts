import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureIAComponent } from './annexure-i-a.component';

describe('AnnexureIAComponent', () => {
  let component: AnnexureIAComponent;
  let fixture: ComponentFixture<AnnexureIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexureIAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
