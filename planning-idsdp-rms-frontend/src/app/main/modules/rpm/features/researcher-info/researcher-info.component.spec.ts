import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherInfoComponent } from './researcher-info.component';

describe('ResearcherInfoComponent', () => {
  let component: ResearcherInfoComponent;
  let fixture: ComponentFixture<ResearcherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
