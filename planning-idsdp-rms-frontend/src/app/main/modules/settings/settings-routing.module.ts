import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../../layout/layout.component';
import { InitialDataResolver } from '../../../app.resolvers';
import { TestComponentComponent } from './features/test-component/test-component.component';
import { ResearchCategoryTypeComponent } from './features/research-category-type/research-category-type.component';
import { FiscalYearComponent } from './features/fiscal-year/fiscal-year.component';
import { CategoryWiseDeskOfficerComponent } from './features/category-wise-desk-officer/category-wise-desk-officer.component';
import { ProfileMarksSetupComponent } from "./features/profile-marks-setup/profile-marks-setup.component";
import { SectorTypeComponent } from './features/sector-type/sector-type.component';
import { SubSectorComponent } from './features/sub-sector/sub-sector.component';
import { CommitteeTypeComponent } from './features/committee-type/committee-type.component';
import { CommitteeSetupComponent } from './features/committee-setup/committee-setup.component';
import { TemplateTypeComponent } from './features/template-type/template-type.component';
import { PredefinedTemplateComponent } from './features/predefined-template/predefined-template.component';
import { InstallmentTypeComponent } from './features/installment-type/installment-type.component';
import { InstallmentPayRulesComponent } from './features/installment-pay-rules/installment-pay-rules.component';
import { ExpenditureItemComponent } from './features/expenditure-item/expenditure-item.component';
import { ExpertEvaluatorComponent } from './features/expert-evaluator/expert-evaluator.component';
import { ProfessionsComponent } from './features/common_types/professions/professions.component';
import { DocumentTypeComponent } from './features/common_types/document-type/document-type.component';
import { FiscalYearWiseBudgetComponent } from './features/fiscal-year-wise-budget/fiscal-year-wise-budget.component';
import { UserSerializationComponent } from './features/user-serialization/user-serialization.component';
import { CategoryWiseGrantAmountComponent } from './features/category-wise-grant-amount/category-wise-grant-amount.component';
import { AddMemberInCommitteeComponent } from './features/add-member-in-committee/add-member-in-committee.component';
import { ResearchGuideLineComponent } from './features/research-guide-line/research-guide-line.component';
import {
    ViewExpertEvulatorComponent
} from "./features/expert-evaluator/view-expert-evulator/view-expert-evulator.component";
import {ExpertEvaluator} from "./models/expert-evaluator.model";
import {
    ExpertEvaluatorListComponent
} from "./features/expert-evaluator/expert-evaluator-list/expert-evaluator-list.component";
import { CatWiseActionPlanComponent } from './features/cat-wise-action-plan/cat-wise-action-plan.component';


const routes: Routes = [
    {
        path: '',

        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },

        children: [
            { path: 'test', component: TestComponentComponent },
            //  bulbul
            { path: 'common-type', component: ProfessionsComponent },
            { path: 'doc-type', component: DocumentTypeComponent },
            { path: 'fiscal-year-budget', component: FiscalYearWiseBudgetComponent },
            { path: 'cat-wise-action-plan', component: CatWiseActionPlanComponent },

            { path: 'fiscal-year', component: FiscalYearComponent },
            { path: 'research-category-type', component: ResearchCategoryTypeComponent },
            { path: 'category-wise-desk-officer', component: CategoryWiseDeskOfficerComponent },
            { path: 'profile-marks-setup', component: ProfileMarksSetupComponent },
            { path: 'sector-type', component: SectorTypeComponent },
            { path: 'sub-sector', component: SubSectorComponent },
            { path: 'committee-type', component: CommitteeTypeComponent },
            { path: 'committee-setup', component: CommitteeSetupComponent },
            { path: 'template-type', component: TemplateTypeComponent },
            { path: 'predefined-template', component: PredefinedTemplateComponent },
            { path: 'installment-type', component: InstallmentTypeComponent },
            { path: 'installment-pay-rules', component: InstallmentPayRulesComponent },
            { path: 'expenditure-item', component: ExpenditureItemComponent },
            { path: 'expert-evaluator/add', component: ExpertEvaluatorComponent },
            { path: 'expert-evaluator', component: ExpertEvaluatorListComponent },
            { path: 'user-serialization', component: UserSerializationComponent },
            { path: 'category-grant-amout', component: CategoryWiseGrantAmountComponent },
            { path: 'add-member-in-committee', component: AddMemberInCommitteeComponent },
            { path: 'research-guide-line', component: ResearchGuideLineComponent },
            { path: 'view-expert-evulator/:id', component: ViewExpertEvulatorComponent }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
