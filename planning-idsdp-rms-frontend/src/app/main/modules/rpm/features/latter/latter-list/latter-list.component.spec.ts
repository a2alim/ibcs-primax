import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatterListComponent } from './latter-list.component';

describe('LatterListComponent', () => {
  let component: LatterListComponent;
  let fixture: ComponentFixture<LatterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
