import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementNewsComponent } from './movement-news.component';

describe('MovementNewsComponent', () => {
  let component: MovementNewsComponent;
  let fixture: ComponentFixture<MovementNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovementNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
