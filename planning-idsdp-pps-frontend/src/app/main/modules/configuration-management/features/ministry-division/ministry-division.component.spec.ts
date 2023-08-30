import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryDivisionComponent } from './ministry-division.component';

describe('MinistryDivisionComponent', () => {
  let component: MinistryDivisionComponent;
  let fixture: ComponentFixture<MinistryDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinistryDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
