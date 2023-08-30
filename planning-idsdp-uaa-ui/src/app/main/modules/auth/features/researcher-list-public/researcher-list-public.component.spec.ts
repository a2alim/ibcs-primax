import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherListPublicComponent } from './researcher-list-public.component';

describe('ResearcherListPublicComponent', () => {
  let component: ResearcherListPublicComponent;
  let fixture: ComponentFixture<ResearcherListPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherListPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherListPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
