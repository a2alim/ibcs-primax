import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLatterAddComponent } from './new-latter-add.component';

describe('NewLatterAddComponent', () => {
  let component: NewLatterAddComponent;
  let fixture: ComponentFixture<NewLatterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLatterAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLatterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
