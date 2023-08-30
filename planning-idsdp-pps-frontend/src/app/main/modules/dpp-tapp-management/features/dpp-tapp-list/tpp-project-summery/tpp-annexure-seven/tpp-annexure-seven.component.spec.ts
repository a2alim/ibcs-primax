import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppAnnexureSavenComponent } from './tpp-annexure-seven.component';

describe('TppAnnexureSavenComponent', () => {
  let component: TppAnnexureSavenComponent;
  let fixture: ComponentFixture<TppAnnexureSavenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppAnnexureSavenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppAnnexureSavenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
