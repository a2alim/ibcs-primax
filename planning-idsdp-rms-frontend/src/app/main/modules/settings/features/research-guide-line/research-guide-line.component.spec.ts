import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchGuideLineComponent } from './research-guide-line.component';

describe('ResearchGuideLineComponent', () => {
  let component: ResearchGuideLineComponent;
  let fixture: ComponentFixture<ResearchGuideLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchGuideLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchGuideLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
