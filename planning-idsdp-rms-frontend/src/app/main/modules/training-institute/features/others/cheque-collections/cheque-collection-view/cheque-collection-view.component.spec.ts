import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCollectionViewComponent } from './cheque-collection-view.component';

describe('ChequeCollectionViewComponent', () => {
  let component: ChequeCollectionViewComponent;
  let fixture: ComponentFixture<ChequeCollectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeCollectionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeCollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
