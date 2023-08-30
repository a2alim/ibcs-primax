import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatterViewComponent } from './latter-view.component';

describe('LatterViewComponent', () => {
  let component: LatterViewComponent;
  let fixture: ComponentFixture<LatterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
