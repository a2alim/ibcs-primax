import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadGoLetterComponent } from './download-go-letter.component';

describe('DownloadGoLetterComponent', () => {
  let component: DownloadGoLetterComponent;
  let fixture: ComponentFixture<DownloadGoLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadGoLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadGoLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
