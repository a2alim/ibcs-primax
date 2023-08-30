import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeTaskTypeComponent } from './scope-task-type.component';

describe('ScopeTaskTypeComponent', () => {
  let component: ScopeTaskTypeComponent;
  let fixture: ComponentFixture<ScopeTaskTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScopeTaskTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeTaskTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
