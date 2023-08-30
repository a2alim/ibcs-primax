import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpazillaComponent } from './upazilla.component';

describe('UpazillaComponent', () => {
  let component: UpazillaComponent;
  let fixture: ComponentFixture<UpazillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpazillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpazillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
