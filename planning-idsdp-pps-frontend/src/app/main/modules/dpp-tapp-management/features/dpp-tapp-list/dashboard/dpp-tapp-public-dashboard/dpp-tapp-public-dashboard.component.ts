import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
    ApexChart,
    ApexDataLabels,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ApexStates,
    ApexStroke,
    ApexTheme,
    ApexTitleSubtitle,
    ChartComponent
} from 'ng-apexcharts';
import { DEFAULT_PAGE } from "../../../../../../core/constants/constant";
import { MatTableDataSource } from "@angular/material/table";
import { IProjectConcept } from "../../../../../project-concept-management/models/project-concept";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { ProjectSummaryService } from "../../../../../project-concept-management/services/project-summary.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SnackbarHelper } from "../../../../../../core/helper/snackbar.helper";
import { ActivatedRoute, Router } from "@angular/router";
import {
    DashboardAttachmentService
} from "../../../../../project-concept-management/services/dashboard-attachment.service";
import { DatePipe } from "@angular/common";
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import {
    OK,
} from "../../../../../../core/constants/message";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import {
    CommentObservationComponent
} from "../../../../../project-concept-management/features/project-concepts/comment-observation/comment-observation.component";
import { ReportDataService } from 'app/main/shared/services/report-data.service';
import { ReportCommonService } from 'app/main/core/services/report-common.service';
import { DppObjectiveCostService } from "../../../../services/dpp-objective-cost.service";
import { TranslateService } from "@ngx-translate/core";
import { DppAnnualPhasingCostService } from "../../../../services/dpp-annual-phasing-cost.service";
import { DppAnnualPhasingConstant } from "../../../../constants/dpp-annual-phasing.constant";
import { TappAnnualPhasingCostService } from "../../../../services/tapp-annual-phasing-cost.service";
import { TappObjectiveCostService } from "../../../../services/tapp-objective-cost.service";
import { MatSelectChange } from "@angular/material/select";
import { DateBengaliPipe } from '../../../../../../shared/pipes/date-bengali-pipe';
import { DATE_BENGALI_FORMAT, DATE_ENG_FORMAT } from '../../../../../../shared/constant/formatter.constant';
import { FileUploadService } from "../../../../../../core/services/file-upload.service";
import { NumberPipe } from "../../../../../../shared/pipes/number-pipe.pipe";
import { ProjectMovementStageConstant } from "../../../../constants/project-movement-stage-constant";
import {
    ProjectMovementService as StageMovementService,
    ProjectMovementService
} from "../../../../services/project-movement.service";
import { ProjectMovementStageModel } from "../../../../models/project.movement.model";
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';
import { FeedbackMovementService } from 'app/main/core/services/feedback-movement.service';
import { SectorService } from "../../../../../configuration-management/services/sector.service";
import { SubSectorService } from "../../../../../configuration-management/services/sub-sector.service";
import { SectorModel } from "../../../../../configuration-management/models/sector.model";
import { SubSectorModel } from "../../../../../configuration-management/models/sub-sector.model";
import { SectorDivisionModel } from "../../../../../configuration-management/models/sector-division.model";
import { SectorDivisionService } from "../../../../../configuration-management/services/sector-division.service";
import { locale as lngEnglishAction } from "../../../../../../../layout/layouts/vertical/classy/i18n/en";
import { DppObjectiveCostModel } from "../../../../models/dppObjectiveCost.model";
import { TappObjectiveCostModel } from "../../../../models/tappObjectiveCost.model";
import { CommentSourceEnum } from "../../../../../project-concept-management/enums/comment-source.enum";
import { AgencyService } from "../../../../../configuration-management/services/agency.service";
import { ClassyLayoutComponent } from "../../../../../../../layout/layouts/vertical/classy/classy.component";
import { NgxBootstrapConfirmService } from "ngx-bootstrap-confirm";
import { ModeOfFinanceModel } from "../../../../../feasibility-study-management/models/mode-of-finance.model";
import { IFiscalYearRequest } from "../../../../models/fiscal-year-request";
import { IDppPhasingCostTotal } from "../../../../models/dpp-phasing-cost-total";
import { DppLocationWiseCostBreakdownService } from "../../../../services/dpp-location-wise-cost-breakdown.service";
import { DppProjectManagementSetupService } from "../../../../services/dpp-project-management-setup.service";
import { DppAnnexureGoodsIiiAService } from "../../../../services/dpp-annexure-goods_iii_a.service";
import { ProjectDetailsPartbService } from "../../project-details/services/project-details-partb.service";
import { UserProfileService } from 'app/main/modules/auth/services/user.profile.service';
import { MatSort } from "@angular/material/sort";
import {
    DashboardAttachmentDetailsModel
} from "../../../../../project-concept-management/models/dashboard-attachment-details.model";
import {
    FeasibilityStudySummaryService
} from "../../../../../feasibility-study-management/services/feasibility-study-summary.service";
import { FsLinkWithDppModel } from "../../../../models/FsLinkWithDpp.model";
import { NothiUserService } from 'app/main/modules/auth/services/nothi-user.service';
import { StatusStage } from "../../../../constants/stage-status-constant";
import { DashboardService } from "../../../../services/dashboard.service";
import { DppTappGoService } from 'app/main/modules/dpp-tapp-management/services/dpp-tapp-go.service';
import { AssingEcnecMeetingService } from "../../../../services/assign-ecnec-meeting.service";
import { TermOfReferenceService } from "../../../../services/tapp-term-of-reference.service";
import { TermOfReferenceReportService } from "../../../../services/term-of-reference-report.service";
import { Observable, Subscription, timer } from "rxjs";
import { LayoutHelperService } from 'app/layout/layouts/vertical/services/layout-helper.service';
import { ProjectSummariesService } from "../../../../../../shared/services/project-summaries.service";
import { ProjectRequestModel } from "../../../../models/project-request.model";
import { environment, reportBackend } from "environments/environment";
import { TappWorkScheduleService } from 'app/main/modules/dpp-tapp-management/services/tapp-work-schedule.service';

import * as bl2Js from 'bl2-js-report';
import { TappWorkScheduleModel } from 'app/main/modules/dpp-tapp-management/models/tapp-work-schedule.model';
import { UnsubscribeAdapterComponent } from 'app/main/core/helper/unsubscribeAdapter';
import { DppAmortizationScheduleService } from 'app/main/modules/dpp-tapp-management/services/dpp-amortization-schedule.service';
import { DppAmortizationScheduleDynamicRow } from 'app/main/modules/dpp-tapp-management/models/dpp-amortization-schedule-dynamic-row.model';
import { DppAmortizationSchedule } from 'app/main/modules/dpp-tapp-management/models/DppAmortizationSchedule.model';
import { FinancialAnalysisService } from '../../project-details/services/financial-analysis.service';
import { SimilarProjectStudyService } from '../../project-details/services/similar-project-study.service';
import { EffectImpactService } from '../../project-details/services/effect-impact.service';
import { OtherDetailsService } from '../../project-details/services/other-details.service';
import { OtherImportantDetailsService } from '../../project-details/services/other-important-details.service';
import { DppLocationService } from 'app/main/modules/dpp-tapp-management/services/dpp-location.service';
import { IDppLocationWiseCostBreakdown } from 'app/main/modules/dpp-tapp-management/models/dpp-location-wise-cost-breakdown.model';
import { DivisionModel } from 'app/main/modules/configuration-management/models/division.model';
import { UpazillaModel } from 'app/main/modules/configuration-management/models/upazilla.model';
import { ZillaModel } from 'app/main/modules/configuration-management/models/zilla.model';
import { map, switchMap } from 'rxjs/operators';
import { IYearWisePhysicalAndFinancialTarget } from 'app/main/modules/dpp-tapp-management/models/year-wise-physical-and-financial-target';
import { IDppAnnualPhasingEstimatedCostTabDetails } from 'app/main/modules/dpp-tapp-management/models/dpp-annual-phasing-estimated-cost-tab-details';
import { IDppAnnexure5ACostTotal } from 'app/main/modules/dpp-tapp-management/models/dpp-annexure5A-cost-total';
import { DppLogFrameService } from 'app/main/modules/dpp-tapp-management/services/dpp-log-frame.service';
import { DppProjectManagementService } from 'app/main/modules/dpp-tapp-management/services/dpp-project-management.service';
import { UnitTypeService } from 'app/main/modules/configuration-management/services/unit-type.service';
import { MtbfService } from 'app/main/modules/dpp-tapp-management/services/mtbf.service';
import { ApplicationSubmission } from "../../../../../../shared/model/application-submission.model";
import { ReportGenerateService } from "../../../../../../shared/services/report-generate.service";
import { IDppAnnualPhasingCostWithChildDetailsResponse } from 'app/main/modules/dpp-tapp-management/models/dpp-annual-phasing-cost-with-child-respone';
import { TappAnnexureGoodsService } from 'app/main/modules/dpp-tapp-management/services/tapp-annexure/tapp-annexure-goods.service';
import { TappQualificationSupportStuffService } from 'app/main/modules/dpp-tapp-management/services/tapp-qualification-support-stuff.service';
import { TappConsultantService } from 'app/main/modules/dpp-tapp-management/services/tapp-consultant.service';
import { TappProjectDetailsService } from 'app/main/modules/dpp-tapp-management/services/tapp-project-details.service';
import { ITppPhasingCostTotal } from 'app/main/modules/dpp-tapp-management/models/tpp-phasing-cost-total';
import {TppAnnexureFiveService} from "../../../../../dpp-tapp-management/services/tpp-annexure-five.service";
import { TappFinancingAndExpectationService } from 'app/main/modules/dpp-tapp-management/services/tapp-financing-and-expectation.service';
import { TappLogFrameService } from 'app/main/modules/dpp-tapp-management/services/tapp-log-frame.service';
import { TappYearCostSummeryService } from 'app/main/modules/dpp-tapp-management/services/tapp-year-cost-summery.service';
import { CurrencyService } from 'app/main/modules/configuration-management/services/currency.service';
import {TppAnnexureSavenService} from "../../../../services/tpp-annexure-saven.service";
import {DppTappService} from "../../../../services/dpp-tapp.service";


