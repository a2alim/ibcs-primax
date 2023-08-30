import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSerializationComponent } from './user-serialization.component';

describe('UserSerializationComponent', () => {
  let component: UserSerializationComponent;
  let fixture: ComponentFixture<UserSerializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSerializationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSerializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
