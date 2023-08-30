import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProfileComponent } from './researcher-profile.component';

describe('ResearcherProfileComponent', () => {
  let component: ResearcherProfileComponent;
  let fixture: ComponentFixture<ResearcherProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
