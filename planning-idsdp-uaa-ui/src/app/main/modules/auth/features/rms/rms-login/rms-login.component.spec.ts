import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmsLoginComponent } from './rms-login.component';

describe('RmsLoginComponent', () => {
  let component: RmsLoginComponent;
  let fixture: ComponentFixture<RmsLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmsLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
