import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParipatraVersionComponent } from './paripatra-version.component';

describe('ParipatraVersionComponent', () => {
  let component: ParipatraVersionComponent;
  let fixture: ComponentFixture<ParipatraVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParipatraVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParipatraVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
