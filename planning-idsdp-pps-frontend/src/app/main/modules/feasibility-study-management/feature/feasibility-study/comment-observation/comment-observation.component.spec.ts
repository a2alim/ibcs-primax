import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentObservationComponent } from './comment-observation.component';

describe('CommentObservationComponent', () => {
  let component: CommentObservationComponent;
  let fixture: ComponentFixture<CommentObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentObservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
