import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectImpactComponent } from './effect-impact.component';

describe('EffectImpactComponent', () => {
  let component: EffectImpactComponent;
  let fixture: ComponentFixture<EffectImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffectImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
