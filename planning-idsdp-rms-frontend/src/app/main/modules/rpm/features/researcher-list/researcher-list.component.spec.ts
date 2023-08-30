import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherListComponent } from './researcher-list.component';

describe('ResearcherListComponent', () => {
  let component: ResearcherListComponent;
  let fixture: ComponentFixture<ResearcherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
