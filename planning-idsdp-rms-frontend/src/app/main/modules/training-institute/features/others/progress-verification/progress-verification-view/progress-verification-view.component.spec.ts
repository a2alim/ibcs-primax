import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressVerificationViewComponent } from './progress-verification-view.component';

describe('ProgressVerificationViewComponent', () => {
  let component: ProgressVerificationViewComponent;
  let fixture: ComponentFixture<ProgressVerificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressVerificationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressVerificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
