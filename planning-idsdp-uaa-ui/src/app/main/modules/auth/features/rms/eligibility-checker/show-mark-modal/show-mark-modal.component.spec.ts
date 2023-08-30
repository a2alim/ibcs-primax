import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMarkModalComponent } from './show-mark-modal.component';

describe('ShowMarkModalComponent', () => {
  let component: ShowMarkModalComponent;
  let fixture: ComponentFixture<ShowMarkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMarkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
