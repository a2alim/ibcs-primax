import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRtappAnnexureTwoComponent } from './view-rtapp-annexure-two.component';

describe('ViewRtappAnnexureTwoComponent', () => {
  let component: ViewRtappAnnexureTwoComponent;
  let fixture: ComponentFixture<ViewRtappAnnexureTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRtappAnnexureTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRtappAnnexureTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
