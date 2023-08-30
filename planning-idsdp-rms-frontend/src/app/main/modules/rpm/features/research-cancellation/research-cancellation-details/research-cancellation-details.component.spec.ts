import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCancellationDetailsComponent } from './research-cancellation-details.component';

describe('ResearchCancellationDetailsComponent', () => {
  let component: ResearchCancellationDetailsComponent;
  let fixture: ComponentFixture<ResearchCancellationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCancellationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCancellationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
