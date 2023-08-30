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
import {CreateNewDppComponent} from "./create-new-dpp/create-new-dpp.component";
import {PscWorkingPlanComponent} from "./psc-working-plan/psc-working-plan.component";
import {DppTappViewDashboardBetaComponent} from "./dashboard/dpp-tapp-view-dashboard-beta/dpp-tapp-view-dashboard-beta.component";
import {EcnecMeetingComponent} from "./ecnec-meeting/ecnec-meeting.component";
import {CreateDppTappGoComponent} from './dashboard/create-dpp-tapp-go/create-dpp-tapp-go.component';
import {ProjectSummariesComponent} from "../../../../shared/components/project-summaries/project-summaries.component";
import {DppMtbfComponent} from "./dpp-mtbf/dpp-mtbf.component";
import {CompareReportComponent} from "./dashboard/compare-report/compare-report.component";
import { AnnexureIAComponent } from './annexure-i-a/annexure-i-a.component';
import { MinistryAppraisalFormComponent } from './dashboard/dpp-dashboard/ministry-appraisal-form/ministry-appraisal-form.component';
import {
    DppTappPublicDashboardComponent
} from "./dashboard/dpp-tapp-public-dashboard/dpp-tapp-public-dashboard.component";
import {PublicWorkingPaperComponent} from "./public-working-paper/public-working-paper.component";


const routes: Routes = [

    // project summaries route from ./shared
    {path: 'project-summaries/:id', component: ProjectSummariesComponent},

    // Admin routes

    {path: '', component: DppTappListPageComponent},
    {path: 'dashboard/:id', component: DppDashboardComponent},
    {path: 'view-dashboard-old/:id', component: DppTappViewDashboardComponent},
    {path: 'dashboard/project-concept/:id', component: ListComponent},
    {path: 'add-new/:id', component: DppTappTabComponent},
    {path: 'add-project-details/:id', component: ProjectDetailsTabComponent},
    {path: 'add-annexuregoods/:id', component: AnnexureGoodsComponent},
    {path: 'add-annexurewokrs/:id', component: AnnexureWorksComponent},
    {path: 'add-annexureservices/:id', component: AnnexureServicesComponent},
    {path: 'detailed-estimated-cost/:id', component: DetailedEstimatedCostComponent},
    {path: 'amortization_schedule/:id', component: AmortizationScheduleComponent},
    {path: 'location-wise-cost-breakdown/:id', component: LocationWiseCostBreakdownComponent},
    {path: 'project-management-setup/:id', component: ProjectManagementSetupComponent},
    {path: 'dpp-mtbf/:id', component: DppMtbfComponent},
    {path: 'annexure-i-a/:id', component: AnnexureIAComponent},

    {path: 'tapp-project-summery/:id', component: ProjectSummeryTabComponent},
    {path: 'tapp-annexure-three/:id', component: TppAnnexureThreeComponent},
    {path: 'tapp-annexure-two/:id', component: TppAnnexureTwoComponent},
    {path: 'tapp-project-details/:id', component: ProjectDetailsComponent},
    {path: 'tapp-annexure-four/:id', component: TppAnnexureFourComponent},
    {path: 'tapp-annexure-five/:id', component: TppAnnexureFiveComponent},
    {path: 'tapp-annexure-six/:id', component: TppAnnexureSixComponent},
    {path: 'tapp-annexure-seven/:id', component: TppAnnexureSavenComponent},
    {path: 'add-new-annual-phasing-cost/:id', component: AnnualPhasingTabTitleComponent},
    {path: 'tapp-annexure-goods-first/:id', component: TppAnnexureEightfirstComponent},
    //{path: 'add-new-annual-phasing-cost', component: AnnualPhasingTabTitleComponent},
    {path: 'tpp-annexure-goods-first/:id', component: TppAnnexureEightfirstComponent},
    {path: 'add-new-annual-phasing-cost', component: TappAnnualPhasingTabTitleComponent},
    {path: 'year-wise-fin-plan', component: YearWiseFinancialPlanComponent},
    {path: 'year-wise-fin-plan/:uuid', component: YearWiseFinancialPlanComponent},
    {path: 'year-wise-fin-plan-bn', component: YearWiseFinancialPlanBngComponent},
    {path: 'tapp-annexure-service/:id', component: TappAnnexureGoodsSecondComponent},
    {path: 'tapp-annexure-one/:id', component: TappAnnualPhasingTabTitleComponent},
    {path: 'tpp-annexure-service/:id', component: TappAnnexureGoodsSecondComponent},
    {path: 'tpp-annexure-one', component: TappAnnualPhasingTabTitleComponent},
    {path: 'create-new-dpp-tapp', component: CreateNewDppComponent},

    {path: 'create-new-ministry-appraisal/:id', component: MinistryAppraisalFormComponent},
    {path: 'tpp-annexure-goods-second/:id', component: TappAnnexureGoodsSecondComponent},
    {path: 'psc/:id', component: PscWorkingPlanComponent},
    {path: 'public-psc', component: PublicWorkingPaperComponent},
    {path: 'view-dashboard/:id', component: DppTappViewDashboardBetaComponent},
    {path: 'public-dashboard', component: DppTappPublicDashboardComponent},
    {path: 'ecnec-meeting', component: EcnecMeetingComponent},
    {path: 'create-dpp-tapp-go/:uuid/:orderType', component: CreateDppTappGoComponent},
    {path: 'ecnec-meeting/:id', component: EcnecMeetingComponent},
    {path: 'compare-report/:id', component: CompareReportComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class DppTappListRouting {

}
