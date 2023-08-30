import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCollectionListComponent } from './cheque-collection-list.component';

describe('ChequeCollectionListComponent', () => {
  let component: ChequeCollectionListComponent;
  let fixture: ComponentFixture<ChequeCollectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeCollectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
