import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarEmailComponent } from './seminar-email.component';

describe('SeminarEmailComponent', () => {
  let component: SeminarEmailComponent;
  let fixture: ComponentFixture<SeminarEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
