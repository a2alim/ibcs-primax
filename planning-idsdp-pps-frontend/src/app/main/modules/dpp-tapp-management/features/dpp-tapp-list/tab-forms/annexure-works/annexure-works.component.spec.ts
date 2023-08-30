import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureWorksComponent } from './annexure-works.component';

describe('AnnexureWorksComponent', () => {
  let component: AnnexureWorksComponent;
  let fixture: ComponentFixture<AnnexureWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexureWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