export class CurrentMovementStage {
    id: string;
    currentStage: string;
    movementTime: string;
    userId: number;
}


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    fill: any;
    stroke: ApexStroke;
    states: ApexStates;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
    colors: string[];
    theme: ApexTheme;
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dpp-tapp-public-dashboard',
  templateUrl: './dpp-tapp-public-dashboard.component.html',
  styleUrls: ['./dpp-tapp-public-dashboard.component.scss']
})
export class DppTappPublicDashboardComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('pscDialog') pscDialog: TemplateRef<any>;
    @ViewChild('callDownloadGODialog') callDownloadGODialog: TemplateRef<any>;
    @ViewChild('callDownloadRelatedInfoDialog') callDownloadRelatedInfoDialog: TemplateRef<any>;
    @ViewChild('callAttachmentDialogForMeeting') callAttachmentDialogForMeeting: TemplateRef<any>;
    @ViewChild('relatedMeetingAttachmentDialog') relatedMeetingAttachmentDialog: TemplateRef<any>;
    @ViewChild('conditionalApproveByEcnecDialog') conditionalApproveByEcnecDialog: TemplateRef<any>;
    @ViewChild('linkWithFS') linkWithFS: TemplateRef<any>;
    @ViewChild('commentAndObservationDialog') commentAndObservationDialog: TemplateRef<any>;
    @ViewChild('fsReportBtn') fsReportBtn: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginator2: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    size: number = 10;
    page: number = DEFAULT_PAGE;
    total: number;
    conceptId: number;

    sizeProjectMovement: number = 10;
    pageProjectMovement: number = DEFAULT_PAGE;
    totalProjectMovement: number;

    totalAmountAnnexure5B: number;
    projectMovementModel: ProjectMovementStageModel = new ProjectMovementStageModel();
    currentMovementStage: CurrentMovementStage = new CurrentMovementStage();
    projectRequestModel: ProjectRequestModel = new ProjectRequestModel();

    applicationSubmission: ApplicationSubmission = new ApplicationSubmission();
    meetingNotice = [
        { id: 0, name: 'DPEC MEETING NOTICE' },
        { id: 1, name: 'DPEC MEETING HELD' },
        { id: 2, name: 'DSPEC MEETING NOTICE' },
        { id: 3, name: 'DSPEC MEETING HELD' },
        { id: 4, name: 'PSC MEETING NOTICE' },
        { id: 5, name: 'PSC MEETING HELD' },
        { id: 6, name: 'PEC MEETING NOTICE' },
        { id: 7, name: 'PEC MEETING HELD' },
        { id: 8, name: 'SPEC MEETING NOTICE' },
        { id: 9, name: 'SPEC MEETING HELD' },
    ];

    workingPaperTypes = [
        { id: 0, name: 'DPEC Meeting Working Paper' },
        { id: 1, name: 'PSC Meeting Working Paper' },
        { id: 2, name: 'PEC Meeting Working Paper' },
        { id: 3, name: 'DSPEC Meeting Working Paper' },
        { id: 4, name: 'SPEC Meeting Working Paper' },
    ];

    displayedColumns: string[] = ['id', 'name', 'progress'];
    dataSource: MatTableDataSource<DashboardAttachmentDetailsModel>;
    dataSourceMovementStageAttachment: MatTableDataSource<DashboardAttachmentDetailsModel>;
    projectSummary: IProjectConcept;
    projectSummaryObj: any;
    chartOptions: Partial<ChartOptions>;
    frmGroup: FormGroup;
    obserbationFrmGroup: FormGroup;
    termOfRef: FormGroup;
    file: File;
    title: any;
    pcId: any;
    id: number;
    uuid: string;
    objectiveAndCostUuid: string;

    titleEn: string;
    titleBn: string;
    commencementDate: string;
    completionDate: string;
    dppMasterId: number;
    projectConceptId: number;
    tappMasterId: number;
    currentStage: string;
    isReturnToAgencyDesk: boolean = false;
    isReturnToAgencyHead: boolean = false;
    showButtonSendToNothi: boolean = false;
    enableNothiButtonMOFAndAnnexure5BDataIsEqual: boolean = false;
    isForwardToMinistryHead: boolean = false;
    isForwardToMinistryDesk: boolean = false;
    isForwardToPlanningHead: boolean = false;
    isForwardToPlanningDesk: boolean = false;
    isSendToPlanningHead: boolean = false;
    isForwardToPlanningMinister: boolean = false;
    isForwardToPlanningMinisterForPlanHead: boolean = false;
    isReturnToMinistryHead: boolean = false;
    isForwardToEcnec: boolean = false;
    isInPlanningMinister: boolean = false;
    isInEcnec: boolean = false;
    isEcnecHead: boolean = false;

    isInProjectScrutinyCommitteeNotice = false;
    isInProjectScrutinyCommitteeHeld = false;
    isInDpecMeetingNotice = false;
    isInDpecMeetingHeld = false;
    isInDspecMeetingNotice = false;
    isInDspecMeetingHeld = false;
    isInUnderExamine = false;
    isInpecMeetingNotice = false;
    isInpecMeetingHeld = false;

    isDownloadMeetingAttachment = false;

    isRelatedMeetingAttachments = false;

    isPotroJariAttach = false;
    isPotroJariAttachMinistry = false;
    isPotroJariAttachPlancomm = false;
    isMinistryPotroJariAttached: boolean = false;

    isDownloadGO = false;

    isPscNotice: boolean = false;
    isPscWorkingPaper: boolean = false;

    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    meetingAttachment = {};
    assignedDeskOfficer: any;
    showAssignedDeskOfficer: boolean = false;

    userGroupModel: any;
    sector: SectorModel;
    subSector: SubSectorModel;
    sectorDivision: SectorDivisionModel;
    agencyModel: any;

    isLoading: boolean | false;

    movementStatusList = [];
    projectStatus: string;
    projectStage: string;
    nothiStatus = 'Draft';

    potroJari: boolean = false;
    potroUrl = null;
    isNoteCompletetion: boolean = false;
    manualPotroJari: boolean = false;
    totalAnnexureAmount: number = 0;

    ecnecConditionFormGroup: FormGroup;
    actionPermission = [];
    show = true;
    canEdit = true;
    objectivesAndCost: DppObjectiveCostModel | TappObjectiveCostModel;
    modelOfFinanceList = [];
    meetingType: boolean;
    setMeetingType: string;
    setWorkingPaperType: string;
    paperType: boolean;
    totalModeOfFinance: ModeOfFinanceModel = {} as ModeOfFinanceModel;
    isEcnecMeetingAssignDone: boolean = false;
    isDppPartAConcernedDivisionIdEmpty: boolean = false;
    isDppObjectiveTargetsDataEmpty: boolean = false;
    isDppAnnexure5BDataEmpty: boolean = false;
    isDppPartBDataEmpty: boolean = false;
    isDppPartADataEmpty: boolean = false;
    isDppAnnexureIDataEmpty: boolean = false;
    isDppAnnexureIIDataEmpty: boolean = false;
    isDppAnnexureIIIDataEmpty: boolean = false;

    isMinistryMeetingPaperAttached: boolean = false;
    isPlanningMeetingPaperAttached: boolean = false;
    isTappApproveInMinistry: boolean = false;
    inForwardEcnecOfficer: boolean = false;
    isForwardEcnecDeskOfficer: boolean = false;
    isConditionalApproveByEcnec: boolean = false;
    isUapproveByEcnec: boolean = false;
    isEcnecApprove: boolean = false;
    isEcnecConditionalApprovedInStage: boolean = false;
    previousEcnecConditionApproved = '';

    isTappDesignationContactPersonDataEmpty: boolean = false;
    isTappObjectiveTargetsDataEmpty: boolean = false;
    isTappResponsiblePreparation: boolean = false;
    isTappAnnexureIDataEmpty: boolean = false;
    isTappPartADataEmpty: boolean = false;
    fsReportList = [];
    fsUuid: string;
    fsAttachmentId: number;
    fsAttachmentName: string;
    fsLinkWithDppModel = new FsLinkWithDppModel();

    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    fiscalYearWiseCapitalCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];

    movementStageList: ProjectMovementStageModel[] = [];
    forwardReturnAction: string;
    daakSenderEmp: any;
    statusStage = new StatusStage();
    year: number;
    month: number;
    totalExpenseByAgency: number = 0;
    totalAllocationByAgency: number = 0;
    spinner: boolean;
    isEnLabel: boolean;
    userStatus: boolean = false;
    dppTappAoObj: any = {};
    dppTappGoObj: any = {};
    private reportIndex: number;
    termOfRefSave: boolean = true;
    termOfRefUpdate: boolean = false;
    termOfRefDownload: boolean = false;
    isTapp: boolean = false;
    isCurrentStage: boolean = false;
    locationWiseCostTotal: number = 0;
    annexureIIIaTotal: number = 0;
    annexureIIIbTotal: number = 0;
    annexureIIIcTotal: number = 0;
    attachmentList: any = [];
    isDppProjectType: boolean = false;

    isPEC: boolean = false;
    isDPEC: boolean = false;
    isSPEC: boolean = false;
    isDSPEC: boolean = false;
    isPSC: boolean = false;
    isProjectSecrutinyCommite: boolean = false;
    isPIC: boolean = false;

    isAgencyUser: boolean = false;
    userProfileInfo: any = {};
    data: any = {};
    conceptUuid = this.activatedRoute.snapshot.params['id'];
    projectTitle: any;
    masterId: number;
    fiscalYearList: any[] = [];
    modeFinanceList: any;
    tappWorkPlanList: TappWorkScheduleModel[] = [];
    tappWorkPlanReportList: TappWorkScheduleModel[] = [];

    amortizationSchedule: any;
    totalAmount: number;
    projectName: string;
    gracePeriod: any;
    loanPeriod: any;
    rtappAnnualPhasingCost:any;

    loanPeriods: Array<DppAmortizationScheduleDynamicRow> = new Array<DppAmortizationScheduleDynamicRow>();
    gracePeriods: Array<DppAmortizationScheduleDynamicRow> = new Array<DppAmortizationScheduleDynamicRow>();
    loanPortion: any;
    model: DppAmortizationSchedule = new DppAmortizationSchedule();
    gobAmount: boolean;
    totalInvestmentAmount: { dppAnnualPhasing: string; dppAnnualPhasingCostTotal: IDppPhasingCostTotal[]; grandTotal: { fiscalYear: string; dppAnnualPhasingCostTotal: IDppPhasingCostTotal; }[]; }[];
    rateOfInterest: any;
    projectDetailsPartb: any;
    getFinancialAnalysisData: any;
    similarProjectData: any;
    getEffectImpactData: any;
    getOtherImportantDetailsData: any;
    getProjectManagementSetupData: any;
    modeFinanc: any;
    goods: any;
    works: any;
    services: any;
    grandTotal: any;
    grandTotalData: any[] = [];
    projectSummaryId: number;

    locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
    locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };
    upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel, zilla: ZillaModel, division: DivisionModel }[] = [];

    fiscalYearsEn: string[] = [];
    fiscalYearsBn: string[] = [];
    revenue: any = {};
    capital: IYearWisePhysicalAndFinancialTarget;
    contingency: IYearWisePhysicalAndFinancialTarget;
    grand: IYearWisePhysicalAndFinancialTarget;
    colspan = 0;
    translate = 'en';
    yrs: any;
    yearCostSummery:any;
    userId: any = 0;
    userName: string = '';

    dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse;
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    grandTotalList: { fiscalYear: string; tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[];
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails[] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails[] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    isForeignAid: boolean;
    annexerFiveData: any;
    annexerFiveContingency: any;

    fiscalYearLists: { fiscalYear: string }[] = [];
    revenueTotalDa: IDppPhasingCostTotal;
    capitalTotalDa: IDppPhasingCostTotal;
    contingencyTotal: IDppPhasingCostTotal[];
    grantTotalDa: IDppPhasingCostTotal;
    revenueLists: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    capitalLists: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    contingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    physicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    priceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    grandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    getByProjectConcept: any;
    estimatedProjectCost: any;
    annexure5b: any;
    annex8aData:any;
    annex8bData:any;
    annex5Data:any;
    concernedDivisionList:any;
    currencyList:any;
    objectiveAndCost:any;
    fiscalYearsList: Array<{
        fiscalYear: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
        ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
    }> = [];
    projectCost = {
        gobAmount: '0',
        gobFeAmount: '0',
        paAmount: '0',
        paRpaAmount: '0',
        ownFeAmount: '0',
        ownFundAmount: '0',
        othersAmount: '0',
        otherFeAmount: '0',
        totalAmount: '0'
    };
    projectConceptMasterId: number;
    projectManagement: any;
    getLogFrame: any;
    unitTypeList: any[];
    isParipatra2016: boolean = true;
    mtbfObj: any;
    mtbfFiscalYearModelList: any;

    milliSecondsInASecond = 1000;
    hoursInADay = 24;
    minutesInAnHour = 60;
    SecondsInAMinute = 60;
    timeDifference: any;
    dppRemainingMovementTime: any;
    isEnableRemainingTimeForwardToPlanCom: boolean = false;
    isRemainingTimeExpire: boolean = false;
    secondsToDay: any;
    minutesToDay: any;
    hoursToDay: any;
    daysToDay: any;
    subscription: Subscription;
    otherDetails: any = {};
    projectAreaJustification: any;
    subTotalRevObj: IDppPhasingCostTotal;
    subTotalCapObj: IDppPhasingCostTotal;
    totalRevenueWeight: any = 0;
    totalCapitalWeight: any = 0;
    fiscalYear: string;
    tappLogFrame:any;
    indicateIssues:any;
    indicateIssuesNotWork:any;

    // tapp  report
    gobArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];

    rpaArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];

    dpaArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];

    othersArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];
    tappSupportStuffList: any;
    consultantsList: any;
    paripatraVersion: any;
    partBdata: any;
    tappFiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], tappAnnualPhasingCostTotal?: ITppPhasingCostTotal }[] = [];

    conceptid: string;
    tappRevDataObj:    any;
    tappCapDataObj: any;
    termOfReference:any;
    financingExpectation:any;

    tappPhysicalContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    tappPriceContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    tappGrandList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    totalTappCost: any;
    tappLetterOfAgreement: any;
    ecnecMeeting: any;
    ecnecMeetingObj: any;
    workingPaper = false;
    approvalDate: any;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private sectorService: SectorService,
                private stageMovementService: StageMovementService,
                private subSectorService: SubSectorService,
                private sectorDivisionService: SectorDivisionService,
                private agencyService: AgencyService,
                private locationService: DppLocationService,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
                private route: Router,
                private dppObjectiveCostService: DppObjectiveCostService,
                private tappObjectiveCostService: TappObjectiveCostService,
                private activatedRoute: ActivatedRoute,
                private dashboardAttachmentService: DashboardAttachmentService,
                private formBuilder: FormBuilder,
                private _translateService: TranslateService,
                private datePipe: DatePipe,
                public numberPipe: NumberPipe,
                private _reportDataService: ReportDataService,
                private objectiveAndCostService: DppObjectiveCostService,
                private projectDetailsPartbService: ProjectDetailsPartbService,
                private dppLocationWiseCostBreakdownService: DppLocationWiseCostBreakdownService,
                private dppProjectManagementSetupService: DppProjectManagementSetupService,
                private dppAnnexureGoodsIiiAService: DppAnnexureGoodsIiiAService,
                private classyLayoutComponent: ClassyLayoutComponent,
                private _reportCommonService: ReportCommonService,
                private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
                private dashboardService: DashboardService,
                private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
                private dateBengaliPipe: DateBengaliPipe,
                private fileUploadService: FileUploadService,
                private projectMovementService: ProjectMovementService,
                private userGroupService: UserGroupService,
                private userService: UserProfileService,
                private feedbackMovementService: FeedbackMovementService,
                private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
                private userProfileService: UserProfileService,
                private feasibilityStudySummaryService: FeasibilityStudySummaryService,
                private nothiUserService: NothiUserService,
                private dppTappGoService: DppTappGoService,
                private assignMeetingService: AssingEcnecMeetingService,
                private layoutHelperService: LayoutHelperService,
                private projectSummariesService: ProjectSummariesService,
                private tappWorkScheduleService: TappWorkScheduleService,
                private service: DppAmortizationScheduleService,
                private _financialAnalysisService: FinancialAnalysisService,
                private similarProjectStudyService: SimilarProjectStudyService,
                private _effectImpactService: EffectImpactService,
                private otherDetailsService: OtherDetailsService,
                private otherImportantDetailsService: OtherImportantDetailsService,
                private annxGoodService: DppAnnexureGoodsIiiAService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private logFrameService: DppLogFrameService,
                private projectManagementService: DppProjectManagementService,
                private unitTypeService: UnitTypeService,
                private reportGenerateService: ReportGenerateService,
                private dppMtbfService: MtbfService,
                private tappAnnexureGoodsService: TappAnnexureGoodsService,
                // tapp
                private tapp_service: TappQualificationSupportStuffService,
                private consultantService: TappConsultantService,
                private tappProjectDetailsService: TappProjectDetailsService,
                private tappTermOfReferenceService: TermOfReferenceService,
                private tppAnnexureFiveService: TppAnnexureFiveService,
                private tappFinancingAndExpectationService: TappFinancingAndExpectationService,
                private tappLogFrameService: TappLogFrameService,
                private tappYearCostSummeryService: TappYearCostSummeryService,
                private currencyService: CurrencyService,
                private tppAnnexureSevenService: TppAnnexureSavenService,
                private dppTappService: DppTappService,
                private dppObjectivesService : DppObjectiveCostService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userService.getUserProfileInfo().subscribe(res => {
            this.userId = res.userId;
            this.userName = res.name;
        });
    }

    ngOnInit(): void {
        let url_string = window.location.href;
        let url = new URL(url_string);
        this.conceptid = url.searchParams.get("id");
        this.uuid = url.searchParams.get("id");
        let storeSessionId = url.searchParams.get("p");
        if(storeSessionId) {
            this.route.navigateByUrl('/dpp-tapp/public-dashboard?id='+this.conceptid);
        }

        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
        });
        this.obserbationFrmGroup = this.formBuilder.group({
            obserbations: [''],
            attachmentId: ['']
        });
        this.termOfRef = this.formBuilder.group({
            uuid: [''],
            reportIndex: [''],
            pcUuid: [''],
            termOfReference: ['', Validators.required]
        });
        this.actionPermission = lngEnglishAction.data.ACTION;
        if (this.actionPermission == null)
            this.callActionSubject();
        else
            this.show = false;
        this.getUserGroup();
        this.getProjectSummary();
        this.isAssignEcnecMeetingDone();
        // this.getTappProjectByPcUuid();
        // this.getGrandAll();
    }

    isAssignEcnecMeetingDone(): any {
        this.assignMeetingService.findByPcUuid(this.uuid).subscribe(res => {
            if (res == null) {
                this.isEcnecMeetingAssignDone = false;
            } else {
                this.isEcnecMeetingAssignDone = true;
                this.ecnecMeetingObj = res.ecnecMeeting;
            }
        });
    }

    getTotalExpenseByAgency(agencyId) {
        this.dashboardService.getGrandTotalByProjectConceptIdList(agencyId).subscribe(res => {
            this.totalExpenseByAgency = res;
            this.spinner = false;
        });
    }

    callActionSubject() {
        this.classyLayoutComponent.actionData.subscribe(res => {
            this.show = res;
            this.actionPermission = lngEnglishAction.data.ACTION;
        })
    }

    getUserGroupByUserId() {
        this.userGroupService.getUserGroupByUserId().subscribe(res => {
            this.userGroupModel = res;
        });
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
            this.totalAllocationByAgency = res.ceilingAmount ? res.ceilingAmount : 0;
        })
    }

    getProjectSummary() {
        this.spinner = true;
        this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
            this.projectSummary = res;
            this.isParipatra2016 = res?.isParipatra2016;

            if ((this.nothiStatus === 'Draft')) {
                this.nothiStatus = res?.isForeignAid ? 'Draft' : 'খসড়া';
            }
            this._translateService.use(res.isForeignAid ? 'en' : 'bn');
            this.isEnLabel = this._translateService.currentLang === 'en';
            if (!this.isEnLabel) {
                this.layoutHelperService.setLanguageEvent('bn');
                this.layoutHelperService.changeNavLanguage('bn');
            }
            else {
                this.layoutHelperService.changeNavLanguage('en');
            }

            if (res.isForeignAid) {
                this._translateService.use('en');
            } else {
                this._translateService.use('bn');
            }

            this.titleEn = res.titleEn;
            this.titleBn = res.titleBn;
            this.commencementDate = this.datePipe.transform(res.expCommencementDate, 'dd/MM/yyyy');
            this.completionDate = this.datePipe.transform(res.expCompletionDate, 'dd/MM/yyyy');
            this.id = res.id;
            this.getAgency();
            this.getTotalExpenseByAgency(res.agencyId);
            if (res.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
                this.isDppProjectType = true;
                this.getDppObjectiveCostByPcUuid()
            } else {
                this.getTappObjectiveCostByPcUuid();
            }
            this.getGrandTotal(res.id, res);
            this.getListDashboardAttachment();
            this.getSector(res);
            this.getSubSector(res);
            this.getSectorDivision(res);
            this.checkUserCanEdit();
            this.getUserGroupByUserId();
            const diffDays = (startDate, endDate) => Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
            const totalDays: number = diffDays(new Date(res.expCommencementDate), new Date(res.expCompletionDate));
            this.year = Math.floor(totalDays / 365);
            this.month = Math.floor((totalDays % 365) / 30);
            this.showHideCommitInformation();
            this.isAgencyUpdate();
            if (res.id > 0) {
                this.annexure5bData(res.id);
            }
        }, error => this.spinner = false);
    }

    getProjectMovementAttachmentByDppUuid(id) {
        this.projectMovementService.getProjectMovementAttachmentByDppUuid(id, this.pageProjectMovement, this.sizeProjectMovement).subscribe(res => {
            this.dataSourceMovementStageAttachment = new MatTableDataSource(res.content);
            this.totalProjectMovement = res.totalElements;
        });
    }

    private getSector(concept: IProjectConcept) {
        this.sectorService.getById(concept.sectorId).subscribe(res => {
            this.sector = res;
        })
    }

    private getSubSector(concept: IProjectConcept) {
        this.subSectorService.getById(concept.subSectorId).subscribe(res => {
            this.subSector = res;
        })
    }

    private getSectorDivision(concept: IProjectConcept) {
        this.sectorDivisionService.getById(concept.sectorDivisionId).subscribe(res => {
            this.sectorDivision = res;
        })
    }

    private getDppGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            this.totalInvestmentAmount = res;
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.totalAmountAnnexure5B = Number(total[0].gobAmount.toFixed(2)), Number(total[0].gobThruAmount.toFixed(2)) + Number(total[0].spAcAmount.toFixed(2)) + Number(total[0].thruDpAmount.toFixed(2)) + Number(total[0].thruPdAmount.toFixed(2)), Number(total[0].ownFundAmount.toFixed(2)), Number(total[0].otherAmount.toFixed(2));
                this.financialInfoApexChart(Number(total[0].gobAmount.toFixed(2)), Number(total[0].gobThruAmount.toFixed(2)) + Number(total[0].spAcAmount.toFixed(2)) + Number(total[0].thruDpAmount.toFixed(2)) + Number(total[0].thruPdAmount.toFixed(2)), Number(total[0].ownFundAmount.toFixed(2)), Number(total[0].otherAmount.toFixed(2)));
            } else {
                this.financialInfoApexChart(projectConcept.gobAmount, projectConcept.paAmount, projectConcept.ownFundAmount, projectConcept.otherAmount);
                this.totalAmountAnnexure5B = projectConcept.gobAmount + projectConcept.paAmount + projectConcept.ownFundAmount + projectConcept.otherAmount;
            }
        });
    }

    private getTappGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {

            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                let totalObj = total[0];
                this.grandTotalList = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.grandTotal)[0];
                this.totalTappCost = totalObj;
                let gobAmtPercentage = (totalObj.gobAmount / totalObj.totalAmount) * 100;
                if (totalObj.totalAmount <= 1000 && gobAmtPercentage <= 30 && (this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
                    this.isTappApproveInMinistry = true;
                }
                this.financialInfoApexChart(total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount);
            } else {
                this.financialInfoApexChart(projectConcept.gobAmount, projectConcept.paAmount, projectConcept.ownFundAmount, projectConcept.otherAmount);
            }
        });
    }

    private getGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? this.getDppGrandTotal(conceptId, projectConcept) : this.getTappGrandTotal(conceptId, projectConcept);
    }

    private getDppObjectiveCostByPcUuid() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.uuid).subscribe(res => {
                if (res == null) {
                    this.isDppPartADataEmpty = true;
                }
                if (res != null) {
                    this.fsAttachmentName = res.fsAttachmentName;
                    this.objectiveAndCostUuid = res.uuid;
                    this.objectivesAndCost = res;
                    this.setProjectInfoTitleAndDate(res);
                    this.loadMovementStatus();
                    this.loadDppMasterId();
                    this.getTotalModeData(res);
                    this.getAllStageByMasterId('DPP', res.dppMasterId);
                    if (res.fsUuid) {
                        this.getAllFsReport(res.fsUuid);
                    }
                }
                /*
                * Check Dpp Part A, Part B, Annexure 5B, I, II ,II Data For validation
                */
                this.checkDppPartAData(res);
                this.checkDpp5BData();
                this.checkDppAnnexureIData();
                this.checkDppAnnexureIIData();
                this.checkDppAnnexureIIIData();
                this.checkDppPartBProjectDetails();
            }
        );
    }

    getAllStageByMasterId(source, id) {
        this.stageMovementService.getAllStageByMasterId(source, id).subscribe(res => {
            this.movementStageList = res;
            this.isEcnecConditionalApprovedInStage = this.movementStageList.find(m => m.currentStage == ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE) ? true : false;
            this.movementStageList.forEach(e => {
                let time = e.movementTime.split(':');
                e.currentStage = e.currentStage ? (this.isEnLabel ? (e.currentStage).toString().replace('_', ' ') : this.statusStage.getProjectStatus(e.currentStage)) : (this.isEnLabel ? 'AGENCY DESK' : 'এজেন্সী এর ডেস্ক');
                e.movementTime = this.isEnLabel ? (Number(time[0]) > 12 ? (Number(time[0] - 12) + '.' + time[1] + ' PM') : (Number(time[0]) + '.' + time[1] + ' AM')) :
                    (Number(time[0]) > 12 ? (this.numberPipe.convertToBanglaNumber(Number(time[0] - 12)) + '.' + this.numberPipe.convertToBanglaNumber(time[1]) + ' পি .এম') : (this.numberPipe.convertToBanglaNumber(Number(time[0])) + '.' + this.numberPipe.convertToBanglaNumber(time[1]) + ' এ.এম'));
            });

            if (this.isEcnecConditionalApprovedInStage) {
                this.previousEcnecConditionApproved = this.isEnLabel ? 'ECNEC Conditionally approved' : '** একনেক এ শর্তসাপেক্ষে অনুমোদিত **';
            }
        })
    }

    private setProjectInfoTitleAndDate(res) {
        this.titleEn = res.projectTitleEn ? res.projectTitleEn : this.projectSummary.titleEn;
        this.titleBn = res.projectTitleBn ? res.projectTitleBn : this.projectSummary.titleBn;
        this.commencementDate = res.dateCommencement ? this.datePipe.transform(res.dateCommencement, DATE_ENG_FORMAT) : this.commencementDate;
        this.completionDate = res.dateCompletion ? this.datePipe.transform(res.dateCompletion, DATE_ENG_FORMAT) : this.completionDate;
    }

    private getTappObjectiveCostByPcUuid() {

        this.isTapp = true;
        this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.uuid).subscribe(res => {
                if (res == null) {
                    this.isTappPartADataEmpty = true;
                }
                if (res != null) {
                    this.objectiveAndCostUuid = res.uuid;
                    this.objectivesAndCost = res;
                    this.setProjectInfoTitleAndDate(res);
                    this.loadMovementStatus();
                    this.loadTppMasterId();
                }

                /*
               * Check Tapp Data For validation
               */
                this.checkTappAnnexureIData();
                this.checkTappPartAData(res);
            }
        );
    }

    private financialInfoApexChart(gobAmount, paAmount, ownFundAmount, otherAmount) {
        gobAmount = Number(gobAmount.toFixed(2));
        paAmount = Number(paAmount.toFixed(2));
        ownFundAmount = Number(ownFundAmount.toFixed(2));
        otherAmount = Number(otherAmount.toFixed(2));
        this.totalAnnexureAmount = Number(gobAmount + paAmount + ownFundAmount + otherAmount);
        const totalCost = (this.projectSummary.isForeignAid)
            ? ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) :
            // (!this.projectSummary.isForeignAid && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') ? ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) :
            this.convertToBanglaNumber((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2));

        this.chartOptions = {
            series: this.projectSummary.isForeignAid ? [gobAmount, paAmount, ownFundAmount, otherAmount] : [gobAmount, ownFundAmount, otherAmount],
            chart: {
                type: "pie",
                width: 350,
                height: 350
            },
            colors: this.projectSummary.isForeignAid ? ["#adc5e4", "#03bcd0", "#f7ba16", "#b4ce39"] : ['#74bfe8', '#c0ca33', '#9a73bf'],
            labels: this.projectSummary.isForeignAid ? ['GoB (' + gobAmount + ')', 'Project Aid (' + paAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
                // (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' && this.projectSummary.isForeignAid == false) ? ['GoB (' + gobAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
                ['জিওবি (' + this.convertToBanglaNumber(gobAmount) + ')', 'নিজস্ব অর্থ (' + this.convertToBanglaNumber(ownFundAmount) + ')', 'অন্যান্য (' + this.convertToBanglaNumber(otherAmount) + ')'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ],
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                showAlways: true,
                                show: true,
                                label: this.projectSummary.isForeignAid ? 'Total Cost' : 'মোট খরচ',
                                // this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' ? 'Total Cost' : 'মোট খরচ',
                                formatter: function (w) {
                                    return totalCost;
                                }
                            }
                        }
                    }
                }
            },
            theme: {
                palette: 'palette2'
            },
            dataLabels: {
                dropShadow: {
                    blur: 3,
                    opacity: 0.8
                }
            },
            fill: {
                type: 'pattern',
                opacity: 1,
                pattern: {
                    enabled: true,
                    style: [
                    ]
                }
            },
        };
    }

    openUrl(row: any) {
        this.fileUploadService.download(row.attachment.urlPath);
    }

    openMovementStageUrl(row: any) {
        this.fileUploadService.downloadAttachmentInDppService(row.attachment.urlPath);
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListDashboardAttachment();
    }

    onChangePageProjectMovement(event: PageEvent) {
        this.sizeProjectMovement = +event.pageSize; // get the pageSize
        this.pageProjectMovement = +event.pageIndex; // get the current page
        this.getProjectMovementAttachmentByDppUuid(this.currentMovementStage.id);
    }

    showComments(commission: 'A' | 'MD' | 'PC' | 'EC' | 'ECU' | 'PM', forward: string) {
        this.dialog.closeAll();
        let sourceId;
        let source;
        let isUnapproved = false;
        if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
            sourceId = this.objectivesAndCost.id;
            source = CommentSourceEnum.DPP
        } else {
            sourceId = this.objectivesAndCost.id;
            source = CommentSourceEnum.TAPP
        }
        if (commission === 'ECU') {
            commission = 'EC';
            isUnapproved = true;
        }
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            sourceId: this.dppMasterId ? this.dppMasterId : this.tappMasterId,
            source: source,
            commission: commission,
            userGroup: this.userGroup.groupStatus,
            forward: forward,
            projectStage: this.currentStage,
            isUnapproved: isUnapproved
        };
        const dialogRef = this.dialog.open(CommentObservationComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(result => {
            if (result) {
                if (forward === 'returnToAgencyHead') {
                    this.toAgencyHeadMovement();
                } else if (forward === 'forwardToPlanning') {
                    this.forwardToPlanningMovement('forwardToPlanning')
                } else if (forward === 'returnToMinistry') {
                    this.returnToMinistryMovement();
                } else if (forward === 'forwardToMinistryHead') {
                    this.forwardToMinistryMovement();
                    //this.notificationComponent.getUsers(NotificationEventEnum.SEND_TO_MINISTRY);
                } else if (forward === 'forwardToEcnec') {
                    this.forwardToEcnec();
                } else if (forward === 'unapprove') {
                    this.forwardToPlanningMovement('unapprove')
                }
            }
        });
    }

    sendProjectToAms() {
        this.dppTappService.sendProjectToAms(this.id).subscribe(res => {
        });
    }

    getUuidByModuleWise() {
        if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() == 'pc')
            this.applicationSubmission.projectConceptUuid = this.objectiveAndCostUuid;
        else if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() == 'fs')
            this.applicationSubmission.feasibilityUuid = this.objectiveAndCostUuid;
        else if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() == 'tapp')
            this.applicationSubmission.tappUuid = this.objectiveAndCostUuid;
        else if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() == 'rdpp')
            this.applicationSubmission.rdppUuid = this.objectiveAndCostUuid;
        else if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() == 'rtapp')
            this.applicationSubmission.rtappUuid = this.objectiveAndCostUuid;
        else
            this.applicationSubmission.dppTappUuid = this.objectiveAndCostUuid;
    }

    populateApplicationSubmissionModel() {
        this.applicationSubmission.sourceModule = this.projectSummary.projectTypeDTO.nameEn.toLowerCase();
        this.applicationSubmission.application_subject = 'Report create from send to ministry';
        this.applicationSubmission.data = new Date().toDateString();
        if (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toLowerCase() == 'dpp') {
            this.applicationSubmission.reportType = 'bn';
        } else {
            this.applicationSubmission.reportType = 'en';
        }
        this.applicationSubmission.projectConceptUuid = this.projectSummary.uuid;
        this.applicationSubmission.srcUserGroup = this.userGroup.groupStatus;
    }

    createReportVersioning() {
        this.populateApplicationSubmissionModel();
        this.getUuidByModuleWise();
        this.reportGenerateService.generateReport(this.applicationSubmission).subscribe(res => {
        });
    }

    downloadGOClick() {
        this.findByPcUuidAndOrderType();
        const dialogRef = this.dialog.open(this.callDownloadGODialog, {
            width: '450px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.frmGroup.reset();
        });
    }

    downloadRelatedInfoClick() {
        const dialogRef = this.dialog.open(this.callDownloadRelatedInfoDialog, {
            width: '450px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.frmGroup.reset();
        });
    }

    editProjectSummary() {
        this.route.navigate([`project-concept/add-project-concept/${this.uuid}`]);
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            console.log(res)
            console.log(this.userGroup)
            if (this.userGroup.groupStatus === 'AGENCY-HEAD') {
                this.userStatus = true;
            }
            if (this.userGroup.groupStatus === 'ECNEC-HEAD') {
                this.isEcnecHead = true;
            }
        });
    }

    showHideCommitInformation() {
        if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'ECNEC') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() === 'DPP') {
            this.isPEC = true;
        }
        if ((this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'ECNEC') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() === 'DPP') {
            this.isDPEC = true;
        }
        if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-MINISTER') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() === 'TAPP') {
            this.isSPEC = true;
        }
        if ((this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'MINISTRY-DESK') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() === 'TAPP') {
            this.isDSPEC = true;
        }
        if (this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'MINISTRY-DESK') {
            this.isProjectSecrutinyCommite = true;
        }
        if (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'ECNEC') {
            this.isPSC = true;
        }
        if (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'ECNEC') {
            this.isPIC = true;
        }
    }

    isAgencyUpdate() {
        if (this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK') {
            this.isAgencyUser = true
        }
    }

    setSourceOriginType(): string {
        let userGroup: string = this.userGroup.groupStatus;
        return userGroup.toString().substring(0, userGroup.indexOf('-'));
    };

    loadDppMasterId() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.uuid).subscribe(res => {
            if (res) {
                this.dppMasterId = res.dppMasterId;
                if (this.dppMasterId != null) {
                    this.getCurrentStage(this.dppMasterId, 'DPP');
                    this.getAllStageByMasterId('DPP', this.dppMasterId);
                    this.getDppRemainingTimeConditionForwardMinistryToPlanningCommission();
                }
            }
        });
    }

    loadTppMasterId() {
        this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.uuid).subscribe(res => {
            if (res) {
                this.tappMasterId = res.tappMasterId;
                if (this.tappMasterId != null) {
                    this.getCurrentStage(this.tappMasterId, 'TAPP');
                    this.getAllStageByMasterId('TAPP', this.tappMasterId);
                }
            }
        });
    }

    forwardToMinistryMovement() {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.dppMasterId != null) {
                this.projectMovementModel.dppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.tappMasterId = this.tappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.sendProjectToAms();
                this.createReportVersioning();
                this.projectStatus = this.isEnLabel ? 'MINISTRY HEAD' : 'মিনিস্ট্রি এর হেড';
                this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
                this.isForwardToMinistryHead = false;
                this.showButtonSendToNothi = false;
                if (this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Ministry successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে মন্ত্রণালয়ে প্রেরণ করা হয়েছে', 'ওকে');
                this.isDppProjectType ? this.getAllStageByMasterId('DPP', this.dppMasterId) : this.getAllStageByMasterId('TAPP', this.tappMasterId);
            });
        });
    }

    toAgencyHeadMovement() {
        this.forwardReturnAction = this.isEnLabel ? 'Return' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.dppMasterId != null) {
                this.projectMovementModel.dppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.tappMasterId = this.tappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.AGENCY_HEAD;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isReturnToAgencyHead = false;
                this.isForwardToPlanningHead = false;
                this.isForwardToMinistryDesk = false;
                this.showButtonSendToNothi = false;
                this.isRelatedMeetingAttachments = false;
                this.projectStatus = this.isEnLabel ? 'AGENCY HEAD' : 'এজেন্সী এর হেড';
                this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
                if (this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Agency successfully', 'OK')
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে এজেন্সিতে ফেরত পাঠানো হয়েছ', 'ওকে');
                this.isDppProjectType ? this.getAllStageByMasterId('DPP', this.dppMasterId) : this.getAllStageByMasterId('TAPP', this.tappMasterId);
            });
        });
    }

    returnToMinistry() {
        this.showComments("PC", 'returnToMinistry');
    }

    returnToMinistryMovement() {
        this.forwardReturnAction = this.isEnLabel ? 'Return' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.dppMasterId != null) {
                this.projectMovementModel.dppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.tappMasterId = this.tappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.showButtonSendToNothi = false;
                this.isForwardToPlanningMinister = false;
                this.isForwardToPlanningHead = false;
                this.isReturnToMinistryHead = false;
                this.projectStatus = this.isEnLabel ? 'MINISTRY HEAD' : 'মিনিস্ট্রি এর হেড';
                this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
                if (this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Ministry successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে মন্ত্রণালয়ে ফেরত পাঠানো হয়েছে', 'ওকে');
                this.isDppProjectType ? this.getAllStageByMasterId('DPP', this.dppMasterId) : this.getAllStageByMasterId('TAPP', this.tappMasterId);
            });
        });
    }

    forwardToPlanning() {
        this.showComments("MD", "forwardToPlanning");
    }

    forwardToPlanningMovement(fromAction: string) {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        if (fromAction === 'unapprove') this.forwardReturnAction = this.isEnLabel ? 'unapprove' : 'অননুমোদন করতে';
        this.openDialogProjectMovement((res) => {
            if (this.dppMasterId != null) {
                this.projectMovementModel.dppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.tappMasterId = this.tappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD;

            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isForwardToPlanningHead = false;
                this.isReturnToAgencyHead = false;
                this.showButtonSendToNothi = false;
                this.isInDpecMeetingNotice = false;
                this.isInDspecMeetingNotice = false;
                this.isInDpecMeetingHeld = false;
                this.isInDspecMeetingHeld = false;
                this.isInProjectScrutinyCommitteeNotice = false;
                this.isInProjectScrutinyCommitteeHeld = false;
                this.isRelatedMeetingAttachments = false;
                this.isForwardToMinistryDesk = false;
                this.isEcnecApprove = false;
                this.isConditionalApproveByEcnec = false;
                this.isUapproveByEcnec = false;
                this.projectStatus = this.isEnLabel ? 'PLANNING HEAD' : 'পরিকল্পনা হেড';
                this.projectStage = this.isEnLabel ? 'IN PLANNING' : 'পরিকল্পনা কমিশনে আছে';
                this.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD;
                if (this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Planning successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে পরিকল্পনা কমিশনে প্রেরণ করা হয়েছে', 'ওকে');
                this.isDppProjectType ? this.getAllStageByMasterId('DPP', this.dppMasterId) : this.getAllStageByMasterId('TAPP', this.tappMasterId);
            });
        });
    }

    forwardToEcnec() {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.dppMasterId != null) {
                this.projectMovementModel.dppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.tappMasterId = this.tappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.IN_ECNEC;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.IN_ECNEC;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isInPlanningMinister = false;
                this.isForwardToEcnec = false;
                this.isInEcnec = false;
                this.projectStatus = this.isEnLabel ? 'Forwarded to ECNEC' : 'একনেকে প্রেরণ করা হয়েছে';
                this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেকে আছে';
                if (this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to ECNEC successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে একনেকে প্রেরণ করা হয়েছে', 'ওকে');
                this.isDppProjectType ? this.getAllStageByMasterId('DPP', this.dppMasterId) : this.getAllStageByMasterId('TAPP', this.tappMasterId);
            });
        });
    }

    getCurrentStage(masterId, projectType: string) {
        this.projectMovementService.getCurrentStage(masterId, projectType).subscribe(res => {
            this.currentMovementStage = res.res;
            this.projectStatus = res.res.currentStage ? this.isEnLabel ? (res.res.currentStage).toString().replace('_', ' ') : this.statusStage.getProjectStatus(res.res.currentStage) : '';
            this.checkProjectStage(res.res.currentStage);
            this.approvalDate = res.res.movementTime;

            if (this.userGroup) {
                this.checkCurrentStage(res);
                if (this.currentMovementStage) {
                    this.getProjectMovementAttachmentByDppUuid(this.currentMovementStage.id);
                    this.getAllProjectMovementAttachment(this.currentMovementStage.id);
                }
            } else {
                this.waitToGetUserGroup((r) => {
                    this.checkCurrentStage(res);
                    if (this.currentMovementStage) {
                        this.getProjectMovementAttachmentByDppUuid(this.currentMovementStage.id);
                        this.getAllProjectMovementAttachment(this.currentMovementStage.id);
                    }
                });
            }

        });
    }

    checkProjectStage(currentStage) {
        if (currentStage === ProjectMovementStageConstant.AGENCY_DESK || currentStage === ProjectMovementStageConstant.AGENCY_HEAD) {
            this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
        } else if (currentStage === ProjectMovementStageConstant.MINISTRY_DESK || currentStage === ProjectMovementStageConstant.MINISTRY_HEAD) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage === ProjectMovementStageConstant.PLANNING_MINISTER) {
            this.projectStage = this.isEnLabel ? 'TO THE HONORABLE PLANNING MINISTER' : 'মাননীয় পরিকল্পনা মন্ত্রীর নিকট';
        } else if (currentStage === ProjectMovementStageConstant.IN_ECNEC) {
            this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেক এ আছে';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStage = this.isEnLabel ? 'APPROVED BY ECNEC' : 'একনেক দ্বারা অনুমোদিত';
        } else if (currentStage === ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStage = this.isEnLabel ? 'APPROVED BY PLANNING MINISTER' : 'মাননীয় পরিকল্পনা মন্ত্রী দ্বারা অনুমোদিত';
        } else if (currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.DPEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.DPEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.DSPEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.DSPEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.UNDER_EXAMINE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.PEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.PEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI) {
            this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_OFFICERS) {
            this.projectStage = this.isEnLabel ? 'IN ECNEC WING' : 'একনেক উইং এ আছে';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_DESK) {
            this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেক এ আছে';
        } else if (currentStage == ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.SPEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.SPEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        }
    }

    checkCurrentStage(response: any) {
        this.currentStage = response.res.currentStage;
        const currentStageUserId = response.res.userId;
        this.getMinistryPlanningForwardButton(response.res.id);
        this.getDeskOfficer(currentStageUserId);
        if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')
            && (this.projectStage === 'IN PLANNING' || this.projectStage === 'পরিকল্পনা কমিশনে আছে')) {
            this.isForwardToPlanningDesk = true;
            if (this.userGroup.groupStatus === 'PLANNING-DESK' && this.currentStage != ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
                this.isSendToPlanningHead = true;
            }
        }
        if ((this.userGroup.groupStatus == 'AGENCY-HEAD' || this.userGroup.groupStatus == 'OTHER') && (this.projectStage === 'IN AGENCY' || this.projectStage === 'সংস্থায় আছে')) {
            this.isReturnToAgencyDesk = true;
        }
        if ((this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')
            && (this.projectStage === 'IN MINISTRY' || this.projectStage === 'মন্ত্রণালয়ে আছে')) {
            this.isForwardToMinistryDesk = true;
        }
        if (this.currentStage === ProjectMovementStageConstant.AGENCY_DESK && (this.userGroup.groupStatus == 'AGENCY-DESK' || this.userGroup.groupStatus == 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isForwardToMinistryHead = true;
                this.showButtonSendToNothi = true;
                this.isPotroJariAttach = true;
            }
        } else if (this.currentStage === ProjectMovementStageConstant.AGENCY_HEAD) {
            this.projectStatus = this.isEnLabel ? "Received from Ministry/Division" : 'মন্ত্রণালয়/বিভাগ থেকে প্রাপ্ত';
            if ((this.userGroup.groupStatus == 'AGENCY-HEAD' || this.userGroup.groupStatus == 'OTHER')) {
                //this.isReturnToAgencyDesk = true;
            }

        } else if (this.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD && (this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            // this.isForwardToMinistryDesk = true;
            this.isReturnToAgencyHead = false;
            // this.isForwardToPlanningHead = true;
        } else if (this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK && (this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isReturnToAgencyHead = false;
                this.isForwardToPlanningHead = true;
                this.showButtonSendToNothi = true;
                this.isInProjectScrutinyCommitteeNotice = true;
                // this.isForwardToMinistryDesk = true;
                //this.isPotroJariAttach = true;
                if (!this.isEcnecConditionalApprovedInStage)
                    this.isRelatedMeetingAttachments = true;
                if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' || 'ডিপিপি') {
                    this.isInDpecMeetingNotice = true;
                } else if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') {
                    this.isInDspecMeetingNotice = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            this.projectStatus = this.isEnLabel ? "Forwarded to Planning Commission" : 'পরিকল্পনা কমিশনে প্রেরণ করা হয়েছে';
            if (response.res.previousStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK) {
                this.projectStatus = this.isEnLabel ? "PLANNING HEAD" : "পরিকল্পনা হেড";
                if (this.userGroup.groupStatus === 'PLANNING-HEAD') {
                    this.isReturnToMinistryHead = true;
                    this.isForwardToPlanningMinisterForPlanHead = true;
                }
            } else if (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER') {
                this.projectStatus = this.isEnLabel ? "Received from Ministry/Division" : 'মন্ত্রণালয়/বিভাগ থেকে প্রাপ্ত';
                // this.isForwardToPlanningDesk = true;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK) {
            if (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER') {
                if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
                    if (currentStageUserId === this.userGroup.userId) {
                        this.isForwardToPlanningMinister = true;
                        this.isReturnToMinistryHead = true;
                        this.showButtonSendToNothi = true;
                        this.isInpecMeetingNotice = true;
                        this.isInUnderExamine = true;
                        if (!this.isEcnecConditionalApprovedInStage)
                            this.isRelatedMeetingAttachments = true;
                    }
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER && (this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInPlanningMinister = true;
            if (this.totalAmountAnnexure5B >= 5000) {
                this.isForwardToEcnec = true;
                this.isInPlanningMinister = false;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.IN_ECNEC && (this.userGroup.groupStatus === 'ECNEC-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInEcnec = true;
            this.inForwardEcnecOfficer = true;
            this.isEcnecApprove = false;
        } else if (this.currentStage == ProjectMovementStageConstant.ECNEC_OFFICERS && this.userGroup.groupStatus === 'OTHER') {
            if (this.userGroup.groupStatus === 'ECNEC-OFFICER') {
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardEcnecDeskOfficer = true;
                    this.projectStatus = this.isEnLabel ? "ECNEC Officer Assigned" : 'একনেক অফিসার';
                }
            }
            else {
                this.projectStatus = this.isEnLabel ? "ECNEC Officer Assigned" : 'একনেক অফিসার';
            }

        } else if (this.currentStage == ProjectMovementStageConstant.ECNEC_DESK && this.userGroup.groupStatus === 'OTHER') {
            if (this.userGroup.groupStatus === 'ECNEC-DESK') {
                this.getDeskOfficer(currentStageUserId);
                if (currentStageUserId === this.userGroup.userId) {
                    this.isConditionalApproveByEcnec = true;
                    this.isUapproveByEcnec = true;
                    this.isEcnecApprove = true;
                    this.projectStatus = this.isEnLabel ? "ECNEC Desk Officer Assigned" : 'একনেক ডেস্ক অফিসার';
                }
            }
            else {
                this.projectStatus = this.isEnLabel ? "ECNEC Desk Officer Assigned" : 'একনেক ডেস্ক অফিসার';
                if (this.userGroup.groupStatus === 'ECNEC-HEAD') {
                    this.isConditionalApproveByEcnec = false;
                    this.isUapproveByEcnec = false;
                    this.isEcnecApprove = false;
                }
            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStatus = this.isEnLabel ? "APPROVED" : 'অনুমোদিত';
            this.isDownloadGO = true;
        } else if (this.currentStage == ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStatus = this.isEnLabel ? "ECNEC APPROVED" : 'একনেক অনুমোদিত';
            this.isDownloadGO = true;
        } else if (this.currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE) {
            this.projectStatus = this.isEnLabel ? "Awaiting for Project Scrutiny Committee Meeting" : 'প্রজেক্ট স্ক্রুটিনি কমিটি এর মিটিং এর জন্য অপেক্ষমান';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'MINISTRY-HEAD')) {
                // this.isReturnToAgencyHead = true;
                this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    this.showButtonSendToNothi = true;
                    this.isDownloadMeetingAttachment = true;
                    this.isInDpecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;

                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD) {
            this.projectStatus = this.isEnLabel ? "Project Scrutiny Committee Meeting Held" : 'প্রজেক্ট স্ক্রুটিনি কমিটি এর মিটিং অনুষ্ঠিত';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'MINISTRY-HEAD')) {
                // this.isReturnToAgencyHead = true;
                // this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    // this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isDownloadMeetingAttachment = true;
                    this.isInDpecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.DPEC_MEETING_NOTICE) {
            this.projectStatus = this.isEnLabel ? "Awaiting for DPEC Meeting" : 'ডিপিইসি এর মিটিং এর জন্য অপেক্ষমান';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'MINISTRY-HEAD')) {
                // this.isReturnToAgencyHead = true;
                // this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    // this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isDownloadMeetingAttachment = true;
                    this.isInDpecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.DPEC_MEETING_HELD) {
            this.projectStatus = this.isEnLabel ? "DPEC Meeting Held" : 'ডিপিইসি এর মিটিং অনুষ্ঠিত';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'MINISTRY-HEAD')) {
                // this.isReturnToAgencyHead = true;
                // this.isForwardToPlanningHead = true;
                if ((this.userGroup.groupStatus === 'MINISTRY-DESK')) {
                    // this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isInDpecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.DSPEC_MEETING_NOTICE) {
            this.projectStatus = this.isEnLabel ? "Awaiting for DSPEC Meeting" : 'ডিএসপিইসি এর মিটিং এর জন্য অপেক্ষমান';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'MINISTRY-HEAD')) {
                // this.isReturnToAgencyHead = true;
                // this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    // this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isDownloadMeetingAttachment = true;
                    this.isInDspecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }

        } else if (this.currentStage == ProjectMovementStageConstant.DSPEC_MEETING_HELD) {
            this.projectStatus = this.isEnLabel ? "DSPEC Meeting Held" : 'ডিপিইসি এর মিটিং অনুষ্ঠিত';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'MINISTRY-HEAD')) {
                // this.isReturnToAgencyHead = true;
                // this.isForwardToPlanningHead = true;
                if ((this.userGroup.groupStatus === 'MINISTRY-DESK')) {
                    // this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isInDspecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.UNDER_EXAMINE) {
            this.projectStatus = this.isEnLabel ? "UNDER EXAMINE" : 'পরীক্ষাধীন';
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
                this.isReturnToMinistryHead = true;
                //this.isForwardToPlanningMinister = true;
                this.showButtonSendToNothi = true;
                this.isInpecMeetingNotice = true;
                this.isRelatedMeetingAttachments = true;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PEC_MEETING_NOTICE) {
            this.projectStatus = this.isEnLabel ? "PEC Meeting Notice" : 'পিইসি এর মিটিং নোটিশ';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
                if (currentStageUserId === this.userGroup.userId) {
                    this.isReturnToMinistryHead = true;
                    //this.isForwardToPlanningMinister = true;
                    this.showButtonSendToNothi = true;
                    this.isInpecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PEC_MEETING_HELD) {
            this.projectStatus = this.isEnLabel ? "PEC Meeting Held" : 'পিইসি এর মিটিং অনুষ্ঠিত';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'PLANNING-HEAD')) {
                if (this.userGroup.groupStatus === 'PLANNING-DESK') {
                    if (currentStageUserId === this.userGroup.userId) {
                        this.isReturnToMinistryHead = true;
                        this.isForwardToPlanningMinister = true;
                        this.showButtonSendToNothi = true;
                        this.isRelatedMeetingAttachments = true;
                    }
                }
                else {
                    this.isReturnToMinistryHead = true;
                    this.isForwardToPlanningMinister = true;
                }

            }
        } else if (this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI) {
            this.projectStatus = this.isEnLabel ? "Potro Jari Attached" : 'পত্র জারি সংযুক্ত করা হয়েছে';
            this.getMeetingAttachment(response.res.id);
            if (currentStageUserId === this.userGroup.userId || this.userGroup.groupStatus == 'AGENCY-HEAD') {
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardToMinistryHead = true;
                    this.showButtonSendToNothi = false;
                    this.manualPotroJari = true;
                } else {
                    this.isForwardToMinistryHead = true;
                    this.manualPotroJari = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY) {
            this.projectStatus = this.isEnLabel ? "Potro Jari Attached" : 'পত্র জারি সংযুক্ত করা হয়েছে';
            this.getMeetingAttachment(response.res.id);
            if (currentStageUserId === this.userGroup.userId || this.userGroup.groupStatus == 'MINISTRY-DESK') {
                this.isMinistryPotroJariAttached = true;
                this.isReturnToAgencyHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    this.isRelatedMeetingAttachments = true;
                    this.isForwardToPlanningHead = true;
                    // this.isReturnToAgencyHead = true;
                } else {
                    this.manualPotroJari = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM) {
            this.projectStatus = this.isEnLabel ? "Potro Jari Attached" : 'পত্র জারি সংযুক্ত করা হয়েছে';
            this.getMeetingAttachment(response.res.id);
            if (currentStageUserId === this.userGroup.userId || this.userGroup.groupStatus == 'PLANNING-DESK') {
                if (currentStageUserId === this.userGroup.userId) {
                    this.isRelatedMeetingAttachments = true;
                    this.isReturnToMinistryHead = true;
                } else {
                    this.manualPotroJari = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE) {
            this.projectStatus = this.isEnLabel ? "Conditionally Approved in ECNEC" : 'শর্তসাপেক্ষে অনুমোদন করা হয়েছে ';
            if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
                this.projectStatus = this.isEnLabel ? "Conditionally Approved in ECNEC" : 'শর্তসাপেক্ষে অনুমোদন করা হয়েছে ';
                // this.isForwardToPlanningDesk = true;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC) {
            this.projectStatus = this.isEnLabel ? "Uapproved in ECNEC" : 'একনেকে অননুমোদিত';
            if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
                this.projectStatus = this.isEnLabel ? "Uapproved in ECNEC" : 'একনেকে অননুমোদিত';
                // .isForwardToPlanningDesk = true;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.SPEC_MEETING_NOTICE) {
            this.projectStatus = this.isEnLabel ? "SPEC Meeting Notice" : 'এসপিইসি এর মিটিং নোটিশ';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
                if (currentStageUserId === this.userGroup.userId) {
                    this.isReturnToMinistryHead = true;
                    //this.isForwardToPlanningMinister = true;
                    this.showButtonSendToNothi = true;
                    this.isInpecMeetingHeld = true;
                    this.isRelatedMeetingAttachments = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.SPEC_MEETING_HELD) {
            this.projectStatus = this.isEnLabel ? "SPEC Meeting Held" : 'এসপিইসি এর মিটিং অনুষ্ঠিত';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'PLANNING-HEAD')) {
                if (this.userGroup.groupStatus === 'PLANNING-DESK') {
                    if (currentStageUserId === this.userGroup.userId) {
                        this.isReturnToMinistryHead = true;
                        this.isForwardToPlanningMinister = true;
                        this.showButtonSendToNothi = true;
                        this.isRelatedMeetingAttachments = true;
                    }
                }
                else {
                    this.isReturnToMinistryHead = true;
                    this.isForwardToPlanningMinister = true;
                }
            }
        }
    }

    getDeskOfficer(currentStageUserId: any) {
        this.userProfileService.getUserById(currentStageUserId).subscribe(res => {
            this.assignedDeskOfficer = res;
            if (this.currentStage == ProjectMovementStageConstant.AGENCY_DESK || this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK
                || this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || this.currentStage == ProjectMovementStageConstant.IN_ECNEC
                || this.currentStage == ProjectMovementStageConstant.ECNEC_DESK) {
                this.showAssignedDeskOfficer = true;
            }
        });
    }

    getMeetingAttachment(ProjectMovementStageId) {
        this.projectMovementService.getProjectMovementAttachment(ProjectMovementStageId).subscribe(res => {
            if (res) {
                this.isDownloadMeetingAttachment = true;
                this.meetingAttachment = res;
            }
        });
    }

    waitToGetUserGroup(callBack) {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            callBack(true);
        })
    }

    getMinistryPlanningForwardButton(currentMovementStageId) {
        if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            this.isPlanningMeetingPaperAttached = true;
        }
        if (this.isEcnecConditionalApprovedInStage) {
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup?.groupStatus === 'MINISTRY-HEAD')) {
                this.isMinistryMeetingPaperAttached = true;
            }
        } else {
            this.projectMovementService.checkUpMovementForDpp(currentMovementStageId, this.dppMasterId).subscribe(res => {
                if (res?.res?.status) {
                    if (res.res.stage == 'ministry') {
                        this.isMinistryMeetingPaperAttached = true;
                        /// this.isReturnToAgencyDesk = true;
                    }
                }
            });
        }
    }

    loadMovementStatus() {
        let dpp_uuid: string, tapp_uuid: string;
        this.projectSummary.projectTypeDTO.nameBn.toUpperCase() == 'DPP' || 'ডিপিপি' ? dpp_uuid = this.objectiveAndCostUuid : tapp_uuid = this.objectiveAndCostUuid;
        let srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById("AGENCY", null, null, dpp_uuid, tapp_uuid).subscribe(res => {
            if (res.message == 'Got Feedback') {
                this.movementStatusList = res.result;
                if (res.result[0].nothi_message != null) {
                    this.nothiStatus = res.result[0].nothi_message;
                } else if (res.result[0].decision_note != null) {
                    this.nothiStatus = res.result[0].decision_note;
                }
            } else if (res.message == 'No Feedback')
                this.nothiStatus = this.isEnLabel ? 'Submitted as a Daak to E-Nothi' : 'ই-নথিতে ডাক জমা দেওয়া হয়েছে';
            else if (res.message == 'Daak is not submitted')
                this.nothiStatus = this.nothiStatus;
            else
                this.nothiStatus = this.isEnLabel ? 'AGENCY' : 'এজেন্সী';

            //potro jari
            if (res.result[0].nothi_action == 4) {
                this.potroJari = true;
                this.potroUrl = res.result[0].potro_url;
            }
            //note
            if (res.result[0].nothi_action == 3) {
                this.isNoteCompletetion = true;
            }
        });
        this.feedbackMovementService.getDaakSubmission(srcUserGroup, null, null, dpp_uuid, tapp_uuid).subscribe(res => {
            const empId = res.senderEmpId;
            this.nothiUserService.getNothiUserByNothiDaakSender(empId).subscribe(res2 => {
                this.daakSenderEmp = res2.name;
            })
        })
    }

    downloadMeetingAttachment(urlPath) {
        this.fileUploadService.downloadAttachmentInDppService(urlPath);
    }

    closeReportDownloadDialog() {
        this.dialog.closeAll();
    }

    // for 1 a
    getTappAnn_One_a() {
        this.subscribe$.add(
            this.tappAnnualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
                res.dppAnnualPhasingCostDTOList.forEach(e => {
                    if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                        this.revenueList = e.estimatedCostTabDetailsDTOS;
                        this.revenueTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                        this.capitalList = e.estimatedCostTabDetailsDTOS;
                        this.capitalTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                        this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                        this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                    }
                });
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            })
        );
    }

    downloadTappAnnexureOne_a_PhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            this.download_tappAnnexurei_a_PDF('Annexure-I(a) ', 'tapp/annexure1a_22');
            this.isLoading = false;
        }, 2000);
        this.getTappAnn_One_a();
    }

    download_tappAnnexurei_a_PDF($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';

        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // for 1 b
    getTappGrandAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(pc => this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pc.id).pipe(
                    map(gt => ({ pc: pc, gt: gt }))
                ))
            ).subscribe(res => {
                const length = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.length;
                if (length > 0) {
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.forEach((e, i) => {
                        if (i < (length / 2)) {
                            this.tappPhysicalContingencyList.push(e);
                        } else {
                            this.tappPriceContingencyList.push(e);
                        }
                    });
                }
                this.tappGrandList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.show = false;
            })
        );
    }

    getTappAnnOne_B_RevenueFicalYearData() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptid).pipe(
                switchMap(ps => this.tappAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        projectConceptId: ps.id,
                        componentName: DppAnnualPhasingConstant.Revenue_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.tappRevDataObj = res;
                this.conceptId = res.ps.id;
                if (res.dapc) {
                    this.tappFiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                    this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                } else {
                    (err) => {
                        this.snackbarHelper.openWarnSnackBarWithMessage(
                            'Report Not Found !',
                            'OK'
                        );
                        console.log(err);
                        this.isLoading = false;
                    }
                }
            })
        );
    }

    getTappAnnOne_B_CapitalFicalYearData() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptid).pipe(
                switchMap(ps => this.tappAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        projectConceptId: ps.id,
                        componentName: DppAnnualPhasingConstant.Capital_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.tappCapDataObj = res;
                this.conceptId = res.ps.id;
                if (res.dapc) {
                    this.tappFiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                    this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                } else {
                    (err) => {
                        this.snackbarHelper.openWarnSnackBarWithMessage(
                            'Report Not Found !',
                            'OK'
                        );
                        console.log(err);
                        this.isLoading = false;
                    }
                }
            })
        );
    }

    downloadTappAnnexureOne_b_PhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            this.download_tappAnnexurei_b_PDF('Annexure-I(b) ', 'tapp/annexure1b_22');
            this.isLoading = false;
        }, 5000);
        this.getTappAnnOne_B_RevenueFicalYearData();
        this.getTappAnnOne_B_CapitalFicalYearData();
        this.getTappAnn_One_a();
        this.getTappGrandAll();
        this.getGrandAll();
    }

    download_tappAnnexurei_b_PDF($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';

        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['agency'] = JSON.stringify(this.agencyModel);

        this.data['tappRevDataObj'] = JSON.stringify(this.tappRevDataObj);
        this.data['tappCapDataObj'] = JSON.stringify(this.tappCapDataObj);
        this.data['fiscalYearList'] = JSON.stringify(this.fiscalYearList);

        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);

        this.data['tappPhysicalContingencyList'] = JSON.stringify(this.tappPhysicalContingencyList);
        this.data['tappPriceContingencyList'] = JSON.stringify(this.tappPriceContingencyList);
        this.data['tappGrandList'] = JSON.stringify(this.tappGrandList);

        this.data['grantTotal'] = JSON.stringify(this.grantTotal);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // part B
    getPartB_Data() {
        this.tappProjectDetailsService.getProjectDetails(this.uuid).subscribe((response) => {
            this.partBdata = response;
        })
    }

    downloadTapp_AnnexurePart_B_PhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            this.download_tappPartB_PDF('Part B', 'tapp/Part_B_Report_22');
            this.isLoading = false;
        }, 2000);
        this.getPartB_Data();
    }

    download_tappPartB_PDF($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';

        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['partBdata'] = JSON.stringify(this.partBdata);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // 3
    getTappAnnexureThree(){
        this.consultantService.getTappAnnexureThree(this.conceptUuid).subscribe((res) => {
            this.consultantsList = res;
        })
    }

    downloadAnnexureThree_PhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            this.download_tappAnnexureThree_PDF('Annexure-III ', 'tapp/annexure3_22');
            this.isLoading = false;
        }, 2000);
        this.getTappAnnexureThree();
    }

    download_tappAnnexureThree_PDF($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';

        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['consultantsList'] = JSON.stringify(this.consultantsList);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // for 6
    getSupportStuff(){
        this.tapp_service.getSupportStuff(this.conceptUuid).subscribe((response) =>{
            this.tappSupportStuffList = response;
            let res = response.res;
            this.uuid = res.uuid;
            if (res.tappSupportStuffList != null) {
                if (res.tappSupportStuffList.length > 0) {
                    res.tappSupportStuffList.forEach(re => {
                        if (re.type === "GOB") {
                            this.gobArr.push(
                                {
                                    designation: re.designation,
                                    educationalQualification: re.educationalQualification,
                                    experience: re.experience,
                                    taskPerformed: re.taskPerformed,
                                    projectConceptMasterId: re.projectConceptMasterId,
                                    remarks: re.remarks,
                                    type: re.type
                                }
                            )
                        }
                        if (re.type === "RPA") {
                            this.rpaArr.push(
                                {
                                    designation: re.designation,
                                    educationalQualification: re.educationalQualification,
                                    experience: re.experience,
                                    taskPerformed: re.taskPerformed,
                                    projectConceptMasterId: re.projectConceptMasterId,
                                    remarks: re.remarks,
                                    type: re.type
                                }
                            )
                        }
                        if (re.type === "DPA") {
                            this.dpaArr.push(
                                {
                                    designation: re.designation,
                                    educationalQualification: re.educationalQualification,
                                    experience: re.experience,
                                    taskPerformed: re.taskPerformed,
                                    projectConceptMasterId: re.projectConceptMasterId,
                                    remarks: re.remarks,
                                    type: re.type
                                }
                            )
                        }
                        if (re.type === "Others") {
                            this.othersArr.push(
                                {
                                    designation: re.designation,
                                    educationalQualification: re.educationalQualification,
                                    experience: re.experience,
                                    taskPerformed: re.taskPerformed,
                                    projectConceptMasterId: re.projectConceptMasterId,
                                    remarks: re.remarks,
                                    type: re.type
                                }
                            )
                        }
                    })
                }
            }
        })
    }

    downloadAnnexureSix_PhpReport() {
        this.isLoading = true;
        this.getSupportStuff();
        setTimeout(() => {
            this.isLoading = true;
            this.download_tappAnnexureSix_PDF('Annexure-VI', 'tapp/annexure6_22');
            this.isLoading = false;
        }, 2000);
        this.getSupportStuff();
    }

    download_tappAnnexureSix_PDF($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';

        this.data['projectSummary'] = JSON.stringify(this.projectSummary);

        this.data['tappSupportStuffList'] = JSON.stringify(this.tappSupportStuffList);
        this.data['gobArr'] = JSON.stringify(this.gobArr);
        this.data['rpaArr'] = JSON.stringify(this.rpaArr);
        this.data['dpaArr'] = JSON.stringify(this.dpaArr);
        this.data['othersArr'] = JSON.stringify(this.othersArr);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // for 1 a
    getTappAnn_ia() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }

                this.isForeignAid = res.isForeignAid;
            })
        );

        this.subscribe$.add(
            this.tappAnnualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
                res.dppAnnualPhasingCostDTOList.forEach(e => {
                    if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                        this.revenueList = e.estimatedCostTabDetailsDTOS;
                        this.revenueTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                        this.capitalList = e.estimatedCostTabDetailsDTOS;
                        this.capitalTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                        this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                        this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                    }
                });
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            })
        );
    }

    // ============= End for tapp PHP report ==================

    // ============= for tapp report ==================

    downloadTappAnnexureIReport(isShowFull: boolean) {
        this.isLoading = true;
        if (isShowFull) {
            this._reportDataService.getTappAnnexureOneAReport(this.uuid).subscribe(
                (res) => {
                    this._reportCommonService.previewReport(res, 'PDF');
                    this.isLoading = false;
                },
                (err) => {
                    this.snackbarHelper.openWarnSnackBarWithMessage(
                        'Report Not Found !',
                        'OK'
                    );
                    console.log(err);
                    this.isLoading = false;
                }
            );
        } else {
            this._reportDataService.getTappShortAnnexureOneAReport(this.uuid, isShowFull).subscribe(
                (res) => {
                    this._reportCommonService.previewReport(res, 'PDF');
                    this.isLoading = false;
                },
                (err) => {
                    this.snackbarHelper.openWarnSnackBarWithMessage(
                        'Report Not Found !',
                        'OK'
                    );
                    console.log(err);
                    this.isLoading = false;
                }
            );
        }
    }

    getSectorDivisionList() {
        this.sectorDivisionService.getActiveSectorDivision().subscribe(res => {
            this.concernedDivisionList = res;
        });
    }

    private getAllTAPP() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.isForeignAid = res.isForeignAid;
            })
        );

        this.subscribe$.add(
            this.tappAnnualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
                res.dppAnnualPhasingCostDTOList.forEach(e => {
                    if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                        this.revenueList = e.estimatedCostTabDetailsDTOS;
                        this.revenueTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                        this.capitalList = e.estimatedCostTabDetailsDTOS;
                        this.capitalTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                        this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                        this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                    }
                });
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            })
        );
    }

    getFinancingExpectation() {
        this.tappFinancingAndExpectationService.getFinancingExpectation(this.conceptUuid).subscribe((response) => {
            this.financingExpectation = response.res;
        })
    }
    getTappLogFrame(){
        this.tappLogFrameService.getTappLogFrame(this.conceptUuid).subscribe((response)=>{
            this.tappLogFrame = response.res;
        })
    }
    getCurrencyList(): any {
        this.subscribe$.add(
            this.currencyService.getList().subscribe(res => {
                this.currencyList = [];
                for (let i = 0; i < res.length; i++) {
                    this.currencyList.push({
                        id: res[i].id,
                        name: res[i].nameEn,
                        nameBn: res[i].nameBn,
                        country: res[i].country,
                        uuid: res[i].uuid
                    });
                }
            })
        );
    }

    private getYearCostSummery() {

        this.subscribe$.add(
            this.tappYearCostSummeryService.getYearCostSummeryByProjectSummaryUuid(this.id).subscribe(res => {
                this.yearCostSummery=res.res;
                if (res.status > 0) {
                    this.indicateIssues = res.res.indicateIssues;
                    this.indicateIssuesNotWork = res.res.indicateIssuesNotWork;
                    console.log(this.indicateIssuesNotWork);
                }
            })
        );
    }

    downloadTappPartAReport() {
        this.isLoading = true;
        this.getTappProjectByPcUuid();
        this.getSectorDivisionList();
        this.getProjectConceptByUuid();
        this.getTappLogFrame();
        this.getYearCostSummery();
        this.getFinancingExpectation();
        this.getAllTAPP();
        this.getCurrencyList();
        setTimeout(() => {
            if (this.projectSummary.isForeignAid) {
                this.downloadTapp_part_A_Report_pdf('tapp_part_A ', 'tapp/Part_A_Report_En_22');
            } else {
                this.downloadTapp_part_A_Report_pdf('tapp_part_A ', 'tapp/Part_A_Report_Bn_22');
            }
            this.isLoading = false;
        }, 5000);
    }

    downloadTapp_part_A_Report_pdf($fileName='', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['tappWorkPlanList'] = JSON.stringify(this.tappWorkPlanList);
        this.data['objectiveAndCost'] = JSON.stringify(this.objectiveAndCost);
        this.data['concernedDivisionList'] = JSON.stringify(this.concernedDivisionList);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['grandTotalList'] = JSON.stringify(this.grandTotalList);
        this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);
        this.data['financingExpectation'] = JSON.stringify(this.financingExpectation);
        this.data['tappLogFrame'] = JSON.stringify(this.tappLogFrame);
        this.data['yearCostSummery'] = JSON.stringify(this.yearCostSummery);
        this.data['getByProjectConcept'] = JSON.stringify(this.getByProjectConcept);
        this.data['modeFinanc'] = JSON.stringify(this.modeFinanc);
        this.data['currencyList'] = JSON.stringify(this.currencyList);
        this.data['indicateIssues'] = JSON.stringify(this.indicateIssues);
        this.data['indicateIssuesNotWork'] = JSON.stringify(this.indicateIssuesNotWork);
        this.data['sectorDivision'] = JSON.stringify(this.sectorDivision);
        this.data['projectCost'] = JSON.stringify(this.totalTappCost);
        this.data['fiscalYearList'] = JSON.stringify(this.fiscalYearList);
        this.data['modeFinanceList'] = JSON.stringify(this.modeFinanceList);


        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
        this.isLoading = false;
    }

    downloadTappPartBReport($fileName='') {
        this.getTappProjectByPcUuid();
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/tapp/Part_B_Report_22';

        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['partBdata'] = JSON.stringify(this.partBdata);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    downloadTappAnexTwoReport() {
        this.isLoading = true;
        this.getTappReference();
        setTimeout(() => {
            if(this.projectSummary?.isParipatra2016){
                this.downloadTappAnnexerTwo_Report_pdf('Annexure-II ', 'tapp/annexure2_22');
            }else{
                this.downloadTappAnnexerTwo_Report_pdf('Annexure-II ', 'tapp/annexure2_22');
            }
            this.isLoading = false;
        }, 2000);
    }

    downloadTappAnexSixReport() {
        this.isLoading = true;
        this._reportDataService.getTappAnexSixReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessageEnBn("Report Not Found !", "রিপোর্ট পাওয়া যায়নি !");
                console.log('downloadTappAnexSixReport : ', err);
                this.isLoading = false;
            }
        );
    }

    // ============= for start   tapp report Annexure Four Report ==================

    // Anx4
    downloadTappAnnexureIV_Pdf() {
        this.isLoading = true;
        this.getWorkPlanByTappMasterId(this.masterId);
        setTimeout(() => {
            if(this.projectSummary?.isForeignAid){
                this.downloadAnnexerFour_Report_pdf('Annexure-IV', 'tapp/annexure4_22');
            }else{
                this.downloadAnnexerFour_Report_pdf('Annexure-IV', 'tapp/annexure4_22');
            }
            this.isLoading = false;
        }, 2000);
    }

    getTappAnnex5Value() {
        this.tppAnnexureFiveService.getData("get-list/" + this.conceptUuid).subscribe((res) => {
            this.annex5Data = res;
        })
    }

    downloadTappAnexFiveReport(){
        this.getTappAnnex5Value();
        setTimeout(() => {
            if(this.isParipatra2016){
                this.downloadTappAnnexerFive_Report_pdf('Annexure-V ', 'tapp/annexure5_22');
            }else{
                this.downloadTappAnnexerFive_Report_pdf('Annexure-V ', 'tapp/annexure5_22');
            }
            this.isLoading = false;
        }, 2000);
    }

    downloadTappAnnexerFive_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        this.data['listValue'] = JSON.stringify(this.annex5Data);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    getFiscalYearList() {
        const a = new Date(this.commencementDate);
        const b = new Date(this.completionDate);

        let fYear = a.getFullYear();
        let lYear = b.getFullYear();

        if (a.getMonth() < 6) {
            fYear = a.getFullYear() - 1;
        }
        if (b.getMonth() > 5) {
            lYear = b.getFullYear() + 1;
        }

        let total = lYear - fYear;
        let startingYear = fYear;

        while (total > 0) {
            let nextYear = (startingYear + 1);
            this.fiscalYearList.push({ fiscalYear: (startingYear + "-" + nextYear) });
            startingYear += 1;
            total -= 1;
        }

        this.fiscalYearList.forEach(fYear => {
            fYear.quarterList = [];
            let str = `${fYear.fiscalYear}`;
            let yearList = str.split("-");

            let firstQuarter = { 'strDate': new Date(`${yearList[0]}-07-01`), 'endDate': new Date(`${yearList[0]}-09-30`) }
            let secondQuarter = { 'strDate': new Date(`${yearList[0]}-10-01`), 'endDate': new Date(`${yearList[0]}-12-31`) }
            let thirdQuarter = { 'strDate': new Date(`${yearList[1]}-01-01`), 'endDate': new Date(`${yearList[1]}-03-31`) }
            let fourthQuarter = { 'strDate': new Date(`${yearList[1]}-04-01`), 'endDate': new Date(`${yearList[1]}-06-30`) }

            fYear.quarterList.push(firstQuarter);
            fYear.quarterList.push(secondQuarter);
            fYear.quarterList.push(thirdQuarter);
            fYear.quarterList.push(fourthQuarter);
        });

    }

    dateCheck(from, to, check) {
        var fDate, lDate, cDate;
        fDate = Date.parse(from);
        lDate = Date.parse(to);
        cDate = Date.parse(check);

        if ((cDate <= lDate && cDate >= fDate)) {
            return true;
        }
        return false;
    }

    cleckTest(pIndex: number, cIndex, workPlan: any) {
        let quarterData = this.fiscalYearList[pIndex].quarterList[cIndex];
        let result1 = this.dateCheck(quarterData.strDate, quarterData.endDate, workPlan.startDate);
        let result2 = this.dateCheck(quarterData.strDate, quarterData.endDate, workPlan.endDate);
        let result3 = this.dateCheck(workPlan.startDate, workPlan.endDate, quarterData.strDate);
        let result4 = this.dateCheck(workPlan.startDate, workPlan.endDate, quarterData.endDate);

        if (result1 || result2 || result3 || result4) {
            switch (workPlan.status) {
                case 'Progress':
                    return 'status-progress'
                    break;
                case 'Done':
                    return 'status-done'
                    break;
                case 'Not Done':
                    return 'status-notdone'
                    break;
                default: 'default'
            }

        } else {
            return 'default';
        }
    }

    getTappProjectByPcUuid() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe(
            (response) => {
                this.projectTitle = response.res.projectTitleEn ? response.res.projectTitleEn : this.projectTitle;
                this.commencementDate = response.res.expCommencementDate ? response.res.expCommencementDate : this.commencementDate;
                this.completionDate = response.res.expCompletionDate ? response.res.expCompletionDate : this.completionDate;
                this.masterId = response.res.id ? response.res.id : null;
                this.getWorkPlanByTappMasterId(this.masterId);
                this.getFiscalYearList();
                this.objectiveAndCost=response;
            }
        )
    }

    getWorkPlanByTappMasterId(tappMasterId) {
        this.tappWorkScheduleService.getWorkinngScheduleList(tappMasterId).subscribe(
            res => {
                this.tappWorkPlanList = res;
                this.fiscalYearWiseQuarterData(res.res);
            }
        )
    }

    fiscalYearWiseQuarterData(tappWorkPlanList) {
        this.tappWorkPlanReportList = [...tappWorkPlanList]
        this.tappWorkPlanReportList.forEach(fyQuaData => {
            fyQuaData.fiscalYearList = [];
            this.fiscalYearList.forEach(fYear => {
                fyQuaData.fiscalYearList.push({
                    fYear: fYear,
                    Q1: fyQuaData.selectedQuarter.includes(fYear.fiscalYear + '-Q1,'),
                    Q2: fyQuaData.selectedQuarter.includes(fYear.fiscalYear + '-Q2,'),
                    Q3: fyQuaData.selectedQuarter.includes(fYear.fiscalYear + '-Q3,'),
                    Q4: fyQuaData.selectedQuarter.includes(fYear.fiscalYear + '-Q4,')
                })
            })
        })
    }

    // TAPP Anx2
    getTappReference(){
        this.tappTermOfReferenceService.getReference(this.uuid).subscribe((response) => {
            this.termOfReference = response.res;
        })
    }

    downloadTappAnnexerTwo_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        this.data['termOfReference'] = JSON.stringify(this.termOfReference);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // Anx4
    downloadAnnexerFour_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        // this.data['lng'] ='bn';  //(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['fiscalYearList'] = JSON.stringify(this.fiscalYearList);
        this.data['tappWorkPlanList'] = JSON.stringify(this.tappWorkPlanReportList);
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['mtbfObj'] = JSON.stringify(this.mtbfObj);
        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ============= for tapp report Annexure Four Report End ==================

    // for download full dpp report
    downloadFullTappReport() {

        this.dialog.closeAll();
        this.isLoading = true;
        this._reportDataService.getFullTappReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessageEnBn("Report Not Found !", "রিপোর্ট পাওয়া যায়নি !");
                console.log('downloadFullTappReport : ', err);
                this.isLoading = false;
            }
        );
    }

    // ============= for tapp report Annexure Eight Goods Report ==================
    getTappAnnexureGoodsData() {
        this.tappAnnexureGoodsService.getDataList('get-list/Tapp-Goods/'+this.conceptUuid).subscribe((response) => {
            if (response.status > 0) {
                this.annex8aData = response.res.list;
            }
        });
    }

    downloadTappAnnexureEightGoods() {
        this.isLoading = true;
        this. getTappAnnexureGoodsData();
        setTimeout(() => {
            let reportName = 'Annexure-VIII(a) ';
            if (this.isParipatra2016) {
                this.downloadTappAnnexerEightA_Report_pdf(reportName, 'tapp/annexure8a_22');
            } else {
                if (!this.isForeignAid) {
                    reportName = 'Annexure-VII(a) ';
                }
                this.downloadTappAnnexerEightA_Report_pdf(reportName, 'tapp/annexure8a_22');
            }
            this.isLoading = false;
        }, 2000);
    }

    downloadTappAnnexerEightA_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        this.data['objectivesAndCost'] = JSON.stringify(this.objectivesAndCost);
        this.data['projectCost'] = JSON.stringify(this.totalTappCost);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['listVal'] = JSON.stringify(this.annex8aData);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    // ============= for tapp report Annexure 8a/7a Report ==================

    getTappAnnexureEightServiceData() {
        this.tappAnnexureGoodsService.getData('get-list/Tapp-Service/'+this.conceptUuid).subscribe((response) => {
            if (response.status > 0) {
                this.annex8bData = response.res.list;
            }
        });
    }

    downloadTappAnnexureEightService() {
        this.isLoading = true;
        this. getTappAnnexureEightServiceData();
        setTimeout(() => {
            let reportName = 'Annexure-VIII(b) ';
            if (this.isParipatra2016) {
                this.downloadTappAnnexerEightB_Report_pdf(reportName, 'tapp/annexure8b_22');
            } else {
                if (!this.isForeignAid) {
                    reportName = 'Annexure-VII(b) ';
                }
                this.downloadTappAnnexerEightB_Report_pdf(reportName, 'tapp/annexure8b_22');
            }
            this.isLoading = false;
        }, 2000);
    }

    downloadTappAnnexerEightB_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = this.projectSummary.isForeignAid ? 'en' : 'bn';
        this.data['projectCost'] = JSON.stringify(this.totalTappCost);
        this.data['listVal'] = JSON.stringify(this.annex8bData);
        this.data['objectivesAndCost'] = JSON.stringify(this.objectivesAndCost);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ============= for tapp report Annexure Seven Report ==================

    // TAPP Anx7
    getTappLetterOfAgreement(){
        this.tppAnnexureSevenService.getDetail(this.uuid).subscribe((response) => {
            this.tappLetterOfAgreement = response.res;
        })
    }
    downloadTappAnnexureSeven() {
        this.isLoading = true;
        this.getTappLetterOfAgreement();
        setTimeout(() => {
            if(this.projectSummary?.isParipatra2016){
                this.downloadTappAnnexerSeven_Report_pdf('Annexure-VII ', 'tapp/annexure7_22');
            }else{
                this.downloadTappAnnexerSeven_Report_pdf('Annexure-VII ', 'tapp/annexure7_22');
            }
            this.isLoading = false;
        }, 2000);
    }

    downloadTappAnnexerSeven_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = 'en';
        this.data['tappLetterOfAgreement'] = JSON.stringify(this.tappLetterOfAgreement);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ============= for tapp report Annexure Three Report ==================

    downloadTappAnnexureThree() {
        this.isLoading = true;
        this._reportDataService.getTappAnnexureThree(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessageEnBn("Report Not Found !", "রিপোর্ট পাওয়া যায়নি !");
                console.log('downloadTappAnnexureSeven : ', err);
                this.isLoading = false;
            }
        );
    }

    // for create dpp GO report
    createDppGOAOReport(orderType) {
        this.dialog.closeAll();
        this.route.navigate([`dpp-tapp/create-dpp-tapp-go/${this.uuid}/${orderType}`]);
    }

    // for download dpp GO report
    downloadDppGOReport() {
        this.findByPcUuidAndOrderType();
        this.getTappObjectiveCostByPcUuid();
        this.getAll();
        this.isLoading = true;
        this.dialog.closeAll();
        setTimeout(() => {
            if (this.userGroup.groupStatus == 'ECNEC'|| this.userGroup.groupStatus == 'ECNEC-DESK'|| this.userGroup.groupStatus == 'ECNEC-HEAD') {
                this.downloadDppGOReport_pdf('DppEcnecGOReport ', 'dpp/DppEcnecGOReport');
            } else if
            (this.userGroup.groupStatus == 'PLANNING-HEAD'|| this.userGroup.groupStatus == 'PLANNING-DESK'|| this.userGroup.groupStatus == 'PLANNING-MINISTER')
            {
                this.downloadDppGOReport_pdf('DppPlanComGOReport ', 'dpp/DppPlanComGOReport');
            }
            this.isLoading = false;
        }, 2000);
    }

    downloadDppGOReport_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['objectivesAndCost'] = JSON.stringify(this.objectivesAndCost);
        this.data['dppTappGoObj'] = JSON.stringify(this.dppTappGoObj);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['ecnecMeeting'] = JSON.stringify(this.ecnecMeeting);
        this.data['ecnecMeetingObj'] = JSON.stringify(this.ecnecMeetingObj);
        this.data['isEcnecMeetingAssignDone'] = JSON.stringify(this.isEcnecMeetingAssignDone);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['approvalDate'] = JSON.stringify(this.approvalDate);
        this.data['agency'] = JSON.stringify(this.agencyModel);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // for download dpp Administrative GO report
    downloadDppAdministrativeGOReport() {
        this.findByPcUuidAndOrderType();
        this.getTappObjectiveCostByPcUuid();
        this.getAll();
        this.isLoading = true;
        this.dialog.closeAll();
        setTimeout(() => {
            this.downloadDppAdministrativeAOReport_pdf('DppAdministrativeAOReport ', 'dpp/DppAdministrativeAOReport');
            this.isLoading = false;
        }, 2000);
    }

    downloadDppAdministrativeAOReport_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['objectivesAndCost'] = JSON.stringify(this.objectivesAndCost);
        this.data['dppTappAoObj'] = JSON.stringify(this.dppTappAoObj);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['isEcnecMeetingAssignDone'] = JSON.stringify(this.isEcnecMeetingAssignDone);

        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);

        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    getDetailsEstimatedCost(conceptUuid) {
        this.annualPhasingCostService.getDetailsEstimatedCost(conceptUuid).subscribe(res => {
            this.grantTotal = res.grandTotalResponses;
        });
    }

    getAgencyInfo(conceptUuid, callback){
        this.dppObjectivesService.getByProjectConceptUuid(conceptUuid).subscribe(res =>{
            callback(res);
        },error => {
            callback([]);
        })
    }

    downloadSummery($event: MatSelectChange) {
        let projectSummariesData:any;
        let projectSummary: IProjectConcept;
        let agencyName: string; //
        let ministryDivisionName: string; //
        let grantTotal = 0; //
        let revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
        let revenueTotal: IDppAnnexure5ACostTotal;
        let capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
        let capitalTotal: IDppAnnexure5ACostTotal;

        let physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
        let priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;

        if ($event.value) {
            if ($event.value == '') {

            } else {
                this.isLoading = true;
                this.projectSummariesService.getProjectSummaries(this.uuid, $event.value).subscribe(res => {
                    if (res.status == 0) {
                        this.snackbarHelper.openWarnSnackBarWithMessage("Project Summaries Not Created !", "OK")
                    } else {

                        projectSummariesData = res.res;

                        this.projectSummaryService.getByUuid(this.uuid).subscribe(response => {
                            projectSummary = response;

                            this.annualPhasingCostService.getDetailsEstimatedCost(this.uuid).subscribe(res => {
                                res.dppAnnualPhasingCostDTOList.forEach(e => {
                                    if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                                        revenueList = e.estimatedCostTabDetailsDTOS;
                                        revenueTotal = e.dppAnnualPhasingCostTotal;
                                    } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                                        capitalList = e.estimatedCostTabDetailsDTOS;
                                        capitalTotal = e.dppAnnualPhasingCostTotal;
                                    } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                                        physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                                        priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                                    }
                                });

                                grantTotal = res.grandTotalResponses;

                                this.getAgencyInfo(this.uuid, response => {
                                    if(response){
                                        agencyName = response.res.implementingAgency;
                                        ministryDivisionName = response.res.ministryDivision;
                                    }
                                    this.isLoading = false;

                                    this.data['fileName'] = 'dpp_summary';
                                    this.data['templateName'] = 'pps-reports/dpp/dpp_summary';
                                    this.data['isForeignAid'] = 0; //(this.isForeignAid) ? 1 : 0;
                                    this.data['projectSummary_1'] = JSON.stringify(projectSummary);
                                    this.data['projectSummary'] = JSON.stringify(projectSummariesData);
                                    this.data['grantTotal'] = JSON.stringify(this.grantTotal);
                                    this.data['sectorName'] = this.sectorDivision?.sectorDivisionNameBn || ''
                                    this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);
                                    this.data['upazilas'] = JSON.stringify(this.upazilas);
                                    this.data['agencyName'] = JSON.stringify(agencyName);
                                    this.data['ministryDivisionName'] = JSON.stringify(ministryDivisionName);
                                    this.data['revenueList'] = JSON.stringify(revenueList);
                                    this.data['revenueTotal'] = JSON.stringify(revenueTotal);
                                    this.data['capitalList'] = JSON.stringify(capitalList);
                                    this.data['capitalTotal'] = JSON.stringify(capitalTotal);
                                    this.data['physicalContingencyTotal'] = JSON.stringify(physicalContingencyTotal);
                                    this.data['priceContingencyTotal'] = JSON.stringify(priceContingencyTotal);
                                    this.data['grantTotal'] = JSON.stringify(grantTotal);
                                    this.data['userType'] = this.userGroup.groupStatus;

                                    //console.log('this.data', this.data);
                                    //return;

                                    //Optional
                                    this.data['view'] = 0; // 0 = false or 1 = true
                                    this.data['print_r'] = 0; // 0 = false or 1 = true
                                    let actionUrl = `${reportBackend}/pdf-generate-post`;
                                    bl2Js(this.data, actionUrl);
                                })

                            })
                        })
                    }
                })
            }
        }

    }

    private convertToBanglaNumber(value) {
        const numbers = {
            0: '০',
            1: '১',
            2: '২',
            3: '৩',
            4: '৪',
            5: '৫',
            6: '৬',
            7: '৭',
            8: '৮',
            9: '৯'
        };

        let output = '';
        const input = value.toString();
        for (let i = 0; i < input.length; ++i) {
            if (numbers.hasOwnProperty(input.charAt(i))) {
                output = output + numbers[input[i]];
            } else {
                output = output + input.charAt(i);
            }
        }
        return output;
    }

    checkUserCanEdit() {
        if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() === 'dpp') {
            this.dppObjectiveCostService.getObjectiveCostByPcUuid(this.projectSummary.uuid).subscribe(res => {
                if (res) {
                    this.findDppCurrentStage(res.dppMasterId, this.projectSummary.uuid)
                } else {
                    this.canEdit = true;
                    // this.router.navigate([`dpp-tapp/dashboard/${row.uuid}`]);
                }
            });
        } else if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() === 'tapp') {
            this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.projectSummary.uuid).subscribe(res => {
                if (res) {
                    this.findTappCurrentStage(res.tappMasterId, this.projectSummary.uuid)
                } else {
                    this.canEdit = true;
                }
            });
        }
    }

    findDppCurrentStage(dppMasterId, uuid) {
        this.stageMovementService.getCurrentStage(dppMasterId, 'DPP').subscribe(async res => {
            if (res.res) {
                if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
                    this.canEdit = true;
                } else {
                    this.canEdit = false;
                    // await this.router.navigate([`dpp-tapp/view-dashboard/${uuid}`]);
                }
            } else {
                // await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
                this.canEdit = true;
            }
        });
    }

    findTappCurrentStage(tappMasterId, uuid) {
        this.stageMovementService.getCurrentStageInTapp(tappMasterId).subscribe(async res => {
            if (res.res) {
                if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
                    // await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
                    this.canEdit = true;
                } else {
                    this.canEdit = false;
                    // await this.router.navigate([`dpp-tapp/view-dashboard/${uuid}`]);
                }
            } else {
                // await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
                this.canEdit = true;
            }
        });
    }

    private openDialogProjectMovement(callback) {
        let label;
        let confimationMsg = this.isEnLabel ? 'Are you sure that you want to ' + this.forwardReturnAction + ' this Project?' : 'আপনি কি প্রজেক্ট টি ' + this.forwardReturnAction + ' চান?';
        if (this.userGroup.groupStatus === 'PLANNING-MINISTER') {
            // label = this.isEnLabel ? 'Approve':'অনুমোদন করুন';
            label = this.isEnLabel ? '<img src="assets/images/logo/yes.png" class="yes-no-cls"> <span class="yes-no-txt">Okay</span>'
                : '<img src="assets/images/logo/yes.png" class="yes-no-cls"> <span class="yes-no-txt">হ্যাঁ</span>';
            confimationMsg = this.isEnLabel ? 'Honorable Planning Minister, do you want to ' + this.forwardReturnAction + ' this project?'
                : 'মাননীয় পরিকল্পনা মন্ত্রী, আপনি কি প্রকল্পটি ' + this.forwardReturnAction + ' চান?';
        } else {
            // label = this.isEnLabel ? 'Okay':'প্রেরণ করুন';
            label = this.isEnLabel ? '<img src="assets/images/logo/yes.png" class="yes-no-cls"> <span class="yes-no-txt">Okay</span>'
                : '<img src="assets/images/logo/yes.png" class="yes-no-cls"> <span class="yes-no-txt">হ্যাঁ</span>';
        }

        let options = {
            title: confimationMsg,
            confirmLabel: label,
            // declineLabel: 'বাতিল করুন',
            declineLabel: this.isEnLabel ? '<img src="assets/images/logo/no.png" class="yes-no-cls"> <span class="yes-no-txt">Cancel</span>'
                : '<img src="assets/images/logo/no.png" class="yes-no-cls"> <span class="yes-no-txt">না</span>'
        };
        this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
            if (res) {
                callback(true);
            }
        });
    }

    //get mode of finance total value and annexure 5b total data for show send to nothi button
    getTotalModeData(res: any) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.id).subscribe(response => {
            if (response.length > 1) {
                let total = response.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.totalAmountAnnexure5B = Number(total[0].totalAmount.toFixed(2));
                this.modelOfFinanceList = res.modeFinanceList;
                this.totalModeOfFinance.gobAmount = this.modelOfFinanceList.map(m => m.gob).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.feGobAmount = this.modelOfFinanceList.map(m => m.gobFe).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.otherAmount = this.modelOfFinanceList.map(m => m.others).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.feOtherAmount = this.modelOfFinanceList.map(m => m.othersFe).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.ownFundAmount = this.modelOfFinanceList.map(m => m.ownFund).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.feOwnFundAmount = this.modelOfFinanceList.map(m => m.ownFundFe).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.paAmount = this.modelOfFinanceList.map(m => m.pa).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.rpaAmount = this.modelOfFinanceList.map(m => m.paRpa).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.totalAmount =
                    this.totalModeOfFinance.gobAmount + this.totalModeOfFinance.feGobAmount +
                    this.totalModeOfFinance.otherAmount + this.totalModeOfFinance.feOtherAmount +
                    this.totalModeOfFinance.ownFundAmount + this.totalModeOfFinance.feOwnFundAmount +
                    this.totalModeOfFinance.paAmount + this.totalModeOfFinance.rpaAmount;


                if (this.totalModeOfFinance.gobAmount == Number(total[0].gobAmount.toFixed(2)) && this.totalModeOfFinance.feGobAmount == Number(total[0].gobFeAmount.toFixed(2))) {
                    if (this.totalModeOfFinance.ownFundAmount == Number(total[0].ownFundAmount.toFixed(2)) && this.totalModeOfFinance.feOwnFundAmount == Number(total[0].ownFundFeAmount.toFixed(2))) {
                        if (this.totalModeOfFinance.otherAmount == Number(total[0].otherAmount.toFixed(2)) && this.totalModeOfFinance.feOtherAmount == Number(total[0].otherFeAmount.toFixed(2))) {
                            this.enableNothiButtonMOFAndAnnexure5BDataIsEqual = true;
                        }
                    }
                }
            }
        });
    }

    /* Check DPP Data validation for send to nothi*/
    checkDpp5BData(): any {
        this.dppAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            projectConceptId: this.id,
            componentName: DppAnnualPhasingConstant.Revenue_Component
        }).subscribe(res => {
            if (res == null) {
                this.isDppAnnexure5BDataEmpty = true;
            }
        });
    }

    checkDppPartAData(res: any) {
        if (res == null) {
            this.isDppPartAConcernedDivisionIdEmpty = false;
            this.isDppObjectiveTargetsDataEmpty = true;
        } else {
            if (res.concernedDivisionId == null) {
                this.isDppPartAConcernedDivisionIdEmpty = true;
            }
            if (res.objectivesTargets == null || res.objectivesTargets == '') {
                this.isDppObjectiveTargetsDataEmpty = true;
            }
        }
    }

    checkDppPartBProjectDetails() {
        this.projectDetailsPartbService.getProjectDetailsByProjectId(this.uuid).subscribe(res => {
            if (res == null || res == '') {
                this.isDppPartBDataEmpty = true;
            }
        })
    }

    checkDppAnnexureIData() {
        this.dppLocationWiseCostBreakdownService.getByProjectConceptMasterId(this.id).subscribe(res => {
            if (res.length == 0) {
                this.isDppAnnexureIDataEmpty = true;
            } else {
                this.locationWiseCostTotal = res.reduce((sum, current) => (sum + current.estimatedCost), 0);
            }
        })
    }

    checkDppAnnexureIIData() {
        this.dppProjectManagementSetupService.getProjectManagementSetup(this.uuid).subscribe(res => {
            if (res.res.dppProjectManagementSetupMasterId === null) {
                this.isDppAnnexureIIDataEmpty = true;
            }
        })
    }

    /* Check Tapp Data validation for send to nothi*/
    checkTappAnnexureIData() {
        this.tappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            projectConceptId: this.id,
            componentName: DppAnnualPhasingConstant.Revenue_Component
        }).subscribe(res => {
            if (res == null) {
                this.isTappAnnexureIDataEmpty = true;
            }
        })
    }

    checkTappPartAData(res: TappObjectiveCostModel) {
        if (res == null) {
            this.isTappDesignationContactPersonDataEmpty = true;
            this.isTappObjectiveTargetsDataEmpty = true;
            this.isTappResponsiblePreparation = true;
        } else {
            if (res.designationContactPerson == null || res.designationContactPerson == '') {
                this.isTappDesignationContactPersonDataEmpty = true;
            }
            if (res.objectivesTargets == '' || res.objectivesTargets == null) {
                this.isTappObjectiveTargetsDataEmpty = true;
            }
            if (res.responsiblePreparation == null || res.responsiblePreparation == '') {
                this.isTappResponsiblePreparation = true;
            }
        }
    }

    downloadAllAttachments() {
        this.fileUploadService.downloadDppAttachementsZip(this.id);
    }

    applyFilter(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyFilterProjectMovement(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceMovementStageAttachment.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceMovementStageAttachment.paginator) {
            this.dataSourceMovementStageAttachment.paginator.firstPage();
        }
    }

    getListDashboardAttachment(): any {
        this.dashboardAttachmentService.getListDashboardAttachment({
            page: this.page,
            size: this.size
        }, this.id, this.projectSummary.projectTypeDTO.nameEn).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content);
            this.total = res.totalElements;
        });
    }

    openDialogFSReport() {
        if (!this.objectivesAndCost) {
            this.snackbarHelper.openWarnSnackBarWithMessageEnBn('Please Add Objective and Cost First!', 'অনুগ্রহ করে প্রথমে উদ্দেশ্য এবং খরচ যোগ করুন!');
            return;
        }
        this.fsAttachmentName = this.objectivesAndCost?.fsAttachmentName;
        const dialogRef = this.dialog.open(this.linkWithFS, {
            height: '400px',
            width: '700px',
            position: {
                top: '15vh',
                left: '30vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.frmGroup.reset();
        });
    }

    getAllFsReport(fsUuid: string) {
        this.feasibilityStudySummaryService.getFsReportList(fsUuid).subscribe(res => {
            this.fsReportList = res.res;
        })
    }

    setSelectedFsReport(event: MatSelectChange) {
        this.fsUuid = event.value;
        this.linkFsReportWithDpp();
    }

    downloadFSReport() {
        this._reportDataService.getFSReport(this.objectivesAndCost?.fsUuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessageEnBn("Report Not Found !", "রিপোর্ট পাওয়া যায়নি !");
                console.log('downloadFSReport : ', err);
            }
        );
    }

    linkFsReportWithDpp() {
        let fsLinkWithDppModel = new FsLinkWithDppModel();
        fsLinkWithDppModel.pcUuid = this.uuid;
        fsLinkWithDppModel.fsUuid = this.fsUuid;
        fsLinkWithDppModel.fsAttachmentId = this.fsAttachmentId;
        fsLinkWithDppModel.dppMasterId = this.dppMasterId;

        this.objectiveAndCostService.linkFsWithDpp(fsLinkWithDppModel).subscribe(
            res => {
                if (res.status == 200) {
                    if (this.fsAttachmentId != null) {
                        this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully link with Feasibility Study Report Attachment", OK)
                    } else {
                        this.fsLinkWithDppModel.dppMasterId = this.dppMasterId;
                        this.fsLinkWithDppModel.fsUuid = this.fsUuid;
                        this.feasibilityStudySummaryService.linkDppWithFs(this.fsLinkWithDppModel).subscribe(res => {
                            if (res.status == 200) {
                                this.fsUuid = null;
                                this.getDppObjectCostData();
                                this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully link with Feasibility Study Report", OK)
                            }
                        })
                    }
                }
            },
            err => {
                console.log('linkFsReportWithDpp : ', err);
            }
        );
    }

    downloadFsAttachment() {
        this.fileUploadService.getAttachmentByIdInDppService(this.objectivesAndCost.fsAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInDppService(res.pathUrl);
        });
    }

    getDppObjectCostData() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.uuid).subscribe(res => {
            if (res) {
                this.objectivesAndCost.fsUuid = res.fsUuid;
                this.objectivesAndCost.fsAttachmentId = res.fsAttachmentId;
            }
        });
    }


    /**
     * open dialog for comment observation model
     * */
    openCommentAndObservation() {
        let dialog = this.dialog.open(this.commentAndObservationDialog, {
            height: '450px',
            width: '600px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialog.afterClosed().subscribe(result => {
            // this.meetingType = false;
            // this.paperType = false;
        });

    }

    findByPcUuidAndOrderType() {
        this.dppTappAoObj = {}
        this.dppTappGoObj = {}
        let orderType = '';
        if (this.userGroup.groupStatus == 'ECNEC' || this.userGroup.groupStatus=='ECNEC-DESK' || this.userGroup.groupStatus=='ECNEC-HEAD') {
            orderType = 'ECNEC-GO';
        } else if (this.userGroup.groupStatus == 'PLANNING-HEAD' || this.userGroup.groupStatus == 'PLANNING-DESK' || this.userGroup.groupStatus == 'PLANNING-MINISTER') {
            orderType = 'PLANCOM-GO';
        }
        this.dppTappGoService.findByPcUuid(this.uuid, 'AO').subscribe(
            res => {
                if (res) {
                    this.dppTappAoObj = res;
                }
            },
            err => {
                console.log('findByPcUuidAndOrderType err : ', err);
            }
        );
        this.dppTappGoService.findByPcUuid(this.uuid, orderType).subscribe(
            res => {
                if (res) {
                    this.dppTappGoObj = res;
                }
            },
            err => {
                console.log('findByPcUuidAndOrderType err : ', err);
            }
        );
    }

    getAllProjectMovementAttachment(projectMovementId) {
        this.projectMovementService.getAllProjectMovementAttachment(projectMovementId).subscribe(
            res => {
                if (res) {
                    this.attachmentList = res;
                    this.isPscNotice = this.attachmentList.find(obj => (obj.projectMovementStage.currentStage == 'PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE' && !obj.paperType)) ? true : false;
                    this.isPscWorkingPaper = this.attachmentList.find(obj => obj.paperType == 'PSC Meeting Working Paper') ? true : false;
                }
            },
            err => {
                console.log('getAllProjectMovementAttachment : ', err);
            }
        );
    }

    // ======================================All Reports =====================================================>

    // ======================================Full DPP/TAPP =====================================================>
    downloadFullDppTapp_php_Report() {
        this.isLoading = true;
        this.dialog.closeAll();
        // Part A
        this.getAll();
        this.getProjectConceptByUuid();
        this.getProjectSummaryMasterId();
        this.getProjectManagement();
        // Part B
        this.getProjectDetailsByProjectId();
        this.getFinancialAnalysis();
        this.getSimilarProject();
        this.getEffectImpact();
        this.getOherDetails();
        this.getOtherImportantDetails();
        // annexer 2
        this.downloadAnnexerTwo_Report();
        // annexer 3 goods
        this.getUnitTypeList();
        // annexer 4
        this.getData();
        // annexer 5 B
        this.getGrandAll();
        //  annexer 7
        this.getDataByProjectConceptUuid();
        this.getLoanCredit();
        this.getUnitTypeList();
        this.getData();
        // 5 b
        this.getAll();
        this.getGrandAll();

        setTimeout(() => {
            this.isLoading = true;
            if (this.isParipatra2016) {
                this.download_Full_Pdf_Report('Full Dpp Tapp', 'dpp/full_dpp_Report_Bn_16');
                this.isLoading = false;
            } else {
                if (this.projectSummary.isForeignAid) {
                    this.download_Full_Pdf_Report('Full Dpp Tapp', 'dpp/full_dpp_Report_En_22');
                } else {
                    this.download_Full_Pdf_Report('Full Dpp Tapp', 'dpp/full_dpp_Report_Bn_22');
                }
                this.isLoading = false;
            }

        }, 7000);
    }

    download_Full_Pdf_Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        // Part A
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['sector'] = JSON.stringify(this.sector);
        this.data['sectorDivision'] = JSON.stringify(this.sectorDivision);
        this.data['getByProjectConcept'] = JSON.stringify(this.getByProjectConcept);
        this.data['estimatedProjectCost'] = JSON.stringify(this.estimatedProjectCost);
        // grand total
        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
        this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
        this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
        this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
        this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);
        this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);

        // estimated
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        // project management
        this.data['projectManagement'] = JSON.stringify(this.projectManagement);
        this.data['getLogFrame'] = JSON.stringify(this.getLogFrame);

        // Part B
        this.data['projectDetailsPartb'] = JSON.stringify(this.projectDetailsPartb);
        this.data['getFinancialAnalysisData'] = JSON.stringify(this.getFinancialAnalysisData);
        this.data['similarProjectData'] = JSON.stringify(this.similarProjectData);
        this.data['getEffectImpactData'] = JSON.stringify(this.getEffectImpactData);
        this.data['otherDetails'] = JSON.stringify(this.otherDetails);
        this.data['getOtherImportantDetailsData'] = JSON.stringify(this.getOtherImportantDetailsData);

        // Annexer 1
        this.data['upazilas'] = JSON.stringify(this.upazilas);
        this.data['projectAreaJustification'] = JSON.stringify(this.projectAreaJustification);

        // Annexer 2
        this.data['getProjectManagementSetupData'] = JSON.stringify(this.getProjectManagementSetupData);

        // annexer 3 services
        this.data['services'] = JSON.stringify(this.services);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['grandTotal'] = JSON.stringify(this.grandTotalData);

        // annexer 3 works
        this.data['works'] = JSON.stringify(this.works);
        this.data['grandTotal'] = JSON.stringify(this.grandTotalData);

        // annexer 3 goods
        this.data['goods'] = JSON.stringify(this.goods);
        this.data['grandTotal'] = JSON.stringify(this.grandTotalData);
        this.data['unitTypeList'] = JSON.stringify(this.unitTypeList);

        // annexer 4
        this.data['revenue'] = JSON.stringify(this.revenue);
        this.data['capital'] = JSON.stringify(this.capital);
        this.data['contingency'] = JSON.stringify(this.contingency);
        this.data['grand'] = JSON.stringify(this.grand);
        this.data['yrs'] = JSON.stringify(this.yrs);
        this.data['subTotalRevObj'] = JSON.stringify(this.subTotalRevObj);
        this.data['subTotalCapObj'] = JSON.stringify(this.subTotalCapObj);
        this.data['totalRevenueWeight'] = JSON.stringify(this.totalRevenueWeight);
        this.data['totalCapitalWeight'] = JSON.stringify(this.totalCapitalWeight);

        // annexer 5 A
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);

        // annexer 5 B
        this.data['annexerFiveData'] = JSON.stringify(this.annexerFiveData);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);

        this.data['fiscalYearLists'] = JSON.stringify(this.fiscalYearLists);
        this.data['revenueLists'] = JSON.stringify(this.revenueLists);
        this.data['capitalLists'] = JSON.stringify(this.capitalLists);
        this.data['grandList'] = JSON.stringify(this.grandList);
        this.data['physicalContingencyList'] = JSON.stringify(this.physicalContingencyList);
        this.data['priceContingencyList'] = JSON.stringify(this.priceContingencyList);

        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
        this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
        this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
        this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
        this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);

        this.data['fiscalYearWiseCost'] = JSON.stringify(this.fiscalYearWiseCost);
        this.data['fiscalYearWiseCapitalCost'] = JSON.stringify(this.fiscalYearWiseCapitalCost);

        // annexer 6
        this.data['projectSummaryObj'] = JSON.stringify(this.projectSummary);
        this.data['amortizationSchedule'] = JSON.stringify(this.amortizationSchedule);
        this.data['loanPortion'] = JSON.stringify(this.loanPortion);
        this.data['totalInvestmentAmount'] = JSON.stringify(this.totalInvestmentAmount);
        this.data['gracePeriods'] = JSON.stringify(this.gracePeriods);
        this.data['loanPeriods'] = JSON.stringify(this.loanPeriods);

        //    annexer 7
        this.data['mtbfObj'] = JSON.stringify(this.mtbfObj);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ======================== Dpp PHP Part AAAA report start =========================
    downloadPartA_php_Report() {
        this.isLoading = true;
        this.getLoanCredit();
        this.getAll();
        this.getProjectConceptByUuid();
        this.getProjectSummaryMasterId();
        this.getProjectManagement();
        setTimeout(() => {
            if (this.isParipatra2016) {
                this.downloadPartA_Pdf_Report('Part-A ', 'dpp/Part_A_Report_16');
            } else {
                if (this.projectSummary.isForeignAid) {
                    this.downloadPartA_Pdf_Report('Part-A ', 'dpp/Part_A_Report_En_22');
                } else {
                    this.downloadPartA_Pdf_Report('Part-A ', 'dpp/Part_A_Report_Bn_22');
                }
            }
            this.isLoading = false;
        }, 3000);
    }

    getProjectLocation(psId: number) {
        this.subscribe$.add(
            this.locationService.getByProjectSummaryId(psId).subscribe(res => {
                this.projectAreaJustification = res.projectAreaJustification;
            })
        );
    }

    private getProjectManagement() {
        this.subscribe$.add(
            this.projectManagementService.getByProjectConceptUuid(this.conceptUuid).subscribe((res) => {
                this.projectManagement = res;
            })
        );
    }

    getProjectSummaryMasterId() {
        this.spinner = true;
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.projectConceptMasterId = res.id;
            setTimeout(() => {
                this.spinner = true;

            }, 1000)
            this.getLogFrameByPcid();
            this.spinner = false;
        })
    }

    private getLogFrameByPcid() {
        this.spinner = true;
        this.subscribe$.add(
            this.logFrameService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
                this.getLogFrame = response;
                let res = response.res;
                this.uuid = res.uuid;
                this.spinner = false;
            })
        );
    }

    downloadPartA_Pdf_Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['sectorDivision'] = JSON.stringify(this.sectorDivision);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['getByProjectConcept'] = JSON.stringify(this.getByProjectConcept);
        this.data['estimatedProjectCost'] = JSON.stringify(this.estimatedProjectCost);
        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
        this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
        this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
        this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
        this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);

        this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);

        console.log(" this.fiscalYearsList this.fiscalYearsList=", this.fiscalYearsList);
        // location
        this.data['upazilas'] = JSON.stringify(this.upazilas);
        this.data['projectAreaJustification'] = JSON.stringify(this.projectAreaJustification);
        // estimated
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);

        // project management
        this.data['projectManagement'] = JSON.stringify(this.projectManagement);
        this.data['getLogFrame'] = JSON.stringify(this.getLogFrame);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ======================== Dpp PHP Part B report start =========================
    //  Get project details part-b by pcUuid
    getProjectDetailsByProjectId() {
        this.projectDetailsPartbService.getProjectDetailsByProjectId(this.conceptUuid).subscribe((res) => {
            this.projectDetailsPartb = res;

        }, error => {
            console.log(error);
        })
    }
    //   Get Financial Analysis value
    getFinancialAnalysis() {
        this._financialAnalysisService.getFinancialAnalysis(this.conceptUuid).subscribe((response) => {
            this.getFinancialAnalysisData = response;
        }, error => {
            console.log(error);
        })
    }
    // get similar project study data
    getSimilarProject() {
        this.similarProjectStudyService.getSimilarProjectStudy(this.conceptUuid).subscribe((response) => {
            this.similarProjectData = response;
        })
    }
    /* For getting EffectImpact */
    getEffectImpact() {
        this._effectImpactService.getEffectImpact(this.conceptUuid).subscribe((res) => {
            this.getEffectImpactData = res;
        })
    }
    /* For getting OtherDetails*/
    getOherDetails() {
        this.otherDetailsService.getOtherDetails(this.conceptUuid).subscribe((res) => {
            this.otherDetails = res;
        })
    }
    /* For getting other Important Details */
    getOtherImportantDetails() {
        this.otherImportantDetailsService.getOtherImportantDetails(this.conceptUuid).subscribe((res) => {
            this.getOtherImportantDetailsData = res;
        })
    }

    // ==========================================
    downloadAnnexureB_PhpReport() {
        this.spinner = true;
        setTimeout(() => {
            if (this.isParipatra2016) {
                this.downloadPartB_Report('Part-B ', 'dpp/Part_B_Report_16');
            } else {
                this.downloadPartB_Report('Part-B ', 'dpp/Part_B_Report_22');
            }
            this.spinner = false;
        }, 2000);
        this.getProjectDetailsByProjectId();
        this.getFinancialAnalysis();
        this.getSimilarProject();
        this.getEffectImpact();
        this.getOherDetails();
        this.getOtherImportantDetails();
    }
    downloadPartB_Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['projectDetailsPartb'] = JSON.stringify(this.projectDetailsPartb);
        this.data['getFinancialAnalysisData'] = JSON.stringify(this.getFinancialAnalysisData);
        this.data['similarProjectData'] = JSON.stringify(this.similarProjectData);
        this.data['getEffectImpactData'] = JSON.stringify(this.getEffectImpactData);
        this.data['otherDetails'] = JSON.stringify(this.otherDetails);
        this.data['getOtherImportantDetailsData'] = JSON.stringify(this.getOtherImportantDetailsData);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    // ======================== Dpp PHP Part B report End ==================================================

    // ======================== Dpp PHP Annexer ONe report Srart ==================================================

    private getProjectConceptByUuid() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.titleEn = res.titleEn;
                if (res.isForeignAid) {
                    this._translateService.use('en');
                } else {
                    this._translateService.use('bn');
                }
                this.conceptId = res.id;
                this.projectSummary = res;
                this.getByLocationWiseCostProjectConceptMasterId();
            })
        );
    }

    /**
     * get location wise cost by project concept master id
     * @private
     */
    private getByLocationWiseCostProjectConceptMasterId() {
        this.subscribe$.add(
            this.dppLocationWiseCostBreakdownService.getByProjectConceptMasterId(this.conceptId).subscribe(res => {
                this.locationWiseCost = res;
                this.getLocationByObjectCostId();
            })
        );
    }
    private getLocationByObjectCostId() {
        this.subscribe$.add(
            this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(this.conceptId).subscribe(res => {
                if (res) {
                    this.upazilas = [];

                    this.locations = res;
                    this.arrangeData(res);
                }
                this.getProjectLocation(this.conceptId);
            }, _ => {
                this.show = false;
            })
        );
    }

    private arrangeData(res) {
        let di = 0;
        res.divisions.forEach(division => {
            let zi = 0;
            let upazilaUnderDivision = division.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0);

            if (division && division.zillaList.length == 0) {
                this.createViewList(res.dppMasterId, division, null, null, di, zi, 0, upazilaUnderDivision);
            }
            division.zillaList.forEach(zilla => {
                let ui = 0;

                if (zilla && zilla.upaZillaList.length == 0) {
                    this.createViewList(res.dppMasterId, division, zilla, null, di, zi, ui, upazilaUnderDivision);
                }

                zilla.upaZillaList.forEach(upazila => {
                    this.createViewList(res.dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision);
                    ui += 1;
                });
                zi += 1;
            });
            di += 1;
        });
    }

    createViewList(dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision) {

        const serial = ((!this.projectSummary?.isForeignAid && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(di + 1) : di + 1);
        let lwc: IDppLocationWiseCostBreakdown;
        if (upazila) {
            lwc = this.locationWiseCost.find(f => f.upazilaId === upazila.id);
        } else if (zilla) {
            lwc = this.locationWiseCost.find(f => f.zillaId === zilla.id);
        } else if (division) {
            lwc = this.locationWiseCost.find(f => f.divisionId === division.id);
        }

        this.upazilas.push(
            {
                location: {
                    uuid: lwc ? lwc?.uuid : null,
                    id: lwc ? lwc?.id : null,
                    dppMasterId: dppMasterId,
                    divisionId: division?.id,
                    zillaId: zilla?.id,
                    upazilaId: upazila?.id,
                    projectConceptMasterId: this.conceptId,
                    projectConceptMasterUuid: this.conceptUuid,
                    comment: lwc ? lwc?.comment : '',
                    estimatedCost: lwc ? lwc.estimatedCost : 0,
                    quantity: lwc ? lwc?.quantity : '',
                },
                sl: serial,
                dSpan: this.calDSpan(division, zilla, upazila, zi, ui), //((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
                zSpan: this.calZSpan(zilla, ui), //((ui === 0) ? (division.zillaList[zi].upaZillaList.length) : 0),
                upazila: upazila,
                division: division,
                zilla: zilla,

            }
        );

    }

    calDSpan(division, zilla, upazila, zi, ui) {
        let dRowSpan = 0;
        if (zi == 0 && ui == 0) {
            if (zilla) {
                division?.zillaList.forEach(element => {
                    dRowSpan += element.upaZillaList.length == 0 ? 1 : element.upaZillaList.length;
                })
            } else {
                dRowSpan = 1
            }
        } else if (zi == 0 && !ui) {
            dRowSpan = division?.zillaList.length;
        } else {
            dRowSpan = 0;
        }
        return dRowSpan;
    }

    calZSpan(zilla, ui) {
        let zRowSpan;
        if (ui === 0) {
            if (zilla == null) {
                zRowSpan = 1;
            } else if (zilla?.upaZillaList.length == 0) {
                zRowSpan = 1;
            } else {
                zRowSpan = zilla?.upaZillaList.length;
            }
        } else {
            zRowSpan = 0;
        }
        return zRowSpan;
    }

    downloadAnnexerOneReport() {
        this.isLoading = true;
        setTimeout(() => {
            if (this.projectSummary != null) {
                this.downloadAnnexerOneReport_pdf('Annexure-I ', 'dpp/annexure1');
            } else {
                this.snackbarHelper.openWarnSnackBarWithMessageEnBn("Must fill all of the data !", "রিপোর্ট পাওয়া যায়নি !");
            }
            this.isLoading = false;
        }, 2000);
        this.getProjectConceptByUuid();
    }

    downloadAnnexerOneReport_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['upazilas'] = JSON.stringify(this.upazilas);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    // ======================== Dpp PHP Annexer ONe report End ==================================================

    // ======================== Dpp PHP Annexer Two report start ==================================================
    downloadAnnexerTwoReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            if (this.isParipatra2016) {

                this.downloadAnnexerTwoReport_pdf('Annexure-II ', 'dpp/annexure2_16');
            } else {
                this.downloadAnnexerTwoReport_pdf('Annexure-II ', 'dpp/annexure2_22');
            }
            this.isLoading = false;
        }, 1000);
        this.downloadAnnexerTwo_Report();
    }

    downloadAnnexerTwo_Report() {
        this.isLoading = true;
        this.objectiveAndCostService.getProjectManagementSetup(this.conceptUuid).subscribe(res => {
            this.getProjectManagementSetupData = res;
        })
    }

    downloadAnnexerTwoReport_pdf($fileName = '', $templateName = '') {

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['getProjectManagementSetupData'] = JSON.stringify(this.getProjectManagementSetupData);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    // ======================== Dpp PHP Annexer Two report End ==================================================

    // ======================== Dpp PHP Annexer Three report Start ===============================================

    annexure5bData(pcId) {
        this.annxGoodService.getAnnexure5bData(pcId).subscribe((res) => {
            this.annexerFiveData = res;
            this.estimatedProjectCost = res;

            this.annexerFiveContingency = res[2];

            if (res) {
                this.annexure5b = res;
            }
            if (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
                let grandTotal = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].dppAnnualPhasingCostTotal[0];
                this.projectCost.gobAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobAmount.toFixed(2));
                this.projectCost.gobFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobFeAmount.toFixed(2));
                this.projectCost.paAmount = this.numberPipe.convertToBanglaNumber((grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2));
                this.projectCost.paRpaAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobThruAmount + grandTotal.spAcAmount.toFixed(2));
                this.projectCost.ownFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.ownFundFeAmount.toFixed(2));
                this.projectCost.ownFundAmount = this.numberPipe.convertToBanglaNumber(grandTotal.ownFundAmount.toFixed(2));
                this.projectCost.othersAmount = this.numberPipe.convertToBanglaNumber(grandTotal.otherAmount.toFixed(2));
                this.projectCost.otherFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.otherFeAmount.toFixed(2));
                this.projectCost.totalAmount = this.numberPipe.convertToBanglaNumber(grandTotal.totalAmount.toFixed(2));

                let fiscalYear = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].grandTotal;


                if (fiscalYear.length > 0) {
                    this.fiscalYearsList = [];
                    for (let k = 0; k < fiscalYear.length; k++) {
                        this.fiscalYearsList.push({
                            fiscalYear: this.numberPipe.convertToBanglaNumber(fiscalYear[k].fiscalYear),
                            govAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.gobAmount.toFixed(2)),
                            govFeAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.gobFeAmount.toFixed(2)),
                            rpaAmount: this.numberPipe.convertToBanglaNumber((fiscalYear[k].dppAnnualPhasingCostTotal.gobThruAmount + fiscalYear[k].dppAnnualPhasingCostTotal.spAcAmount).toFixed(2)),
                            dpaAmount: this.numberPipe.convertToBanglaNumber((fiscalYear[k].dppAnnualPhasingCostTotal.thruPdAmount + fiscalYear[k].dppAnnualPhasingCostTotal.thruDpAmount).toFixed(2)),
                            ownFundAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.ownFundAmount.toFixed(2)),
                            ownFundFeAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.ownFundFeAmount.toFixed(2)),
                            otherAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.otherAmount.toFixed(2)),
                            otherFeAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.otherFeAmount.toFixed(2)),
                            totalAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.totalAmount.toFixed(2)),
                        });
                    }

                }
            } else {
                let grandTotal = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].dppAnnualPhasingCostTotal[0];
                this.projectCost.gobAmount = grandTotal.gobAmount.toFixed(2);
                this.projectCost.gobFeAmount = grandTotal.gobFeAmount.toFixed(2);
                this.projectCost.paAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2);

                this.projectCost.paRpaAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount).toFixed(2);
                this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount.toFixed(2);
                this.projectCost.ownFundAmount = grandTotal.ownFundAmount.toFixed(2);
                this.projectCost.othersAmount = grandTotal.otherAmount.toFixed(2);
                this.projectCost.otherFeAmount = grandTotal.otherFeAmount.toFixed(2);
                this.projectCost.totalAmount = grandTotal.totalAmount.toFixed(2);

                let fiscalYear = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].grandTotal;


                if (fiscalYear.length > 0) {
                    this.fiscalYearsList = [];
                    for (let k = 0; k < fiscalYear.length; k++) {
                        this.fiscalYearsList.push({
                            fiscalYear: fiscalYear[k].fiscalYear,
                            govAmount: fiscalYear[k].dppAnnualPhasingCostTotal.gobAmount.toFixed(2),
                            govFeAmount: fiscalYear[k].dppAnnualPhasingCostTotal.gobFeAmount.toFixed(2),
                            rpaAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.gobThruAmount + fiscalYear[k].dppAnnualPhasingCostTotal.spAcAmount).toFixed(2),
                            dpaAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.thruPdAmount + fiscalYear[k].dppAnnualPhasingCostTotal.thruDpAmount).toFixed(2),
                            ownFundAmount: fiscalYear[k].dppAnnualPhasingCostTotal.ownFundAmount.toFixed(2),
                            ownFundFeAmount: fiscalYear[k].dppAnnualPhasingCostTotal.ownFundFeAmount.toFixed(2),
                            otherAmount: fiscalYear[k].dppAnnualPhasingCostTotal.otherAmount.toFixed(2),
                            otherFeAmount: fiscalYear[k].dppAnnualPhasingCostTotal.otherFeAmount.toFixed(2),
                            totalAmount: fiscalYear[k].dppAnnualPhasingCostTotal.totalAmount.toFixed(2),
                        });
                    }

                }
            }
        })

    }

    checkDppAnnexureIIIData() {
        this.dppAnnexureGoodsIiiAService.getDataList('get-list/Goods/' + this.uuid).subscribe(res => {
            this.goods = res;
            if (res.res == null || res.res == '') {
                this.isDppAnnexureIIIDataEmpty = true;
            } else {
                this.annexureIIIaTotal = res.res.totalAmount;
            }
        })
        this.dppAnnexureGoodsIiiAService.getDataList('get-list/Works/' + this.uuid).subscribe(res => {
            this.works = res;
            if (res.res) {
                this.annexureIIIbTotal = res.res.totalAmount;
            }
        })
        this.dppAnnexureGoodsIiiAService.getDataList('get-list/Service/' + this.uuid).subscribe(res => {
            this.services = res;
            if (res.res) {
                this.annexureIIIcTotal = res.res.totalAmount;
            }
        })
    }
    downloadAnnexerGoods_Pdf() {
        this.isLoading = true;
        if (this.goods.status === 1) {
            this.downloadAnnexerThreeGoodsReport_pdf('Annexure-III(a) Goods ', 'dpp/annexure3a_22');
        } else {
            this.downloadAnnexerThreeGoodsReport_pdf('Annexure-III(a) Goods ', 'dpp/annexure3a_NULL');

        }
        this.getUnitTypeList();
        this.isLoading = false;
    }

    getUnitTypeList() {
        this.unitTypeList = [];
        this.unitTypeService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.unitTypeList.push(m);
            });
        });
    }
    downloadAnnexerThreeGoodsReport_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['goods'] = JSON.stringify(this.goods?.res);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['grandTotal'] = JSON.stringify(this.grandTotalData);
        this.data['unitTypeList'] = JSON.stringify(this.unitTypeList);

        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
        this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
        this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
        this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
        this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // works
    downloadAnnexerWorks_Pdf() {
        this.isLoading = true;
        if (this.works.status === 1) {
            this.downloadAnnexerThreeWorksReport_pdf('Annexure-III(b) Works ', 'dpp/annexure3b_22');
        } else {
            this.downloadAnnexerThreeWorksReport_pdf('Annexure-III(b) Works ', 'dpp/annexure3b_NULL');

        }
        this.isLoading = false;
    }
    downloadAnnexerThreeWorksReport_pdf($fileName = '', $templateName = '') {

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['works'] = JSON.stringify(this.works?.res);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['grandTotal'] = JSON.stringify(this.grandTotalData);

        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
        this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
        this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
        this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
        this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    // services
    downloadAnnexerServices_Pdf() {
        this.isLoading = true;
        // if (this.services.res === "") {
        if (this.services.status === 1) {
            this.downloadAnnexerThreeServicessReport_pdf('Annexure-III(c) Services ', 'dpp/annexure3c_22');
        } else {
            this.downloadAnnexerThreeServicessReport_pdf('Annexure-III(c) Services ', 'dpp/annexure3c_NULL');

        }
        this.isLoading = false;
    }
    downloadAnnexerThreeServicessReport_pdf($fileName = '', $templateName = '') {

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['services'] = JSON.stringify(this.services?.res);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['grandTotal'] = JSON.stringify(this.grandTotalData);

        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
        this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
        this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
        this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
        this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
        this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
        this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
        this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
        this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);

        console.log('services', this.services);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ======================== Dpp PHP Annexer Three report End ==================================
    // ======================== Dpp PHP Annexer Four report Start =================================
    getData() {
        this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
            switchMap(pc => this.annualPhasingCostService.getYearWisePhysicalAndFinancialTargetByProjectConceptId(pc.id).pipe(
                map(gt => ({ pc: pc, gt: gt }))
            ))
        ).subscribe(res => {
            if (!res.pc.isForeignAid) {
                this._translateService.use('bn');
                this.translate = 'bn';
            }
            if (res.gt) {
                this.fiscalYearsEn = res.gt[0].details[0].years.map(m => m.fiscalYear);
                this.fiscalYearsBn = res.gt[0].details[0].years.map(m => (this.numberPipe.getBanglaString(m.fiscalYear.substr(0, 4)) + "-"
                    + this.numberPipe.getBanglaString(m.fiscalYear.substr(5, 4))));
                this.colspan = (res.gt[0]?.details[0].years.length * 3) + 8;
                this.data = res.gt;
                this.revenue = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0];

                res.gt[1].details?.forEach(fWeit => {
                    fWeit.years?.forEach(fiscalAmount => {
                        this.fiscalYear = fiscalAmount.fiscalYear;
                    })
                })



                this.revenue.details?.forEach(fWeit => {
                    this.totalRevenueWeight = this.totalRevenueWeight + fWeit.weight;
                })

                this.capital = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0];
                this.capital.details?.forEach(fCaWeit => {
                    this.totalCapitalWeight = this.totalCapitalWeight + fCaWeit.weight;
                })

                this.capital = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0];
                this.contingency = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0];
                this.grand = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0];
                console.log('grand grand grand ', this.grand);
                this.revenue.details.forEach((detail) => {
                    let newYears: any = [];
                    detail.years.forEach(year => {
                        newYears.push(year);
                    })
                    this.revenue.years = newYears;
                    this.yrs = newYears;
                })

                this.show = false;
            } else {
                this.show = false;
            }

        });
    }
    downloadAnnexureFourPhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            if (this.yrs != null) {

                this.isLoading = true;
                if (this.isParipatra2016) {
                    this.downloadAnnexerFourReport_pdf('Annexure-IV ', 'dpp/annexure4_16');
                } else {
                    this.downloadAnnexerFourReport_pdf('Annexure-IV ', 'dpp/annexure4_22');
                }
                this.isLoading = false;

            } else {
                this.downloadAnnexerFourReport_pdf('Annexure-IV ', 'dpp/AnnexerYearWiseFinancial_NULL');
            }
            this.isLoading = false;
        }, 4000);
        this.getData();
    }
    downloadAnnexerFourReport_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['revenue'] = JSON.stringify(this.revenue);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['capital'] = JSON.stringify(this.capital);
        this.data['contingency'] = JSON.stringify(this.contingency);
        this.data['grand'] = JSON.stringify(this.grand);
        this.data['yrs'] = JSON.stringify(this.yrs);
        this.data['subTotalRevObj'] = JSON.stringify(this.subTotalRevObj);
        this.data['subTotalCapObj'] = JSON.stringify(this.subTotalCapObj);
        this.data['totalRevenueWeight'] = JSON.stringify(this.totalRevenueWeight);
        this.data['totalCapitalWeight'] = JSON.stringify(this.totalCapitalWeight);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    // ======================== Dpp PHP Annexer Four report End ==================================
    // ======================== Dpp PHP Annexer Five A report start ==================================

    private getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.isForeignAid = res.isForeignAid;
            })
        );

        this.subscribe$.add(
            this.annualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
                res.dppAnnualPhasingCostDTOList.forEach(e => {
                    if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                        this.revenueList = e.estimatedCostTabDetailsDTOS;
                        this.revenueTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                        this.capitalList = e.estimatedCostTabDetailsDTOS;
                        this.capitalTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                        this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                        this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                    }
                });
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            })
        );
    }

    downloadAnnexureFive_A_PhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = true;
            if (this.isParipatra2016) {
                this.downloadAnnexerFive_A_Report_pdf('Annexure-V(a) ', 'dpp/annexure5a_16');
            } else {
                this.downloadAnnexerFive_A_Report_pdf('Annexure-V(a) ', 'dpp/annexure5a_22');
            }

            this.isLoading = false;
        }, 2000);
        this.getAll();

    }
    downloadAnnexerFive_A_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }


    // ======================== Dpp PHP Annexer Five A report End ==================================
    // ======================== Dpp PHP Annexer Five B report Start ==================================

    getGrandAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(pc => this.annualPhasingCostService.getGrandTotalByProjectConceptId(pc.id).pipe(
                    map(gt => ({ pc: pc, gt: gt }))
                ))
            ).subscribe(res => {
                console.log('dpp',res);
                this.subTotalRevObj = res.gt[0].dppAnnualPhasingCostTotal[0];
                this.subTotalCapObj = res.gt[1].dppAnnualPhasingCostTotal[0];

                this.conceptId = res.pc.id;
                this.grandTotal = res.gt;
                this.fiscalYearLists = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
                this.revenueTotalDa = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.dppAnnualPhasingCostTotal[0];
                this.capitalTotalDa = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.dppAnnualPhasingCostTotal[0];
                this.contingencyTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0] ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal : [];
                this.grantTotalDa = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.dppAnnualPhasingCostTotal[0];
                this.revenueLists = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
                this.capitalLists = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
                this.contingencyList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
                this.grandList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.grantTotalDa.totalAmount = (this.revenueTotal ? this.revenueTotal.totalAmount : 0) +
                    (this.capitalTotal ? this.capitalTotal.totalAmount : 0) +
                    (this.contingencyTotal[0] ? this.contingencyTotal[0].totalAmount : 0) +
                    (this.contingencyTotal[1] ? this.contingencyTotal[1].totalAmount : 0);
                const length = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.length;
                if (length > 0) {
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.forEach((e, i) => {
                        if (i < (length / 2)) {
                            this.physicalContingencyList.push(e);
                        } else {
                            this.priceContingencyList.push(e);
                        }
                    });
                }
                this.show = false;
            })
        );
    }
    downloadAnnexureFive_B_PhpReport() {
        this.isLoading = true;
        setTimeout(() => {
            if (this.isParipatra2016) {
                this.downloadAnnexerFive_B_Report_pdf('Annexure-V(b) ', 'dpp/annexure5b_16');
            } else {
                this.downloadAnnexerFive_B_Report_pdf('Annexure-V(b) ', 'dpp/annexure5b_22');
            }
            this.isLoading = false;
        }, 3000);
        this.getAll();
        this.getGrandAll();

    }

    downloadAnnexerFive_B_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['annexerFiveData'] = JSON.stringify(this.annexerFiveData);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['fiscalYearLists'] = JSON.stringify(this.fiscalYearLists);
        this.data['revenueLists'] = JSON.stringify(this.revenueLists);
        this.data['capitalLists'] = JSON.stringify(this.capitalLists);
        this.data['grandList'] = JSON.stringify(this.grandList);
        this.data['physicalContingencyList'] = JSON.stringify(this.physicalContingencyList);
        this.data['priceContingencyList'] = JSON.stringify(this.priceContingencyList);



        this.data['fiscalYearWiseCost'] = JSON.stringify(this.fiscalYearWiseCost);
        this.data['fiscalYearWiseCapitalCost'] = JSON.stringify(this.fiscalYearWiseCapitalCost);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // ======================== Dpp PHP Annexer Five B report End ==================================
    // =============== DPP anexxer 6 PHP REPORT start =====================================

    downloadAnnexureSixPhpReport() {
        this.spinner = true;
        setTimeout(() => {
            if (this.projectSummary != null) {
                this.downloadAmortizationReport('Annexure-VI ', 'dpp/annexure6');
            } else {
                this.downloadAmortizationReport('Annexure-VI ', 'dpp/annexure6_NULL');
            }
            this.spinner = false;
        }, 5000);
        this.getLoanCredit();
    }

    // annexer seven report


    getDataByProjectConceptUuid() {
        this.isLoading = true;
        this.dppMtbfService.getByProjectConceptUuid(this.conceptUuid).subscribe(res => {
            this.mtbfObj = res;
            this.mtbfFiscalYearModelList = res.mtbfFiscalYearDetailList;
            this.uuid = res.uuid;
            this.isLoading = false;
        })
    }

    downloadAnnexureVIIPhpReport() {
        this.isLoading = true;
        this.getDataByProjectConceptUuid();
        setTimeout(() => {
            this.downloadAnnexerSeven_Report_pdf('Annexure-VII ', 'dpp/annexure7');
            this.isLoading = false;
        }, 2000);
    }


    downloadAnnexerSeven_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['mtbfObj'] = JSON.stringify(this.mtbfObj);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    getLoanCredit() {
        this.isLoading = true;
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
            this.getByProjectConcept = response;
            this.modeFinanc = response;
            this.titleEn = response.res.projectTitleEn;
            let res = response.res;
            if (res.modeFinanceList != null) {
                res.modeFinanceList.forEach(re => {
                    if (re.modeSource === "Loan/Credit" || re.modeSource === "ঋণ") {
                        this.loanPortion = re.gob;
                        if (re.gob || re.gobFe || re.others || re.othersFe || re.ownFund || re.ownFundFe || re.pa || re.paRpa)
                            this.gobAmount = true;
                    }
                })
            } else {
                this.gobAmount = false;
            }
        })
        this.getAmortizationSchedule();

        this.isLoading = false;
    }
    getAmortizationSchedule() {
        this.service.getAmortizationSchedule(this.uuid).subscribe((response) => {
            setTimeout(() => {
                this.dynamicRow();
            }, 2000);
            this.amortizationSchedule = response;
            let res = response.res;
            this.loanPeriod = res.loanPeriod;
            this.gracePeriod = res.gracePeriod;
            this.rateOfInterest = res.rateOfInterest;
        })
    }
    addMultipleRow(res: any, length: number) {
        this.loanPeriods = [];
        let a = this.loanPortion;
        for (let i = 0; i < res; i++) {
            let yfa = (this.loanPortion / this.loanPeriod);
            let yip = (this.rateOfInterest) / 100;
            this.loanPeriods.push({
                year: i + length + 1,
                beginingPrincipalAmount: (i === 0) ? this.loanPortion : a,
                yearlyFixedAmount: yfa,
                yearlyInterestPaid: (a * yip).toFixed(2),
                totalPayment: (yfa + (a * yip)).toFixed(2),
                endingPrincipalBalance: i == res - 1 ? '0' : (a - yfa).toFixed(2),
                projectConceptMasterId: this.id
            })
            a = this.loanPeriods[i].endingPrincipalBalance;
        }
    }

    addGracePeriod(res: any) {
        this.gracePeriods = [];
        for (let i = 0; i < res; i++) {
            this.gracePeriods.push({
                year: i + 1,
                beginingPrincipalAmount: this.loanPortion,
                yearlyFixedAmount: "0.00",
                yearlyInterestPaid: ((this.loanPortion * this.rateOfInterest) / 100).toFixed(2),
                totalPayment: ((this.loanPortion * this.rateOfInterest) / 100).toFixed(2),
                endingPrincipalBalance: (this.loanPortion).toFixed(2),
                projectConceptMasterId: this.id
            })
        }
    }

    dynamicRow() {
        this.addGracePeriod(this.gracePeriod);
        this.addMultipleRow(this.loanPeriod, Number(this.gracePeriod));
    }

    downloadAmortizationReport($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['agency'] = JSON.stringify(this.agencyModel);
        this.data['projectSummaryObj'] = JSON.stringify(this.projectSummary);
        this.data['projectSummary'] = JSON.stringify(this.projectSummary);
        this.data['amortizationSchedule'] = JSON.stringify(this.amortizationSchedule);
        this.data['loanPortion'] = JSON.stringify(this.loanPortion);
        this.data['totalInvestmentAmount'] = JSON.stringify(this.totalInvestmentAmount);
        this.data['gracePeriods'] = JSON.stringify(this.gracePeriods);
        this.data['loanPeriods'] = JSON.stringify(this.loanPeriods);
        this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    /* Dpp Remaining Time Condition*/
    getDppRemainingTimeConditionForwardMinistryToPlanningCommission(): void {
        const model: any = {};
        model.dppMasterId = this.dppMasterId;
        this.projectMovementService.getDppRemainingTimeConditionFMP(model).subscribe(res => {

            console.log(res);

            const numberOfDaysToAdd = 10;
            //this.isEnableRemainingTimeForwardToPlanCom = true;
            //this.dppRemainingMovementTime = new Date('Jan 01 2023 23:52:00');
            this.isEnableRemainingTimeForwardToPlanCom = res.res.enableWarningTimer;
            this.dppRemainingMovementTime = new Date(res.res.movementTime);
            this.dppRemainingMovementTime.setDate(this.dppRemainingMovementTime.getDate() + numberOfDaysToAdd);

            if (this.dppRemainingMovementTime.getTime() > new Date().getTime() && this.isEnableRemainingTimeForwardToPlanCom) {
                this.subscription = timer(0, 1000)
                    .subscribe(x => {
                        this.getTimeDifference();
                    });
            } else {
                this.isRemainingTimeExpire = true;
            }
        })
    }
    private getTimeDifference() {
        if (this.dppRemainingMovementTime.getTime() < new Date().getTime()) {
            this.isRemainingTimeExpire = true;
            this.subscription.unsubscribe();
            return;
        }
        this.timeDifference = this.dppRemainingMovementTime.getTime() - new Date().getTime();
        this.allocateTimeUnits(this.timeDifference);
    }

    private allocateTimeUnits(timeDifference) {
        this.secondsToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
        this.minutesToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
        this.hoursToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
        this.daysToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    }

    ngOnDestroy() {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
    }

    // ============================================ DPP anexxer 6 PHP REPORT end =====================================

}
