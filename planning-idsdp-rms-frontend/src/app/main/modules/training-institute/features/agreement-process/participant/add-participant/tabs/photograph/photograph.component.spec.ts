import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographComponent } from './photograph.component';

describe('PhotographComponent', () => {
  let component: PhotographComponent;
  let fixture: ComponentFixture<PhotographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotographComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
