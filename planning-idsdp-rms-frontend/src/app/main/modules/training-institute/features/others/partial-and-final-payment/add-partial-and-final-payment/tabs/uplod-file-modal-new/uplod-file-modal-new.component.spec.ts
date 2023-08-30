import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplodFileModalNewComponent } from './uplod-file-modal-new.component';

describe('UplodFileModalNewComponent', () => {
  let component: UplodFileModalNewComponent;
  let fixture: ComponentFixture<UplodFileModalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UplodFileModalNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UplodFileModalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
