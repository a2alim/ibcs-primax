import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiSignInComponent } from './ti-sign-in.component';

describe('TiSignInComponent', () => {
  let component: TiSignInComponent;
  let fixture: ComponentFixture<TiSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiSignInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
