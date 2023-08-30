import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchExprianceComponent } from './research-expriance.component';

describe('ResearchExprianceComponent', () => {
  let component: ResearchExprianceComponent;
  let fixture: ComponentFixture<ResearchExprianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchExprianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchExprianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
