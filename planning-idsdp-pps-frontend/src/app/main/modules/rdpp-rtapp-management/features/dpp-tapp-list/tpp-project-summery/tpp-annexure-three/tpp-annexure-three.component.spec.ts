import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureThreeComponent } from './tpp-annexure-three.component';

describe('TppAnnexureThreeComponent', () => {
  let component: TppAnnexureThreeComponent;
  let fixture: ComponentFixture<TppAnnexureThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
