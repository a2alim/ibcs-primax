import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalWorkingOrganizationComponent } from './institutional-working-organization.component';

describe('InstitutionalWorkingOrganizationComponent', () => {
  let component: InstitutionalWorkingOrganizationComponent;
  let fixture: ComponentFixture<InstitutionalWorkingOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionalWorkingOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalWorkingOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
