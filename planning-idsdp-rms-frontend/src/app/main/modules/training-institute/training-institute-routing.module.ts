import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "../../../layout/layout.component";
import {InitialDataResolver} from "../../../app.resolvers";
import {TrainersListComponent} from "./features/proposal-setup/trainers/trainers-list/trainers-list.component";
import {AddNewTrainerComponent} from './features/proposal-setup/proposals/proposal-tab/tabs/add-new-trainer/add-new-trainer.component';
import {CourseScheduleListComponent} from "./features/proposal-setup/course-schedule/course-schedule-list/course-schedule-list.component";
import {AddNewCourseComponent} from "./features/proposal-setup/proposals/proposal-tab/tabs/add-new-course/add-new-course.component";
import {BudgetComponent} from './features/proposal-setup/proposals/proposal-tab/tabs/budget/budget.component';
import {ProposalListComponent} from './features/proposal-setup/proposals/proposal-list/proposal-list.component';
import {AddNewProposalComponent} from './features/proposal-setup/proposals/proposal-tab/tabs/add-new-proposal/add-new-proposal.component';
import {GuarantorListComponent} from './features/agreement-process/guarantors-info/guarantor-list/guarantor-list.component';
import {AddNewGuarantorComponent} from './features/agreement-process/guarantors-info/add-new-guarantor/add-new-guarantor.component';
import {AgreementListComponent} from './features/agreement-process/agreement-letter/agreement-list/agreement-list.component';
import {AddNewAgreementComponent} from './features/agreement-process/agreement-letter/add-new-agreement/add-new-agreement.component';
import {ParticipantListComponent} from './features/agreement-process/participant/participant-list/participant-list.component'
import {AddParticipantComponent} from './features/agreement-process/participant/add-participant/add-participant.component'
import {AttendanceListComponent} from './features/classroom/participant-attendance/attendance-list/attendance-list.component';
import {AttendanceFormComponent} from './features/classroom/participant-attendance/attendance-form/attendance-form.component';
import {ParticipentViewComponent} from "./features/agreement-process/participant/participent-view/participent-view.component";
import {TrainersProfileComponent} from "./features/proposal-setup/trainers/trainers-list/trainers-profile/trainers-profile.component";
import {ProposalViewComponent} from './features/proposal-setup/proposals/proposal-list/proposal-view/proposal-view.component';
import {CourseTimescheduleViewComponent} from "./features/proposal-setup/course-schedule/course-timeschedule-view/course-timeschedule-view.component";
import {AgreementViewComponent} from './features/agreement-process/agreement-letter/agreement-view/agreement-view.component';
import {ParticipantAllViewComponent} from "./features/agreement-process/participant/participant-all-view/participant-all-view.component";
import {ParticipantAllListComponent} from './features/agreement-process/participant/participant-all-list/participant-all-list.component'
import {TrainersListDownloadComponent} from "./features/proposal-setup/trainers/trainers-list-download/trainers-list-download.component";
import {TrainingInsProfileComponent} from "./features/profiles/training-ins-profile/training-ins-profile.component";
import {ProfileEditComponent} from "./features/profile-tab/profile-edit/profile-edit.component";
import {NominateInstitutesListComponent} from './features/others/nominate-institutes/nominate-institutes-list/nominate-institutes-list.component';
import {EDocumentsViewComponent} from './features/others/nominate-institutes/e-documents-view/e-documents-view.component';
import {ChequeCollectionListComponent} from './features/others/cheque-collections/cheque-collection-list/cheque-collection-list.component';
import {AddNewChequeCollectionComponent} from './features/others/cheque-collections/add-new-cheque-collection/add-new-cheque-collection.component';
import {ProgressVerificationListComponent} from "./features/others/progress-verification/progress-verification-list/progress-verification-list.component";
import {AddProgressVerificationComponent} from "./features/others/progress-verification/add-progress-verification/add-progress-verification.component";
import {PartialAndFinalPaymentListComponent} from "./features/others/partial-and-final-payment/partial-and-final-payment-list/partial-and-final-payment-list.component";
import {AddPartialAndFinalPaymentComponent} from "./features/others/partial-and-final-payment/add-partial-and-final-payment/add-partial-and-final-payment.component";
import {ChequeCollectionViewComponent} from "./features/others/cheque-collections/cheque-collection-view/cheque-collection-view.component";
import {PartialAndFinalPaymentViewComponent} from "./features/others/partial-and-final-payment/partial-and-final-payment-view/partial-and-final-payment-view.component";
import {ProgressVerificationViewComponent} from './features/others/progress-verification/progress-verification-view/progress-verification-view.component';
import {NomitateIntituteViewComponent} from './features/others/nominate-institutes/nomitate-intitute-view/nomitate-intitute-view.component';
//import {AttendanceViewComponent} from "./features/classroom/participant-attendance/attendance-view/attendance-view.component";
import {SpeakerEvaluationReportComponent} from './features/classroom/speaker-evaluation/speaker-evaluation-report/speaker-evaluation-report.component';
import {CreateGoLetterComponent} from "./features/others/partial-and-final-payment/create-go-letter/create-go-letter.component";
import {AwardLetterComponent} from "./features/others/award-letter/award-letter.component";
import {AddNewAwardLetterComponent} from "./features/others/award-letter/add-new-award-letter/add-new-award-letter.component";
import {EditPartialAndFinalPaymentComponent} from "./features/others/partial-and-final-payment/edit-partial-and-final-payment/edit-partial-and-final-payment.component";
import {AttendanceViewComponent} from "./features/classroom/participant-attendance/attendance-view/attendance-view.component";
import {ViewEFileComponent} from './features/others/nominate-institutes/view-e-file/view-e-file.component';
import {ProposalTabComponent} from "./features/proposal-setup/proposals/proposal-tab/proposal-tab.component";
import {AddCompletionReportComponent} from "./features/others/completion-report/add-completion-report/add-completion-report.component";
import {CompletionReportViewComponent} from "./features/others/completion-report/completion-report-view/completion-report-view.component";
import {CompletionReportListComponent} from "./features/others/completion-report/completion-report-list/completion-report-list.component";
import {ProfileTabComponent} from "./features/profile-tab/profile-tab.component";
import {AwardLetterViewComponent} from "./features/others/award-letter/award-letter-view/award-letter-view.component";
import { PartialAndFinalPaymentListTwoComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-list-two/partial-and-final-payment-list-two.component';
import { PartialAndFinalPaymentViewTwoComponent } from './features/others/partial-and-final-payment/partial-and-final-payment-view-two/partial-and-final-payment-view-two.component';
import {ProfileListComponent} from "./features/profiles/profile-list/profile-list.component";
import {DashboardComponent} from "./features/dashboard/dashboard.component";
import { SpeakerEvaluationReportNewComponent } from './features/classroom/speaker-evaluation/speaker-evaluation-report-new/speaker-evaluation-report-new.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            /*--------------- Trainers --------------------*/
            {path: 'trainers', component: TrainersListComponent},
            {path: 'trainers-list-download', component: TrainersListDownloadComponent},
            {path: 'trainers/add', component: AddNewTrainerComponent},
            {path: 'trainers/profile/edit/:id', component: AddNewTrainerComponent},
            {path: 'trainers/profile/:uuid', component: TrainersProfileComponent},
            /*--------------- Budget --------------------*/
            {path: 'budget', component: BudgetComponent},

            /*----------------- Course Schedule --------------*/
            {path: 'course-schedules', component: CourseScheduleListComponent},
            {path: 'course-schedules/add', component: AddNewCourseComponent},
            {path: 'course-schedules/:id/edit', component: AddNewCourseComponent},
            {path: 'course-schedules/list/:id', component: CourseTimescheduleViewComponent},

            /*----------------- Proposal --------------*/
            {path: 'proposal-list', component: ProposalListComponent},
            // {path: 'proposal-list/add', component: AddNewProposalComponent},
            {path: 'proposal-list/add', component: ProposalTabComponent},
            {path: 'proposal-list/edit/:proposalId', component: ProposalTabComponent},
            //{path: 'proposal-list/edit/:proposalId/:courseScheduleId/:fiscalYearId', component: ProposalTabComponent},

            {path: 'proposal-list/view/:uuid/:id/:u', component: ProposalViewComponent},

            /*----------------- Guarantor Process --------------*/
            {path: 'guarantor-list', component: GuarantorListComponent},
            {path: 'guarantor-list/add', component: AddNewGuarantorComponent},
            {path: 'guarantor-list/edit/:id', component: AddNewGuarantorComponent},

            /*----------------- Speaker Evaluation Report--------------*/
            {path: 'speaker-evaluation-report', component: SpeakerEvaluationReportNewComponent},

            /*----------------- Agreement Letter Process --------------*/
            {path: 'agreement-letter', component: AgreementListComponent},
            {path: 'agreement-letter/add', component: AddNewAgreementComponent},
            {path: 'agreement-letter/add/:id', component: AddNewAgreementComponent},
            {path: 'agreement-letter/view/:uuid', component: AgreementViewComponent},

            /*----------------- Participant List Route --------------*/
            {path: 'participant-list', component: ParticipantListComponent},
            {path: 'participant-list/:id/view', component: ParticipentViewComponent},
            {path: 'add-new-participant', component: AddParticipantComponent},
            {path: 'add-new-participant/:id', component: AddParticipantComponent},
            {path: 'participant-list/view/all', component: ParticipantAllViewComponent},
            {path: 'participant-list/download/all', component: ParticipantAllListComponent},

            /*----------------- Participant attendance route Route --------------*/
            {path: 'attendance-list', component: AttendanceListComponent},
            {path: 'attendance-list/view/:id', component: AttendanceViewComponent},
            {path: 'attendance-list/add', component: AttendanceFormComponent},
            {path: 'attendance-list/edit/:id', component: AttendanceFormComponent},
            {path: 'participant-list/add', component: AddParticipantComponent},
            {path: 'participant-list/add/:id', component: AddParticipantComponent},

            /*------------------Profile-----------------------------------------*/
            //{path: 'profile/:uuid', component: TrainingInsProfileComponent},
            {path: 'profile/:uuid?p=sessionId', component: TrainingInsProfileComponent},
            {path: 'ti-profile-information', component: TrainingInsProfileComponent},
            {path: 'profile/:uuid/edit', component: ProfileEditComponent},
            {path: 'profile/:uuid/edit/tabs', component: ProfileTabComponent},
            {path: 'ti-profile-list', component: ProfileListComponent},

            /* -------------- Nominate Institutes ------------------ */
            {path: 'nominate-institutes', component: NominateInstitutesListComponent},
            {path: 'nominate-institutes/e-documents/:page/:size/:isl/:tid/:fid', component: EDocumentsViewComponent},
            {path: 'nominate-institutes/e-documents', component: EDocumentsViewComponent},
            {path: 'nominate-institutes/view/:uuid/:id/:u', component: NomitateIntituteViewComponent},
            {path: 'nominate-institutes/view/:uuid/:id', component: NomitateIntituteViewComponent},
            {path: 'nominate-institutes/e-documents/view', component: ViewEFileComponent},

            /* -------------- Cheque Collection Info ------------------ */
            {path: 'cheque-collection', component: ChequeCollectionListComponent},
            {path: 'cheque-collection/add', component: AddNewChequeCollectionComponent},
            {path: 'cheque-collection/edit/:id', component: AddNewChequeCollectionComponent},
            {path: 'cheque-collection/view/:id', component: ChequeCollectionViewComponent},

            /* -------------- Progress Verification ------------------ */
            {path: 'progress-verification', component: ProgressVerificationListComponent},
            {path: 'progress-verification/add', component: AddProgressVerificationComponent},
            {path: 'progress-verification/edit/:progressVerificationId', component: AddProgressVerificationComponent},
            {path: 'progress-verification/view/:progressVerificationId', component: ProgressVerificationViewComponent},

            /* -------------- Partial & Final Payment ------------------ */
            {path: 'partial-and-final-payment', component: PartialAndFinalPaymentListTwoComponent},
            {path: 'partial-and-final-payment/add', component: AddPartialAndFinalPaymentComponent},
            {path: 'partial-and-final-payment/edit/:id', component: AddPartialAndFinalPaymentComponent},
         // {path: 'partial-and-final-payment/:id', component: PartialAndFinalPaymentViewComponent},
            {path: 'partial-and-final-payment/:id', component: PartialAndFinalPaymentViewTwoComponent},
            {path: 'partial-and-final-payment/:id/create-go-letter', component: CreateGoLetterComponent},

            /* -------------- Award Letter ------------------ */
            {path: 'ti-award-letter', component: AwardLetterComponent},
            {path: 'ti-award-letter/add', component: AddNewAwardLetterComponent},
            {path: 'ti-award-letter/edit/:id', component: AddNewAwardLetterComponent},
            {path: 'ti-award-letter/view/:id', component: AwardLetterViewComponent},

            /* -------------- Completion Report ------------------ */
            {path: 'completion-report/:proposalId/add', component: AddCompletionReportComponent},
            {path: 'completion-report/edit/:id', component: AddCompletionReportComponent},
            {path: 'completion-report/view/:id', component: CompletionReportViewComponent},
            {path: 'completion-reports', component: CompletionReportListComponent},

            /*ti-Dashboard*/
            {path: 'ti-dashboard', component: DashboardComponent},

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainingInstituteRoutingModule {
}
