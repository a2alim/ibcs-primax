import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaSourceComponent } from './pa-source.component';

describe('PaSourceComponent', () => {
  let component: PaSourceComponent;
  let fixture: ComponentFixture<PaSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
