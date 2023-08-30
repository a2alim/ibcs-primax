import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DppTappTabComponent} from './dpp-tapp-tab.component';

describe('DppTappTabComponent', () => {
  let component: DppTappTabComponent;
  let fixture: ComponentFixture<DppTappTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppTappTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppTappTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
