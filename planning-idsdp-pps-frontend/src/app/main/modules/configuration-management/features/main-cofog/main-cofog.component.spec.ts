import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCofogComponent } from './main-cofog.component';

describe('MainCofogComponent', () => {
  let component: MainCofogComponent;
  let fixture: ComponentFixture<MainCofogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCofogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCofogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
