import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureServicesComponent } from './annexure-services.component';

describe('AnnexureServicesComponent', () => {
  let component: AnnexureServicesComponent;
  let fixture: ComponentFixture<AnnexureServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexureServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
