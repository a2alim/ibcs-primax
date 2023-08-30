import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureFourComponent } from './tpp-annexure-four.component';

describe('TppAnnexureFourComponent', () => {
  let component: TppAnnexureFourComponent;
  let fixture: ComponentFixture<TppAnnexureFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
