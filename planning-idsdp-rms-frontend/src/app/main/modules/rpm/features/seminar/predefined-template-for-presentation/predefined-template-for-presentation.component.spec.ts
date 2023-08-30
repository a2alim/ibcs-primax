import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedTemplateForPresentationComponent } from './predefined-template-for-presentation.component';

describe('PredefinedTemplateForPresentationComponent', () => {
  let component: PredefinedTemplateForPresentationComponent;
  let fixture: ComponentFixture<PredefinedTemplateForPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedTemplateForPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedTemplateForPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
