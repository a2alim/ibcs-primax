import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalCofogComponent } from './optional-cofog.component';

describe('OptionalCofogComponent', () => {
  let component: OptionalCofogComponent;
  let fixture: ComponentFixture<OptionalCofogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionalCofogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalCofogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
