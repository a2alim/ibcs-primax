import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementUploadSignatureFilesComponent } from './agreement-upload-signature-files.component';

describe('AgreementUploadSignatureFilesComponent', () => {
  let component: AgreementUploadSignatureFilesComponent;
  let fixture: ComponentFixture<AgreementUploadSignatureFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementUploadSignatureFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementUploadSignatureFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
