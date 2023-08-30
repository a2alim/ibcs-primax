import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureTwoComponent } from './tpp-annexure-two.component';

describe('TppAnnexureTwoComponent', () => {
  let component: TppAnnexureTwoComponent;
  let fixture: ComponentFixture<TppAnnexureTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
