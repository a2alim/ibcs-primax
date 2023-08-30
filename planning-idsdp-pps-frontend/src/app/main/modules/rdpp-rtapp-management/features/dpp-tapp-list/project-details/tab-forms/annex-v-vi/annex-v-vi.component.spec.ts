import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexVViComponent } from './annex-v-vi.component';

describe('AnnexVViComponent', () => {
  let component: AnnexVViComponent;
  let fixture: ComponentFixture<AnnexVViComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexVViComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexVViComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
