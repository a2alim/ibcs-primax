import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZillaComponent } from './zilla.component';

describe('ZillaComponent', () => {
  let component: ZillaComponent;
  let fixture: ComponentFixture<ZillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
