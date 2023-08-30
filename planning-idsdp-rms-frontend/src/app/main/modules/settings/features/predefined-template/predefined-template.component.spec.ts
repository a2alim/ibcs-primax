import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedTemplateComponent } from './predefined-template.component';

describe('PredefinedTemplateComponent', () => {
  let component: PredefinedTemplateComponent;
  let fixture: ComponentFixture<PredefinedTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
