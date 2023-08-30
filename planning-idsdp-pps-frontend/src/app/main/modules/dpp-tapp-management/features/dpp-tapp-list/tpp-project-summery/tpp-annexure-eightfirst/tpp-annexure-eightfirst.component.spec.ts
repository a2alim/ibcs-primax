import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureEightfirstComponent } from './tpp-annexure-eightfirst.component';

describe('TppAnnexureEightfirstComponent', () => {
  let component: TppAnnexureEightfirstComponent;
  let fixture: ComponentFixture<TppAnnexureEightfirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureEightfirstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureEightfirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
