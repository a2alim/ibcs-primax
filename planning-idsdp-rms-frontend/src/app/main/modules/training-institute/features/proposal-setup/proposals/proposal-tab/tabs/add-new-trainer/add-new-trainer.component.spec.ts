import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTrainerComponent } from './add-new-trainer.component';

describe('AddNewTrainerComponent', () => {
  let component: AddNewTrainerComponent;
  let fixture: ComponentFixture<AddNewTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTrainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
