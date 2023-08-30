import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarViewDetailsComponent } from './seminar-view-details.component';

describe('SeminarViewDetailsComponent', () => {
  let component: SeminarViewDetailsComponent;
  let fixture: ComponentFixture<SeminarViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarViewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
