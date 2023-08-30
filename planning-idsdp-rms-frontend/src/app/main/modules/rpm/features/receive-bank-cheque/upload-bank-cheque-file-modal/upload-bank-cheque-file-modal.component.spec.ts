import { ComponentFixture, TestBed } from '@angular/core/testing';
import {UploadFileModalComponent} from "../../create-go-letter/upload-file-modal/upload-file-modal.component";


describe('UploadFileModalComponent', () => {
  let component: UploadFileModalComponent;
  let fixture: ComponentFixture<UploadFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
