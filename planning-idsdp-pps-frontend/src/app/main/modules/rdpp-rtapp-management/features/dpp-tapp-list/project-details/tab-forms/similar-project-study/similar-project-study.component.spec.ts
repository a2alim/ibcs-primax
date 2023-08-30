import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarProjectStudyComponent } from './similar-project-study.component';

describe('SimilarProjectStudyComponent', () => {
  let component: SimilarProjectStudyComponent;
  let fixture: ComponentFixture<SimilarProjectStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimilarProjectStudyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarProjectStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
