import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseDeskOfficerComponent } from './category-wise-desk-officer.component';

describe('CategoryWiseDeskOfficerComponent', () => {
  let component: CategoryWiseDeskOfficerComponent;
  let fixture: ComponentFixture<CategoryWiseDeskOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryWiseDeskOfficerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseDeskOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
