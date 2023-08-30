import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureSixComponent } from './tpp-annexure-six.component';

describe('TppAnnexureSixComponent', () => {
  let component: TppAnnexureSixComponent;
  let fixture: ComponentFixture<TppAnnexureSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
