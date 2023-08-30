import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppLogFrameComponent } from './tpp-log-frame.component';

describe('TppLogFrameComponent', () => {
  let component: TppLogFrameComponent;
  let fixture: ComponentFixture<TppLogFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppLogFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppLogFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
