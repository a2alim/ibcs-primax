import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DppTappListPageComponent } from './dpp-tapp-list-page.component';

describe('DppTappListPageComponent', () => {
  let component: DppTappListPageComponent;
  let fixture: ComponentFixture<DppTappListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppTappListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppTappListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
