import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeasibilityStudyListComponent} from './feasibility-study-list/feasibility-study-list.component';
import {AddFeasibilityStudyProposalComponent} from './feasibility-study-proposal-setup/add-feasibility-study-proposal/add-feasibility-study-proposal.component';
import {AddFeasibilityStudyReportComponent} from './feasibility-study-report/add-feasibility-study-report/add-feasibility-study-report.component';
import {MovementNewsComponent} from './movement-news/movement-news.component';
import {FeasibilityStudyProposalReportComponent} from './feasibility-study-proposal-report/feasibility-study-proposal-report.component';
import {CreateNewFeasibilityStudyComponent} from "./feasibility-study-proposal-setup/create-new-feasibility-study/create-new-feasibility-study.component";
import {FeasibilityStudyProposalViewDashboardBetaComponent} from "./feasibility-study-proposal-view-dashboard-beta/feasibility-study-proposal-view-dashboard-beta.component";
import {FeasibilityStudyProposalEditDashboardBetaComponent} from "./feasibility-study-proposal-edit-dashboard-beta/feasibility-study-proposal-edit-dashboard-beta.component";
import {ProjectSummariesComponent} from "../../../../shared/components/project-summaries/project-summaries.component";


const routes: Routes = [
    // Admin routes

    {path: '', component: FeasibilityStudyListComponent},
    {path: 'add-feasibility-study-proposal/:uuid', component: AddFeasibilityStudyProposalComponent},
    {path: 'add-feasibility-study-report/:uuid', component: AddFeasibilityStudyReportComponent},
    {path: 'movement-news', component: MovementNewsComponent},
    {path: 'view-dashboard/:uuid', component: FeasibilityStudyProposalViewDashboardBetaComponent},
    {path: 'edit-dashboard/:uuid', component: FeasibilityStudyProposalEditDashboardBetaComponent},
    {path: 'report-view/:uuid', component: FeasibilityStudyProposalReportComponent},
    {path: 'create-new-feasibility-study', component: CreateNewFeasibilityStudyComponent},
    // project summaries route from ./shared
    {path: 'project-summaries/:id', component: ProjectSummariesComponent},

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
export class FeasibilityStudyRouting {
}
