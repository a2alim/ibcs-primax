import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {DppTappTabComponent} from './project-summary/project-summay-tab/dpp-tapp-tab.component';
import {AnnualPhasingTabTitleComponent} from './annual-phasing-cost/annual-phasing-tab-title/annual-phasing-tab-title.component';
import {YearWiseFinancialPlanComponent} from './year-wise-financial-plan/year-wise-financial-plan.component';
import {YearWiseFinancialPlanBngComponent} from './year-wise-financial-plan-bng/year-wise-financial-plan-bng.component';
import {AnnexureGoodsComponent} from './tab-forms/annexure-goods/annexure-goods.component';
import {DetailedEstimatedCostComponent} from './detailed-estimated-cost/detailed-estimated-cost.component';

import {AnnexureServicesComponent} from './tab-forms/annexure-services/annexure-services.component';
import {AnnexureWorksComponent} from './tab-forms/annexure-works/annexure-works.component';
import {ProjectDetailsTabComponent} from './project-details/project-details-tab/project-details-tab.component';
import {AmortizationScheduleComponent} from './amortization-schedule/amortization-schedule.component';
import {LocationWiseCostBreakdownComponent} from './location-wise-cost-breakdown/location-wise-cost-breakdown.component';
import {ProjectManagementSetupComponent} from './project-management-setup/project-management-setup.component';
import {ProjectSummeryTabComponent} from './tpp-project-summery/project-summery-tab/project-summery-tab.component';
import {ProjectDetailsComponent} from './tpp-project-summery/project-details/project-details.component';
import {TppAnnexureThreeComponent} from "./tpp-project-summery/tpp-annexure-three/tpp-annexure-three.component";
import {TppAnnexureTwoComponent} from "./tpp-project-summery/tpp-annexure-two/tpp-annexure-two.component";
import {TppAnnexureFourComponent} from "./tpp-project-summery/tpp-annexure-four/tpp-annexure-four.component";
import {TppAnnexureFiveComponent} from "./tpp-project-summery/tpp-annexure-five/tpp-annexure-five.component";
import {TppAnnexureSixComponent} from "./tpp-project-summery/tpp-annexure-six/tpp-annexure-six.component";
import {TppAnnexureSavenComponent} from "./tpp-project-summery/tpp-annexure-seven/tpp-annexure-seven.component";
import {TppAnnexureEightfirstComponent} from "./tpp-project-summery/tpp-annexure-eightfirst/tpp-annexure-eightfirst.component";
import {TappAnnexureGoodsSecondComponent} from "./tpp-project-summery/tapp-annexure-goods-second/tapp-annexure-goods-second.component";
import {DppTappListPageComponent} from './dpp-tapp-list-page/dpp-tapp-list-page.component';
import {DppDashboardComponent} from './dashboard/dpp-dashboard/dpp-dashboard.component';
import {TappAnnualPhasingTabTitleComponent} from "./tpp-project-summery/tapp-annexure-one/add-tapp-annexure-one-tab/tapp-annual-phasing-tab-title.component";
import {DppTappViewDashboardComponent} from "./dashboard/dpp-tapp-view-dashboard/dpp-tapp-view-dashboard.component";
import {CreateNewDppComponent} from "./create-new-rdpp-rtapp/create-new-dpp.component";
import {PscWorkingPlanComponent} from "./psc-working-plan/psc-working-plan.component";
import {DppTappViewDashboardBetaComponent} from "./dashboard/dpp-tapp-view-dashboard-beta/dpp-tapp-view-dashboard-beta.component";
import {RtappAnnexureTwoComponent} from "./tpp-project-summery/rtapp-annexure-two/rtapp-annexure-two.component";
import {ViewRtappAnnexureTwoComponent} from "./tpp-project-summery/rtapp-annexure-two/view-rtapp-annexure-two/view-rtapp-annexure-two.component";
import { EcnecMeetingComponent } from './ecnec-meeting/ecnec-meeting.component';


const routes: Routes = [

    // Admin routes
    {path: '', component: DppTappListPageComponent},
    {path: 'dashboard', component: DppDashboardComponent},
    {path: 'view-dashboard-old/:id', component: DppTappViewDashboardComponent},
    {path: 'dashboard/project-concept/:id', component: ListComponent},
    {path: 'add-new', component: DppTappTabComponent},
    {path: 'add-project-details', component: ProjectDetailsTabComponent},
    {path: 'add-annexuregoods', component: AnnexureGoodsComponent},
    {path: 'add-annexurewokrs', component: AnnexureWorksComponent},
    {path: 'add-annexureservices', component: AnnexureServicesComponent},
    {path: 'detailed-estimated-cost', component: DetailedEstimatedCostComponent},
    {path: 'amortization_schedule', component: AmortizationScheduleComponent},
    {path: 'location-wise-cost-breakdown', component: LocationWiseCostBreakdownComponent},
    {path: 'tapp-project-summery', component: ProjectSummeryTabComponent},
    {path: 'project-management-setup', component: ProjectManagementSetupComponent},

    {path: 'tapp-annexure-three', component: TppAnnexureThreeComponent},
    {path: 'tapp-annexure-two', component: TppAnnexureTwoComponent},

    {path: 'tapp-project-details', component: ProjectDetailsComponent},
    {path: 'tapp-annexure-four', component: TppAnnexureFourComponent},
    {path: 'tapp-annexure-five', component: TppAnnexureFiveComponent},
    {path: 'tapp-annexure-six', component: TppAnnexureSixComponent},
    {path: 'tapp-annexure-seven', component: TppAnnexureSavenComponent},
    {path: 'add-new-annual-phasing-cost', component: AnnualPhasingTabTitleComponent},
    {path: 'tapp-annexure-goods-first', component: TppAnnexureEightfirstComponent},
    //{path: 'add-new-annual-phasing-cost', component: AnnualPhasingTabTitleComponent},
    {path: 'tpp-annexure-goods-first', component: TppAnnexureEightfirstComponent},
    {path: 'add-new-annual-phasing-cost', component: TappAnnualPhasingTabTitleComponent},
    {path: 'year-wise-fin-plan', component: YearWiseFinancialPlanComponent},
    {path: 'year-wise-fin-plan/:uuid', component: YearWiseFinancialPlanComponent},
    {path: 'year-wise-fin-plan-bn', component: YearWiseFinancialPlanBngComponent},
    {path: 'tapp-annexure-service', component: TappAnnexureGoodsSecondComponent},
    {path: 'tapp-annexure-one', component: TappAnnualPhasingTabTitleComponent},
    {path: 'tpp-annexure-service', component: TappAnnexureGoodsSecondComponent},
    {path: 'tpp-annexure-one', component: TappAnnualPhasingTabTitleComponent},
    {path: 'create-new-rdpp-rtapp', component: CreateNewDppComponent},
    {path: 'tpp-annexure-goods-second', component: TappAnnexureGoodsSecondComponent},
    {path: 'psc/:id', component: PscWorkingPlanComponent},
    {path: 'view-dashboard', component: DppTappViewDashboardBetaComponent},
    {path: 'rtapp-annexure-two', component: RtappAnnexureTwoComponent},
    {path: 'ecnec-meeting', component: EcnecMeetingComponent},
    {
        path: 'view-rtapp-annexure-two/:masterId/:dateOfCommencement/:dateOfCompletion',
        component: ViewRtappAnnexureTwoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class DppTappListRouting {

}
