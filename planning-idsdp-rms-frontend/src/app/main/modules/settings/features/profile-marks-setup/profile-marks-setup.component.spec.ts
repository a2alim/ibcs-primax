import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMarksSetupComponent } from './profile-marks-setup.component';

describe('ProfileMarksSetupComponent', () => {
  let component: ProfileMarksSetupComponent;
  let fixture: ComponentFixture<ProfileMarksSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileMarksSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMarksSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
