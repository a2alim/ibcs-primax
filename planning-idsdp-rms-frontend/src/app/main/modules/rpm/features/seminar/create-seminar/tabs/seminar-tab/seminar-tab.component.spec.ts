import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarTabComponent } from './seminar-tab.component';

describe('SeminarTabComponent', () => {
  let component: SeminarTabComponent;
  let fixture: ComponentFixture<SeminarTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
