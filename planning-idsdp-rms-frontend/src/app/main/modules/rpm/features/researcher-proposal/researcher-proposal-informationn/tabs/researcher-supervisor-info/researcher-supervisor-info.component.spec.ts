import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherSupervisorInfoComponent } from './researcher-supervisor-info.component';

describe('ResearcherSupervisorInfoComponent', () => {
  let component: ResearcherSupervisorInfoComponent;
  let fixture: ComponentFixture<ResearcherSupervisorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherSupervisorInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherSupervisorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
