import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TappAnnexureGoodsSecondComponent } from './tapp-annexure-goods-second.component';

describe('TappAnnexureGoodsSecondComponent', () => {
  let component: TappAnnexureGoodsSecondComponent;
  let fixture: ComponentFixture<TappAnnexureGoodsSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TappAnnexureGoodsSecondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TappAnnexureGoodsSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
