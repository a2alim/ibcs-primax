import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementProcessListComponent } from './agreement-process-list.component';

describe('AgreementProcessListComponent', () => {
  let component: AgreementProcessListComponent;
  let fixture: ComponentFixture<AgreementProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementProcessListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
