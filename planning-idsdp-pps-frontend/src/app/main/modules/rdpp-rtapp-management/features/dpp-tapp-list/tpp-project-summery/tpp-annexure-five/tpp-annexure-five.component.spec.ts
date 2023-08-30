import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureFiveComponent } from './tpp-annexure-five.component';

describe('TppAnnexureFiveComponent', () => {
  let component: TppAnnexureFiveComponent;
  let fixture: ComponentFixture<TppAnnexureFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
