import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalExprianceComponent } from './professional-expriance.component';

describe('ProfessionalExprianceComponent', () => {
  let component: ProfessionalExprianceComponent;
  let fixture: ComponentFixture<ProfessionalExprianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalExprianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalExprianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
