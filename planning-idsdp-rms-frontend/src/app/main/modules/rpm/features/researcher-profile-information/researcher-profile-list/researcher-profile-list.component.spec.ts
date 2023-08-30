import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProfileListComponent } from './researcher-profile-list.component';

describe('ResearcherProfileListComponent', () => {
  let component: ResearcherProfileListComponent;
  let fixture: ComponentFixture<ResearcherProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProfileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
