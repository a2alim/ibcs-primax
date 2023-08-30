import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmsSignUpComponent } from './rms-sign-up.component';

describe('RmsSignUpComponent', () => {
  let component: RmsSignUpComponent;
  let fixture: ComponentFixture<RmsSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmsSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmsSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
