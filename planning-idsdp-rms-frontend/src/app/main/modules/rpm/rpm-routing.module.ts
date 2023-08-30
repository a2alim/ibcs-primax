import { ResearcherPresentationReportComponent } from "./features/m2/researcher-presentation/researcher-presentation-report/researcher-presentation-report.component";
import { SendFeedBackListPageComponent } from './features/m2/researcher-presentation/feedback-list-page/send-feed-back-list-page/send-feed-back-list-page.component';
import { EvaluatorFeedbackListComponent } from "./features/m2/researcher-presentation/evaluator-feedback-list/evaluator-feedback-list.component";
import { InstallmentProcessListComponent } from "./features/installment-process/installment-process-list/installment-process-list.component";
import { InstallmentProcessViewComponent } from "./features/installment-process/installment-process-view/installment-process-view.component";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from 'app/layout/layout.component';
import { TestComponentComponent } from './features/test-component/test-component.component';
import { ResearcherProfileInformationComponent } from "./features/researcher-profile-information/researcher-profile-information.component";
import { TotalMarksOfResearcherComponent } from './features/researcher-proposal/total-marks-of-researcher/total-marks-of-researcher.component';
import { ResearcherProposalInformationnComponent } from './features/researcher-proposal/researcher-proposal-informationn/researcher-proposal-informationn.component';
import { ResearchProposalViewDetailsComponent } from "./features/researcher-proposal/research-proposal-view-details/research-proposal-view-details.component";
import { AddFormComponent } from './features/fiscalYear-wise-sector-sub-sector/add-form/add-form.component';
import { ListTableComponent } from './features/fiscalYear-wise-sector-sub-sector/list-table/list-table.component';
import { DetailsComponent } from './features/fiscalYear-wise-sector-sub-sector/details/details.component';
import { CreateAddComponent } from './features/fiscalYear-wise-sector-sub-sector/forAdvertising/create-add/create-add.component';
import { AdDetailsComponent } from './features/fiscalYear-wise-sector-sub-sector/forAdvertising/ad-details/ad-details.component';
import { ProfileViewComponent } from './features/researcher-profile-information/profile-view/profile-view.component';
import { ResearcherProfileListComponent } from "./features/researcher-profile-information/researcher-profile-list/researcher-profile-list.component";
import { ListTableComponentsComponent } from './features/Ged-Feedback/list-table-components/list-table-components.component';
import { CreateLetterGedComponent } from './features/Ged-Feedback/create-letter-ged/create-letter-ged.component';
import { ViewLetterGedComponent } from './features/Ged-Feedback/view-letter-ged/view-letter-ged.component';
import { LatterListComponent } from "./features/latter/latter-list/latter-list.component";
import { NewLatterAddComponent } from "./features/latter/new-latter-add/new-latter-add.component";
import { LatterViewComponent } from "./features/latter/latter-view/latter-view.component";
import { ResearchProposalSubmissionLetterComponent } from "./features/research-proposal-submission-letter/research-proposal-submission-letter.component";
import { ResearcherListComponent } from './features/researcher-list/researcher-list.component';
import { LinkupProposalWithEvaluatorsComponent } from './features/researcher-proposal/linkup-proposal-with-evaluators/linkup-proposal-with-evaluators.component';
import { SavedGedFeedbackAnsListComponent } from './features/Ged-Feedback/saved-ged-feedback-ans-list/saved-ged-feedback-ans-list.component';
import { CreateGedFeedbakAnswerComponent } from './features/Ged-Feedback/create-ged-feedbak-answer/create-ged-feedbak-answer.component';
import { FeedbackAnswerComponent } from './features/Ged-Feedback/feedback-answer/feedback-answer.component';
import { AgreementProcessComponent } from "./features/agreement-process/agreement-process.component";
import { AgreementProcessListComponent } from "./features/agreement-process/agreement-process-list/agreement-process-list.component";
import { EvaluatorsGrantAmountInformationComponent } from "./features/evaluators-grant-amount/evaluators-grant-amount-information/evaluators-grant-amount-information.component";
import { EvaluatorsGrantAmountListComponent } from "./features/evaluators-grant-amount/evaluators-grant-amount-list/evaluators-grant-amount-list.component";
import { EvaluatorsGrantAmountLetterDetailsComponent } from "./features/evaluators-grant-amount/evaluators-grant-amount-letter-details/evaluators-grant-amount-letter-details.component";
import { AgreementViewPageComponent } from "./features/agreement-process/agreement-view-page/agreement-view-page.component";
import { ResearcherProfileComponent } from './features/researcher-list/researcher-profile/researcher-profile.component';
import { AgreementUploadSignatureFilesComponent } from './features/agreement-process/tabs/agreement-upload-signature-files/agreement-upload-signature-files.component';
import { ResearcherProposalMarksComponent } from "./features/researcher-proposal/researcher-proposal-marks/researcher-proposal-marks.component";
import { InforOfResearchComponent } from './features/researcher-list/infor-of-research/infor-of-research.component';
import { ResearcherProfileMarksPromotionalComponent } from "./features/researcher-profile-marks/researcher-profile-marks-promotional/researcher-profile-marks-promotional.component";
import { ResearcherProfileMarksFellowshipComponent } from "./features/researcher-profile-marks/researcher-profile-marks-fellowship/researcher-profile-marks-fellowship.component";
import { ResearcherProfileMarksMPhillPhdComponent } from "./features/researcher-profile-marks/researcher-profile-marks-mPhill-phd/researcher-profile-marks-mPhill-phd.component";
import { ResearcherProfileMarksInstitutionResearchComponent } from "./features/researcher-profile-marks/researcher-profile-marks-institution-research/researcher-profile-marks-institution-research.component";
import { NotificationListComponent } from "./features/notification/notification-list/notification-list.component";
import { CreateNotificationComponent } from "./features/notification/create-notification/create-notification.component";
import { NotificationNoteComponent } from "./features/notification/notification-note/notification-note.component";
import { CreateSeminarComponent } from "./features/seminar/create-seminar/create-seminar.component";
import { ResearchProgressReportComponent } from './features/m2/research-progress-report/research-progress-report.component';
import { ProgressReportListPageComponent } from './features/m2/research-progress-report/progress-report-list-page/progress-report-list-page.component';
import { FeedbackListPageComponent } from './features/m2/researcher-presentation/feedback-list-page/feedback-list-page.component';
import { InstallmentProcessComponent } from './features/installment-process/installment-process.component';
import { AddResearcherPresentationComponent } from "./features/m2/researcher-presentation/add-researcher-presentation/add-researcher-presentation.component";
import { StartPresentationComponent } from "./features/m2/researcher-presentation/start-presentation/start-presentation.component";
import { SeminarsListComponent } from "./features/seminar/seminars-list/seminars-list.component";
import { EvaluatorFeedbackComponent } from "./features/m2/researcher-presentation/evaluator-feedback/evaluator-feedback.component";
import { FeedbackListComponent } from './features/m2/researcher-presentation/feedback-list-page/feedback-list/feedback-list.component';
import { ResearcherFeedbackComponent } from "./features/m2/researcher-presentation/researcher-feedback/researcher-feedback.component";
import { SeminarEmailComponent } from "./features/seminar/seminar-email/seminar-email.component";
import { PredefinedTemplateForPresentationComponent } from './features/seminar/predefined-template-for-presentation/predefined-template-for-presentation.component';
import { CreateGoLetterComponent } from "./features/create-go-letter/create-go-letter.component";
import { ReceiveBankChequeComponent } from './features/receive-bank-cheque/receive-bank-cheque.component';
import { GeoLetterListComponent } from "./features/create-go-letter/geo-letter-list/geo-letter-list.component";
import { DownloadGoLetterComponent } from "./features/create-go-letter/download-go-letter/download-go-letter.component";
import { ResearchProfileComponent } from "./features/research-profile/research-profile.component";
import { DownloadBankChequeComponent } from './features/receive-bank-cheque/download-bank-cheque/download-bank-cheque.component';
import { BankChequeListComponent } from './features/receive-bank-cheque/bank-cheque-list/bank-cheque-list.component';
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { ViewSeminarComponent } from './features/seminar/view-seminar/view-seminar.component';
import { FinalEvaluationReportListComponent } from './features/seminar/final-evaluation-report-list/final-evaluation-report-list.component';
import { FinalEvaluationReportFormComponent } from './features/seminar/final-evaluation-report-form/final-evaluation-report-form.component';
import { ChangePasswordComponent } from 'app/layout/common/change-password/change-password.component';
import { RmsDashboardComponent } from "./features/rms-dashboard/rms-dashboard.component";
import { EvaluatorProfileComponent } from "./features/evaluators/evaluator-profile/evaluator-profile.component";
import { ProgressReportListComponent } from "./features/progress-report/progress-report-list/progress-report-list.component";
import { ProgressReportComponent } from "./features/progress-report/progress-report.component";
import { DownloadProgressReportComponent } from "./features/progress-report/download-progress-report/download-progress-report.component";
import { ResearchCancellationComponent } from "./features/research-cancellation/research-cancellation.component";
import { ResearchCancellationAddComponent } from "./features/research-cancellation/research-cancellation-add/research-cancellation-add.component";
import { ResearchCancellationDetailsComponent } from "./features/research-cancellation/research-cancellation-details/research-cancellation-details.component";
import {
    ResearchCancellationViewComponent
} from "./features/research-cancellation/research-cancellation-view/research-cancellation-view.component";
import {
    CreateAcknowledgmentLetterComponent
} from "./features/receive-bank-cheque/create-acknowledgment-letter/create-acknowledgment-letter.component";
import { LinkupProposalWithEvaluatorsViewDetailsComponent } from "./features/researcher-proposal/linkup-proposal-with-evaluators/linkup-proposal-with-evaluators-view-details/linkup-proposal-with-evaluators-view-details.component";
import { ResearchFinalSubmissionComponent } from "./features/m2/research-final-submission/research-final-submission.component";
import { ViewResearchFinalSubmissionComponent } from "./features/m2/view-research-final-submission/view-research-final-submission.component";
import { ResearcherInfoComponent } from "./features/researcher-info/researcher-info.component";
import { SeminarViewDetailsComponent } from "./features/seminar/seminar-view-details/seminar-view-details.component";
import { ResearcherListPublicComponent } from "./features/researcher-list-public/researcher-list-public.component";
import { CropImageComponent } from "./features/crop-image/crop-image.component";
//http://localhost:4200/researcher/profile/eb05b8d3-bb5c-437b-a34d-8e958666a047
const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },

        children: [
            { path: 'test2', component: TestComponentComponent },

            /*----------For Sector Sub-Sector Selection URL-----------*/
            { path: 'sector-sub-sector-list', component: ListTableComponent },
            { path: 'add-sector-sub-sector', component: AddFormComponent },
            { path: 'sector-sub-sector-details', component: DetailsComponent },
            { path: 'create-request-letter', component: CreateAddComponent },
            { path: 'request-letter-detail', component: AdDetailsComponent },
            { path: 'request-letter-detail/:stFiscalYear', component: AdDetailsComponent },
            /*----------/For Sector Sub-Sector Selection URL-----------*/

            /*----------For Researcher Profile URL-----------*/
            { path: 'researcher-profile-information/add', component: ResearcherProfileInformationComponent },
            { path: 'add-researcher-profile', component: ResearcherProfileInformationComponent },
            { path: 'researcher-profile-information/:id/edit/:uid', component: ResearcherProfileInformationComponent },
            { path: 'researcher-profile-information/:id/view', component: ProfileViewComponent },
            { path: 'researcher-profile-information/:id/:isInstitutional/view', component: ProfileViewComponent },
            { path: 'researcher-profile-information/:id/:rid/view', component: ProfileViewComponent },
            { path: 'researcher-profile-information/:id/:rid/:isInstitutional/view', component: ProfileViewComponent },
            { path: 'researcher-profile-information', component: ResearcherProfileListComponent },
            { path: 'researcher-profile-promotional-marks/:uuid/:profileUuid', component: ResearcherProfileMarksPromotionalComponent },
            { path: 'researcher-profile-fellowship-marks/:uuid:profileUuid', component: ResearcherProfileMarksFellowshipComponent },
            { path: 'researcher-profile-institutional-marks/:uuid/:profileUuid', component: ResearcherProfileMarksMPhillPhdComponent },
            {
                path: 'researcher-profile-institution-research-marks/:uuid/:profileUuid',
                component: ResearcherProfileMarksInstitutionResearchComponent
            },
            { path: 'researcher-profile-information/:profile', component: ResearcherProfileInformationComponent },

            /*----------/For Researcher Profile URL-----------*/

            /*------------For Researcher List----------*/
            { path: 'researcher/list', component: ResearcherListComponent },
            { path: 'researcher-list-public', component: ResearcherListPublicComponent },

            { path: 'researcher/profile/:uuid', component: ResearcherProfileComponent },
            { path: 'researcher/profile', component: ResearcherProfileComponent },
            { path: 'researcher/proposal-info', component: InforOfResearchComponent },
            // {feedback-list
            //     path: 'researcher',
            //     //loadChildren: './features/researcher-list/researcher-list.module',
            //     //loadChildren: () => ResearcherListModule
            //     loadChildren: () => import('./features/researcher-list/researcher-list.module').then(m=>m.ResearcherListModule),
            // },
            /*------------/For Researcher List----------*/

            /*----------For Evaluator profile component-----------*/
            { path: 'evaluator-profile', component: EvaluatorProfileComponent },
            /*----------/For Evaluator profile component-----------*/


            /*----------For Create Letter for Ged-----------*/

            { path: 'create-go-letter', component: CreateGoLetterComponent },
            { path: 'go-letter-list/:goUuid/create-go-letter', component: CreateGoLetterComponent },
            { path: 'go-letter-list/:goUuid/update-go-letter', component: CreateGoLetterComponent },
            { path: 'go-letter-list/:goUuid', component: GeoLetterListComponent },
            { path: 'go-letter-list/:goUuid/download-go-letter', component: DownloadGoLetterComponent },
            { path: 'go-letter-list/:goLetterId/bank-cheque-list', component: BankChequeListComponent },
            { path: 'go-letter-list/:goLetterId/receive-bank-cheque/:chequeId', component: ReceiveBankChequeComponent },
            { path: 'go-letter-list/:goLetterId/download-bank-cheque/:chequeId', component: DownloadBankChequeComponent },
            { path: 'receive-bank-cheque', component: ReceiveBankChequeComponent },
            { path: 'go-letter-list/:goLetterId/create-acknowledgment-letter/:uuid', component: CreateAcknowledgmentLetterComponent },

            /*----------/For Create Letter for Ged-----------*/

            /*----------For Create Go Letter Dashboard-----------*/
            { path: 'rms-dashboard', component: RmsDashboardComponent },
            // { path: 'rms-dashboard/:sessionId', component: RmsDashboardComponent },

            /*----------For Research Profile-----------*/

            { path: 'research-profile', component: ResearchProfileComponent },

            /*----------For Research Information-----------*/
            { path: 'researcher-information/:uuid', component: ResearcherInfoComponent },

            /*----------For Research Cancellation-----------*/
            { path: 'research-cancellation', component: ResearchCancellationComponent },
            { path: 'research-cancellation-add', component: ResearchCancellationAddComponent },
            { path: 'research-cancellation/:uuid/edit', component: ResearchCancellationAddComponent },
            { path: 'research-cancellation-details', component: ResearchCancellationDetailsComponent },
            { path: 'research-cancellation/:uuid/view', component: ResearchCancellationViewComponent },



            /*----------For Create Letter for Ged-----------*/

            { path: 'ged-list', component: ListTableComponentsComponent },
            { path: 'create-letter-ged', component: CreateLetterGedComponent },
            { path: 'view-letter-ged', component: ViewLetterGedComponent },
            { path: 'ged-feedback-list', component: SavedGedFeedbackAnsListComponent },
            { path: 'ged-feedback-asnwer', component: CreateGedFeedbakAnswerComponent },
            { path: 'view-feedback-asnwer', component: FeedbackAnswerComponent },

            /*--------------------------For Progress Report ( Submit Progress Report )------------------------*/
            { path: 'list-progress-report', component: ProgressReportListComponent },
            { path: 'progress-report/add', component: ProgressReportComponent },
            { path: 'progress-report/add/:uuid/edit', component: ProgressReportComponent },
            { path: 'progress-report/:uuid/details', component: DownloadProgressReportComponent },
            /*--------------------------//For Progress Report------------------------*/

            /*----------/For Create Letter for Ged-----------*/

            /*----------For Researcher Proposal URL-----------*/
            { path: 'total-marks-of-researcher', component: TotalMarksOfResearcherComponent },
            // {
            //     path: 'researcher-proposal-informationn/:researcherProfileUuId',
            //     component: ResearcherProposalInformationnComponent
            // },
            // {
            //     path: 'researcher-proposal-informationn/edit/:researcherProposalUuId',
            //     component: ResearcherProposalInformationnComponent
            // },
            // {
            //     path: 'researcher-proposal-informationn/edit/:type/:researcherProposalUuId',
            //     component: ResearcherProposalInformationnComponent
            // },
            {
                //path: 'researcher-proposal-informationn/:researcherProfileUuId/:categoryTypeId',
                path: 'researcher-proposal-informationn/:researcherProfileUuId',
                component: ResearcherProposalInformationnComponent
            },
            {
                path: 'researcher-proposal-informationn/edit/:type/:researcherProposalUuId',
                component: ResearcherProposalInformationnComponent
            },
            { path: 'researcher-proposal-details/view/:uuId', component: ResearchProposalViewDetailsComponent },
            { path: 'researcher-proposal-submission-letter/:uuid', component: ResearchProposalSubmissionLetterComponent },
            { path: 'researcher-proposal-marks/:proposalUuid', component: ResearcherProposalMarksComponent },
            /*----------/For Researcher Proposal URL-----------*/

            /*----------For Latter URL-----------*/
            { path: 'letter', component: LatterListComponent },
            { path: 'letter/add', component: NewLatterAddComponent },
            { path: 'letter/add/:id', component: NewLatterAddComponent },
            { path: 'letter/view/:id', component: LatterViewComponent },
            /*----------For Latter URL-----------*/

            /*--------------Agreement Process----------------*/
            { path: 'agreement-process/add', component: AgreementProcessComponent },
            { path: 'agreement-process/:id/edit', component: AgreementProcessComponent },
            { path: 'agreement-process/:id/view/:researcherProfileUuid/:userId', component: AgreementViewPageComponent },
            { path: 'agreement-process', component: AgreementProcessListComponent },
            { path: 'agreement-file/:id/upload', component: AgreementUploadSignatureFilesComponent },
            /*--------------Agreement Process----------------*/

            { path: 'linkup-proposal-with-evaluators', component: LinkupProposalWithEvaluatorsComponent },
            { path: 'linkup-proposal-with-evaluators-view-details', component: LinkupProposalWithEvaluatorsViewDetailsComponent },


            /*----------For Evaluator Grant Amount URL-----------*/
            { path: 'evaluators-grant-amount-list', component: EvaluatorsGrantAmountListComponent },
            { path: 'evaluator-grant-amount/add', component: EvaluatorsGrantAmountInformationComponent },
            { path: 'evaluator-grant-amount/edit/:uuid', component: EvaluatorsGrantAmountInformationComponent },
            { path: 'evaluator-grant-amount-details/:uuid', component: EvaluatorsGrantAmountLetterDetailsComponent },
            /*----------/For Evaluator Grant Amount URL-----------*/

            /*----------For Notification-----------*/
            { path: 'notifications', component: NotificationListComponent },
            { path: 'notifications/add', component: CreateNotificationComponent },
            { path: 'notifications/:id', component: CreateNotificationComponent },
            { path: 'notifications/:id/note', component: NotificationNoteComponent },
            /*----------For Notification-----------*/

            /*-------------For Seminar ----------------*/
            { path: 'seminars', component: SeminarsListComponent },
            { path: 'seminars/add', component: CreateSeminarComponent },
            //{ path: 'seminars/:uuid/view/:id', component: ViewSeminarComponent },
            { path: 'seminars/:uuid/view/:id', component: SeminarViewDetailsComponent },
            { path: 'seminars/:uuid/edit/:id', component: CreateSeminarComponent },
            { path: 'seminars/:uuid/email/:id', component: SeminarEmailComponent },
            {
                path: 'seminars-predefined-template-for-presentation/:uuid',
                component: PredefinedTemplateForPresentationComponent
            },

            { path: 'final-evaluation-report', component: FinalEvaluationReportListComponent },
            {
                path: 'final-evaluation-report/add-edit/:uuid/:m1ResearcherProposalInfoId',
                component: FinalEvaluationReportFormComponent
            },

            /*-------------For Research Progress Report ----------------*/
            { path: 'research-progress-report/list', component: ProgressReportListPageComponent },
            { path: 'research-progress-report/add', component: ResearchProgressReportComponent },
            /*-------------/For Research Progress Report ----------------*/

            /*-------------Researcher Presentation ----------------*/
            { path: 'add-researcher-presentation/:seminarUuid', component: AddResearcherPresentationComponent },
            { path: 'start-presentation/:presentationUuid', component: StartPresentationComponent },
            { path: 'add-researcher-presentation', component: AddResearcherPresentationComponent },
            { path: 'feedback-list-page', component: FeedbackListPageComponent },
            { path: 'evaluator-feedback/:attendanceUuid', component: EvaluatorFeedbackComponent },
            { path: 'feedback-list/:uuid', component: FeedbackListComponent },
            { path: 'researcher-feedback/:proposalUuid', component: ResearcherFeedbackComponent },
            { path: 'research-final-submission/:m1ResearcherProfilePersonalInfoId/:m1ResearcherProposalId/:proposalUuid', component: ResearchFinalSubmissionComponent },
            { path: 'view-final-report-of-research-submission/:m1ResearcherProfilePersonalInfoId/:m1ResearcherProposalId/:proposalUuid', component: ViewResearchFinalSubmissionComponent },
            // {path: 'send-feedback-list-page', component: SendFeedBackListPageComponent},
            {
                path: 'send-feedback-list-page/:feedbackBetweenEvaAndResearcherUuid',
                component: SendFeedBackListPageComponent
            },
            { path: 'presentation-report/:seminarUuid', component: ResearcherPresentationReportComponent },
            { path: 'evaluator-feedback-list/:attendanceUuid', component: EvaluatorFeedbackListComponent },

            /*----------For installment process-----------*/
            { path: 'installment-process/add/:uuid', component: InstallmentProcessComponent },
            { path: 'installment-process', component: InstallmentProcessListComponent },
            { path: 'installment-process/:mode/:uuid', component: InstallmentProcessComponent },
            { path: 'installment-process/view/all/:uuid', component: InstallmentProcessViewComponent },


            /*----------For installment process-----------*/
            { path: 'dashboard', component: DashboardComponent },

            /*----------For reset password-----------*/
            { path: 'change-password', component: ChangePasswordComponent },
            //{ path: 'pdf', component: TesComponent },

            {
                path: 'e-Nothi',
                loadChildren: () => import('./features/e-Nothi-approval-process/e-nothi-routing.module').then(m => m.ENothiRoutingModule),
            },

            { path: 'resize-image', component: CropImageComponent },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RpmRoutingModule {

}
