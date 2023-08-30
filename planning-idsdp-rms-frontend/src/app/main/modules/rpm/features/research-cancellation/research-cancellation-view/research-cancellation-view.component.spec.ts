import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCancellationViewComponent } from './research-cancellation-view.component';

describe('ResearchCancellationViewComponent', () => {
  let component: ResearchCancellationViewComponent;
  let fixture: ComponentFixture<ResearchCancellationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCancellationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCancellationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
