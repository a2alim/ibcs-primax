import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarsListComponent } from './seminars-list.component';

describe('SeminarsListComponent', () => {
  let component: SeminarsListComponent;
  let fixture: ComponentFixture<SeminarsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
