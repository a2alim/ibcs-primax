import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchProfileComponent } from './research-profile.component';

describe('ResearchProfileComponent', () => {
  let component: ResearchProfileComponent;
  let fixture: ComponentFixture<ResearchProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
