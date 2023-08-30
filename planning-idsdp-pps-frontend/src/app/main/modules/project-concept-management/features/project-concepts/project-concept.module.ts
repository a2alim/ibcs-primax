import {NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ProjectConceptRouting} from './project-concept.routing';
import {ProjectConceptListComponent} from './project-concept-list/project-concept-list.component';
import {ProjectSummaryComponent} from './project-concept-setup/component-tabs/project-summary/project-summary.component';
import {JustificationComponent} from './project-concept-setup/component-tabs/justification/justification.component';
import {ScopeOfWorkComponent} from './project-concept-setup/component-tabs/scope-of-work/scope-of-work.component';
import {ModeOfFinanceComponent} from './project-concept-setup/component-tabs/mode-of-finance/mode-of-finance.component';
import {ProjectLocationComponent} from './project-concept-setup/component-tabs/project-location/project-location.component';
import {LinkagesAndTargetComponent} from './project-concept-setup/component-tabs/linkages-and-target/linkages-and-target.component';
import {AddProjectConceptComponent} from './project-concept-setup/add-project-concept/add-project-concept.component';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {ProjectConceptEditDashboardComponent} from './project-concept-edit-dashboard/project-concept-edit-dashboard.component';
import {ProjectConceptViewDashboardComponent} from './project-concept-view-dashboard/project-concept-view-dashboard.component';
import {CommentObservationComponent} from './comment-observation/comment-observation.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MovementNewsComponent } from './movement-news/movement-news.component';
import { ProjectConceptReportComponent } from './project-concept-report/project-concept-report.component';
import { AgencyDashboardComponent } from './agency-dashboard/agency-dashboard.component';
import { ProjectConceptViewDashboardBetaComponent } from './project-concept-view-dashboard-beta/project-concept-view-dashboard-beta.component';
import { ProjectConceptEditDashboardBetaComponent } from './project-concept-edit-dashboard-beta/project-concept-edit-dashboard-beta.component';
import { EcnecDashboardComponent } from './ecnec-dashboard/ecnec-dashboard.component';
import { SharedModule } from 'app/main/shared/shared.module';
import { PlanComDashboardComponent } from './plan-com-dashboard/plan-com-dashboard.component';
import { GisMapComponent } from './gis-map/gis-map.component';
import { GisMapDashboardComponent } from './gis-map-dashboard/gis-map-dashboard.component';
import { AgencyDashboardV2Component } from './agency-dashboard-v2/agency-dashboard-v2.component';

@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [
        ProjectConceptListComponent,
        AddProjectConceptComponent,
        ProjectSummaryComponent,
        JustificationComponent,
        ScopeOfWorkComponent,
        ModeOfFinanceComponent,
        ProjectLocationComponent,
        LinkagesAndTargetComponent,
        ProjectConceptEditDashboardComponent,
        ProjectConceptViewDashboardComponent,
        CommentObservationComponent,
        MovementNewsComponent,
        ProjectConceptReportComponent,
        AgencyDashboardComponent,
        ProjectConceptViewDashboardBetaComponent,
        ProjectConceptEditDashboardBetaComponent,
        EcnecDashboardComponent,
        PlanComDashboardComponent,
        GisMapComponent,
        GisMapDashboardComponent,
        AgencyDashboardV2Component,
    ],
    imports: [
        ProjectConceptRouting,
        SharedModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        DatePipe
    ]
})
export class ProjectConceptModule {

}
