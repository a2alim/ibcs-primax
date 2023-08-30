import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureGoodsComponent } from './annexure-goods.component';

describe('AnnexureGoodsComponent', () => {
  let component: AnnexureGoodsComponent;
  let fixture: ComponentFixture<AnnexureGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexureGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
