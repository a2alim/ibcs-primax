import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { AuthGuard } from '../../core/auth/guards/auth.guard';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FuseCardModule } from '../../../../@fuse/components/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatSortModule } from '@angular/material/sort';

import { MatTooltipModule } from '@angular/material/tooltip';

import { MatRadioModule } from '@angular/material/radio';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SharedModule } from '../../shared/shared.module';
import { TestComponentComponent } from './features/test-component/test-component.component';
import { SettingsRoutingModule } from "./settings-routing.module";
import { ToastrModule } from 'ngx-toastr';
import { FiscalYearWiseBudgetComponent } from './features/fiscal-year-wise-budget/fiscal-year-wise-budget.component';
import { SpecialityTypeComponent } from './features/common_types/speciality-type/speciality-type.component';
import { DocumentTypeComponent } from './features/common_types/document-type/document-type.component';
import { ProfessionsComponent } from './features/common_types/professions/professions.component';

import { ResearchCategoryTypeComponent } from './features/research-category-type/research-category-type.component';
import { FiscalYearComponent } from './features/fiscal-year/fiscal-year.component';
import { CategoryWiseDeskOfficerComponent } from './features/category-wise-desk-officer/category-wise-desk-officer.component';
import { ProfileMarksSetupComponent } from './features/profile-marks-setup/profile-marks-setup.component';
import { SectorTypeComponent } from './features/sector-type/sector-type.component';
import { SubSectorComponent } from './features/sub-sector/sub-sector.component';
import { CommitteeTypeComponent } from './features/committee-type/committee-type.component';
import { CommitteeSetupComponent } from './features/committee-setup/committee-setup.component';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { TemplateTypeComponent } from './features/template-type/template-type.component';
import { PredefinedTemplateComponent } from './features/predefined-template/predefined-template.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { InstallmentTypeComponent } from './features/installment-type/installment-type.component';
import { InstallmentPayRulesComponent } from './features/installment-pay-rules/installment-pay-rules.component';
import { ExpenditureItemComponent } from './features/expenditure-item/expenditure-item.component';
import { ExpertEvaluatorComponent } from './features/expert-evaluator/expert-evaluator.component';
import {CKEditorModule} from 'ng2-ckeditor';
import { UserSerializationComponent } from './features/user-serialization/user-serialization.component';
import { CategoryWiseGrantAmountComponent } from './features/category-wise-grant-amount/category-wise-grant-amount.component';
import { AddMemberInCommitteeComponent } from './features/add-member-in-committee/add-member-in-committee.component';
import { ResearchGuideLineComponent } from './features/research-guide-line/research-guide-line.component';
import { AddEvaluatorModalComponent } from './features/expert-evaluator/add-evaluator-modal/add-evaluator-modal.component';
import {FuseAlertModule} from "../../../../@fuse/components/alert";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ViewExpertEvulatorComponent } from './features/expert-evaluator/view-expert-evulator/view-expert-evulator.component';
import {NgxPrintModule} from "ngx-print";
import { ExpertEvaluatorListComponent } from './features/expert-evaluator/expert-evaluator-list/expert-evaluator-list.component';
import { CatWiseActionPlanComponent } from './features/cat-wise-action-plan/cat-wise-action-plan.component';

const _materialModule = [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    NativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    CKEditorModule

];

@NgModule({
    declarations: [
        TestComponentComponent,
        ProfessionsComponent,
        ResearchCategoryTypeComponent,
        CategoryWiseDeskOfficerComponent,
        ProfileMarksSetupComponent,
        SectorTypeComponent,
        SubSectorComponent,
        CommitteeTypeComponent,
        CommitteeSetupComponent,

       ProfessionsComponent,
       FiscalYearWiseBudgetComponent,
       SpecialityTypeComponent,
       DocumentTypeComponent,

       ResearchCategoryTypeComponent,
       FiscalYearComponent,
       CategoryWiseDeskOfficerComponent,
       ProfileMarksSetupComponent,
       TemplateTypeComponent,
       PredefinedTemplateComponent,
       InstallmentTypeComponent,
       InstallmentPayRulesComponent,
       ExpenditureItemComponent,
       ExpertEvaluatorComponent,
       UserSerializationComponent,
       CategoryWiseGrantAmountComponent,
       AddMemberInCommitteeComponent,
       ResearchGuideLineComponent,
       AddEvaluatorModalComponent,
       ViewExpertEvulatorComponent,
       ExpertEvaluatorListComponent,
       CatWiseActionPlanComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
        TranslateModule.forRoot(),
        FuseCardModule,
        FlexLayoutModule,
        MatDatepickerModule,
        _materialModule,
        RouterModule,
        MatTabsModule,
        MatChipsModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        MaterialFileInputModule,
        MatSortModule,
        MatTooltipModule,
        MatRadioModule,
        DragDropModule,
        SharedModule,
        SettingsRoutingModule,

        ToastrModule.forRoot(),
        FuseAlertModule,
        MatProgressSpinnerModule,
        NgxPrintModule,
    ], providers: [AuthGuard]
})
export class SettingsModule { }
