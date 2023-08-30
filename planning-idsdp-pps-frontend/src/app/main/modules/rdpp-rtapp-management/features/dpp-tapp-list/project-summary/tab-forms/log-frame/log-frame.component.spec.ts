import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogFrameComponent} from './log-frame.component';

describe('LogFrameComponent', () => {
  let component: LogFrameComponent;
  let fixture: ComponentFixture<LogFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
