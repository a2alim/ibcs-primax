import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiUserVerificationComponent } from './ti-user-verification.component';

describe('UserVerificationComponent', () => {
  let component: TiUserVerificationComponent;
  let fixture: ComponentFixture<TiUserVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiUserVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiUserVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
