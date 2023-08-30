import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTableComponentsComponent } from './list-table-components.component';

describe('ListTableComponentsComponent', () => {
  let component: ListTableComponentsComponent;
  let fixture: ComponentFixture<ListTableComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTableComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTableComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
