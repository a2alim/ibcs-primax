import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforOfResearchComponent } from './infor-of-research.component';

describe('InforOfResearchComponent', () => {
  let component: InforOfResearchComponent;
  let fixture: ComponentFixture<InforOfResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforOfResearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforOfResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
