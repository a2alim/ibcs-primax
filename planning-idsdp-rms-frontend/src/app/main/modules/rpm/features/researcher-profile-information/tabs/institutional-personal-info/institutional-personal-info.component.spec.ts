import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalPersonalInfoComponent } from './institutional-personal-info.component';

describe('InstitutionalPersonalInfoComponent', () => {
  let component: InstitutionalPersonalInfoComponent;
  let fixture: ComponentFixture<InstitutionalPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionalPersonalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
