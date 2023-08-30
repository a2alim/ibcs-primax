import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersImportantDetailsComponent } from './others-important-details.component';

describe('OthersImportantDetailsComponent', () => {
  let component: OthersImportantDetailsComponent;
  let fixture: ComponentFixture<OthersImportantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersImportantDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersImportantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
