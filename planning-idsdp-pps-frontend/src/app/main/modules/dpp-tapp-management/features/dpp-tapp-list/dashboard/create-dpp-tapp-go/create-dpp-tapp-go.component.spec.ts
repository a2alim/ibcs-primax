import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDppTappGoComponent } from './create-dpp-tapp-go.component';

describe('CreateDppTappGoComponent', () => {
  let component: CreateDppTappGoComponent;
  let fixture: ComponentFixture<CreateDppTappGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDppTappGoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDppTappGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
