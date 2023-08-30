import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkagesAndTargetComponent } from './linkages-and-target.component';

describe('LinkagesAndTargetComponent', () => {
  let component: LinkagesAndTargetComponent;
  let fixture: ComponentFixture<LinkagesAndTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkagesAndTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkagesAndTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
