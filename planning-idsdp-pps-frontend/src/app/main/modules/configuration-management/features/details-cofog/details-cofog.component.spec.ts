import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCofogComponent } from './details-cofog.component';

describe('DetailsCofogComponent', () => {
  let component: DetailsCofogComponent;
  let fixture: ComponentFixture<DetailsCofogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsCofogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCofogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
