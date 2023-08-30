import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskUserMovementComponent } from './desk-user-movement.component';

describe('DeskUserMovementComponent', () => {
  let component: DeskUserMovementComponent;
  let fixture: ComponentFixture<DeskUserMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeskUserMovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeskUserMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
