import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {RpmRoutingModule} from './rpm-routing.module';
import {TestComponentComponent} from './features/test-component/test-component.component';
import {ResearcherProfileInformationComponent} from './features/researcher-profile-information/researcher-profile-information.component';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatStepperModule} from "@angular/material/stepper";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../shared/shared.module";
import {PersonalInfoComponent} from './features/researcher-profile-information/tabs/personal-info/personal-info.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {EducationInfoComponent} from './features/researcher-profile-information/tabs/education-info/education-info.component';
import {RelativeInfoComponent} from './features/researcher-profile-information/tabs/relative-info/relative-info.component';
import {PublicationInfoComponent} from './features/researcher-profile-information/tabs/publication-info/publication-info.component';
import {ProfessionalExprianceComponent} from './features/researcher-profile-information/tabs/professional-expriance/professional-expriance.component';
import {ResearchExprianceComponent} from './features/researcher-profile-information/tabs/research-expriance/research-expriance.component';
import {ProfileTrainingInfoComponent} from './features/researcher-profile-information/tabs/profile-training-info/profile-training-info.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {AddFormComponent} from './features/fiscalYear-wise-sector-sub-sector/add-form/add-form.component';
import {ListTableComponent} from './features/fiscalYear-wise-sector-sub-sector/list-table/list-table.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatNativeDateModule, NativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {CKEditorModule} from 'ng2-ckeditor';
import {DetailsComponent} from './features/fiscalYear-wise-sector-sub-sector/details/details.component';
import {CreateAddComponent} from './features/fiscalYear-wise-sector-sub-sector/forAdvertising/create-add/create-add.component';
import {AdDetailsComponent} from './features/fiscalYear-wise-sector-sub-sector/forAdvertising/ad-details/ad-details.component';
import {ProfileViewComponent} from './features/researcher-profile-information/profile-view/profile-view.component';
import {ResearcherProfileListComponent} from './features/researcher-profile-information/researcher-profile-list/researcher-profile-list.component';
import {TotalMarksOfResearcherComponent} from './features/researcher-proposal/total-marks-of-researcher/total-marks-of-researcher.component';
import {ResearcherProposalInformationnComponent} from './features/researcher-proposal/researcher-proposal-informationn/researcher-proposal-informationn.component';
import {ResearcherProposalComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal/researcher-proposal.component';
import {ResearcherProposalInfoComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal-info/researcher-proposal-info.component';
import {ResearcherProposalInstituteInfoComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal-institute-info/researcher-proposal-institute-info.component';
import {ResearcherProposalRscWorkingInOrgComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal-rsc-working-in-org/researcher-proposal-rsc-working-in-org.component';
import {ResearcherProposalUploadDocComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal-upload-doc/researcher-proposal-upload-doc.component';
import {ResearcherSupervisorInfoComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-supervisor-info/researcher-supervisor-info.component';
import {ResearcherProposalActionPlanComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal-action-plan/researcher-proposal-action-plan.component';
import {ResearcherProposalBudgetDetailsComponent} from './features/researcher-proposal/researcher-proposal-informationn/tabs/researcher-proposal-budget-details/researcher-proposal-budget-details.component';
import {ResearchProposalViewDetailsComponent} from './features/researcher-proposal/research-proposal-view-details/research-proposal-view-details.component';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FuseCardModule} from '@fuse/components/card';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ToastrModule} from 'ngx-toastr';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import {ResearcherProposalListModalComponent} from './features/researcher-profile-information/researcher-profile-list/researcher-proposal-list-modal/researcher-proposal-list-modal.component';
import {ListTableComponentsComponent} from './features/Ged-Feedback/list-table-components/list-table-components.component';
import {CreateLetterGedComponent} from './features/Ged-Feedback/create-letter-ged/create-letter-ged.component';
import {ViewLetterGedComponent} from './features/Ged-Feedback/view-letter-ged/view-letter-ged.component';
import {LatterListComponent} from './features/latter/latter-list/latter-list.component';
import {LatterViewComponent} from './features/latter/latter-view/latter-view.component';
import {NewLatterAddComponent} from './features/latter/new-latter-add/new-latter-add.component';
import {LinkupProposalWithEvaluatorsComponent} from './features/researcher-proposal/linkup-proposal-with-evaluators/linkup-proposal-with-evaluators.component';
import {ResearchProposalSubmissionLetterComponent} from './features/research-proposal-submission-letter/research-proposal-submission-letter.component';
import {SendEmailModalComponent} from './features/researcher-proposal/linkup-proposal-with-evaluators/send-email-modal/send-email-modal.component';
import {SavedGedFeedbackAnsListComponent} from './features/Ged-Feedback/saved-ged-feedback-ans-list/saved-ged-feedback-ans-list.component';
import {CreateGedFeedbakAnswerComponent} from './features/Ged-Feedback/create-ged-feedbak-answer/create-ged-feedbak-answer.component';
import {FeedbackAnswerComponent} from './features/Ged-Feedback/feedback-answer/feedback-answer.component';
import {ResearcherListComponent} from './features/researcher-list/researcher-list.component';
import {AgreementProcessComponent} from './features/agreement-process/agreement-process.component';
import {AgreementProcessListComponent} from './features/agreement-process/agreement-process-list/agreement-process-list.component';
import {AgreementWithResearcherTabComponent} from './features/agreement-process/tabs/agreement-with-researcher-tab/agreement-with-researcher-tab.component';
import {AgreementInstallmentTabComponent} from './features/agreement-process/tabs/agreement-installment-tab/agreement-installment-tab.component';
import {EvaluatorsGrantAmountInformationComponent} from './features/evaluators-grant-amount/evaluators-grant-amount-information/evaluators-grant-amount-information.component';
import {EvaluatorsGrantAmountListComponent} from './features/evaluators-grant-amount/evaluators-grant-amount-list/evaluators-grant-amount-list.component';
import {EvaluatorsGrantAmountLetterComponent} from './features/evaluators-grant-amount/evaluators-grant-amount-information/tabs/evaluators-grant-amount-letter/evaluators-grant-amount-letter.component';
import {EvaluatorsGrantAmountComponent} from './features/evaluators-grant-amount/evaluators-grant-amount-information/tabs/evaluators-grant-amount/evaluators-grant-amount.component';
import {AgreementJamanatnamaComponent} from './features/agreement-process/tabs/agreement-jamanatnama/agreement-jamanatnama.component';
import {AgreementPartyComponent} from './features/agreement-process/tabs/agreement-party/agreement-party.component';
import {AgreementUploadSignatureFilesComponent} from './features/agreement-process/tabs/agreement-upload-signature-files/agreement-upload-signature-files.component';
import {AgreementViewPageComponent} from './features/agreement-process/agreement-view-page/agreement-view-page.component';
import {ResearcherProfileComponent} from './features/researcher-list/researcher-profile/researcher-profile.component';
import {ResearcherProposalMarksComponent} from './features/researcher-proposal/researcher-proposal-marks/researcher-proposal-marks.component';
import {InforOfResearchComponent} from './features/researcher-list/infor-of-research/infor-of-research.component';
import {EvaluatorsGrantAmountLetterDetailsComponent} from './features/evaluators-grant-amount/evaluators-grant-amount-letter-details/evaluators-grant-amount-letter-details.component';
import {ResearcherProfileMarksPromotionalComponent} from './features/researcher-profile-marks/researcher-profile-marks-promotional/researcher-profile-marks-promotional.component';
import {ResearcherProfileMarksFellowshipComponent} from "./features/researcher-profile-marks/researcher-profile-marks-fellowship/researcher-profile-marks-fellowship.component";
import {ResearcherProfileMarksMPhillPhdComponent} from "./features/researcher-profile-marks/researcher-profile-marks-mPhill-phd/researcher-profile-marks-mPhill-phd.component";
import {ResearcherProfileMarksInstitutionResearchComponent} from "./features/researcher-profile-marks/researcher-profile-marks-institution-research/researcher-profile-marks-institution-research.component";
import {EmptyFieldValidatorPipe} from "./pipes/Validations/EmptyFieldValidatorPipe";
import {CreateNotificationComponent} from './features/notification/create-notification/create-notification.component';
import {NotificationListComponent} from './features/notification/notification-list/notification-list.component';
import {ViewNotificationComponent} from './features/notification/view-notification/view-notification.component';
import {NotificationNoteComponent} from './features/notification/notification-note/notification-note.component';
import {CreateSeminarComponent} from './features/seminar/create-seminar/create-seminar.component';
import {SeminarTabComponent} from './features/seminar/create-seminar/tabs/seminar-tab/seminar-tab.component';
import {SeminarTimeScheduleTabComponent} from './features/seminar/create-seminar/tabs/seminar-time-schedule-tab/seminar-time-schedule-tab.component';
import {SeminarParticipantTabComponent} from './features/seminar/create-seminar/tabs/seminar-participant-tab/seminar-participant-tab.component';

import {ResearchProgressReportComponent} from './features/m2/research-progress-report/research-progress-report.component';
import {ProgressReportListPageComponent} from './features/m2/research-progress-report/progress-report-list-page/progress-report-list-page.component';
import {AddResearchInfoComponent} from './features/m2/research-progress-report/tab/add-research-info/add-research-info.component';
import {AddProgressTaskListComponent} from './features/m2/research-progress-report/tab/add-progress-task-list/add-progress-task-list.component';
import {EmailValidatorPipe} from "./pipes/Validations/EmailValidatorPipe";
import {NidValidatorPipe} from "./pipes/Validations/NidValidatorPipe";
import {PhoneNumberValidatorPipe} from "./pipes/Validations/PhoneNumberValidatorPipe";

import {StartPresentationComponent} from './features/m2/researcher-presentation/start-presentation/start-presentation.component';
import {FeedbackListPageComponent} from './features/m2/researcher-presentation/feedback-list-page/feedback-list-page.component';
import {InstallmentProcessComponent} from './features/installment-process/installment-process.component';
import {CreateLetterComponent} from './features/installment-process/tabs/create-letter/create-letter.component';
import {ExpenditureItemsComponent} from './features/installment-process/tabs/expenditure-items/expenditure-items.component';
import {UploadBillVoucherComponent} from './features/installment-process/tabs/upload-bill-voucher/upload-bill-voucher.component';
import {SendFeedBackModalComponent} from './features/m2/researcher-presentation/feedback-list-page/send-feed-back-modal/send-feed-back-modal.component';
import {SeminarsListComponent} from './features/seminar/seminars-list/seminars-list.component';
import {EvaluatorFeedbackComponent} from './features/m2/researcher-presentation/evaluator-feedback/evaluator-feedback.component';
import {FeedbackListComponent} from './features/m2/researcher-presentation/feedback-list-page/feedback-list/feedback-list.component';
import {ResearcherFeedbackComponent} from './features/m2/researcher-presentation/researcher-feedback/researcher-feedback.component';
import {SeminarEmailComponent} from './features/seminar/seminar-email/seminar-email.component';
import {FeedbackEditModalComponent} from './features/m2/researcher-presentation/feedback-list-page/feedback-edit-modal/feedback-edit-modal.component';
import {NewMemberAddModalComponent} from './features/m2/researcher-presentation/new-member-add-modal/new-member-add-modal.component';
import {PredefinedTemplateForPresentationComponent} from './features/seminar/predefined-template-for-presentation/predefined-template-for-presentation.component';
import {SendFeedBackListPageComponent} from './features/m2/researcher-presentation/feedback-list-page/send-feed-back-list-page/send-feed-back-list-page.component';
import {MatDialogModule} from "@angular/material/dialog";
import {CreateGoLetterComponent} from './features/create-go-letter/create-go-letter.component';
import {UploadFileModalComponent} from './features/create-go-letter/upload-file-modal/upload-file-modal.component';
import {ReceiveBankChequeComponent} from './features/receive-bank-cheque/receive-bank-cheque.component';
import {UploadBankChequeFileModalComponent} from './features/receive-bank-cheque/upload-bank-cheque-file-modal/upload-bank-cheque-file-modal.component';
import {AddResearcherPresentationComponent} from "./features/m2/researcher-presentation/add-researcher-presentation/add-researcher-presentation.component";
import {ResearcherPresentationReportComponent} from './features/m2/researcher-presentation/researcher-presentation-report/researcher-presentation-report.component';
import {EvaluatorFeedbackListComponent} from './features/m2/researcher-presentation/evaluator-feedback-list/evaluator-feedback-list.component';
import {InstallmentProcessListComponent} from "./features/installment-process/installment-process-list/installment-process-list.component";
import {InstallmentProcessViewComponent} from './features/installment-process/installment-process-view/installment-process-view.component';
import {ViewSeminarComponent} from './features/seminar/view-seminar/view-seminar.component';
import {SafeHtmlPipe} from "./pipes/SafeHtmlPipe";
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {FinalEvaluationReportListComponent} from './features/seminar/final-evaluation-report-list/final-evaluation-report-list.component';
import {FinalEvaluationReportFormComponent} from './features/seminar/final-evaluation-report-form/final-evaluation-report-form.component';
import {GeoLetterListComponent} from './features/create-go-letter/geo-letter-list/geo-letter-list.component';
import {DownloadGoLetterComponent} from './features/create-go-letter/download-go-letter/download-go-letter.component';
import {BankChequeListComponent} from './features/receive-bank-cheque/bank-cheque-list/bank-cheque-list.component';
import {DownloadBankChequeComponent} from './features/receive-bank-cheque/download-bank-cheque/download-bank-cheque.component';
import {ResearchProfileComponent} from "./features/research-profile/research-profile.component";
import {RmsDashboardComponent} from './features/rms-dashboard/rms-dashboard.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {InstitutionalPersonalInfoComponent} from './features/researcher-profile-information/tabs/institutional-personal-info/institutional-personal-info.component';
import {EvaluatorProfileComponent} from './features/evaluators/evaluator-profile/evaluator-profile.component';
import {ProposalEligibilityCheckModalComponent} from './features/researcher-proposal/proposal-eligibility-check-modal/proposal-eligibility-check-modal.component';
import {ResearchCancellationAddComponent} from './features/research-cancellation/research-cancellation-add/research-cancellation-add.component';
import {ResearchCancellationComponent} from "./features/research-cancellation/research-cancellation.component";
import {ResearchCancellationDetailsComponent} from "./features/research-cancellation/research-cancellation-details/research-cancellation-details.component";
import {UploadFileModalsComponent} from "./features/research-cancellation/upload-file-modal/upload-file-modals.component";
import {ProgressReportComponent} from './features/progress-report/progress-report.component';
import {ResearchInformationComponent} from './features/progress-report/tabs/research-information/research-information.component';
import {TaskListComponent} from './features/progress-report/tabs/task-list/task-list.component';
import {DownloadProgressReportComponent} from './features/progress-report/download-progress-report/download-progress-report.component';
import {ProgressReportListComponent} from './features/progress-report/progress-report-list/progress-report-list.component';

import {ResearchCancellationViewComponent} from './features/research-cancellation/research-cancellation-view/research-cancellation-view.component';
import {CreateAcknowledgmentLetterComponent} from './features/receive-bank-cheque/create-acknowledgment-letter/create-acknowledgment-letter.component';
import {LinkupProposalWithEvaluatorsViewDetailsComponent} from './features/researcher-proposal/linkup-proposal-with-evaluators/linkup-proposal-with-evaluators-view-details/linkup-proposal-with-evaluators-view-details.component';
import {ResearchFinalSubmissionComponent} from './features/m2/research-final-submission/research-final-submission.component';
import {ViewResearchFinalSubmissionComponent} from './features/m2/view-research-final-submission/view-research-final-submission.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {ResearcherInfoComponent} from './features/researcher-info/researcher-info.component';
import {InstitutionalWorkingOrganizationComponent} from './features/researcher-profile-information/tabs/institutional-working-organization/institutional-working-organization.component';
import {CustomCapitalizePipe} from './pipes/Validations/custom-capitalize.pipe';
import {NgxPrintModule} from 'ngx-print';
import { UplodFileModalComponent } from './features/installment-process/installment-process-list/uplod-file-modal/uplod-file-modal.component';
import { GoLetterComponent } from './features/installment-process/installment-process-list/go-letter/go-letter.component';
import { ViewGoLetterComponent } from './features/installment-process/installment-process-list/view-go-letter/view-go-letter.component';
import { NgHtmlPipe } from './pipes/ng-html.pipe';

import {ResultFinderPipe} from "./pipes/Validations/ResultFinderPipe";
import { SeminarViewDetailsComponent } from './features/seminar/seminar-view-details/seminar-view-details.component';
import { EnToBnPipe } from './pipes/enToBnNumber/en-to-bn.pipe';
import { ResearcherListPublicComponent } from './features/researcher-list-public/researcher-list-public.component';
import { FywApprovalListComponent } from './features/fiscalYear-wise-sector-sub-sector/approval-process/fyw-approval-list/fyw-approval-list.component';
import { FywSendToEnothiComponent } from './features/fiscalYear-wise-sector-sub-sector/approval-process/fyw-send-to-enothi/fyw-send-to-enothi.component';
import { FywApprovalDetailsComponent } from './features/fiscalYear-wise-sector-sub-sector/approval-process/fyw-approval-details/fyw-approval-details.component';
import { ProposalListComponent } from './features/e-Nothi-approval-process/research-proposals/proposal-list/proposal-list.component';
import { ProposalDetailsComponent } from './features/e-Nothi-approval-process/research-proposals/proposal-details/proposal-details.component';
import { ProposalFormComponent } from './features/e-Nothi-approval-process/research-proposals/proposal-form/proposal-form.component';
import { ResearcherAgreementListComponent } from './features/e-Nothi-approval-process/researcher-agreement/researcher-agreement-list/researcher-agreement-list.component';
import { ResearcherAgreementFormComponent } from './features/e-Nothi-approval-process/researcher-agreement/researcher-agreement-form/researcher-agreement-form.component';
import { ResearcherAgreementDetailsComponent } from './features/e-Nothi-approval-process/researcher-agreement/researcher-agreement-details/researcher-agreement-details.component';
import { ResearcherInstallmentGoListComponent } from './features/e-Nothi-approval-process/researcher-installment-go/researcher-installment-go-list/researcher-installment-go-list.component';
import { ResearcherInstallmentGoFormComponent } from './features/e-Nothi-approval-process/researcher-installment-go/researcher-installment-go-form/researcher-installment-go-form.component';
import { ResearcherInstallmentGoDetailsComponent } from './features/e-Nothi-approval-process/researcher-installment-go/researcher-installment-go-details/researcher-installment-go-details.component';
import { SendEmailModalNewComponent } from './features/researcher-proposal/linkup-proposal-with-evaluators/send-email-modal-new/send-email-modal-new.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropImageComponent } from './features/crop-image/crop-image.component';
import { AgreementActivityPlanComponent } from './features/agreement-process/tabs/agreement-activity-plan/agreement-activity-plan.component';

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
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule

];

@NgModule({
    declarations: [        
        TestComponentComponent,
        ResearcherProfileInformationComponent,
        PersonalInfoComponent,
        EducationInfoComponent,
        RelativeInfoComponent,
        PublicationInfoComponent,
        ProfessionalExprianceComponent,
        ResearchExprianceComponent,
        ProfileTrainingInfoComponent,
        TotalMarksOfResearcherComponent,
        ResearcherProposalInformationnComponent,
        ResearcherProposalComponent,
        ResearcherProposalInfoComponent,
        ResearcherProposalInstituteInfoComponent,
        ResearcherProposalRscWorkingInOrgComponent,
        ResearcherProposalUploadDocComponent,
        ResearcherSupervisorInfoComponent,
        ResearcherProposalActionPlanComponent,
        ResearcherProposalBudgetDetailsComponent,
        ResearchProposalViewDetailsComponent,
        TestComponentComponent,
        ResearcherProfileInformationComponent,
        PersonalInfoComponent,
        EducationInfoComponent,
        RelativeInfoComponent,
        PublicationInfoComponent,
        ProfessionalExprianceComponent,
        ResearchExprianceComponent,
        ProfileTrainingInfoComponent,
        AddFormComponent,
        ListTableComponent,
        DetailsComponent,
        CreateAddComponent,
        AdDetailsComponent,
        ProfileViewComponent,
        ResearcherProfileListComponent,
        ResearcherProposalListModalComponent,
        ListTableComponentsComponent,
        CreateLetterGedComponent,
        ViewLetterGedComponent,
        LatterListComponent,
        LatterViewComponent,
        NewLatterAddComponent,
        LinkupProposalWithEvaluatorsComponent,
        ResearchProposalSubmissionLetterComponent,
        SendEmailModalComponent,
        SavedGedFeedbackAnsListComponent,
        CreateGedFeedbakAnswerComponent,
        FeedbackAnswerComponent,
        ResearcherListComponent,
        AgreementProcessComponent,
        AgreementProcessListComponent,
        CreateAcknowledgmentLetterComponent,
        AgreementWithResearcherTabComponent,
        AgreementInstallmentTabComponent,
        EvaluatorsGrantAmountInformationComponent,
        EvaluatorsGrantAmountListComponent,
        EvaluatorsGrantAmountLetterComponent,
        EvaluatorsGrantAmountComponent,
        EvaluatorsGrantAmountLetterDetailsComponent,
        AgreementJamanatnamaComponent,
        AgreementPartyComponent,
        AgreementUploadSignatureFilesComponent,
        AgreementViewPageComponent,
        EvaluatorsGrantAmountComponent,
        ResearcherProfileComponent,
        ResearcherProposalMarksComponent,
        InforOfResearchComponent,
        ResearcherProfileMarksPromotionalComponent,
        ResearcherProfileMarksFellowshipComponent,
        ResearcherProfileMarksMPhillPhdComponent,
        ResearcherProfileMarksInstitutionResearchComponent,
        InforOfResearchComponent,
        EmailValidatorPipe,
        SafeHtmlPipe,
        NidValidatorPipe,
        PhoneNumberValidatorPipe,
        ResultFinderPipe,
        EmptyFieldValidatorPipe,
        CreateNotificationComponent,
        NotificationListComponent,
        ViewNotificationComponent,
        NotificationNoteComponent,
        CreateSeminarComponent,
        SeminarTabComponent,
        SeminarTimeScheduleTabComponent,
        SeminarParticipantTabComponent,
        ResearchProgressReportComponent,
        ProgressReportListPageComponent,
        AddResearchInfoComponent,
        AddProgressTaskListComponent,
        AddResearcherPresentationComponent,
        StartPresentationComponent,
        FeedbackListPageComponent,
        InstallmentProcessComponent,
        CreateLetterComponent,
        ExpenditureItemsComponent,
        UploadBillVoucherComponent,
        SendFeedBackModalComponent,
        SeminarsListComponent,
        EvaluatorFeedbackComponent,
        ResearcherFeedbackComponent,
        SeminarEmailComponent,
        FeedbackListComponent,
        FeedbackEditModalComponent,
        NewMemberAddModalComponent,
        PredefinedTemplateForPresentationComponent,
        CreateGoLetterComponent,
        ReceiveBankChequeComponent,
        UploadFileModalComponent,
        UploadBankChequeFileModalComponent,
        DashboardComponent,
        ResearcherPresentationReportComponent,
        EvaluatorFeedbackListComponent,
        InstallmentProcessListComponent,
        InstallmentProcessViewComponent,
        ViewSeminarComponent,
        FinalEvaluationReportListComponent,
        FinalEvaluationReportFormComponent,
        GeoLetterListComponent,
        DownloadGoLetterComponent,
        ResearchProfileComponent,
        BankChequeListComponent,
        DownloadBankChequeComponent,
        SendFeedBackListPageComponent,
        RmsDashboardComponent,
        InstitutionalPersonalInfoComponent,
        EvaluatorProfileComponent,
        ProposalEligibilityCheckModalComponent,
        ProgressReportComponent,
        ResearchInformationComponent,
        TaskListComponent,
        DownloadProgressReportComponent,
        ProgressReportListComponent,
        ResearchCancellationAddComponent,
        ResearchCancellationComponent,
        ResearchCancellationDetailsComponent,
        UploadFileModalsComponent,
        ResearchCancellationViewComponent,
        CreateAcknowledgmentLetterComponent,
        LinkupProposalWithEvaluatorsViewDetailsComponent,
        ResearchFinalSubmissionComponent,
        ViewResearchFinalSubmissionComponent,
        LinkupProposalWithEvaluatorsViewDetailsComponent,
        ResearcherInfoComponent,
        InstitutionalWorkingOrganizationComponent,
        UplodFileModalComponent,
        GoLetterComponent,
        ViewGoLetterComponent,
        CustomCapitalizePipe,
        NgHtmlPipe,
        SeminarViewDetailsComponent,
        EnToBnPipe,
        ResearcherListPublicComponent,
        FywApprovalListComponent,
        FywSendToEnothiComponent,
        FywApprovalDetailsComponent,
        ProposalListComponent,
        ProposalDetailsComponent,
        ProposalFormComponent,
        ResearcherAgreementListComponent,
        ResearcherAgreementFormComponent,
        ResearcherAgreementDetailsComponent,
        ResearcherInstallmentGoListComponent,
        ResearcherInstallmentGoFormComponent,
        ResearcherInstallmentGoDetailsComponent,
        SendEmailModalNewComponent,
        CropImageComponent,
        AgreementActivityPlanComponent
    ],
    providers: [EmptyFieldValidatorPipe, EmailValidatorPipe,
        NidValidatorPipe, PhoneNumberValidatorPipe,ResultFinderPipe,
        SafeHtmlPipe],
    exports: [EmptyFieldValidatorPipe, EmailValidatorPipe,ResultFinderPipe,
        NidValidatorPipe, PhoneNumberValidatorPipe,
        SafeHtmlPipe, CustomCapitalizePipe],
    imports: [
        CommonModule,
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
        MatGridListModule,
        NgApexchartsModule,
        NgxPrintModule,
        ImageCropperModule
    ]
})
export class RpmModule {
}
