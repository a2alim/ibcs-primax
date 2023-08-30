import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DppMtbfComponent } from './dpp-mtbf.component';

describe('DppMtbfComponent', () => {
  let component: DppMtbfComponent;
  let fixture: ComponentFixture<DppMtbfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppMtbfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppMtbfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
