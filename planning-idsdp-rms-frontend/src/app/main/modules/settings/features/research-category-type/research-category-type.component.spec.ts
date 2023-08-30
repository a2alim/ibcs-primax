import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCategoryTypeComponent } from './research-category-type.component';

describe('ResearchCategoryTypeComponent', () => {
  let component: ResearchCategoryTypeComponent;
  let fixture: ComponentFixture<ResearchCategoryTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCategoryTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCategoryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
