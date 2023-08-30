import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalComponentComponent } from './capital-component.component';

describe('CapitalComponentComponent', () => {
  let component: CapitalComponentComponent;
  let fixture: ComponentFixture<CapitalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
