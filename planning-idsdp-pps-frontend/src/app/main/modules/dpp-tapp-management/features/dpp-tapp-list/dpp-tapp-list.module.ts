import {NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DppTappListRouting} from './dpp-tapp-list.routing';
import {ListComponent} from './list/list.component';
import {DppTappTabComponent} from './project-summary/project-summay-tab/dpp-tapp-tab.component';
import {ObjectAndCostComponent} from './project-summary/tab-forms/object-and-cost/object-and-cost.component';
import {LocationsComponent} from './project-summary/tab-forms/locations/locations.component';
import {ComponentWiseCostComponent} from './project-summary/tab-forms/component-wise-cost/component-wise-cost.component';
import {LogFrameComponent} from './project-summary/tab-forms/log-frame/log-frame.component';
import {ProjectManagementComponent} from './project-summary/tab-forms/project-management/project-management.component';
import {RevenueComponentComponent} from './annual-phasing-cost/tab-forms/revenue-component/revenue-component.component';
import {CapitalComponentComponent} from './annual-phasing-cost/tab-forms/capital-component/capital-component.component';
import {PhysicalContingencyComponent} from './annual-phasing-cost/tab-forms/physical-contingency/physical-contingency.component';
import {GrandTotalComponent} from './annual-phasing-cost/tab-forms/grand-total/grand-total.component';
import {AnnualPhasingTabTitleComponent} from './annual-phasing-cost/annual-phasing-tab-title/annual-phasing-tab-title.component';
import {YearWiseFinancialPlanComponent} from './year-wise-financial-plan/year-wise-financial-plan.component';
import {YearWiseFinancialPlanBngComponent} from './year-wise-financial-plan-bng/year-wise-financial-plan-bng.component';
import {AnnexureGoodsComponent} from './tab-forms/annexure-goods/annexure-goods.component';
import {DetailedEstimatedCostComponent} from './detailed-estimated-cost/detailed-estimated-cost.component';
import {AmortizationScheduleComponent} from './amortization-schedule/amortization-schedule.component';
import {AnnexureWorksComponent} from './tab-forms/annexure-works/annexure-works.component';
import {LocationWiseCostBreakdownComponent} from './location-wise-cost-breakdown/location-wise-cost-breakdown.component';
import {ProjectManagementSetupComponent} from './project-management-setup/project-management-setup.component';
import {ProjectDetailsTabComponent} from './project-details/project-details-tab/project-details-tab.component';
import {ProjectDetailsBComponent} from './project-details/tab-forms/project-details-b/project-details-b.component';
import {FinancialAnalysisComponent} from './project-details/tab-forms/financial-analysis/financial-analysis.component';
import {SimilarProjectStudyComponent} from './project-details/tab-forms/similar-project-study/similar-project-study.component';
import {AnnexVViComponent} from './project-details/tab-forms/annex-v-vi/annex-v-vi.component';
import {EffectImpactComponent} from './project-details/tab-forms/effect-impact/effect-impact.component';
import {OtherDetailsComponent} from './project-details/tab-forms/other-details/other-details.component';
import {OthersImportantDetailsComponent} from './project-details/tab-forms/others-important-details/others-important-details.component';
import {AnnexureServicesComponent} from './tab-forms/annexure-services/annexure-services.component';
import {ProjectSummeryTabComponent} from './tpp-project-summery/project-summery-tab/project-summery-tab.component';
import {TppObjectivesAndCostComponent} from './tpp-project-summery/tab-forms/tpp-objectives-and-cost/tpp-objectives-and-cost.component';
import {TppComponentWiseCostComponent} from './tpp-project-summery/tab-forms/tpp-component-wise-cost/tpp-component-wise-cost.component';
import {TppYearCostSummeryComponent} from './tpp-project-summery/tab-forms/tpp-year-cost-summery/tpp-year-cost-summery.component';
import {TppLogFrameComponent} from './tpp-project-summery/tab-forms/tpp-log-frame/tpp-log-frame.component';
import {TppFinancingAndExpectationComponent} from './tpp-project-summery/tab-forms/tpp-financing-and-expectation/tpp-financing-and-expectation.component';
import {ProjectDetailsComponent} from './tpp-project-summery/project-details/project-details.component';
import {TppAnnexureThreeComponent} from './tpp-project-summery/tpp-annexure-three/tpp-annexure-three.component';
import {TppAnnexureTwoComponent} from './tpp-project-summery/tpp-annexure-two/tpp-annexure-two.component';
import {TppAnnexureFourComponent} from './tpp-project-summery/tpp-annexure-four/tpp-annexure-four.component';
import {TppAnnexureFiveComponent} from './tpp-project-summery/tpp-annexure-five/tpp-annexure-five.component';
import {TppAnnexureSixComponent} from './tpp-project-summery/tpp-annexure-six/tpp-annexure-six.component';
import {TppAnnexureSavenComponent} from './tpp-project-summery/tpp-annexure-seven/tpp-annexure-seven.component';
import {TppAnnexureEightfirstComponent} from './tpp-project-summery/tpp-annexure-eightfirst/tpp-annexure-eightfirst.component';
import {SharedModule} from '../../../../shared/shared.module';
import {TappAnnexureGoodsSecondComponent} from './tpp-project-summery/tapp-annexure-goods-second/tapp-annexure-goods-second.component';
import {DppTappListPageComponent} from './dpp-tapp-list-page/dpp-tapp-list-page.component';

import {DppDashboardComponent} from './dashboard/dpp-dashboard/dpp-dashboard.component';
import {RevenueComponentBetaComponent} from './annual-phasing-cost/tab-forms/revenue-component-beta/revenue-component-beta.component';
import {TappAnnualPhasingTabTitleComponent} from './tpp-project-summery/tapp-annexure-one/add-tapp-annexure-one-tab/tapp-annual-phasing-tab-title.component';
import {TappCapitalComponentComponent} from './tpp-project-summery/tapp-annexure-one/tab-forms/tapp-capital-component/tapp-capital-component.component';
import {TappPhysicalContingencyComponent} from './tpp-project-summery/tapp-annexure-one/tab-forms/tapp-physical-contingency/tapp-physical-contingency.component';
import {TappGrandTotalComponent} from './tpp-project-summery/tapp-annexure-one/tab-forms/tapp-grand-total/tapp-grand-total.component';
import {TappRevenueComponentBetaComponent} from './tpp-project-summery/tapp-annexure-one/tab-forms/tapp-revenue-component-beta/tapp-revenue-component-beta.component';
import {DppTappViewDashboardComponent} from './dashboard/dpp-tapp-view-dashboard/dpp-tapp-view-dashboard.component';
import {CreateNewDppComponent} from "./create-new-dpp/create-new-dpp.component";
import {PscWorkingPlanComponent} from "./psc-working-plan/psc-working-plan.component";
import {FinancialAnalysisCalModalComponent} from './project-details/tab-forms/financial-analysis-cal-modal/financial-analysis-cal-modal.component';
import {DppTappViewDashboardBetaComponent} from './dashboard/dpp-tapp-view-dashboard-beta/dpp-tapp-view-dashboard-beta.component';
import {EcnecMeetingComponent} from './ecnec-meeting/ecnec-meeting.component';
import {CreateDppTappGoComponent} from './dashboard/create-dpp-tapp-go/create-dpp-tapp-go.component';
import { DppMtbfComponent } from './dpp-mtbf/dpp-mtbf.component';
import { CompareReportComponent } from './dashboard/compare-report/compare-report.component';
import { AnnexureIAComponent } from './annexure-i-a/annexure-i-a.component';
import { MinistryAppraisalFormComponent } from './dashboard/dpp-dashboard/ministry-appraisal-form/ministry-appraisal-form.component';
import { DppTappPublicDashboardComponent } from './dashboard/dpp-tapp-public-dashboard/dpp-tapp-public-dashboard.component';
import { PublicWorkingPaperComponent } from './public-working-paper/public-working-paper.component';


@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [
        ListComponent,
        DppTappTabComponent,
        ObjectAndCostComponent,
        LocationsComponent,
        ComponentWiseCostComponent,
        LogFrameComponent,
        ProjectManagementComponent,
        RevenueComponentComponent,
        CapitalComponentComponent,
        PhysicalContingencyComponent,
        GrandTotalComponent,
        AnnualPhasingTabTitleComponent,
        YearWiseFinancialPlanComponent,
        YearWiseFinancialPlanBngComponent,
        DetailedEstimatedCostComponent,
        AnnexureGoodsComponent,
        AmortizationScheduleComponent,
        AnnexureWorksComponent,
        ProjectDetailsTabComponent,
        ProjectDetailsBComponent,
        FinancialAnalysisComponent,
        SimilarProjectStudyComponent,
        AnnexVViComponent,
        EffectImpactComponent,
        OtherDetailsComponent,
        OthersImportantDetailsComponent,
        AnnexureWorksComponent,
        LocationWiseCostBreakdownComponent,
        ProjectManagementSetupComponent,
        AnnexureServicesComponent,
        ProjectSummeryTabComponent,
        TppObjectivesAndCostComponent,
        TppComponentWiseCostComponent,
        TppYearCostSummeryComponent,
        TppLogFrameComponent,
        TppFinancingAndExpectationComponent,
        ProjectDetailsComponent,
        TppAnnexureThreeComponent,
        TppAnnexureTwoComponent,
        TppAnnexureFourComponent,
        TppAnnexureFiveComponent,
        TppAnnexureSixComponent,
        TppAnnexureSavenComponent,
        TppAnnexureEightfirstComponent,
        TappAnnexureGoodsSecondComponent,
        DppTappListPageComponent,
        DppDashboardComponent,
        RevenueComponentBetaComponent,
        TappAnnualPhasingTabTitleComponent,
        TappRevenueComponentBetaComponent,
        TappCapitalComponentComponent,
        TappPhysicalContingencyComponent,
        TappGrandTotalComponent,
        DppTappViewDashboardComponent,
        CreateNewDppComponent,
        PscWorkingPlanComponent,
        FinancialAnalysisCalModalComponent,
        PscWorkingPlanComponent,
        DppTappViewDashboardBetaComponent,
        EcnecMeetingComponent,
        CreateDppTappGoComponent,
        DppMtbfComponent,
        CompareReportComponent,
        AnnexureIAComponent,
        MinistryAppraisalFormComponent,
        DppTappPublicDashboardComponent,
        PublicWorkingPaperComponent
    ],
    imports: [
        SharedModule,
        DppTappListRouting,
    ],
    providers: [
        DatePipe
    ]
})
export class DppTappListModule {
}
