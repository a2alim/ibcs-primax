import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoLetterListComponent } from './geo-letter-list.component';

describe('GeoLetterListComponent', () => {
  let component: GeoLetterListComponent;
  let fixture: ComponentFixture<GeoLetterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoLetterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoLetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
