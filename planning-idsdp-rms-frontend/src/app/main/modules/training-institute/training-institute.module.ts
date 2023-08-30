import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingInstituteRoutingModule } from './training-institute-routing.module';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatNativeDateModule, NativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { CKEditorModule } from "ng2-ckeditor";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { FuseCardModule } from "../../../../@fuse/components/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { SharedModule } from "../../shared/shared.module";
import { RpmRoutingModule } from "../rpm/rpm-routing.module";
import { ToastrModule } from "ngx-toastr";
import { TrainersListComponent } from './features/proposal-setup/trainers/trainers-list/trainers-list.component';
import { CourseScheduleListComponent } from './features/proposal-setup/course-schedule/course-schedule-list/course-schedule-list.component';
import { CourseTitleComponent } from './features/proposal-setup/proposals/proposal-tab/tabs/add-new-course/tabs/course-title/course-title.component';
import { AddCourseScheduleComponent } from './features/proposal-setup/proposals/proposal-tab/tabs/add-new-course/tabs/add-course-schedule/add-course-schedule.component';
import { ProposalListComponent } from './features/proposal-setup/proposals/proposal-list/proposal-list.component';
import { GuarantorListComponent } from './features/agreement-process/guarantors-info/guarantor-list/guarantor-list.component';
import { AddNewGuarantorComponent } from './features/agreement-process/guarantors-info/add-new-guarantor/add-new-guarantor.component';
import { SpeakerEvaluationComponent } from './features/classroom/speaker-evaluation/speaker-evaluation.component';
import { AddNewAgreementComponent } from './features/agreement-process/agreement-letter/add-new-agreement/add-new-agreement.component';
import { AgreementListComponent } from './features/agreement-process/agreement-letter/agreement-list/agreement-list.component';
import { AddParticipantComponent } from './features/agreement-process/participant/add-participant/add-participant.component';
import { ParticipantListComponent } from './features/agreement-process/participant/participant-list/participant-list.component';
import { AcademicInfoComponent } from './features/agreement-process/participant/add-participant/tabs/academic-info/academic-info.component';
import { PersonalInfoComponent } from './features/agreement-process/participant/add-participant/tabs/personal-info/personal-info.component';
import { PhotographComponent } from './features/agreement-process/participant/add-participant/tabs/photograph/photograph.component';
import { AttendanceListComponent } from './features/classroom/participant-attendance/attendance-list/attendance-list.component';
import { AttendanceFormComponent } from './features/classroom/participant-attendance/attendance-form/attendance-form.component';
import { EmptyFieldValidatorPipe } from "../rpm/pipes/Validations/EmptyFieldValidatorPipe";
import { RpmModule } from "../rpm/rpm.module";
import { ParticipentViewComponent } from './features/agreement-process/participant/participent-view/participent-view.component';
import { ProposalViewComponent } from './features/proposal-setup/proposals/proposal-list/proposal-view/proposal-view.component';
import { TrainersProfileComponent } from './features/proposal-setup/trainers/trainers-list/trainers-profile/trainers-profile.component';
import { CourseTimescheduleViewComponent } from './features/proposal-setup/course-schedule/course-timeschedule-view/course-timeschedule-view.component';
import { AgreementViewComponent } from './features/agreement-process/agreement-letter/agreement-view/agreement-view.component';
import { ParticipantAllViewComponent } from './features/agreement-process/participant/participant-all-view/participant-all-view.component';
import { ParticipantAllListComponent } from './features/agreement-process/participant/participant-all-list/participant-all-list.component';
import { TrainersSendMailModalComponent } from './features/proposal-setup/trainers/trainers-list/trainers-send-mail-modal/trainers-send-mail-modal.component';
import { TrainersListDownloadComponent } from './features/proposal-setup/trainers/trainers-list-download/trainers-list-download.component';
import { TrainingInsProfileComponent } from './features/profiles/training-ins-profile/training-ins-profile.component';
import { ProfileEditComponent } from './features/profile-tab/profile-edit/profile-edit.component';
import { NominateInstitutesListComponent } from './features/others/nominate-institutes/nominate-institutes-list/nominate-institutes-list.component';
import { EDocumentsViewComponent } from './features/others/nominate-institutes/e-documents-view/e-documents-view.component';
import { ChequeCollectionListComponent } from './features/others/cheque-collections/cheque-collection-list/cheque-collection-list.component';
import { AddNewChequeCollectionComponent } from './features/others/cheque-collections/add-new-cheque-collection/add-new-cheque-collection.component';
import { AddProgressVerificationComponent } from './features/others/progress-verification/add-progress-verification/add-progress-verification.component';
import { ProgressVerificationListComponent } from './features/others/progress-verification/progress-verification-list/progress-verification-list.component';
import { PartialAndFinalPaymentListComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-list/partial-and-final-payment-list.component';
import { AddPartialAndFinalPaymentComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/add-partial-and-final-payment.component';
import { CreateLetterComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/tabs/create-letter/create-letter.component';
import { SubmitBillVoucherComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/tabs/submit-bill-voucher/submit-bill-voucher.component';
import { FileUploadComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/tabs/file-upload/file-upload.component';
import { ChequeCollectionViewComponent } from './features/others/cheque-collections/cheque-collection-view/cheque-collection-view.component';
import { PartialAndFinalPaymentViewComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-view/partial-and-final-payment-view.component';
import { ProgressVerificationViewComponent } from './features/others/progress-verification/progress-verification-view/progress-verification-view.component';
import { NomitateIntituteViewComponent } from './features/others/nominate-institutes/nomitate-intitute-view/nomitate-intitute-view.component';
import { UploadSignatureModalComponent } from './features/others/cheque-collections/cheque-collection-list/upload-signature-modal/upload-signature-modal.component';
//import {AttendanceViewComponent} from './features/classroom/participant-attendance/attendance-view/attendance-view.component';
import { SpeakerEvaluationReportComponent } from './features/classroom/speaker-evaluation/speaker-evaluation-report/speaker-evaluation-report.component';
import { SpeakerEvaluationRoutingModule } from "./speaker-evaluation-routing.module";
import { CreateGoLetterComponent } from './features/others/partial-and-final-payment/create-go-letter/create-go-letter.component';
import { AwardLetterComponent } from './features/others/award-letter/award-letter.component';
import { AddNewAwardLetterComponent } from './features/others/award-letter/add-new-award-letter/add-new-award-letter.component';
import { EditPartialAndFinalPaymentComponent } from "./features/others/partial-and-final-payment/edit-partial-and-final-payment/edit-partial-and-final-payment.component";
import { EditLetterComponent } from "./features/others/partial-and-final-payment/edit-partial-and-final-payment/tabs/create-letter/edit-letter.component";
import { EditSubmitBillVoucherComponent } from "./features/others/partial-and-final-payment/edit-partial-and-final-payment/tabs/submit-bill-voucher/edit-submit-bill-voucher.component";
import { EditFileUploadComponent } from "./features/others/partial-and-final-payment/edit-partial-and-final-payment/tabs/file-upload/edit-file-upload.component";
import { ResearchProposalViewDetailsComponent } from "../rpm/features/research-proposal-view-details/research-proposal-view-details.component";
import { UploadENothiComponent } from './features/others/nominate-institutes/upload-e-nothi/upload-e-nothi.component';
import { ViewEFileComponent } from './features/others/nominate-institutes/view-e-file/view-e-file.component';
import { AttendanceViewComponent } from "./features/classroom/participant-attendance/attendance-view/attendance-view.component";
import { FuseAlertModule } from "../../../../@fuse/components/alert";
import { ProposalTabComponent } from './features/proposal-setup/proposals/proposal-tab/proposal-tab.component';
import { AddCompletionReportComponent } from './features/others/completion-report/add-completion-report/add-completion-report.component';
import { CompletionReportListComponent } from './features/others/completion-report/completion-report-list/completion-report-list.component';
import { CompletionReportViewComponent } from './features/others/completion-report/completion-report-view/completion-report-view.component';
import { UploadModalComponent } from './features/agreement-process/guarantors-info/upload-modal/upload-modal.component';
import {
    BudgetComponent
} from "./features/proposal-setup/proposals/proposal-tab/tabs/budget/budget.component";
import {
    AddNewCourseComponent
} from "./features/proposal-setup/proposals/proposal-tab/tabs/add-new-course/add-new-course.component";
import {
    AddNewTrainerComponent
} from "./features/proposal-setup/proposals/proposal-tab/tabs/add-new-trainer/add-new-trainer.component";
import {
    AddNewProposalComponent
} from "./features/proposal-setup/proposals/proposal-tab/tabs/add-new-proposal/add-new-proposal.component";
import { AddNewCourseScheduleComponent } from './features/proposal-setup/proposals/proposal-tab/tabs/add-new-course-schedule/add-new-course-schedule.component';
import { ProfileTabComponent } from './features/profile-tab/profile-tab.component';
import { TrainersComponent } from './features/profile-tab/trainers/trainers.component';
import {NgxPrintModule} from "ngx-print";
import { AwardLetterViewComponent } from './features/others/award-letter/award-letter-view/award-letter-view.component';
import { CreateLetterNewComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/tabs/create-letter-new/create-letter-new.component';
import { SubmitBillVoucherNewTwoComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/tabs/submit-bill-voucher-new-two/submit-bill-voucher-new-two.component';
import { PartialAndFinalPaymentListTwoComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-list-two/partial-and-final-payment-list-two.component';
import { CreateGoLetterModalComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-list-two/create-go-letter-modal/create-go-letter-modal.component';
import { ViewGoLetterModalComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-list-two/view-go-letter-modal/view-go-letter-modal.component';
import { UplodFileModalNewComponent } from './features/others/partial-and-final-payment/add-partial-and-final-payment/tabs/uplod-file-modal-new/uplod-file-modal-new.component';
import { PartialAndFinalPaymentViewTwoComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-view-two/partial-and-final-payment-view-two.component';
import { ProfileListComponent } from './features/profiles/profile-list/profile-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import {EnToBnPipe} from "./pipes/enToBnNumber/en-to-bn.pipe";
import { SpeakerEvaluationReportNewComponent } from './features/classroom/speaker-evaluation/speaker-evaluation-report-new/speaker-evaluation-report-new.component';
import { NgHtmlPipe } from './pipes/ng-html.pipe';

const AllMaterialModule = [
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
    CKEditorModule,
    MaterialFileInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatStepperModule,
    MatTableModule,
    MatDatepickerModule,
    MatTabsModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSortModule,
    MatTooltipModule,
    MatRadioModule

];

@NgModule({
    declarations: [
        TrainersListComponent,
        AddNewTrainerComponent,
        CourseScheduleListComponent,
        AddNewCourseComponent,
        CourseTitleComponent,
        AddCourseScheduleComponent,
        BudgetComponent,
        ProposalListComponent,
        AddNewProposalComponent,
        GuarantorListComponent,
        AddNewGuarantorComponent,
        SpeakerEvaluationComponent,
        AddNewAgreementComponent,
        AgreementListComponent,
        AddParticipantComponent,
        ParticipantListComponent,
        AcademicInfoComponent,
        PersonalInfoComponent,
        PhotographComponent,
        AttendanceListComponent,
        AttendanceFormComponent,
        ParticipentViewComponent,
        ProposalViewComponent,
        TrainersProfileComponent,
        CourseTimescheduleViewComponent,
        AgreementViewComponent,
        ParticipantAllViewComponent,
        ParticipantAllListComponent,
        TrainersSendMailModalComponent,
        TrainersListDownloadComponent,
        TrainingInsProfileComponent,
        ProfileEditComponent,
        NominateInstitutesListComponent,
        EDocumentsViewComponent,
        ChequeCollectionListComponent,
        AddNewChequeCollectionComponent,
        AddProgressVerificationComponent,
        ProgressVerificationListComponent,
        PartialAndFinalPaymentListComponent,
        AddPartialAndFinalPaymentComponent,
        CreateLetterComponent,
        SubmitBillVoucherComponent,
        FileUploadComponent,
        ChequeCollectionViewComponent,
        PartialAndFinalPaymentViewComponent,
        ProgressVerificationViewComponent,
        NomitateIntituteViewComponent,
        UploadSignatureModalComponent,
        AttendanceViewComponent,
        SpeakerEvaluationReportComponent,
        CreateGoLetterComponent,
        AwardLetterComponent,
        AddNewAwardLetterComponent,
        EditPartialAndFinalPaymentComponent,
        EditLetterComponent,
        EditSubmitBillVoucherComponent,
        EditFileUploadComponent,
        ResearchProposalViewDetailsComponent,
        UploadENothiComponent,
        ViewEFileComponent,
        ProposalTabComponent,
        AddCompletionReportComponent,
        CompletionReportListComponent,
        CompletionReportViewComponent,
        UploadModalComponent,
        AddNewCourseScheduleComponent,
        ProfileTabComponent,
        TrainersComponent,
        AwardLetterViewComponent,
        CreateLetterNewComponent,
        SubmitBillVoucherNewTwoComponent,
        PartialAndFinalPaymentListTwoComponent,
        CreateGoLetterModalComponent,
        ViewGoLetterModalComponent,
        UplodFileModalNewComponent,
        PartialAndFinalPaymentViewTwoComponent,
        ProfileListComponent,
        DashboardComponent,
        EnToBnPipe,
        SpeakerEvaluationReportNewComponent,
        NgHtmlPipe
    ],
    providers: [EmptyFieldValidatorPipe],
    imports: [
        HttpClientModule,
        TranslateModule,
        TranslateModule.forRoot(),
        FuseCardModule,
        FlexLayoutModule,
        AllMaterialModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule,
        SharedModule,
        RpmRoutingModule,
        ToastrModule.forRoot(),
        CommonModule,
        TrainingInstituteRoutingModule,
        SpeakerEvaluationRoutingModule,
        RpmModule,
        FuseAlertModule,
        NgxPrintModule
    ]
})
export class TrainingInstituteModule {

}
