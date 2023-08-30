import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationTypeComponent } from './justification-type.component';

describe('JustificationTypeComponent', () => {
  let component: JustificationTypeComponent;
  let fixture: ComponentFixture<JustificationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificationTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
