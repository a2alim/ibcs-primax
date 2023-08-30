import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileModalsComponent } from './upload-file-modals.component';

describe('UploadFileModalsComponent', () => {
  let component: UploadFileModalsComponent;
  let fixture: ComponentFixture<UploadFileModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileModalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
