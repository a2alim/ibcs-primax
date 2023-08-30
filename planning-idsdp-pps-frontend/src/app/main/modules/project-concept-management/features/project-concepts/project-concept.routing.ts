import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectConceptListComponent} from './project-concept-list/project-concept-list.component';
import {AddProjectConceptComponent} from './project-concept-setup/add-project-concept/add-project-concept.component';
import {MovementNewsComponent} from "./movement-news/movement-news.component";
import {ProjectConceptReportComponent} from './project-concept-report/project-concept-report.component';
import {AgencyDashboardComponent} from "./agency-dashboard/agency-dashboard.component";
import {ProjectConceptViewDashboardBetaComponent} from "./project-concept-view-dashboard-beta/project-concept-view-dashboard-beta.component";
import {ProjectConceptEditDashboardBetaComponent} from "./project-concept-edit-dashboard-beta/project-concept-edit-dashboard-beta.component";
import {PlanComDashboardComponent} from "./plan-com-dashboard/plan-com-dashboard.component";
import {MisReportComponent} from "../../../../shared/components/mis-report/mis-report.component";
import {GisMapDashboardComponent} from "./gis-map-dashboard/gis-map-dashboard.component";
import {AgencyDashboardV2Component} from "./agency-dashboard-v2/agency-dashboard-v2.component";


const routes: Routes = [
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
    {path: 'dashboard',  component: AgencyDashboardV2Component},
    {path: 'dashboard?p=:sessionId',  component: AgencyDashboardV2Component},
    {path: 'dashboard-v2',  component: AgencyDashboardComponent},
    {path: 'project-concept', component: ProjectConceptListComponent},
    {path: 'project-concept/add-project-concept', component: AddProjectConceptComponent},
    {path: 'project-concept/movement-news', component: MovementNewsComponent},
    {path: 'project-concept/add-project-concept/:uuid/:edit', component: AddProjectConceptComponent},
    {path: 'project-concept/edit-dashboard/:uuid', component: ProjectConceptEditDashboardBetaComponent},
    {path: 'project-concept/view-dashboard/:uuid', component: ProjectConceptViewDashboardBetaComponent},
    {path: 'project-concept/report-view/:uuid', component: ProjectConceptReportComponent},
    {path: 'plan-com-dashboard', component: PlanComDashboardComponent},
    {path: 'mis-report', component: MisReportComponent},
    {path: 'gis-map-dashboard',  component: GisMapDashboardComponent},
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class ProjectConceptRouting {
}
