import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCancellationAddComponent } from './research-cancellation-add.component';

describe('ResearchCancellationAddComponent', () => {
  let component: ResearchCancellationAddComponent;
  let fixture: ComponentFixture<ResearchCancellationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCancellationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCancellationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
