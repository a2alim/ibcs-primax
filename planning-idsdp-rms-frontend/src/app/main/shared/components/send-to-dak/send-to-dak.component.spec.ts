import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendToDakComponent } from './send-to-dak.component';

describe('SendToDakComponent', () => {
  let component: SendToDakComponent;
  let fixture: ComponentFixture<SendToDakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendToDakComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToDakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
