import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectManagementSetupComponent} from './project-management-setup.component';

describe('ProjectManagementSetupComponent', () => {
    let component: ProjectManagementSetupComponent;
    let fixture: ComponentFixture<ProjectManagementSetupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProjectManagementSetupComponent]
        }) 
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectManagementSetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
