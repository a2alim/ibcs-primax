import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpertEvulatorComponent } from './view-expert-evulator.component';

describe('ViewExpertEvulatorComponent', () => {
  let component: ViewExpertEvulatorComponent;
  let fixture: ComponentFixture<ViewExpertEvulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpertEvulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpertEvulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
