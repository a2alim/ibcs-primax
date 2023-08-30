import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomitateIntituteViewComponent } from './nomitate-intitute-view.component';

describe('NomitateIntituteViewComponent', () => {
  let component: NomitateIntituteViewComponent;
  let fixture: ComponentFixture<NomitateIntituteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomitateIntituteViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomitateIntituteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
