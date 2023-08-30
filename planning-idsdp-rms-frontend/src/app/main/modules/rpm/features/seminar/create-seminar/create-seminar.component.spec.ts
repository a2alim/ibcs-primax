import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeminarComponent } from './create-seminar.component';

describe('CreateSeminarComponent', () => {
  let component: CreateSeminarComponent;
  let fixture: ComponentFixture<CreateSeminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSeminarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
