import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCancellationComponent } from './research-cancellation.component';

describe('ResearchCancellationComponent', () => {
  let component: ResearchCancellationComponent;
  let fixture: ComponentFixture<ResearchCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCancellationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
