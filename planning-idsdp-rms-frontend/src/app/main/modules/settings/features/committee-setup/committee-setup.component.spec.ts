import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeSetupComponent } from './committee-setup.component';

describe('CommitteeSetupComponent', () => {
  let component: CommitteeSetupComponent;
  let fixture: ComponentFixture<CommitteeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
