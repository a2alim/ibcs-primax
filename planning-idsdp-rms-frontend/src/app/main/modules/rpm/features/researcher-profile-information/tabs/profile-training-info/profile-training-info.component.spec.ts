import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTrainingInfoComponent } from './profile-training-info.component';

describe('ProfileTrainingInfoComponent', () => {
  let component: ProfileTrainingInfoComponent;
  let fixture: ComponentFixture<ProfileTrainingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTrainingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTrainingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
