import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplodFileModalComponent } from './uplod-file-modal.component';

describe('UplodFileModalComponent', () => {
  let component: UplodFileModalComponent;
  let fixture: ComponentFixture<UplodFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UplodFileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UplodFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
