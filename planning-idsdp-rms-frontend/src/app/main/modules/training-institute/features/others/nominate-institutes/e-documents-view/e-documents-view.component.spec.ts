import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDocumentsViewComponent } from './e-documents-view.component';

describe('EDocumentsViewComponent', () => {
  let component: EDocumentsViewComponent;
  let fixture: ComponentFixture<EDocumentsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EDocumentsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EDocumentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
