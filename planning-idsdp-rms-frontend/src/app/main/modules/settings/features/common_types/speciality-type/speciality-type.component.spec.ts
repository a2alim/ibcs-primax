import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialityTypeComponent } from './speciality-type.component';

describe('SpecialityTypeComponent', () => {
  let component: SpecialityTypeComponent;
  let fixture: ComponentFixture<SpecialityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialityTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
