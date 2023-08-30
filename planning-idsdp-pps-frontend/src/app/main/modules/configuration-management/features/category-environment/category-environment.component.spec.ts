import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEnvironmentComponent } from './category-environment.component';

describe('CategoryEnvironmentComponent', () => {
  let component: CategoryEnvironmentComponent;
  let fixture: ComponentFixture<CategoryEnvironmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryEnvironmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
