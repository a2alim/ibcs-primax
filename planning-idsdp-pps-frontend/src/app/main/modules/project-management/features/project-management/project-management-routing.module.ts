import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/main/core/auth/guards/auth.guard';
import { ProjectManagementDetailsTabComponent } from './project-management-details-tab/project-management-details-tab.component';
import { ProjectManagementListComponent } from './project-management-list/project-management-list.component';
import {ViewPmWorkPlanComponent} from "./project-management-details-tab/pm-work-plan/view-pm-work-plan/view-pm-work-plan.component";

const routes: Routes = [

  { path: '', component: ProjectManagementListComponent },
  //{ path: 'pd-selection/:dppTappMasterId/:dppTappMasterUuid/:projectConceptMasterId/:projectConceptUuid/:type/:pcmId', component: ProjectManagementDetailsTabComponent },
  { path: 'pd-selection/:dppTappMasterId/:dppTappMasterUuid/:projectConceptMasterId/:projectConceptUuid/:dateCommencement/:dateCompletion/:type', component: ProjectManagementDetailsTabComponent },
  { path: 'view-work-plan/:dppTappMasterId/:dateCommencement/:dateCompletion', component: ViewPmWorkPlanComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProjectManagementRoutingModule { }
