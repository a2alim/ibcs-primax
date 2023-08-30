import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FeasibilityStudyListComponent} from './feasibility-study-list/feasibility-study-list.component';
import {ExpenditureCostComponent} from './feasibility-study-proposal-setup/components-tabs/expenditure-cost/expenditure-cost.component';
import {CommitteeManagementComponent} from './feasibility-study-proposal-setup/components-tabs/committee-management/committee-management.component';
import {WorkPlanComponent} from './feasibility-study-proposal-setup/components-tabs/work-plan/work-plan.component';
import {VisitPlanComponent} from './feasibility-study-proposal-setup/components-tabs/visit-plan/visit-plan.component';
import {SharedModule} from '../../../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {CKEditorModule} from 'ng2-ckeditor';
import {FeasibilityStudyRouting} from './feasibility-study.routing';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {FsSummaryComponent} from './feasibility-study-proposal-setup/components-tabs/fs-summary/fs-summary.component';
import {AddFeasibilityStudyProposalComponent} from './feasibility-study-proposal-setup/add-feasibility-study-proposal/add-feasibility-study-proposal.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AddFeasibilityStudyReportComponent} from './feasibility-study-report/add-feasibility-study-report/add-feasibility-study-report.component';
import {IntroductionComponent} from './feasibility-study-report/component-tabs/introduction/introduction.component';
import {MarketDemandAnalysisComponent} from './feasibility-study-report/component-tabs/market-demand-analysis/market-demand-analysis.component';
import {TechnicalTechnologicalAnalysisComponent} from './feasibility-study-report/component-tabs/technical-technological-analysis/technical-technological-analysis.component';
import {RiskAnalysisComponent} from './feasibility-study-report/component-tabs/risk-analysis/risk-analysis.component';
import {CostBenefitAnalysisComponent} from './feasibility-study-report/component-tabs/cost-benefit-analysis/cost-benefit-analysis.component';
import {OtherAnalysisComponent} from './feasibility-study-report/component-tabs/other-analysis/other-analysis.component';
import {FeasibilityStudySummaryComponent} from './feasibility-study-report/component-tabs/feasibility-study-summary/feasibility-study-summary.component';
import {VendorComponent} from './feasibility-study-proposal-setup/components-tabs/vendor/vendor.component';
import { ProjectGeographicLocationComponent } from './feasibility-study-report/component-tabs/project-geographic-location/project-geographic-location.component';
import { ModeOfFinanceComponent } from './feasibility-study-proposal-setup/components-tabs/mode-of-finance/mode-of-finance.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MovementNewsComponent } from './movement-news/movement-news.component';
import { FeasibilityStudyProposalViewDashboardComponent } from './feasibility-study-proposal-view-dashboard/feasibility-study-proposal-view-dashboard.component';
import {MatDialogModule} from '@angular/material/dialog';
import {NgApexchartsModule} from 'ng-apexcharts';
import { CommentObservationComponent } from './comment-observation/comment-observation.component';
import { FeasibilityStudyProposalEditDashboardComponent } from './feasibility-study-proposal-edit-dashboard/feasibility-study-proposal-edit-dashboard.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { FeasibilityStudyProposalReportComponent } from './feasibility-study-proposal-report/feasibility-study-proposal-report.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { CreateNewFeasibilityStudyComponent } from './feasibility-study-proposal-setup/create-new-feasibility-study/create-new-feasibility-study.component';
import {MatRadioModule} from "@angular/material/radio";
import { FeasibilityStudyProposalViewDashboardBetaComponent } from './feasibility-study-proposal-view-dashboard-beta/feasibility-study-proposal-view-dashboard-beta.component';
import { FeasibilityStudyProposalEditDashboardBetaComponent } from './feasibility-study-proposal-edit-dashboard-beta/feasibility-study-proposal-edit-dashboard-beta.component';

@NgModule({
    declarations: [
        FeasibilityStudyListComponent,
        AddFeasibilityStudyProposalComponent,
        ExpenditureCostComponent,
        CommitteeManagementComponent,
        WorkPlanComponent,
        VisitPlanComponent,
        FsSummaryComponent,
        AddFeasibilityStudyReportComponent,
        IntroductionComponent,
        MarketDemandAnalysisComponent,
        TechnicalTechnologicalAnalysisComponent,
        RiskAnalysisComponent,
        CostBenefitAnalysisComponent,
        OtherAnalysisComponent,
        FeasibilityStudySummaryComponent,
        VendorComponent,
        ProjectGeographicLocationComponent,
        ModeOfFinanceComponent,
        MovementNewsComponent,
        FeasibilityStudyProposalViewDashboardComponent,
        CommentObservationComponent,
        FeasibilityStudyProposalEditDashboardComponent,
        FeasibilityStudyProposalReportComponent,
        CreateNewFeasibilityStudyComponent,
        FeasibilityStudyProposalViewDashboardBetaComponent,
        FeasibilityStudyProposalEditDashboardBetaComponent,
    ],
    imports: [
        SharedModule,
        FeasibilityStudyRouting,

    ]
})
export class FeasibilityStudyModule {
}
