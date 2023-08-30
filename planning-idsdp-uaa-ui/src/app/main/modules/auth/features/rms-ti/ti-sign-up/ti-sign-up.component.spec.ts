import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiSignUpComponent } from './ti-sign-up.component';

describe('TiSignUpComponent', () => {

  let component: TiSignUpComponent;
  let fixture: ComponentFixture<TiSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiSignUpComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
