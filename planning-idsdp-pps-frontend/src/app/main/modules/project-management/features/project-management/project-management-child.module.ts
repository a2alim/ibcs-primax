import { NgModule } from '@angular/core';
import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectManagementListComponent } from './project-management-list/project-management-list.component';
import { ProjectManagementDetailsTabComponent } from './project-management-details-tab/project-management-details-tab.component';
import { PmPdSelectionComponent } from './project-management-details-tab/pm-pd-selection/pm-pd-selection.component';
import { PmProcurementPlanComponent } from './project-management-details-tab/pm-procurement-plan/pm-procurement-plan.component';
import { ProcurementPlanWorksComponent } from './project-management-details-tab/pm-procurement-plan/procurement-plan-works/procurement-plan-works.component';
import { ProcurementPlanServicesComponent } from './project-management-details-tab/pm-procurement-plan/procurement-plan-services/procurement-plan-services.component';
import { ProcurementPlanGoodsComponent } from './project-management-details-tab/pm-procurement-plan/procurement-plan-goods/procurement-plan-goods.component';
import { PmWorkPlanComponent } from './project-management-details-tab/pm-work-plan/pm-work-plan.component';
import { ViewPmWorkPlanComponent } from './project-management-details-tab/pm-work-plan/view-pm-work-plan/view-pm-work-plan.component';
import { VisitScheduleComponent } from './project-management-details-tab/visit-schedule/visit-schedule.component';
import { PmPdExpenditureComponent } from './project-management-details-tab/pm-pd-expenditure/pm-pd-expenditure.component';
import { AssetManagementComponent } from './project-management-details-tab/asset-management/asset-management.component';
import { AdpFundRequestComponent } from './project-management-details-tab/adp-fund-request/adp-fund-request.component';
import { SharedModule } from 'app/main/shared/shared.module';

@NgModule({
  declarations: [
    ProjectManagementListComponent,
    ProjectManagementDetailsTabComponent,
    PmPdSelectionComponent,
    PmProcurementPlanComponent,
    ProcurementPlanGoodsComponent,
    ProcurementPlanServicesComponent,
    ProcurementPlanWorksComponent,
    PmWorkPlanComponent,
    ViewPmWorkPlanComponent,
    VisitScheduleComponent,
    ProcurementPlanWorksComponent,
    PmPdExpenditureComponent,
    AssetManagementComponent,
    AdpFundRequestComponent
  ],
  imports: [
    SharedModule,
    ProjectManagementRoutingModule,
  ]
})
export class ProjectManagementChildModule { }
