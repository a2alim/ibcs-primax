import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicWorkingPaperComponent } from './public-working-paper.component';

describe('PublicWorkingPaperComponent', () => {
  let component: PublicWorkingPaperComponent;
  let fixture: ComponentFixture<PublicWorkingPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicWorkingPaperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicWorkingPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
