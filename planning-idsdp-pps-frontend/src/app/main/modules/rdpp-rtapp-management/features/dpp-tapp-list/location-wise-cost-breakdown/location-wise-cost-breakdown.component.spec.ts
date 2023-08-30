import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationWiseCostBreakdownComponent} from './location-wise-cost-breakdown.component';

describe('LocationWiseCostBreakdownComponent', () => {
    let component: LocationWiseCostBreakdownComponent;
    let fixture: ComponentFixture<LocationWiseCostBreakdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LocationWiseCostBreakdownComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LocationWiseCostBreakdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
