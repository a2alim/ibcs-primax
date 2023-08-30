import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementJamanatnamaComponent } from './agreement-jamanatnama.component';

describe('AgreementJamanatnamaComponent', () => {
  let component: AgreementJamanatnamaComponent;
  let fixture: ComponentFixture<AgreementJamanatnamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementJamanatnamaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementJamanatnamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
