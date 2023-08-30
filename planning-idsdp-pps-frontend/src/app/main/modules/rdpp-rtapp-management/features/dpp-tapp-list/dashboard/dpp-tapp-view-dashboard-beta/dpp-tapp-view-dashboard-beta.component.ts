import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

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
import {ProcurementMethodModel} from "../../../../../configuration-management/models/procurement-method.model";
import {DEFAULT_PAGE} from "../../../../../../core/constants/constant";
import {DashboardAttachmentModel} from "../../../../../project-concept-management/models/dashboard-attachment.model";
import {MatTableDataSource} from "@angular/material/table";
import {IProjectConcept} from "../../../../../project-concept-management/models/project-concept";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {ActivatedRoute, Router} from "@angular/router";
import {
    DashboardAttachmentService
} from "../../../../../project-concept-management/services/dashboard-attachment.service";
import {EnothiDakSubmissionService} from "../../../../../../core/services/enothi-dak-submission.service";
import {DatePipe} from "@angular/common";
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {ERROR, FAILED_SAVE, FAILED_UPDATE, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../../core/constants/message";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {
    CommentObservationComponent
} from "../../../../../project-concept-management/features/project-concepts/comment-observation/comment-observation.component";
import {ReportDataService} from 'app/main/shared/services/report-data.service';
import {ReportCommonService} from 'app/main/core/services/report-common.service';
import {TranslateService} from "@ngx-translate/core";
import {DppAnnualPhasingConstant} from "../../../../constants/dpp-annual-phasing.constant";
import {SendToDakComponent} from 'app/main/shared/components/send-to-dak/send-to-dak.component';
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {MatSelectChange} from "@angular/material/select";
import {DateBengaliPipe} from '../../../../../../shared/pipes/date-bengali-pipe';
import {DATE_ENG_FORMAT} from '../../../../../../shared/constant/formatter.constant';
import {FileUploadService} from "../../../../../../core/services/file-upload.service";
import {NumberPipe} from "../../../../../../shared/pipes/number-pipe.pipe";
import {ProjectMovementStageConstant} from "../../../../constants/project-movement-stage-constant";
import {
    ProjectMovementService as StageMovementService,
    ProjectMovementService
} from "../../../../services/project-movement.service";
import {ProjectMovementStageModel} from "../../../../models/project.movement.model";
import {UserGroupService} from 'app/main/modules/configuration-management/services/user-group.service';
import {
    DeskUserMovementComponent
} from "../../../../../../shared/components/desk-user-movement/desk-user-movement.component";
import {FeedbackMovementService} from 'app/main/core/services/feedback-movement.service';
import {SectorService} from "../../../../../configuration-management/services/sector.service";
import {SubSectorService} from "../../../../../configuration-management/services/sub-sector.service";
import {SectorModel} from "../../../../../configuration-management/models/sector.model";
import {SubSectorModel} from "../../../../../configuration-management/models/sub-sector.model";
import {SectorDivisionModel} from "../../../../../configuration-management/models/sector-division.model";
import {SectorDivisionService} from "../../../../../configuration-management/services/sector-division.service";
import {locale as lngEnglishAction} from "../../../../../../../layout/layouts/vertical/classy/i18n/en";
import {DppObjectiveCostModel} from "../../../../models/dppObjectiveCost.model";
import {TappObjectiveCostModel} from "../../../../models/tappObjectiveCost.model";
import {CommentSourceEnum} from "../../../../../project-concept-management/enums/comment-source.enum";
import {AgencyService} from "../../../../../configuration-management/services/agency.service";
import {ClassyLayoutComponent} from "../../../../../../../layout/layouts/vertical/classy/classy.component";
import {NgxBootstrapConfirmService} from "ngx-bootstrap-confirm";
import {ModeOfFinanceModel} from "../../../../../feasibility-study-management/models/mode-of-finance.model";
import {IFiscalYearRequest} from "../../../../models/fiscal-year-request";
import {IDppPhasingCostTotal} from "../../../../models/dpp-phasing-cost-total";
import {DppLocationWiseCostBreakdownService} from "../../../../services/dpp-location-wise-cost-breakdown.service";
import {DppProjectManagementSetupService} from "../../../../services/dpp-project-management-setup.service";
import {DppAnnexureGoodsIiiAService} from "../../../../services/dpp-annexure-goods_iii_a.service";
import {UserProfileService} from 'app/main/modules/auth/services/user.profile.service';
import {MatSort} from "@angular/material/sort";
import {
    DashboardAttachmentDetailsModel
} from "../../../../../project-concept-management/models/dashboard-attachment-details.model";
import {RdppAnnualPhasingCostService} from "../../../../services/rdpp-annual-phasing-cost.service";
import {RtappAnnualPhasingCostService} from "../../../../services/rtapp-annual-phasing-cost.service";
import {ProjectRequestModel} from 'app/main/modules/dpp-tapp-management/models/project-request.model';
import {LayoutHelperService} from 'app/layout/layouts/vertical/services/layout-helper.service';
import {RdppObjectiveCostService} from 'app/main/modules/rdpp-rtapp-management/services/rdpp-objective-cost.service';
import {PotroJariComponent} from 'app/main/shared/components/potro-jari/potro-jari.component';
import {StatusStage} from 'app/main/modules/dpp-tapp-management/constants/stage-status-constant';
import {
    DppAnnualPhasingCostService
} from 'app/main/modules/dpp-tapp-management/services/dpp-annual-phasing-cost.service';
import {DppObjectiveCostService} from 'app/main/modules/dpp-tapp-management/services/dpp-objective-cost.service';
import * as moment from 'moment';
import {ImplementationWorkScheduleModel} from "../../../../models/rtapp-annexure-two.model";
import {IDppLocationWiseCostBreakdown} from "../../../../models/dpp-location-wise-cost-breakdown.model";
import {UpazillaModel} from "../../../../../configuration-management/models/upazilla.model";
import {DivisionModel} from "../../../../../configuration-management/models/division.model";
import {environment, reportBackend} from "../../../../../../../../environments/environment";
import {DppAmortizationScheduleService} from "../../../../services/dpp-amortization-schedule.service";
import {ProcurementTypeService} from "../../../../../configuration-management/services/procurement-type.service";
import {RdppAnnexureGoodsService} from "../../../../../dpp-tapp-management/services/rdpp-annexure-goods.service";
import {ProcurementMethodService} from "../../../../../configuration-management/services/procurement-method.service";
import {ImplementationWorkScheduleService} from "../../../../services/rtapp-annexure-two.service";
import {TappAnnexureGoodsService} from "../../../../services/tapp-annexure/tapp-annexure-goods.service";
import {UnitTypeService} from "../../../../../configuration-management/services/unit-type.service";
import {RdppLocationService} from "../../../../services/rdpp-location.service";
import {RdppReportService} from "../../../../services/rdpp-report.service";
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {AssingEcnecMeetingService} from 'app/main/modules/rdpp-rtapp-management/services/assign-ecnec-meeting.service';
import {CookieService} from 'ngx-cookie-service';
import {DashboardService} from 'app/main/modules/dpp-tapp-management/services/dashboard.service';
import {ITppPhasingCostTotal} from "../../../../models/tpp-phasing-cost-total";
import {
    TappAnnualPhasingCostService
} from 'app/main/modules/dpp-tapp-management/services/tapp-annual-phasing-cost.service';
import {DppLocationService} from "../../../../../dpp-tapp-management/services/dpp-location.service";
import {EconomicCodeService} from "../../../../../configuration-management/services/economic-code-service.service";
import {SubEconomicCodeService} from "../../../../../configuration-management/services/sub-economic-code.service";
import {
    DppAnnualPhasingCostTabDetailsWithName
} from "../../../../models/dpp-annual-phasing-cost-tab-details-with-name.model";
import {FiscalYearWiseTotalCost} from "../../../../models/fiscal-year-wise-total-cost.model";
import {log} from "util";



import * as bl2Js from 'bl2-js-report';
import { IDppAnnualPhasingEstimatedCostTabDetails } from 'app/main/modules/rdpp-rtapp-management/models/dpp-annual-phasing-estimated-cost-tab-details';
import { map, switchMap } from 'rxjs/operators';
import { ITppAnnualPhasingCostTabDetails } from 'app/main/modules/rdpp-rtapp-management/models/tpp-annual-phasing-cost-tab-details';
import { RTppAnnualPhasingCostWithChildDetailsResponse } from 'app/main/modules/rdpp-rtapp-management/models/tpp-annual-phasing-cost-with-child-respone';
import { SubEconomicCodeModel } from 'app/main/modules/configuration-management/models/sub-economic-code-model';
import { IOption } from 'app/main/shared/model/option';
import { EstimatedCostModel } from 'app/main/modules/rdpp-rtapp-management/models/estimated-cost.model';
import { FinancialAnalysisService } from '../../project-details/services/financial-analysis.service';
import { TermOfReferenceReportService } from 'app/main/modules/dpp-tapp-management/services/term-of-reference-report.service';
import { TappWorkScheduleService } from 'app/main/modules/dpp-tapp-management/services/tapp-work-schedule.service';
import { TappWorkScheduleModel } from 'app/main/modules/dpp-tapp-management/models/tapp-work-schedule.model';
import { ZillaModel } from 'app/main/modules/configuration-management/models/zilla.model';


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
    selector: 'app-dpp-tapp-view-dashboard-beta',
    templateUrl: './dpp-tapp-view-dashboard-beta.component.html',
    styleUrls: ['./dpp-tapp-view-dashboard-beta.component.scss']
})
export class DppTappViewDashboardBetaComponent extends UnsubscribeAdapterComponent implements OnInit {
    // chart design
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callDownloadGODialog') callDownloadGODialog: TemplateRef<any>;
    @ViewChild('callDownloadRelatedInfoDialog') callDownloadRelatedInfoDialog: TemplateRef<any>;
    @ViewChild('callAttachmentDialogForMeeting') callAttachmentDialogForMeeting: TemplateRef<any>;
    @ViewChild('attachmentMeetingDialog') attachmentMeetingDialog: TemplateRef<any>;
    @ViewChild('commentAndObservationDialog') commentAndObservationDialog: TemplateRef<any>;
    @ViewChild('conditionalApproveByEcnecDialog') conditionalApproveByEcnecDialog: TemplateRef<any>;
    @ViewChild('relatedMeetingAttachmentDialog') relatedMeetingAttachmentDialog: TemplateRef<any>;
    @ViewChild('pscDialog') pscDialog: TemplateRef<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    procurementMethodList: ProcurementMethodModel[] = new Array<ProcurementMethodModel>();
    size: number = 2;
    page: number = DEFAULT_PAGE;
    total: number;
    totalAmountAnnexure5B: number;
    projectMovementModel: ProjectMovementStageModel = new ProjectMovementStageModel();
    currentMovementStage: CurrentMovementStage = new CurrentMovementStage();
    projectRequestModel: ProjectRequestModel = new ProjectRequestModel();
    revisedVersion: string;
    revisedVersionBn: string;

    meetingNotice = [
        {id: 0, name: 'DPEC MEETING NOTICE'},
        {id: 1, name: 'DPEC MEETING HELD'},
        {id: 2, name: 'DSPEC MEETING NOTICE'},
        {id: 3, name: 'DSPEC MEETING HELD'},
        {id: 4, name: 'PSC MEETING NOTICE'},
        {id: 5, name: 'PSC MEETING HELD'},
        {id: 6, name: 'PEC MEETING NOTICE'},
        {id: 7, name: 'PEC MEETING HELD'},
        {id: 8, name: 'SPEC MEETING NOTICE'},
        {id: 9, name: 'SPEC MEETING HELD'},
    ];

    workingPaperTypes = [
        {id: 0, name: 'DPEC Meeting Working Paper'},
        {id: 1, name: 'PSC Meeting Working Paper'},
        {id: 2, name: 'PEC Meeting Working Paper'},
        {id: 3, name: 'DSPEC Meeting Working Paper'},
        {id: 4, name: 'SPEC Meeting Working Paper'},
    ];

    dashboardAttachmentModels: DashboardAttachmentModel[] = new Array<DashboardAttachmentModel>();
    displayedColumns: string[] = ['id', 'name', 'progress'];
    dataSource: MatTableDataSource<DashboardAttachmentDetailsModel>;
    projectSummary: IProjectConcept;
    chartOptions: Partial<ChartOptions>;
    observer: 'A' | 'MD' | 'PC' = 'A';
    frmGroup: FormGroup;
    file: File;
    title: any;
    pcId: number;
    uuid: string;
    objectiveAndCostUuid: string;

    titleEn: string;
    titleBn: string;
    commencementDate: string;
    completionDate: string;
    projectConceptId: number;
    rdppMasterId: number;
    rtappMasterId: number;
    currentStage: string;
    rdppRtappMasterId: number;

    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    meetingAttachment={};
    assignedPlanningDeskOfficer:any;

    userGroupModel: any;
    sector: SectorModel;
    subSector: SubSectorModel;
    sectorDivision: SectorDivisionModel;
    agencyModel: any;
    totalAllocationByAgency: number = 0;
    totalExpenseByAgency: number = 0;

    isLoading: boolean | false;

    movementStatusList = [];
    projectStatus: string;
    nothiStatus = 'Draft';

    potroJari: boolean = false;
    potroUrl = null;
    projectStage: string;
    totalAnnexureAmount: number = 0;

    downloadReportFormGroup: FormGroup;
    actionPermission = [];
    show = true;
    canEdit = false;
    objectivesAndCost: DppObjectiveCostModel | TappObjectiveCostModel;
    referenceObjectiveCost: DppObjectiveCostModel | TappObjectiveCostModel;
    modelOfFinanceList = [];
    totalModeOfFinance: ModeOfFinanceModel = {} as ModeOfFinanceModel;
    preTotalModeOfFinance: ModeOfFinanceModel = {} as ModeOfFinanceModel;

    //======== Start for button validation ============
    isReturnToAgencyDesk: boolean = false;
    isReturnToAgencyHead: boolean = false;
    showButtonSendToNothi: boolean = false;
    enableNothiButtonMOFAndAnnexure5BDataIsEqual: boolean = false;

    isForwardToMinistryHead: boolean = false;
    isForwardToMinistryDesk: boolean = false;
    isForwardToPlanningHead: boolean = false;
    isForwardToPlanningDesk: boolean = false;
    isForwardToPlanningMinister: boolean = false;
    isReturnToMinistryHead: boolean = false;
    isForwardToEcnec: boolean = false;
    isInPlanningMinister: boolean = false;
    isInEcnec: boolean = false;

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
    isPotroJariAttachPlancomm = false;
    isDownloadGO = false;
    isPotroJariAttachMinistry = false;

    isEcnecMeetingAssignDone: boolean = false;
    isDppPartAConcernedDivisionIdEmpty: boolean = false;
    isDppObjectiveTargetsDataEmpty: boolean = false;
    isDppAnnexure5BDataEmpty: boolean = false;
    // isDppPartBDataEmpty: boolean = false;
    isDppPartADataEmpty: boolean = false;
    isDppAnnexureIDataEmpty: boolean = false;
    isDppAnnexureIIIDataEmpty: boolean = false;

    isMinistryMeetingPaperAttached: boolean = false;
    isPlanningMeetingPaperAttached: boolean = false;
    // isTappApproveInMinistry: boolean = false;

    inForwardEcnecOfficer: boolean = false;
    isForwardEcnecDeskOfficer: boolean = false;

    isConditionalApproveByEcnec: boolean = false;
    isUapproveByEcnec: boolean = false;

    isEcnecApprove: boolean = false;
    isEcnecConditionalApprovedInStage: boolean = false;
    previousEcnecConditionApproved='';

    isNoteCompletetion: boolean = false;
    manualPotroJari: boolean = false;

    isTapp: boolean = false;
    // isTappDesignationContactPersonDataEmpty: boolean = false;
    // isTappObjectiveTargetsDataEmpty: boolean = false;
    // isTappResponsiblePreparation: boolean = false;
    isTappAnnexureIDataEmpty: boolean = false;
    isTappCumulativeProgressDataEmpty: boolean = false;
    isImplementingWorkScheduleEmpty: boolean = false;
    isTappPartADataEmpty: boolean = false;

    isRdppApprovedInMinistry: boolean = false;
    isRdppApprovedInPlancom: boolean = false;
    isRdppApprovedByPlancomMinister: boolean = false;
    isRdppApprovedByEcnec: boolean = false;
    //========== End for button validation ============

    year: number;
    month: number;

    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    movementStageList: ProjectMovementStageModel[] = [];

    spinner: boolean = false;
    isEnLabel: boolean;

    meetingType: boolean;
    setMeetingType: string;
    paperType: boolean;
    setWorkingPaperType: string;
    statusStage = new StatusStage();

    sizeProjectMovement: number = 2;
    pageProjectMovement: number = DEFAULT_PAGE;
    totalProjectMovement: number;
    dataSourceMovementStageAttachment: MatTableDataSource<DashboardAttachmentDetailsModel>;
    forwardReturnAction: string;

    /** Variable declear for report --Start */

    // Annexure- I(a), (b)
    rtappProjectInfo: any;
    rtappGoodsAndServiceList: any;
    rtappProjectCost = {
        totalAmount:0,
        gobAmount: 0,
        paAmount: 0,
        ownFundAmount: 0,
    }

    // Annexure- II
    pmWorkPlanList: ImplementationWorkScheduleModel[] = [];
    fiscalYearList: any[] = []
    fiscalYearLists: { fiscalYear: string; }[]=[];

    dateCommencement: any;
    dateCompletion: any;
    isLoad: boolean = true;

    // Annexure-I
    data: any = {};
    currentUpazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel }[] = [];
    locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
    originalUpazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel }[] = [];
    conceptId: number;
    saveDisable = false;
    locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };

    // Annexure-IV
    gobAmount: boolean;
    amortizationSchedule:any;
    // Annexure-3-all
    projectInfo: any;
    goodsWorkAndServiceList: any;
    project_name: string;
    projectCost = {
        totalAmount:0,
        gobAmount: 0,
        paAmount: 0,
        ownFundAmount: 0,
        others: 0,
    }
    /** Part-A */
    rdppObjectCost: DppObjectiveCostModel = new DppObjectiveCostModel();
    estimatedCostCal = {
        percentageTotal: 0,
        percentageGob: 0,
        percentageOwnFund: 0,
        percentageOther: 0,
        percentagePA: 0,
        totalOfTotal: 0,
        gobTotal: 0,
        ownFundTotal: 0,
        otherAmountTotal: 0,
        paTotal: 0,
    }
    /** For 8 no table-->Start*/
    refRevenueItems: IDppPhasingCostTotal[] = [];
    refRevenueItemLst: IDppPhasingCostTotal[] = [];
    currRevenueItems: IDppPhasingCostTotal[] = [];
    currRevenueItemLst: ITppPhasingCostTotal[] = [];

    refCapitalItems: IDppPhasingCostTotal[] = [];
    refCapitalItemLst: IDppPhasingCostTotal[] = [];
    currCapitalItems: IDppPhasingCostTotal[] = [];
    currRevenueItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();
    refCapitalItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();
    currCapitalItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();
    refRevenueItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();

    refRevenueGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    currRevenueGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    refCapitalGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    currCapitalGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    refPhysicalContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    currPhysicalContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    refPriceContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    currPriceContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    refGrandTotalObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
    currGrandTotalObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();

    currFiscalYearList: { fiscalYear: string }[] = [];
    currRevenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    currCapitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    currContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    currPhysicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    currPriceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    currGrandTotalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];

    refFiscalYearList: { fiscalYear: string }[] = [];
    refRevenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    refCapitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    refContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    refPhysicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    refPriceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    refGrandTotalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
    /** For 8 no table-->End*/

    /** For 9 no table-->Start*/
    revenueTotal: IDppPhasingCostTotal;
    capitalTotal: IDppPhasingCostTotal;
    phyContingencySubTotal: IDppPhasingCostTotal;
    priceContingencySubTotal: IDppPhasingCostTotal;
    grantTotal: IDppPhasingCostTotal;
    revenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    capitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    grandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    // revItem:  any = [];
    revItemCumulative: DppAnnualPhasingCostTabDetailsWithName [] = [];
    capItemCumulative: DppAnnualPhasingCostTabDetailsWithName [] = [];
    revItemYearWIse: {fiscalYear: DppAnnualPhasingCostTabDetailsWithName} [] = [];
    capItemYearWIse: {fiscalYear: DppAnnualPhasingCostTabDetailsWithName} [] = [];
    contingencyItemYearWIse: {fiscalYear: DppAnnualPhasingCostTabDetailsWithName} [] = [];
    /** For 9 no table-->End*/
    /** Variable declear for report --End */

    ecnecConditionFormGroup: FormGroup;
    rtappGrandTotal: number;
    rdppGrandTotal: number;
    refTappGrandTotal: ITppPhasingCostTotal;
    referenceId: number;

    fiscalYearList2: any[] = []
    rtappGrandList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    rdppGrandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];

    // Cumulative progress
    conceptUuid: any;
    isForeignAid: boolean;
    masterId: number;
    rtappAnnualPhasingCost: any[] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    tappMasterId: number;


    //fiscal year
    revenueArray: { form: FormGroup, details: ITppAnnualPhasingCostTabDetails }[] = [];
    rtappObjModel: TappObjectiveCostModel;
    revenueComponentInRdppFound: boolean = true;
    tppAnnualPhasingCostWithChildDetails: RTppAnnualPhasingCostWithChildDetailsResponse;
    subEconomicCodes: { index: number, codes: SubEconomicCodeModel[] }[] = [];
    subEconomicList: { index: number, codes: IOption[] }[] = [];
    rtappVersion: string;
    estimatedCosts: EstimatedCostModel[];

    mofListRes: any;
    mofList: any;
    estimatiedCostTotal: any;
    financialAnalysisServiceData: any;
    isUpdate: boolean;
    attachmentList: any = [];
    isPscNotice: boolean =false;
    isPscWorkingPaper: boolean =false;

    isPEC: boolean = false;
    isDPEC: boolean = false;
    isSPEC: boolean = false;
    isDSPEC: boolean = false;
    isPSC: boolean = false;
    isProjectSecrutinyCommite: boolean = false;
    isPIC: boolean = false;

    private reportIndex: number;

    termOfRef: FormGroup;

    termOfRefSave: boolean = true;
    termOfRefUpdate: boolean = false;
    termOfRefDownload: boolean = false;
    rtappObjectiveCostServiceDataList: TappObjectiveCostModel;
    pmWorkPlanServiceDataList: any;
    tappWorkPlanList: any;
    viewWorkScheduleDataCheckList: TappWorkScheduleModel[] = [];
    tappWorkPlanReportList: TappWorkScheduleModel[] = [];
    rtappReportDataList: any;
    rtappReportcapiDataList: any;
    divisionDataList: any;
    upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, division: DivisionModel, upazila: UpazillaModel, zilla: ZillaModel}[] = [];
    tappGetRespon: any;
    fiscalYearsList: Array<{
        fiscalYear: string, revisedVersion: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
        ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
    }> = [];
    mainFeaturesOfRevision: string;
    rtappAnualCostService: any;
    cumulativeDate: any;


    // 11
    revenueItemList: ITppAnnualPhasingCostTabDetails[]=[];
    fiscalYearWiseRevenueCostList: { fiscalYear: string; values: IFiscalYearRequest[]; tappAnnualPhasingCostTotal: ITppPhasingCostTotal; }[]=[];
    revenueSubTotal: ITppPhasingCostTotal =  {} as ITppPhasingCostTotal;
    capitalItemList: ITppAnnualPhasingCostTabDetails[]=[];
    fiscalYearWiseCapitalCostList: { fiscalYear: string; values: IFiscalYearRequest[]; tappAnnualPhasingCostTotal: ITppPhasingCostTotal; }[]=[];
    capitalSubTotal: ITppPhasingCostTotal =  {} as ITppPhasingCostTotal;
    contingencyItemList: ITppAnnualPhasingCostTabDetails[]=[];
    fiscalYearWiseContingencyCostList: { fiscalYear: string; values: IFiscalYearRequest[]; tappAnnualPhasingCostTotal: ITppPhasingCostTotal; }[]=[];
    grandTotal: ITppPhasingCostTotal = {} as ITppPhasingCostTotal;
    fiscalYearWiseGrandTotalList: { fiscalYear: string; tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[]=[];
    originalCommencementDate: any;
    originalCompletionDate: any;
    dateList: any;


    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private projectSummaryService: ProjectSummaryService,
        private sectorService: SectorService,
        private stageMovementService: StageMovementService,
        private subSectorService: SubSectorService,
        private sectorDivisionService: SectorDivisionService,
        private agencyService: AgencyService,
        private dialog: MatDialog,
        private snackbarHelper: SnackbarHelper,
        private route: Router,
        private rdppObjectiveCostService: RdppObjectiveCostService,
        private rtappObjectiveCostService: TappObjectiveCostService,
        private activatedRoute: ActivatedRoute,
        private dashboardAttachmentService: DashboardAttachmentService,
        private formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private enothiDakSubmissionService: EnothiDakSubmissionService,
        private datePipe: DatePipe,
        public numberPipe: NumberPipe,
        private _reportDataService: ReportDataService,
        private dppLocationWiseCostBreakdownService : DppLocationWiseCostBreakdownService,
        private rdppProjectManagementSetupService : DppProjectManagementSetupService,
        private dppAnnexureGoodsIiiAService : DppAnnexureGoodsIiiAService,
        private classyLayoutComponent: ClassyLayoutComponent,
        private _reportCommonService: ReportCommonService,
        private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
        private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
        private rtappAnnualPhasingCostService: RtappAnnualPhasingCostService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private dateBengaliPipe: DateBengaliPipe,
        private fileUploadService: FileUploadService,
        private projectMovementService: ProjectMovementService,
        private userGroupService: UserGroupService,
        private feedbackMovementService: FeedbackMovementService,
        private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
        private userProfileService: UserProfileService,
        private layoutHelperService: LayoutHelperService,
        private dppObjectiveCostService: DppObjectiveCostService,
        private objectiveAndCostService: DppObjectiveCostService,
        private dppAmortizationScheduleService: DppAmortizationScheduleService,
        private rdppAnnexureGoodsService: RdppAnnexureGoodsService,
        private unitTypeService: UnitTypeService,
        private procTypeService: ProcurementTypeService,
        private procMethodService: ProcurementMethodService,
        private tappAnnexureGoodsService: TappAnnexureGoodsService,
        private pmWorkPlanService: ImplementationWorkScheduleService,
        private _rdppLocationService : RdppLocationService,
        private _rdppReportService : RdppReportService,
        private assignMeetingService : AssingEcnecMeetingService,
        private cookieService: CookieService,
        private dashboardService: DashboardService,
        private __dppLocationWiseCostBreakdownService: DppLocationWiseCostBreakdownService,
        private locationService: DppLocationService,
        private economicCodeService: EconomicCodeService,
        private subEconomicCodeService: SubEconomicCodeService,
        private financialAnalysisService: FinancialAnalysisService,
        private tappWorkScheduleService: TappWorkScheduleService,


        private termOfRefServiceReport : TermOfReferenceReportService,

    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        // Get Value From Router
        this.activatedRoute.queryParams.subscribe(params => {
            this.uuid = params['pcUuid'];
            this.rdppRtappMasterId = params['id'];
        });

        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
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
        this.initDownloadReportSelect();
        this.getProjectSummary();
        this.getAll();
        this.getProjectConceptByUuidRepo();


        this.getFinancialAnalysis();
        this.getYearWiseEstimatiedCost();
        this.getRevenueComponentDataRtapp();
        this.getEstimatedCosts(this.uuid);
    }

    callActionSubject() {
        this.classyLayoutComponent.actionData.subscribe(res => {
            this.show = res;
            this.actionPermission = lngEnglishAction.data.ACTION;
        })
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        });
    }

    initDownloadReportSelect() {
        this.downloadReportFormGroup = new FormGroup({
            committeeSelect: new FormControl(''),
            summarySelect: new FormControl(''),
            workingSelect: new FormControl(''),
        });
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
            this._translateService.use(res.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' ? 'en' : res.isForeignAid ? 'en' : 'bn');
            this.isEnLabel = this._translateService.currentLang === 'en';
            if(!this.isEnLabel){
                this.layoutHelperService.setLanguageEvent('bn');
            } else{
                this.layoutHelperService.changeNavLanguage('en');
            }
            this.titleEn = res.titleEn;
            this.titleBn = res.titleBn;
            this.commencementDate = this.datePipe.transform(res.expCommencementDate, 'dd/MM/yyyy');
            this.completionDate = this.datePipe.transform(res.expCompletionDate, 'dd/MM/yyyy');
            this.pcId = res.id;
            this.projectSummary = res;

            res.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? this.getRDppObjectiveCostByPcUuid() : this.getRTappObjectiveCostByPcUuid();
            this.getAgency();
            this.getTotalExpenseByAgency(this.projectSummary.agencyId);

            // this.getGrandTotal(res.id, res);
            this.getListDashboardAttachment();
            this.getSector(res);
            this.getSubSector(res);
            this.getSectorDivision(res);
            this.getUserGroupByUserId();
            this.checkUserCanEdit();
            this.showHideCommitInformation();
            const diffDays = (startDate, endDate) => Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
            const totalDays: number = diffDays(new Date(res.expCommencementDate), new Date(res.expCompletionDate));
            this.year = Math.floor(totalDays / 365);
            this.month = Math.floor((totalDays % 365) / 30);
            this.printCallMethod();

        });
    }

    getUserGroupByUserId() {
        this.userGroupService.getUserGroupByUserId().subscribe(res => {
            this.userGroupModel = res;
            if (res && this.userGroupModel.ministryDivision) {
                // this.getAgency();
                // this.getTotalExpenseByAgency(this.projectSummary.agencyId);
            }
        });
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
            this.totalAllocationByAgency = res.ceilingAmount ? res.ceilingAmount : 0;
        })
    }

    getTotalExpenseByAgency(agencyId) {
        this.dashboardService.getGrandTotalByProjectConceptIdList(agencyId).subscribe(res => {
            this.totalExpenseByAgency = res;
            this.spinner = false;
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

    private getRdppGrandTotal(rdppMasterId: number) {
        this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(rdppMasterId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.totalAmountAnnexure5B = total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount;

                let grTotal = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.allGrandTotal)[0];
                this.financialInfoApexChart(grTotal.gobAmount, grTotal.gobThruAmount + grTotal.spAcAmount +grTotal.thruDpAmount + grTotal.thruPdAmount, grTotal.ownFundAmount, grTotal.otherAmount);

                this.fiscalYearList = res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                this.rdppGrandList = res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                    res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.rdppGrandTotal = 0;
                this.fiscalYearList.forEach((data, index)=>{
                    this.rdppGrandTotal += this.rdppGrandList[index]?.dppAnnualPhasingCostTotal?.totalAmount ? this.rdppGrandList[index]?.dppAnnualPhasingCostTotal?.totalAmount: 0;
                })
            }
            this.getPreviousVersionTotalModeData(this.referenceId);
        });
    }

    private getRtappGrandTotal(rtappMasterId: number,) {
        this.rtappAnnualPhasingCostService.getGrandTotalByProjectConceptId(rtappMasterId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.allGrandTotal)[0];
                this.financialInfoApexChart(total.gobAmount, total.gobThruAmount + total.spAcAmount + total.thruDpAmount + total.thruPdAmount, total.ownFundAmount, total.otherAmount);

                this.fiscalYearList = res.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                this.rtappGrandList = res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                    res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.rtappGrandTotal = 0;
                this.fiscalYearList.forEach((data, index)=>{
                    this.rtappGrandTotal += this.rtappGrandList[index]?.tappAnnualPhasingCostTotal?.totalAmount;
                })
            }
            this.getPreviousVersionTotalModeData(this.referenceId);
        });
    }

    private getRefTappGrandTotal(conceptId: number) {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                this.refTappGrandTotal = total[0];
                this.checkRtappApprovedValidation()
            }
        });
    }

    private getRefRtappGrandTotal(refRtappMasterId: number,) {
        this.rtappAnnualPhasingCostService.getGrandTotalByProjectConceptId(refRtappMasterId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                this.refTappGrandTotal = total[0];
            }
            this.checkRtappApprovedValidation();
        });
    }

    private getRDppObjectiveCostByPcUuid() {
        this.rdppObjectiveCostService.getByProjectConceptUuidAndId(this.uuid, this.rdppRtappMasterId).subscribe(res => {
            this.mofListRes = res.res;
            this.mofList = res.res;
            if (res.res == '') {
                this.isDppPartADataEmpty = true;
            }
            if (res.res != '') {
                this.objectiveAndCostUuid = res.res.uuid;
                this.rdppMasterId = res.res.id;
                this.objectivesAndCost = res.res;
                this.setProjectInfoTitleAndDate(res.res);
                this.loadMovementStatus();
                this.loadDppMasterId();
                // this.getRdppGrandTotal(this.rdppMasterId);
                this.getRdppTotalModeData(res);
                this.checkDppPartAData(res);
                this.isAssignEcnecMeetingDone();
            }
            this.checkDpp5BData();
            this.checkDppAnnexureIData();
            this.checkDppAnnexureIIIData();
            // this.checkDppPartBProjectDetails();
        });
    }

    getAllStageByMasterId(source, id) {

        this.stageMovementService.getAllStageByMasterId(source, id).subscribe(res => {
            this.movementStageList = res;
            this.isEcnecConditionalApprovedInStage = this.movementStageList.find(m=>m.currentStage==ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE) ? true: false;
            this.movementStageList.forEach(e => {
                let time = e.movementTime.split(':');
                e.currentStage = e.currentStage ? (this.isEnLabel ? (e.currentStage).toString().replace(/_/g, ' ') : this.statusStage.getProjectStatus(e.currentStage)) : (this.isEnLabel ? 'AGENCY DESK' : 'এজেন্সী এর ডেস্ক');
                e.movementTime = this.isEnLabel ? (Number(time[0]) > 12 ? (Number(time[0] - 12) + '.' + time[1] + ' PM') : (Number(time[0]) + '.' + time[1] + ' AM')) :
                    (Number(time[0]) > 12 ? (this.numberPipe.convertToBanglaNumber(Number(time[0] - 12)) + '.' + this.numberPipe.convertToBanglaNumber(time[1]) + ' পি .এম') : (this.numberPipe.convertToBanglaNumber(Number(time[0])) + '.' + this.numberPipe.convertToBanglaNumber(time[1]) + ' এ.এম'));
            });
            if(this.isEcnecConditionalApprovedInStage){
                this.previousEcnecConditionApproved = this.isEnLabel?'ECNEC Conditionally approved':'** একনেক এ শর্তসাপেক্ষে অনুমোদিত **';
            }
        })
    }

    private setProjectInfoTitleAndDate(res) {
        this.titleEn = res.projectTitleEn ? res.projectTitleEn : this.projectSummary.titleEn;
        this.titleBn = res.projectTitleBn ? res.projectTitleBn : this.projectSummary.titleBn;
        this.commencementDate = res.dateCommencement ? this.datePipe.transform(res.dateCommencement, DATE_ENG_FORMAT) : this.commencementDate;
        this.completionDate = res.dateCompletion ? this.datePipe.transform(res.dateCompletion, DATE_ENG_FORMAT) : this.completionDate;
    }

    private getRTappObjectiveCostByPcUuid() {
        this.isTapp = true;
        // this.rtappObjectiveCostService.getRTappObjectiveCostByPcUuid(this.uuid, this.rdppRtappMasterId).subscribe(
        this.rtappObjectiveCostService.getObjectiveCostByRtappMasterId(this.rdppRtappMasterId).subscribe(
            res => {
                this.mainFeaturesOfRevision = res.mainFeaturesOfRevision;
                if(res == null) {
                    this.isTappPartADataEmpty = true;
                }
                if (res != null) {
                    this.objectiveAndCostUuid = res.uuid;
                    this.rtappMasterId = res.id;
                    this.objectivesAndCost = res;
                    this.setProjectInfoTitleAndDate(res);
                    this.loadMovementStatus();
                    this.loadTppMasterId();
                    this.isAssignEcnecMeetingDone();
                }

                /*
               * Check Tapp Data For validation
               */
                this.checkTappCumulativeProgress();
                this.checkTappAnnexerI();
                this.checkImplimentingWorkSchedule();
                // this.checkTappPartAData(res);
            }
        );
    }

    // for const info chart
    private financialInfoApexChart(gobAmount, paAmount, ownFundAmount, otherAmount) {
        gobAmount = Number(gobAmount.toFixed(2));
        paAmount = Number(paAmount.toFixed(2));
        ownFundAmount = Number(ownFundAmount.toFixed(2));
        otherAmount = Number(otherAmount.toFixed(2));
        this.totalAnnexureAmount = Number(gobAmount+paAmount+ownFundAmount+otherAmount);
        const totalCost = (this.projectSummary.isForeignAid)
            ? ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) :
            (!this.projectSummary.isForeignAid && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') ?
                ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) : this.convertToBanglaNumber((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2));
        this.chartOptions = {
            series: this.projectSummary.isForeignAid ? [gobAmount, paAmount, ownFundAmount, otherAmount] : [gobAmount, ownFundAmount, otherAmount],
            chart: {
                type: "pie",
                width: 350,
                height: 350
            },
            colors: this.projectSummary.isForeignAid ? ["#adc5e4", "#03bcd0", "#f7ba16", "#b4ce39"] : ['#74bfe8', '#c0ca33', '#9a73bf'],
            labels: this.projectSummary.isForeignAid ? ['GoB (' + gobAmount + ')', 'Project Aid (' + paAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
                (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' && this.projectSummary.isForeignAid == false) ? ['GoB (' + gobAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
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
                                label: this.projectSummary.isForeignAid ? 'Total Cost' :
                                    this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' ? 'Total Cost' : 'মোট খরচ',
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
                        // 'verticalLines',
                        // 'squares',
                        // 'horizontalLines',
                        // 'circles',
                        // 'slantedLines'
                    ]
                }
            },
        };
    }

    edit(row: any) {
        this.frmGroup.patchValue({
            title: row.title,
            attachmentId: row.attachment.id,
            uuid: row.uuid
        });
        this.openDialog();
    }

    delete(uuid: string) {
        this.dashboardAttachmentService.delete(uuid).subscribe(res => {
            this.getListDashboardAttachment();
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(this.callAPIDialog, {
            height: '380px',
            width: '600px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.frmGroup.reset();
        });
    }

    save() {
        const uuid = this.frmGroup.value.uuid;
        const title = this.frmGroup.value.title;
        let projectType = "RDPP";
        if (this.projectSummary.projectTypeDTO.nameEn=='TAPP') {
            projectType = "RTAPP";
        }
        if (uuid) {
            this.dashboardAttachmentService.updateRdppRtappDashboardAttachment(this.file, title, uuid, this.rdppRtappMasterId, projectType).subscribe(res => {
                this.loadData();
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });

        } else {
            this.dashboardAttachmentService.createRdppRtappDashBoardAttachment(this.file, title, this.rdppRtappMasterId, projectType).subscribe(res => {
                this.loadData();
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }

    loadData(): any {
        this.getListDashboardAttachment();
        this.frmGroup.reset();
        this.dialog.closeAll();
    }

    uploadOtherFile(files: FileList) {
        this.file = files.item(0);
    }

    uploadFile(files: FileList, type: string, typeName: string) {
        this.spinner = true;
        this.file = files.item(0);
        if (type == 'meeting') {
            this.meetingType = true;
            this.paperType = false;
            this.setMeetingType = typeName;
            this.setWorkingPaperType = null;
        } else {
            this.meetingType = false;
            this.paperType = true;
            this.setWorkingPaperType = typeName;
            this.setMeetingType = null;
        }
        this.saveMeetingOrWorkingPaperWithAttachment();
    }

    // uploadFile(files: FileList) {
    //     this.file = files.item(0);
    // }

    openUrl(row: any) {
        this.fileUploadService.download(row.attachment.urlPath);
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListDashboardAttachment();
    }

    private deleteDialog(uuid: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(uuid);
            }
            dialogRef.close(true);
        });
    }

    setObserver(commission: 'A' | 'MD' | 'PC') {

    }

    downloadGOClick() {
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


    resetValue() {
        this.frmGroup.reset();
        this.dialog.closeAll();
    }

    editProjectSummary() {
        this.route.navigate([`project-concept/add-project-concept/${this.uuid}`]);
    }

    sendDppTappToNothi() {
        const reportType = (this.projectSummary.isForeignAid)? 'en' : 'bn';
        const source = this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? 'rdpp' : 'rtapp';
        let srcUserGroup = this.setSourceOriginType();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {source: source, sourceId: this.objectiveAndCostUuid, pcUuid: this.uuid , reportType: reportType, srcUserGroup: srcUserGroup};
        const dialogRef = this.dialog.open(SendToDakComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    setSourceOriginType(): string {
        let userGroup: string = this.userGroup.groupStatus;
        return userGroup.toString().substring(0, userGroup.indexOf('-'));
    };

    deskUserMovement(userGroupType) {
        // let projectMovementStageModel = {} as ProjectMovementStageModel;
        // projectMovementStageModel.dppMasterId = this.dppMasterId;
        // projectMovementStageModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            userGroupType: userGroupType,
            message: this.isEnLabel ?'Forwarded to Ministry successfully':'সফলভাবে মন্ত্রণালয়ে প্রেরণ করা হয়েছে',
            projectMovementStageModel: this.projectMovementModel
        };
        // dialogConfig.data = { userGroupType: userGroupType, dppTappMasterId: this.dppMasterId, currentStage: ProjectMovementStageConstant.MINISTRY_HEAD };
        const dialogRef = this.dialog.open(DeskUserMovementComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                let message = "";
                if (userGroupType === 'Agency') {
                    this.projectStatus = this.isEnLabel ? 'AGENCY DESK OFFICER ASSIGNED' : 'এজেন্সি ডেস্ক অফিসার নিকট প্রেরণ করা হয়েছে';
                    this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
                    this.isReturnToAgencyDesk = false;
                    message = this.isEnLabel ? "Forwarded to Agency Desk Officer successfully" : "সফলভাবে সংস্থার ডেস্ক অফিসারের নিকট প্রেরণ করা হয়েছে";
                } else if (userGroupType === 'Ministry') {
                    this.isForwardToMinistryDesk = false;
                    this.isReturnToAgencyHead = false;
                    this.projectStatus = this.isEnLabel ? 'MINISTRY DESK OFFICER ASSIGNED' : 'মন্ত্রণালয়ের ডেস্ক অফিসার নিকট প্রেরিত';
                    this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
                    message = this.isEnLabel ? "Forwarded to Ministry Desk Officer successfully" :  "সফলভাবে মন্ত্রণালয়ের অফিসারের নিকট প্রেরণ করা হয়েছে";
                } else if (userGroupType === 'Planning_Commission') {
                    this.isForwardToPlanningDesk = false;
                    this.projectStatus = this.isEnLabel ? 'PLANNING DESK OFFICER ASSIGNED' : 'পরিকল্পনা কমিশনের ডেস্ক অফিসারের নিকট প্রেরণ';
                    this.projectStage = this.isEnLabel ? 'IN PLANNING' : 'পরিকল্পনা কমিশনে আছে';
                    message = this.isEnLabel ? "Forwarded to Planning Commision Desk Officer successfully" : 'সফলভাবে পরিকল্পনা কমিশনের অফিসারের নিকট প্রেরণ করা হয়েছে';
                } else if(userGroupType == 'Ecnec_Head'){
                    //userGroupType =='Ecnec-Officer'
                    this.inForwardEcnecOfficer = false;
                    this.projectStatus = this.isEnLabel ? 'ECNEC OFFICER ASSIGNED' : 'একনেক অফিসারের নিকট প্রেরণ করা হয়েছে';
                    this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেকে আছে';
                    message = "Forwarded to ECNEC Officer successfully";
                } else if(userGroupType =='Ecnec_Officer'){
                    this.isForwardEcnecDeskOfficer = false;
                    this.projectStatus = this.isEnLabel ? 'ECNEC DESK OFFICER ASSIGNED' : 'একনেক ডেস্ক অফিসারের নিকট প্রেরণ করা হয়েছে';
                    this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেকে আছে';
                    message = "Forwarded to ECNEC Desk Officer successfully";
                }
                const ok = this.isEnLabel ? 'OK': 'ওকে';
                this.snackbarHelper.openSuccessSnackBarWithMessage(message, ok);
            }
        });
    }

    loadDppMasterId() {
        this.rdppObjectiveCostService.getObjectiveCostByRdppMasterId(this.rdppRtappMasterId).subscribe(
            res => {
                if (res) {
                    this.revisedVersion = res.revisedVersion;
                    this.revisedVersionBn = this.convertRevisedVersion(res.revisedVersion);
                    this.referenceId = res.referenceId;
                    this.getRdppGrandTotal(this.rdppMasterId);

                    if(this.rdppMasterId != null){
                        this.getCurrentStage(this.rdppMasterId, 'RDPP');
                        this.getAllStageByMasterId('RDPP', this.rdppMasterId);
                    }
                }
            }
        );
    }

    loadTppMasterId() {
        this.rtappObjectiveCostService.getObjectiveCostByRtappMasterId(this.rtappMasterId).subscribe(res => {
            if (res) {
                this.revisedVersion = res.revisedVersion;
                this.revisedVersionBn = this.convertRevisedVersion(res.revisedVersion);
                this.referenceId = res.referenceId;
                this.getRtappGrandTotal(this.rtappMasterId)
                if(this.rtappMasterId != null) {
                    this.getCurrentStage(this.rtappMasterId, 'RTAPP');
                    this.getAllStageByMasterId('RTAPP', this.rtappMasterId);
                }
            }
        });
    }

    forwardToMinistry() {
        this.openDialogProjectMovement( (res) => {
            if(this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Ministry successfully', 'OK');
                this.projectStatus = 'MINISTRY HEAD';
                this.projectStage = 'IN MINISTRY';
                this.isForwardToMinistryHead = false;
                this.showButtonSendToNothi = false;
            });
        });

    }

    forwardToMinistryDesk() {
        if(this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_DESK;
        this.deskUserMovement('Ministry');
        // this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
        //     this.isForwardToMinistryDesk=false;
        //     this.snackbarHelper.openSuccessSnackBarWithMessage('Move Down to Desk successfully', 'OK')
        // });
    }

    returnToAgencyDesk() {
        if(this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_DESK;
        this.deskUserMovement('Agency');
    }

    returnToMinistry() {
        this.openDialogProjectMovement( (res) => {
            if(this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.showButtonSendToNothi = false;
                this.isForwardToPlanningMinister = false;
                this.isForwardToPlanningHead = false;
                this.isReturnToMinistryHead = false;
                this.projectStatus = 'MINISTRY HEAD';
                this.projectStage = 'IN MINISTRY';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Ministry successfully', 'OK')
            });
        });
    }

    forwardToPlanning() {
        this.openDialogProjectMovement( (res) => {
            if(this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
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
                this.projectStatus = 'PLANNING HEAD';
                this.projectStage = 'IN PLANNING';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Planning successfully', 'OK');
            });
        });
    }

    forwardToPlanningDesk() {
        if(this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_DESK;
        this.deskUserMovement('Planning_Commission');
    }

    setMeetingNotice(meetingType){
        const dialogRef = this.dialog.open(this.callAttachmentDialogForMeeting, {
            height: '380px',
            width: '600px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        let meetingAttachmentType  = document.getElementById('meetingAttachmentType');
        meetingAttachmentType.textContent=meetingType;

    }

    submitMeetingNoticeWithAttachment(){
        if(this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.userId = this.userGroup.userId;
        let meetingAttachmentTypeContent  = document.getElementById('meetingAttachmentType');
        let projectStatus;
        const meetingAttachmentType = meetingAttachmentTypeContent.textContent
        if(meetingAttachmentType=='Project Scrutiny Committee Notice'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE;
            projectStatus = "Awaiting for Project Scrutiny Committee Meeting";
        }
        else if(meetingAttachmentType=='Project Scrutiny Committee Held'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD;
            projectStatus = "Project Scrutiny Committee Meeting Held";
        }
        else if(meetingAttachmentType=='DPEC Meeting Notice'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.DPEC_MEETING_NOTICE;
            projectStatus = "Awaiting for DPEC Meeting";
        }
        else if(meetingAttachmentType=='DPEC Meeting Held'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.DPEC_MEETING_HELD;
            projectStatus = "DPEC Meeting Held";
        }
        else if(meetingAttachmentType=='DSPEC Meeting Notice'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.DSPEC_MEETING_NOTICE;
            projectStatus = "Awaiting for DSPEC Meeting";
        }
        else if(meetingAttachmentType=='DSPEC Meeting Held'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.DSPEC_MEETING_HELD;
            projectStatus = 'DSPEC Meeting Held';
        }
        else if(meetingAttachmentType=='PEC Meeting Notice'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PEC_MEETING_NOTICE;
            projectStatus = "Awaiting for PEC Meeting";
        }
        else if(meetingAttachmentType=='PEC Meeting Held'){
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PEC_MEETING_HELD;
            projectStatus = 'PEC Meeting Held';
            this.isInDspecMeetingHeld = false;
        }
        this.saveMeetingNoticeWithAttachment(projectStatus);
    }

    saveMeetingNoticeWithAttachment(projectStatus){
        this.projectMovementService.forward(this.projectMovementModel).subscribe(res=>{
            const projectMovementStage = res.res;
            this.fileUploadService.uploadApprovalProcessFlowAttachment(this.file,projectMovementStage).subscribe(res2=>{
                this.snackbarHelper.openSuccessSnackBarWithMessage('Meeting Notified successfully', 'OK');
                this.getAllProjectMovementAttachment(this.currentMovementStage.id);
                this.isInProjectScrutinyCommitteeNotice = false;
                this.projectStatus = projectStatus;
                this.dialog.closeAll();
            },error=>{
                this.snackbarHelper.openErrorSnackBarWithMessage('Attachment is failed to save', 'OK');
            });
        })
    }

    getCurrentStage(masterId, projectType: string) {
        this.projectMovementService.getCurrentStage(masterId, projectType).subscribe(res => {
            this.currentMovementStage = res.res;
            this.projectStatus = res.res.currentStage ? this.isEnLabel ? (res.res.currentStage).toString().replace('_', ' ') : this.statusStage.getProjectStatus(res.res.currentStage) : '';
            this.checkProjectStage(res.res.currentStage);

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
            this.projectStage = this.isEnLabel ? 'IN PLANNING MINISTER' : 'পরিকল্পনা মিনিস্টারে আছে';
        } else if (currentStage === ProjectMovementStageConstant.IN_ECNEC) {
            this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেক এ আছে';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStage = this.isEnLabel ? 'APPROVED BY ECNEC' : 'একনেক দ্বারা অনুমোদিত';
        } else if (currentStage === ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStage = this.isEnLabel ? 'APPROVED BY PLANNING MINISTER' : 'পরিকল্পনা মিনিস্টার দ্বারা অনুমোদিত';
        } else if (currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.DPEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.DPEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if( currentStage == ProjectMovementStageConstant.DSPEC_MEETING_NOTICE){
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if( currentStage == ProjectMovementStageConstant.DSPEC_MEETING_HELD){
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (currentStage == ProjectMovementStageConstant.UNDER_EXAMINE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.PEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.PEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI) {
            this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_OFFICERS){
            this.projectStage = this.isEnLabel ? 'IN ECNEC WING' : 'একনেক উইং এ আছে';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_DESK){
            this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেক এ আছে';
        } else if( currentStage == ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE){
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if( currentStage == ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC){
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.SPEC_MEETING_NOTICE) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if (currentStage == ProjectMovementStageConstant.SPEC_MEETING_HELD) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        } else if(currentStage == ProjectMovementStageConstant.MINISTRY_APPROVED){
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
        }
    }

    checkCurrentStage(response: any) {
        this.currentStage = response.res.currentStage;
        const currentStageUserId = response.res.userId;
        this.getMinistryPlanningForwardButton(response.res.id);
        if (this.currentStage === ProjectMovementStageConstant.AGENCY_DESK && (this.userGroup.groupStatus == 'AGENCY-DESK' || this.userGroup.groupStatus == 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isForwardToMinistryHead = true;
                this.showButtonSendToNothi = true;
                this.isPotroJariAttach = true;
            }
        } else if (this.currentStage === ProjectMovementStageConstant.AGENCY_HEAD) {
            this.projectStatus = this.isEnLabel ? "Received from Ministry/Division" : 'মন্ত্রণালয়/বিভাগ থেকে প্রাপ্ত';
            if ((this.userGroup.groupStatus == 'AGENCY-HEAD' || this.userGroup.groupStatus == 'OTHER')) {
                this.isReturnToAgencyDesk = true;
            }
        } else if (this.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD && (this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.isForwardToMinistryDesk = true;
            this.isReturnToAgencyHead = true;
           // this.isForwardToPlanningHead = true;
        } else if (this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK && (this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isReturnToAgencyHead = true;
                this.isForwardToPlanningHead = true;
                this.showButtonSendToNothi = true;
                this.isInProjectScrutinyCommitteeNotice = true;
                //this.isPotroJariAttach = true;
                if(!this.isEcnecConditionalApprovedInStage)
                    this.isRelatedMeetingAttachments = true;
                if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' || 'ডিপিপি') {
                    this.isInDpecMeetingNotice = true;
                } else if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') {
                    this.isInDspecMeetingNotice = true;
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            this.projectStatus = this.isEnLabel ? "Forwarded to Planning Commission" : 'পরিকল্পনা কমিশনে প্রেরণ করা হয়েছে';
            if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
                this.projectStatus = this.isEnLabel ? "Received from Ministry/Division" : 'মন্ত্রণালয়/বিভাগ থেকে প্রাপ্ত';
                this.isForwardToPlanningDesk = true;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK) {
            if (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER') {
                this.getDeskOfficer(currentStageUserId);
                if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
                    if (currentStageUserId === this.userGroup.userId) {
                        //this.isForwardToPlanningMinister = true;
                        this.isReturnToMinistryHead = true;
                        this.showButtonSendToNothi = true;
                        this.isInpecMeetingNotice = true;
                        this.isInUnderExamine = true;
                        if(!this.isEcnecConditionalApprovedInStage)
                            this.isRelatedMeetingAttachments = true;
                    }
                }
            }
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER && (this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInPlanningMinister = true;
            // if (this.totalAmountAnnexure5B >= 5000) {
            //     this.isForwardToEcnec = true;
            //     this.isInPlanningMinister = false;
            // }
        } else if (this.currentStage == ProjectMovementStageConstant.IN_ECNEC && (this.userGroup.groupStatus === 'ECNEC-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInEcnec = true;
            this.inForwardEcnecOfficer = true;
            this.isEcnecApprove = true;
        } else if(this.currentStage == ProjectMovementStageConstant.ECNEC_OFFICERS  || this.userGroup.groupStatus === 'OTHER'){
            if(this.userGroup.groupStatus === 'ECNEC-OFFICER'){
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardEcnecDeskOfficer = true;
                    this.projectStatus = this.isEnLabel ? "ECNEC Officer Assigned" : 'একনেক অফিসার';
                }
            }
            else{
                this.projectStatus = this.isEnLabel ? "ECNEC Officer Assigned" : 'একনেক অফিসার';
            }

        } else if(this.currentStage == ProjectMovementStageConstant.ECNEC_DESK || this.userGroup.groupStatus === 'OTHER'){
            if(this.userGroup.groupStatus === 'ECNEC-DESK'){
                this.getDeskOfficer(currentStageUserId);
                if (currentStageUserId === this.userGroup.userId){
                    this.isConditionalApproveByEcnec = true;
                    this.isUapproveByEcnec = true;
                    this.isEcnecApprove = true;
                    this.projectStatus = this.isEnLabel ? "ECNEC Desk Officer Assigned" : 'একনেক ডেস্ক অফিসার';
                }
            }
            else{
                this.projectStatus = this.isEnLabel ? "ECNEC Desk Officer Assigned" : 'একনেক ডেস্ক অফিসার';
                if(this.userGroup.groupStatus === 'ECNEC-HEAD'){
                    this.isConditionalApproveByEcnec = true;
                    this.isUapproveByEcnec = true;
                    this.isEcnecApprove = true;
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
                this.isReturnToAgencyHead = true;
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
                this.isReturnToAgencyHead = true;
                // this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardToPlanningHead = true;
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
                this.isReturnToAgencyHead = true;
               // this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardToPlanningHead = true;
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
                this.isReturnToAgencyHead = true;
               // this.isForwardToPlanningHead = true;
                if((this.userGroup.groupStatus === 'MINISTRY-DESK')) {
                    this.isForwardToPlanningHead = true;
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
                this.isReturnToAgencyHead = true;
               // this.isForwardToPlanningHead = true;
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardToPlanningHead = true;
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
                this.isReturnToAgencyHead = true;
               // this.isForwardToPlanningHead = true;
                if((this.userGroup.groupStatus === 'MINISTRY-DESK')) {
                    this.isForwardToPlanningHead = true;
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
                if (currentStageUserId === this.userGroup.userId){
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
                if(this.userGroup.groupStatus === 'PLANNING-DESK'){
                    if (currentStageUserId === this.userGroup.userId){
                        this.isReturnToMinistryHead = true;
                        this.isForwardToPlanningMinister = true;
                        this.showButtonSendToNothi = true;
                        this.isRelatedMeetingAttachments = true;
                    }
                }
                else{
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
                if (currentStageUserId === this.userGroup.userId) {
                    this.isRelatedMeetingAttachments = true;
                    this.isReturnToAgencyHead = true;
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
        } else if( this.currentStage == ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE){
            this.projectStatus = this.isEnLabel ? "Conditionally Approved in ECNEC" : 'শর্তসাপেক্ষে অনুমোদন করা হয়েছে ';
            if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
                this.projectStatus = this.isEnLabel ? "Conditionally Approved in ECNEC" : 'শর্তসাপেক্ষে অনুমোদন করা হয়েছে ';
                this.isForwardToPlanningDesk = true;
            }
        } else if( this.currentStage == ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC){
            this.projectStatus = this.isEnLabel ? "Uapproved in ECNEC" : 'একনেকে অননুমোদিত';
            if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
                this.projectStatus = this.isEnLabel ? "Uapproved in ECNEC" : 'একনেকে অননুমোদিত';
                this.isForwardToPlanningDesk = true;
            }
        } else if (this.currentStage == ProjectMovementStageConstant.SPEC_MEETING_NOTICE) {
            this.projectStatus = this.isEnLabel ? "SPEC Meeting Notice" : 'এসপিইসি এর মিটিং নোটিশ';
            this.getMeetingAttachment(response.res.id);
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
                if (currentStageUserId === this.userGroup.userId){
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
                if(this.userGroup.groupStatus === 'PLANNING-DESK'){
                    if (currentStageUserId === this.userGroup.userId){
                        this.isReturnToMinistryHead = true;
                        this.isForwardToPlanningMinister = true;
                        this.showButtonSendToNothi = true;
                        this.isRelatedMeetingAttachments = true;
                    }
                }
                else{
                    this.isReturnToMinistryHead = true;
                    this.isForwardToPlanningMinister = true;
                }
            }
        }else if(this.currentStage == ProjectMovementStageConstant.MINISTRY_APPROVED){
            this.projectStatus = this.isEnLabel ? 'APPROVED' : 'অনুমোদিত';
            if ((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup.groupStatus === 'PLANNING-HEAD')) {
                // this.projectStage = this.isEnLabel ? 'APPROVED BY MINISTRY' : 'মন্ত্রণালয় কর্তৃক অনুমোদিত';
                this.showButtonSendToNothi = false;
                this.isReturnToAgencyHead = false;
                this.isRelatedMeetingAttachments = false;
                // this.isTappApproveInMinistry = false;
            }
        }
    }

    getMinistryPlanningForwardButton(currentMovementStageId){
        if((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')){
            this.isPlanningMeetingPaperAttached = true;
        }
        if(this.isEcnecConditionalApprovedInStage){
            if ((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER' || this.userGroup?.groupStatus === 'MINISTRY-HEAD')) {
                this.isMinistryMeetingPaperAttached = true;
            }
        } else {
            this.projectMovementService.checkUpMovementForDpp(currentMovementStageId).subscribe(res=>{
                if(res?.res?.status){
                    if(res.res.stage=='ministry'){
                        this.isMinistryMeetingPaperAttached = true;
                    }
                }
            });
        }
    }

    getDeskOfficer(currentStageUserId: any) {
        this.userProfileService.getUserById(currentStageUserId).subscribe(res=>{
            this.assignedPlanningDeskOfficer = res;
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

    loadMovementStatus() {
        let dpp_uuid:string, tapp_uuid:string;
        this.projectSummary.projectTypeDTO.nameBn.toUpperCase() == 'DPP' || 'ডিপিপি' ? dpp_uuid = this.objectiveAndCostUuid : tapp_uuid = this.objectiveAndCostUuid;
        let srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup,null, null, dpp_uuid, tapp_uuid).subscribe(res => {
            if (res.message == 'Got Feedback' && res.result) {
                this.movementStatusList = res.result;
                if (res.result[0].nothi_message != null) {
                    this.nothiStatus=res.result[0].nothi_message;
                }
                else if (res.result[0].decision_note != null) {
                    this.nothiStatus = res.result[0].decision_note;
                }
            }
            else if (res.message == 'No Feedback')
                this.nothiStatus = 'Submitted as a Daak to E-Nothi';
            else if (res.message == 'Daak is not submitted')
                this.nothiStatus = this.nothiStatus;
            else
                this.nothiStatus = 'AGENCY';

            //potro jari
            if(res.result && res.result[0].nothi_action==4){
                this.potroJari = true;
                this.potroUrl = res.result[0].potro_url;
            }
            //note
            if(res.result && res.result[0].nothi_action==3){
                this.isNoteCompletetion=true;
            }
        })
    }

    downloadMeetingAttachment(urlPath){
        this.fileUploadService.downloadAttachmentInDppService(urlPath);
    }

    navigateToList() {
        this.route.navigate([`rdpp-rtapp`]);
    }

    getProjectSummaryId(url, forUrl = "") {
        let routeUrl = '';
        if (forUrl == "") {
            routeUrl = "rdpp-rtapp/" + url;
        } else {
            routeUrl = url;
        }
        this.route.navigate([routeUrl], {queryParams: {pcUuid: this.uuid, id: this.rdppRtappMasterId}});

    }
    checkCurrentRtappProjectVersionById() {
        this.tappObjectiveCostService.checkCurrentRtappProjectVersionById(this.rdppMasterId).subscribe( response => {
            this.rtappVersion = response.res;
        });
    }
    gotoSelectedTab(url: string) {

        if ((this.isDppPartADataEmpty || this.isDppObjectiveTargetsDataEmpty || this.isDppPartAConcernedDivisionIdEmpty) && url == 'add-new') {
            const routeUrl = 'rdpp-rtapp/' + url;
            this.route.navigate([routeUrl],{queryParams: {pcUuid:this.uuid, id:this.rdppRtappMasterId }});
        } else if (this.isTappPartADataEmpty && url == 'tapp-project-summery') {
            const routeUrl = 'rdpp-rtapp/' + url;
            this.route.navigate([routeUrl], {queryParams: {pcUuid:this.uuid, id:this.rdppRtappMasterId }});
        } else if (this.isDppAnnexureIDataEmpty || this.isDppAnnexureIIIDataEmpty) {
            if(this.isDppPartADataEmpty) {
                this.snackbarHelper.openWarnSnackBarWithMessage('Require to save Part-A (Project Summary)', OK)
            } else {
                const routeUrl = 'rdpp-rtapp/' + url;
                this.route.navigate([routeUrl], {queryParams: {pcUuid:this.uuid, id:this.rdppRtappMasterId}});
            }
        } else if (this.isTappAnnexureIDataEmpty) {
            if(this.isTappPartADataEmpty) {
                this.snackbarHelper.openWarnSnackBarWithMessage('Require to save Part-A (Project Summary)', OK)
            } else {
                const routeUrl = 'rdpp-rtapp/' + url;
                this.route.navigate([routeUrl], {queryParams: {pcUuid:this.uuid, id:this.rdppRtappMasterId }});
            }
        }else if(this.isImplementingWorkScheduleEmpty){
            const routeUrl = 'rdpp-rtapp/' + url;
            this.route.navigate([routeUrl], {queryParams: {pcUuid:this.uuid, id:this.rdppRtappMasterId }});
        } else {
            const routeUrl = 'rdpp-rtapp/' + url;
            this.route.navigate([routeUrl], {queryParams: {pcUuid:this.uuid, id:this.rdppRtappMasterId }});
        }

    }

    closeReportDownloadDialog() {
        this.dialog.closeAll();
    }

    // ================== FOR REPORT ===================
    downloadAnnexureVaReport() {
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureFiveAReport' : 'getAnnexureFiveABanglaReport';
        this.isLoading = true;
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK");
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureIIReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureTwoReport' : 'getAnnexureTwoBanglaReport';
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureIReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureOneReport' : 'getLocationWIseCostBreakDownBnReport';

        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                this.isLoading = false;
            }
        );
    }

    getAnnexureII() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureFourReport' : 'getAnnexureFourBanglaReport';

        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureIIIaReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureThreeAReport' : 'getAnnexureThreeABanglaReport';

        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureIIIbReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureThreeBReport' : 'getAnnexureThreeBBanglaReport';

        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureIIIcReport() {
        this.isLoading = true;

        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureThreeCReport' : 'getAnnexureThreeCBanglaReport';
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureVbReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureFiveBReport' : 'getAnnexureFiveBBanglaReport';
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureSixReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureSixReport' : 'getAnnexureSixBanglaReport';

        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // ============== for dpp report part A ==================
    downloadPartAReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getPartAReport' : 'getPartABanglaReport';
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadPartBReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getPartBReport' : 'getPartBBanglaReport';
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // for download full dpp report
    downloadFullDppReport() {
        this.isLoading = true;
        this.dialog.closeAll();
        let methodName = this.projectSummary.isForeignAid ? 'getFullDppReport' : 'getFullDppBanglaReport';
        this._reportDataService[methodName](this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK");
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // ============= for tapp report ==================
    downloadTappAnnexureIReport() {
        this.isLoading = true;
        this._reportDataService.getTappAnnexureOneAReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadTappPartAReport() {
        this.isLoading = true;
        this._reportDataService.getTappPartAReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadTappPartBReport() {
        this.isLoading = true;
        this._reportDataService.getTappPartBReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadTappAnexTwoReport() {
        this.isLoading = true;
        this._reportDataService.getTappAnexTwoReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadTappAnexFiveReport() {
        this.isLoading = true;
        this._reportDataService.getTappAnexFiveReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }


    // Cumulative Progress and Year Wise Breakdown   start




    private getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
                this.isForeignAid = res.isForeignAid;
                this.getRtappYearWiseEstimatiedCost();




            })
        );

        this.subscribe$.add(
            this.rtappAnnualPhasingCostService.getDetailsEstimatedCost(this.rdppRtappMasterId).subscribe(res => {
                this.rtappAnnualPhasingCost = res;
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
        this.rtappReport();

    }



    // for fiacal year
    private emptyAllArray() {
        // this.fiscalYearList = [];
        this.revenueArray = [];
        this.fiscalYearWiseCost = [];
        this.revenueTotal = null;
    }

    private getAllSubEconomicCodeByEconomicCodes(dppAnnualPhasingCostTabDetails: ITppAnnualPhasingCostTabDetails[]) {
        this.subscribe$.add(
            this.subEconomicCodeService.getByEconomicCodes(dppAnnualPhasingCostTabDetails.map(m => m.economicCodeId)).subscribe(res => {
                dppAnnualPhasingCostTabDetails.forEach((e, index) => {
                    this.subEconomicCodes.push(({index: index,codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes}));
                    this.subEconomicList.push(({
                        index: index,
                        codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes.map(m => ({
                            name: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
                            nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            value: m.id,
                        }))
                    }));

                });
            })
        )
    }

    private getRevenueComponentDataRtapp() {
        this.show = true;
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.uuid).pipe(
                switchMap(ps => this.rtappAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        rtappMasterId: this.rdppRtappMasterId ,
                        componentName: DppAnnualPhasingConstant.Revenue_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.conceptId = res.ps.id;
                if (res.dapc == null) {
                    if(this.rtappObjModel?.revisedVersion == '1st Revised'){
                        this.revenueComponentInRdppFound = false;
                    }else{
                        this.revenueComponentInRdppFound = false;
                     }
                } else {
                    this.revenueComponentInRdppFound = true;
                    this.tppAnnualPhasingCostWithChildDetails = res.dapc;
                    this.getAllSubEconomicCodeByEconomicCodes(res.dapc.tappAnnualPhasingCostTabDetails);
                    this.revenueTotal = res.dapc.tappAnnualPhasingCostTotal;
                    this.fiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                    this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                     this.show = false;
                }
            })
        );
    }

    private rtappReport(){
        this.subscribe$.add(
            this.rtappAnnualPhasingCostService.getDetailsEstimatedCost(this.rdppRtappMasterId).subscribe( res => {
                this.rtappReportDataList = res.capital.dppAnnualPhasingCostTotal;
                this.rtappReportcapiDataList = res.capital;

            })
        );
    }
    downloadCumulativeProgressReport_pdf(){
        this.spinner = true;
        if(this.rtappReportcapiDataList != null){

            this.downloadCumulativeProgressReport('Rtapp Cumulative Anex VI Report', 'rtapp/rtappCumulativeAnexVIReport')
            this.spinner = false;
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
            this.spinner = false;
        }

    }

    downloadCumulativeProgressReport($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;


        this.data['rtappAnnualPhasingCost'] = JSON.stringify(this.rtappAnnualPhasingCost);
        this.data['fiscalYearWiseCost'] = JSON.stringify(this.fiscalYearWiseCost);



        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);

    }

        // Cumulative Progress and Year Wise Breakdown   end

    // ============= for tapp report Annexure Four Report ==================


    downloadTappAnnexureFourReport() {
        this.isLoading = true;
        this._reportDataService.getTappAnnexureFourAReport(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

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
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }


    // ============= for tapp report Annexure Eight Goods Report ==================
    downloadTappAnnexureEightGoods() {
        this.isLoading = true;
        this._reportDataService.getTappAnnexureEightGoods(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // ============= for tapp report Annexure Eight Service Report ==================
    downloadTappAnnexureEightService() {
        this.isLoading = true;
        this._reportDataService.getTappAnnexureEightService(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // ============= for tapp report Annexure Seven Report ==================
    downloadTappAnnexureSeven() {
        this.isLoading = true;
        this._reportDataService.getTappAnnexureSeven(this.uuid).subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
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
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // for download dpp GO report
    downloadDppGOReport() {
        this.isLoading = true;
        this.dialog.closeAll();
        //getDppGOReport
        this._reportDataService.getDppGOBanglaReport(this.uuid, "GO").subscribe(
            res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK");
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    // committeeSelectChange($event: MatSelectChange) {
    //     if ($event.value) {
    //         this.isLoading = true;
    //         this._reportDataService.getCommitteeReportByUrl(this.uuid, $event.value).subscribe(res => {
    //             this._reportCommonService.previewReport(res, "PDF");
    //             this.isLoading = false;
    //         }, error => {
    //             this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
    //             this.isLoading = false;
    //         });
    //     }
    // }

    committeeSelectChange($event: MatSelectChange) {
        if($event.value){
            this.reportIndex = $event.value;
            this.openDialogfor_PIC_PSC($event.value);
        }
    }


    openDialogfor_PIC_PSC(event) {
        this.findByPcUuidAndReportIndex(this.uuid, event);
        let dialogRef = this.dialog.open(this.pscDialog, {
            height: 'auto',
            width: '1100px',
            position: {
                top: '10vh',
                left: '12vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
        });
    }


    private findByPcUuidAndReportIndex(pcUuid, reportIndex){
        this.termOfRef.reset();
        this.termOfRefServiceReport.findByPcUuidAndReportIndex(pcUuid, reportIndex).subscribe(res =>{
            if(res){
                this.termOfRefSave= false;
                this.termOfRefUpdate = true;
                this.termOfRefDownload = true;
                this.termOfRef.patchValue({
                    uuid : res.uuid,
                    pcUuid : res.pcUuid,
                    reportIndex : res.reportIndex,
                    termOfReference : res.termOfReference
                })
            }else{
                this.termOfRefSave= true;
                this.termOfRefUpdate = false;
                this.termOfRefDownload = false;
            }

        })
    }

    private create() {
        this.termOfRef.patchValue({
            pcUuid : this.uuid,
            reportIndex : this.reportIndex,
            termOfReference : this.termOfRef.value.termOfReference
        })
        this.spinner = true;
        this.termOfRefServiceReport.create(this.termOfRef.value).subscribe(res =>{
            if (res.uuid) {
                this.findByPcUuidAndReportIndex(res.pcUuid, res.reportIndex);
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                this.spinner = false;
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
                this.spinner = false;
            }
        })
    }

    // For updating  TermOfReferenceReport
    private update() {
        this.termOfRef.patchValue({
            pcUuid : this.uuid,
            reportIndex : this.reportIndex,
            termOfReference : this.termOfRef.value.termOfReference
        })
        this.spinner = true;
        this.termOfRefServiceReport.update(this.termOfRef.value).subscribe(res =>{
            if (res.uuid) {
                this.findByPcUuidAndReportIndex(res.pcUuid, res.reportIndex);
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                this.spinner = false;
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                this.spinner = false;
            }
        })
    }

    private downloadTermOfRefReport(){
        this.spinner = true;
        this._reportDataService.getCommitteeReportByUrl(this.uuid, this.reportIndex).subscribe(res => {
            this._reportCommonService.previewReport(res, "PDF");
            this.spinner = false;
            this.dialog.closeAll();
        }, error => {
            this.snackbarHelper.openWarnSnackBarWithMessageEnBn("Report Not Found !", "রিপোর্ট পাওয়া যায়নি !");
            this.spinner = false;
        });
    }

    selectAdministrativeChange($event: MatSelectChange) {

    }

    workingSelectChange($event: MatSelectChange) {
        if ($event.value) {
            this.isLoading = true;
            this._reportDataService.getWorkingPlanReport(this.uuid).subscribe(
                res => {
                    this._reportCommonService.previewReport(res, "PDF");
                    this.isLoading = false;
                },
                err => {
                    this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                    console.log(err);
                    this.isLoading = false;
                }
            );
        }
    }

    summarySelectChange($event: MatSelectChange) {
        if ($event.value) {
            this.isLoading = true;
            this._reportDataService.getSummaryReportByUrl(this.uuid, $event.value).subscribe(
                res => {
                    this._reportCommonService.previewReport(res, "PDF");
                    this.isLoading = false;
                },
                err => {
                    this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                    console.log(err);
                    this.isLoading = false;
                }
            );
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
            this.findDppCurrentStage(this.rdppRtappMasterId);

        } else if (this.projectSummary.projectTypeDTO.nameEn.toLowerCase() === 'tapp') {
            this.findTappCurrentStage(this.rdppRtappMasterId)
        }
    }

    findDppCurrentStage(dppMasterId) {
        this.stageMovementService.getCurrentStage(dppMasterId, 'RDPP').subscribe(async res => {
            if (res.res) {
                if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
                    this.canEdit = true;
                } else {
                    this.canEdit = false;
                    // await this.router.navigate([`rdpp-rtapp/view-dashboard/${uuid}`]);
                }
            } else {
                // await this.router.navigate([`rdpp-rtapp/dashboard/${uuid}`]);
                this.canEdit = true;
            }
        });
    }

    findTappCurrentStage(tappMasterId) {
        this.stageMovementService.getCurrentStageInTapp(tappMasterId).subscribe(async res => {
            if (res.res) {
                if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
                    // await this.router.navigate([`rdpp-rtapp/dashboard/${uuid}`]);
                    this.canEdit = true;
                } else {
                    this.canEdit = false;
                    // await this.router.navigate([`rdpp-rtapp/view-dashboard/${uuid}`]);
                }
            } else {
                // await this.router.navigate([`rdpp-rtapp/dashboard/${uuid}`]);
                this.canEdit = true;
            }
        });
    }

    gotToEditDashboard() {
        this.route.navigate(['/rdpp-rtapp/dashboard'], { queryParams: {pcUuid: this.uuid, id: this.rdppRtappMasterId}});
    }

    private openDialogProjectMovement(callback) {
        let label;
        if(this.userGroup.groupStatus === 'PLANNING-MINISTER'){
            label = this.isEnLabel ? 'Approve':'অনুমোদন করুন';
        } else {
            label = this.isEnLabel ? 'Okay':'প্রেরণ করুন';
        }
        const confimationMsg = this.isEnLabel ? 'Are you sure that you want to ' + this.forwardReturnAction + ' this Project?' : 'আপনি কি প্রজেক্ট টি ' + this.forwardReturnAction + ' চান?';
        let options = {
            title: confimationMsg,
            confirmLabel: label,
            declineLabel: this.isEnLabel ?'Cancel':'বাতিল করুন',
        };
        this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
            if (res) {
                callback(true);
            }
        });
    }

    //get mode of finance total value and annexure 5b total data for show send to nothi button
    getRdppTotalModeData(res: any) {
        this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rdppMasterId).subscribe(response => {
            if (response.length > 1) {
                let total = response.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.allGrandTotal);
                this.totalAmountAnnexure5B = Number(total[0].totalAmount.toFixed(2));
                this.modelOfFinanceList = res.res.modeFinanceList;
                this.totalModeOfFinance.gobAmount = this.modelOfFinanceList.map(m => m.gob).reduce((sum, current) => sum+current, 0);
                this.totalModeOfFinance.feGobAmount = this.modelOfFinanceList.map(m => m.gobFe).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.otherAmount = this.modelOfFinanceList.map(m => m.others).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.feOtherAmount = this.modelOfFinanceList.map(m => m.othersFe).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.ownFundAmount = this.modelOfFinanceList.map(m => m.ownFund).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.feOwnFundAmount = this.modelOfFinanceList.map(m => m.ownFundFe).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.paAmount = this.modelOfFinanceList.map(m => m.pa).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.rpaAmount = this.modelOfFinanceList.map(m => m.paRpa).reduce((sum, current) => sum + current, 0);
                this.totalModeOfFinance.totalAmount =
                    this.totalModeOfFinance.gobAmount  + this.totalModeOfFinance.feGobAmount +
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
        this.rdppAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            projectConceptId: this.pcId,
            componentName: DppAnnualPhasingConstant.Revenue_Component
        }).subscribe(res => {
            if (res == null) {
                this.isDppAnnexure5BDataEmpty = true;
            }
        });
    }

    checkDppPartAData(res: any) {
        if( res.res.concernedDivisionId == null) {
            this.isDppPartAConcernedDivisionIdEmpty = true;
        }
        if( res.res.objectivesTargets == null || res.res.objectivesTargets == '') {
            this.isDppObjectiveTargetsDataEmpty = true;
        }
    }

    checkDppAnnexureIData() {
        this.dppLocationWiseCostBreakdownService.getByProjectConceptMasterId(this.pcId).subscribe( res => {
            if( res.length == 0) {
                this.isDppAnnexureIDataEmpty = true;
            }
        })
    }

    checkDppAnnexureIIIData() {
        this.dppAnnexureGoodsIiiAService.getDataList('get-list/Goods/'+this.rdppMasterId).subscribe( res => {
            if( res.res == null || res.res == '') {
                this.isDppAnnexureIIIDataEmpty = true;
            }
        })
    }

    /* Check Tapp Data validation for send to nothi*/
    checkTappCumulativeProgress() {
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            rtappMasterId: this.rtappMasterId,
            componentName: DppAnnualPhasingConstant.Revenue_Component
        }).subscribe( res => {
            if( res == null) {
                this.isTappCumulativeProgressDataEmpty = true;
            }
        })
    }

    checkTappAnnexerI() {
        this.tappAnnexureGoodsService.getDataList('get-list/Tapp-Goods/'+this.rtappMasterId).subscribe(
            (response) => {
                if(response.res == null || response.res == ""){
                    this.isTappAnnexureIDataEmpty = true
                }
            },
            err =>{
                console.log('checkAnnexerI', err);
            }
        )
    }




    // checkTappPartAData(res: TappObjectiveCostModel) {
    //     if (res == null) {
    //         this.isTappDesignationContactPersonDataEmpty = true;
    //         this.isTappObjectiveTargetsDataEmpty = true;
    //         this.isTappResponsiblePreparation = true;
    //     }
    //     if (res.designationContactPerson == null || res.designationContactPerson == '') {
    //         this.isTappDesignationContactPersonDataEmpty = true;
    //     }
    //     if (res.objectivesTargets == '' || res.objectivesTargets == null) {
    //         this.isTappObjectiveTargetsDataEmpty = true;
    //     }
    //     if (res.responsiblePreparation == null || res.responsiblePreparation == '') {
    //         this.isTappResponsiblePreparation = true;
    //     }

    // }

    downloadAllAttachments(){
        this.fileUploadService.downloadDppAttachementsZip(this.pcId);
    }

    applyFilter(event: any) {

    }

    getListDashboardAttachment(): any {
        let projectType = "RDPP";
        if (this.projectSummary.projectTypeDTO.nameEn=='TAPP') {
            projectType = "RTAPP";
        }
        this.dashboardAttachmentService.getRdppRtappListDashboardAttachment({
            page: this.page,
            size: this.size
        }, this.rdppRtappMasterId, projectType).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content);
            this.total = res.totalElements;
        });
    }

    savePotroJariAttachment() {
        let message: String;
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        (this.projectSummary.isForeignAid) ? message = 'Attached Potrojari successfully' : message = 'পত্রজারি সফলভাবে সংযুক্ত হয়েছে';

        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI;
        this.projectMovementModel.userId = this.userGroup.userId;
        const dialogConfigPotroJari = new MatDialogConfig();
        dialogConfigPotroJari.disableClose = false;
        dialogConfigPotroJari.autoFocus = false;
        dialogConfigPotroJari.width = '50%';
        dialogConfigPotroJari.height = 'auto';
        dialogConfigPotroJari.data = {
            message: message,
            projectMovementStageModel: this.projectMovementModel
        };
        const dialogRef = this.dialog.open(PotroJariComponent, dialogConfigPotroJari);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.isPotroJariAttach = false;
                this.isForwardToMinistryHead = true;
                this.manualPotroJari = true;
                this.showButtonSendToNothi = false;
            }

        })
    }


    /**
     * open dialog for meeting or working paper model new
     * */
     openMeetingScheduleDialog() {
        let dialog = this.dialog.open(this.relatedMeetingAttachmentDialog, {
            width: '700px',
            maxHeight: '95vh',
            position: {
                top: '2vh',
                left: '30vw'
            },
        });
        dialog.afterClosed().subscribe(result => {
            this.meetingType = false;
            this.paperType = false;
        });
    }

    // /**
    //  * open dialog for meeting or working paper model
    //  * */
    //  openMeetingScheduleDialog() {
    //     let dialog = this.dialog.open(this.attachmentMeetingDialog, {
    //         height: '400px',
    //         width: '600px',
    //         position: {
    //             top: '15vh',
    //             left: '35vw'
    //         },
    //     });
    //     dialog.afterClosed().subscribe(result => {
    //         this.meetingType = false;
    //         this.paperType = false;
    //     });
    // }

    /**
     * save meeting or working paper with attachment
     * */
    saveMeetingOrWorkingPaperWithAttachment() {
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        if (this.meetingType) {
            this.projectMovementModel.userId = this.userGroup.userId;
            let projectStatus;
            if (this.setMeetingType == this.meetingNotice[4].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE;
                projectStatus = this.isEnLabel ? 'Awaiting for Project Scrutiny Committee Meeting' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE);
            } else if (this.setMeetingType == this.meetingNotice[5].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD;
                projectStatus = this.isEnLabel ? 'Project Scrutiny Committee Meeting Held' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD);
            } else if (this.setMeetingType == this.meetingNotice[0].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.DPEC_MEETING_NOTICE;
                projectStatus = this.isEnLabel ? 'Awaiting for DPEC Meeting' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.DPEC_MEETING_NOTICE);
            } else if (this.setMeetingType == this.meetingNotice[1].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.DPEC_MEETING_HELD;
                projectStatus = this.isEnLabel ? 'DPEC Meeting Held' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.DPEC_MEETING_HELD);
            } else if (this.setMeetingType == this.meetingNotice[2].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.DSPEC_MEETING_NOTICE;
                projectStatus = this.isEnLabel ? 'Awaiting for DSPEC Meeting' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.DSPEC_MEETING_NOTICE);
            } else if (this.setMeetingType == this.meetingNotice[3].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.DSPEC_MEETING_HELD;
                projectStatus = this.isEnLabel ? 'DSPEC Meeting Held' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.DSPEC_MEETING_HELD);
            } else if (this.setMeetingType == this.meetingNotice[6].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.PEC_MEETING_NOTICE;
                projectStatus = this.isEnLabel ? 'Awaiting for PEC Meeting' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.PEC_MEETING_NOTICE);
            } else if (this.setMeetingType == this.meetingNotice[7].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.PEC_MEETING_HELD;
                projectStatus = this.isEnLabel ? 'PEC Meeting Held' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.PEC_MEETING_HELD);
                this.isInDspecMeetingHeld = false;
            } else if (this.setMeetingType == this.meetingNotice[8].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.SPEC_MEETING_NOTICE;
                projectStatus = this.isEnLabel ? 'SPEC Meeting Held' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.SPEC_MEETING_HELD);
            } else if (this.setMeetingType == this.meetingNotice[9].name) {
                this.projectMovementModel.currentStage = ProjectMovementStageConstant.SPEC_MEETING_HELD;
                projectStatus = this.isEnLabel ? 'SPEC Meeting Held' : this.statusStage.getProjectStatus(ProjectMovementStageConstant.SPEC_MEETING_HELD);
            }
            this.saveMeetingNoticeWithAttachment(projectStatus);
        } else {
            this.saveWorkingPaperWithAttachment();
        }
    }


    /**
     * save working paper type with attachment
     * */
    saveWorkingPaperWithAttachment() {
        this.projectMovementService.saveWorkingPaperWithAttachment(this.file, this.currentMovementStage.id, this.setWorkingPaperType).subscribe(res => {
            if (res) {
                this.frmGroup.reset();
                this.snackbarHelper.openSuccessSnackBarWithMessage('Working Paper saved successfully', 'OK');
                this.dialog.closeAll();
                this.getProjectMovementAttachmentByDppUuid(this.currentMovementStage.id);
                this.getAllProjectMovementAttachment(this.currentMovementStage.id);
            }
        }, _ => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Attachment is failed to save', 'OK');
        });
    }


    getProjectMovementAttachmentByDppUuid(id) {
        this.projectMovementService.getProjectMovementAttachmentByDppUuid(id,this.pageProjectMovement, this.sizeProjectMovement).subscribe(res => {
            this.dataSourceMovementStageAttachment = new MatTableDataSource(res.content);
            this.totalProjectMovement = res.totalElements;
        });
    }

    /**
     * on change type for open div meeting or working paper type
     * */
     onChangeMeetingType(type: any): any {
        if (type == 'meeting') {
            this.paperType = false;
            this.meetingType = true;
        } else {
            this.meetingType = false;
            this.paperType = true;
        }
    }

    /**
     * set value meeting or working paper type
     * */
    scheduleMeeting(event: MatSelectChange, type: string) {
        if (type == 'meeting') {
            this.setMeetingType = event.value;
            this.setWorkingPaperType = null;
        } else {
            this.setWorkingPaperType = event.value;
            this.setMeetingType = null;
        }
    }

    savePotroJariAttachmentMinistry(){
        let message: String;
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        (this.projectSummary.isForeignAid) ? message = 'Attached Potrojari successfully' : message = 'পত্রজারি সফলভাবে সংযুক্ত হয়েছে';

        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY;
        this.projectMovementModel.userId = this.userGroup.userId;
        const dialogConfigPotroJari = new MatDialogConfig();
        dialogConfigPotroJari.disableClose = false;
        dialogConfigPotroJari.autoFocus = false;
        dialogConfigPotroJari.width = '50%';
        dialogConfigPotroJari.height = 'auto';
        dialogConfigPotroJari.data = {
            message: message,
            projectMovementStageModel: this.projectMovementModel
        };
        const dialogRef = this.dialog.open(PotroJariComponent, dialogConfigPotroJari);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.isPotroJariAttachMinistry = false;
                this.showButtonSendToNothi = false;
                this.isRelatedMeetingAttachments = true;
                this.isReturnToAgencyHead = true;
            }

        })
    }

    getPreviousVersionTotalModeData(referenceId){

        if(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP'){

            if(this.revisedVersion == '1st Revised' && !referenceId){
                this.getDppObjectiveCostData();
                this.getDppTotalModeData();
            }else{
                this.getRdppObjectiveCostByRefUuid(referenceId);
            }

        }else if(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP'){

            if(this.revisedVersion == '1st Revised' && !referenceId){
                this.getTappObjectiveCostData();
                this.getRefTappGrandTotal(this.pcId);
            }else{
                this.getRefRtappGrandTotal(referenceId);
            }

        }

    }

    getDppObjectiveCostData(){
        this.dppObjectiveCostService.getByProjectConceptUuid(this.uuid).subscribe(
            res => {
                if(res?.res){
                    this.referenceObjectiveCost = res.res;
                }
            },
            err => {
                console.log('getByProjectConceptUuid err ',err);
            }
        )
    }

    getTappObjectiveCostData(){
        this.rtappObjectiveCostService.getObjCostProjectConceptByUuid(this.uuid).subscribe(
            res => {
                if(res?.res){
                    this.referenceObjectiveCost = res.res;
                }
            },
            err => {
                console.log('getByProjectConceptUuid err ',err);
            }
        )
    }

    getDppTotalModeData() {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.projectSummary.id).subscribe(
            response => {
                if (response.length > 1) {
                    let total = response.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                    this.checkRdppApprovedValidation(total[0].totalAmount);
                }
            }
        );
    }

    private getRdppObjectiveCostByRefUuid(referenceId) {
        this.rdppObjectiveCostService.getObjectiveCostByRdppMasterId(referenceId).subscribe(
            res => {
                if (res) {
                    this.referenceObjectiveCost = res;
                    if (res && res.modeFinanceList) {
                        this.preTotalModeOfFinance.gobAmount = res.modeFinanceList.map(m => m.gob).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.feGobAmount = res.modeFinanceList.map(m => m.gobFe).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.otherAmount = res.modeFinanceList.map(m => m.others).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.feOtherAmount = res.modeFinanceList.map(m => m.othersFe).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.ownFundAmount = res.modeFinanceList.map(m => m.ownFund).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.feOwnFundAmount = res.modeFinanceList.map(m => m.ownFundFe).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.paAmount = res.modeFinanceList.map(m => m.pa).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.rpaAmount = res.modeFinanceList.map(m => m.paRpa).reduce((sum, current) => sum + current, 0);
                        this.preTotalModeOfFinance.totalAmount =
                            this.preTotalModeOfFinance.gobAmount + this.preTotalModeOfFinance.feGobAmount +
                            this.preTotalModeOfFinance.otherAmount + this.preTotalModeOfFinance.feOtherAmount +
                            this.preTotalModeOfFinance.ownFundAmount + this.preTotalModeOfFinance.feOwnFundAmount +
                            this.preTotalModeOfFinance.paAmount + this.preTotalModeOfFinance.rpaAmount;

                        this.checkRdppApprovedValidation(this.preTotalModeOfFinance.totalAmount);
                    }
                }
            }
        );
    }

    checkRdppApprovedValidation(preGrandTotal){

        let costChangeAmount = this.rdppGrandTotal - preGrandTotal;
        let costChangePercentage = (costChangeAmount/preGrandTotal)*100;
        let daysDiff = 0;
        if(this.objectivesAndCost.dateCompletion && this.referenceObjectiveCost.dateCompletion){
            daysDiff = moment(this.objectivesAndCost.dateCompletion).diff(this.referenceObjectiveCost.dateCompletion, 'days');
        }

        if(this.objectivesAndCost.costExtension || (this.objectivesAndCost.costExtension && this.objectivesAndCost.timeExtension)){

            if( costChangeAmount<0 ){
                this.isRdppApprovedByPlancomMinister = true;

            } else if(this.revisedVersion == '1st Revised'){
                if(costChangeAmount<=4000 && costChangePercentage<=15){
                    this.isRdppApprovedInMinistry = true;
                } else if((costChangeAmount<=5000 && costChangePercentage<=25) || this.totalModeOfFinance.totalAmount<=7500 ){
                    this.isRdppApprovedByPlancomMinister = true;
                }else{
                    this.isRdppApprovedByEcnec = true;
                }
            } else if(this.revisedVersion == '2nd Revised'){
                if((costChangeAmount<=5000 && costChangePercentage<=25) || this.totalModeOfFinance.totalAmount<=7500){
                    this.isRdppApprovedByPlancomMinister = true;
                }else{
                    this.isRdppApprovedByEcnec = true;
                }
            } else {
                this.isRdppApprovedByEcnec = true;
            }

        } else if(this.objectivesAndCost.timeExtension ){
            if( daysDiff<0 ){
                this.isRdppApprovedByPlancomMinister = true;
            } else if(this.revisedVersion == '1st Revised'){
                if(daysDiff<=365){
                    this.isRdppApprovedInMinistry = true;
                } else {
                    this.isRdppApprovedByPlancomMinister = true;
                }
            } else {
                this.isRdppApprovedByPlancomMinister = true;
            }
        }

    }

    checkRtappApprovedValidation(){

        let costChangeAmount = this.rtappGrandTotal - this.refTappGrandTotal?.totalAmount;
        let costChangePercentage = (costChangeAmount/this.refTappGrandTotal?.totalAmount)*100;
        let daysDiff = 0;
        if(this.objectivesAndCost?.dateCompletion && this.referenceObjectiveCost?.dateCompletion){
            daysDiff = moment(this.objectivesAndCost.dateCompletion).diff(this.referenceObjectiveCost.dateCompletion, 'days');
        }

        if(this.objectivesAndCost.costExtension || (this.objectivesAndCost.costExtension && this.objectivesAndCost.timeExtension)){
            if(this.revisedVersion == '1st Revised' && 0<=costChangeAmount && costChangeAmount<=2000 && costChangePercentage<=25){
                    this.isRdppApprovedInMinistry = true;
            } else {
                this.isRdppApprovedByPlancomMinister = true;
            }
        } else if(this.objectivesAndCost.timeExtension ){
            if(this.revisedVersion == '1st Revised' && 0<=daysDiff && daysDiff<=365){
                    this.isRdppApprovedInMinistry = true;
            } else {
                this.isRdppApprovedByPlancomMinister = true;
            }
        }

    }

    approvedByMinistry() {
        this.forwardReturnAction = this.isEnLabel? 'Approve':'অনুমোদন করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.MINISTRY_APPROVED;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.projectStatus = this.isEnLabel ? 'APPROVED' : 'অনুমোদিত';
                this.projectStage = this.isEnLabel ? 'APPROVED BY MINISTRY' : 'মন্ত্রণালয় কর্তৃক অনুমোদিত';
                this.showButtonSendToNothi = false;
                this.isReturnToAgencyHead = false;
                this.isRelatedMeetingAttachments = false;
                // this.isTappApproveInMinistry = false;
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Approved By Ministry Successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('মন্ত্রণালয় কর্তৃক সফল ভাবে অনুমোদন সম্পন্ন হয়েছে', 'ওকে');
                this.ngOnInit();
            });
        });
    }

    forwardToMinistryMovement() {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.projectStatus = this.isEnLabel ? 'MINISTRY HEAD' : 'মিনিস্ট্রি এর হেড';
                this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
                this.isForwardToMinistryHead = false;
                this.showButtonSendToNothi = false;
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Ministry successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে মন্ত্রণালয়ে প্রেরণ করা হয়েছে', 'ওকে');
            });
        });

    }

    toAgencyHeadMovement() {
        this.forwardReturnAction = this.isEnLabel ? 'Return' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
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
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Agency successfully', 'OK')
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে এজেন্সিতে ফেরত পাঠানো হয়েছ', 'ওকে');
            });
        });
    }

    returnToMinistryMovement() {
        this.forwardReturnAction = this.isEnLabel ? 'Return' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
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
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Ministry successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে মন্ত্রণালয়ে ফেরত পাঠানো হয়েছে', 'ওকে');
            });
        });
    }

    forwardToPlanningMovement(fromAction: string) {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        if (fromAction==='unapprove') this.forwardReturnAction = this.isEnLabel ? 'unapprove' : 'অননুমোদন করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
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
                this.isConditionalApproveByEcnec = false;
                this.isEcnecApprove = false;
                this.isUapproveByEcnec = false;
                this.projectStatus = this.isEnLabel ? 'PLANNING HEAD' : 'পরিকল্পনা হেড';
                this.projectStage = this.isEnLabel ? 'IN PLANNING' : 'পরিকল্পনা কমিশনে আছে';
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Planning successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে পরিকল্পনা কমিশনে প্রেরণ করা হয়েছে', 'ওকে');
            });
        });
    }

    forwardToPlanningMinister() {
        this.forwardReturnAction = this.isEnLabel? 'Forward' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.showButtonSendToNothi = false;
                this.isReturnToMinistryHead = false;
                this.isForwardToPlanningMinister = false;
                this.isReturnToAgencyHead = false;
                this.isInpecMeetingNotice = false;
                this.isInpecMeetingHeld = false;
                this.isRelatedMeetingAttachments = false;
                this.projectStatus = this.isEnLabel ? 'PLANNING MINISTER' : 'পরিকল্পনা মিনিস্টার';
                this.projectStage = this.isEnLabel ? 'IN PLANNING MINISTER' : 'পরিকল্পনা মিনিস্টারে আছে';
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Minister successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে মন্ত্রীর কাছে প্রেরণ করা হয়েছে', 'ওকে');
            });
        });
    }

    approvedByPlanningMinister() {
        this.forwardReturnAction = this.isEnLabel? 'Approve':'অনুমোদন করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.projectStatus = this.isEnLabel ? 'APPROVED' : 'অনুমোদিত';
                this.projectStage = this.isEnLabel ? 'APPROVED BY Minister' : 'মিনিস্টার দ্বারা অনুমোদিত';
                this.isInPlanningMinister = false;
                this.isForwardToEcnec = false;
                this.isInEcnec = false;
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Approved By Minister successfully','OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('মন্ত্রী দ্বারা সফল ভাবে অনুমোদন সম্পন্ন হয়েছে','ওকে');

            });
        });
    }

    forwardToEcnec() {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.IN_ECNEC;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.IN_ECNEC;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isInPlanningMinister = false;
                this.isForwardToEcnec = false;
                this.isInEcnec = false;
                this.projectStatus = this.isEnLabel ? 'Forwarded to ECNEC' : 'একনেকে প্রেরণ করা হয়েছে';
                this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেকে আছে';
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to ECNEC successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('সফলভাবে একনেকে প্রেরণ করা হয়েছে', 'ওকে');
            });
        });
    }


    approvedByEcnec() {
        this.forwardReturnAction = this.isEnLabel? 'Approve':'অনুমোদন করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.currentStage = ProjectMovementStageConstant.ECNEC_APPROVED;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.ECNEC_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isEcnecApprove = false;
                this.isConditionalApproveByEcnec = false;
                this.isUapproveByEcnec = false;
                this.isInEcnec = false;
                this.projectStatus = this.isEnLabel ? 'APPROVED' : 'অনুমোদিত';
                this.projectStage = this.isEnLabel ? 'APPROVED BY ECNEC' : 'একনেক দ্বারা অনুমোদিত';
                if(this.isEnLabel)
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Approved by ECNEC successfully', 'OK');
                else
                    this.snackbarHelper.openSuccessSnackBarWithMessage('একনেক দ্বারা সফলভাবে অনুমোদন সম্পন্ন হয়েছে', 'ওকে');

            });
        });
    }

    setUnderExamine() {
        this.forwardReturnAction = this.isEnLabel ? 'Forward' : 'প্রেরণ করতে';
        this.openDialogProjectMovement((res) => {
            if (this.rdppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.rdppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.rtappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.UNDER_EXAMINE;
            this.projectMovementModel.userId = this.userGroup.userId;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isInUnderExamine = false;
                this.projectStatus = this.isEnLabel ? 'UNDER EXAMINE' : 'পরীক্ষাধীন';
                this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা কমিশনে আছে';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Under Examined successfully', 'OK');
            });
        });
    }

    // End Revised Project Summary
    savePotroJariAttachmentPlanning(){
        let message: String;
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        (this.projectSummary.isForeignAid) ? message = 'Attached Potrojari successfully' : message = 'পত্রজারি সফলভাবে সংযুক্ত হয়েছে';
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM;
        this.projectMovementModel.userId = this.userGroup.userId;
        const dialogConfigPotroJari = new MatDialogConfig();
        dialogConfigPotroJari.disableClose = false;
        dialogConfigPotroJari.autoFocus = false;
        dialogConfigPotroJari.width = '50%';
        dialogConfigPotroJari.height = 'auto';
        dialogConfigPotroJari.data = {
            message: message,
            projectMovementStageModel: this.projectMovementModel
        };
        const dialogRef = this.dialog.open(PotroJariComponent, dialogConfigPotroJari);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.showButtonSendToNothi = false;
                this.isRelatedMeetingAttachments = true;
                this.isReturnToMinistryHead = true;
                this.isPotroJariAttachPlancomm=true;
            }

        })
    }

    /**
     * open dialog for meeting or working paper model
     * */
    openConditionalApproveByEcnecDialog() {
        this.ecnecConditionFormGroup = this.formBuilder.group({
            conditions: [''],
            attachmentId: ['']
        });
        let dialog = this.dialog.open(this.conditionalApproveByEcnecDialog, {
            height: '600px',
            width: '1000px',
            position: {
                top: '10vh',
                left: '20vw'
            },
        });
        dialog.afterClosed().subscribe(result => {
           // this.meetingType = false;
           // this.paperType = false;
        });

    }

    submitConditionalEcnecApprove(){
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE;
        this.saveConditionalEcnecApprove(this.ecnecConditionFormGroup);
    }

    saveConditionalEcnecApprove(ecnecConditionFormGroup){
        this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
            const ecnecConditions = {
                projectMovementStageId:res.res.id,
                conditions:ecnecConditionFormGroup.value.conditions
            }
            this.fileUploadService.uploadConditionalEcnecAttachment(this.file, ecnecConditions).subscribe(res2 => {
                this.frmGroup.reset();
                this.snackbarHelper.openSuccessSnackBarWithMessage('Conditional approved done successfully', 'OK');
                this.isConditionalApproveByEcnec = false;
                this.isEcnecApprove = false;
                this.isUapproveByEcnec = false;
                this.projectStatus = "Conditionally Approved in ECNEC";
                this.checkProjectStage(ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE);
                this.dialog.closeAll();
            }, _ => {
                this.snackbarHelper.openErrorSnackBarWithMessage('Attachment is failed to save', 'OK');
            });
        })
    }

    unapprovedByEcnec() {
        this.showComments("EC", "forwardToPlanning");
    }

    forwardToEcnecFromPlanningMinister() {
        this.showComments("PM", 'forwardToEcnec');
    }

    toAgencyHead() {
        this.showComments("MD", "returnToAgencyHead");
    }

    showComments(commission: 'A' | 'MD' | 'PC' | 'EC' | 'ECU' | 'PM', forward: string) {
        this.dialog.closeAll();
        let sourceId;
        let source;
        let isUnapproved = false;
        if(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP'){
            sourceId = this.objectivesAndCost.id;
            source = CommentSourceEnum.RDPP
        }else if(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP'){
            sourceId = this.objectivesAndCost.id;
            source = CommentSourceEnum.RTAPP
        }
        if (commission==='ECU') {
            commission = 'EC';
            isUnapproved = true;
        }
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            sourceId: this.rdppMasterId ? this.rdppMasterId : this.rtappMasterId,
            source: source,
            commission: commission,
            userGroup: this.userGroup.groupStatus,
            forward: forward,
            projectStage: this.currentStage,
            isUnapproved: isUnapproved
        };
        const dialogRef = this.dialog.open(CommentObservationComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(result => {
            if(result) {
                if (forward === 'returnToAgencyHead') {
                    this.toAgencyHeadMovement();
                } else if (forward === 'forwardToPlanning') {
                    this.forwardToPlanningMovement('forwardToPlanning');
                } else if(forward === 'returnToMinistry') {
                    this.returnToMinistryMovement();
                } else if(forward === 'forwardToMinistryHead') {
                    this.forwardToMinistryMovement();
                } else if(forward === 'forwardToEcnec') {
                    this.forwardToEcnec();
                } else if (forward === 'unapprove') {
                    this.forwardToPlanningMovement('unapprove')
                }
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

    /** Start Annexure - I: Location Wise Cost Breakdown */

    async downloadAnnexure1Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['upazilas'] = JSON.stringify(this.upazilas);
        this.data['isForeignAid'] = JSON.stringify(this.isForeignAid);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    getRdppLocationWiseCostBreakdown() {
        this.spinner = true;
        this.getByLocationWiseCostProjectConceptMasterId((res) =>{
            this.spinner = false;
            if (res){
                this.getLocationByObjectCostId((res)=> {
                    this.spinner = false;
                    if (res){
                        this.downloadAnnexure1Report('Annexure-I-Location-Wise-Cost-Breakdown', 'rdpp/rdppAnnexureIReport');
                        this.spinner = false;
                    }
                })
            }
        });
    }


    private getLocationByObjectCostId(callBack) {
        this._rdppLocationService.getLocationByObjectiveCostIdUsingProjectSummary(this.rdppMasterId).subscribe(res => {
            this.divisionDataList = res;
            if (res) {
                this.locations = res;
                this.arrangeData(res);
            } else {
                this.saveDisable = true;
                this.snackbarHelper.openWarnSnackBarWithMessage("Require to save Part-A (Project Summary)", OK);
            }
            callBack(true);
        })
    }

    private getByLocationWiseCostProjectConceptMasterId(callBack) {
        this.dppLocationWiseCostBreakdownService.getByProjectConceptMasterId(this.projectSummary.id).subscribe(res => {
            this.locationWiseCost = res;
            callBack(true);
        })

    }
    private arrangeData(res) {
        let di = 0;
        res.divisions.forEach(division => {
            let zi = 0;
            let upazilaUnderDivision = division.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0);

            if(division && division.zillaList.length==0){
                this.createViewList(res.dppMasterId, division, null, null, di, zi, 0, upazilaUnderDivision);
            }

            division.zillaList.forEach(zilla => {
                let ui = 0;

                if(zilla && zilla.upaZillaList.length==0){
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
        this.show = true;
    }

    createViewList(rdppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision){

        const serial = ((!this.projectSummary?.isForeignAid && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(di +1) : di +1);
        let lwc:IDppLocationWiseCostBreakdown;

        if(upazila){
            lwc = this.locationWiseCost.find(f => f.upazilaId === upazila.id);
        } else if(zilla){
            lwc = this.locationWiseCost.find(f => f.zillaId === zilla.id);
        } else if(division){
            lwc = this.locationWiseCost.find(f => f.divisionId === division.id);
        }

        this.upazilas.push(
            {
                location: {
                    uuid: lwc ? lwc?.uuid : null,
                    id: lwc ? lwc?.id : null,
                    rdppMasterId: rdppMasterId,
                    dppMasterId: null,
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
                zSpan: this.calZSpan(zilla,ui), //((ui === 0) ? (division.zillaList[zi].upaZillaList.length) : 0),
                upazila: upazila,
                division: division,
                zilla: zilla,

            }
        );
    }

    calDSpan(division, zilla, upazila, zi, ui){
        let dRowSpan = 0;
        if(zi==0 && ui ==0){
            if (zilla){
                division?.zillaList.forEach(element => {
                    dRowSpan +=element.upaZillaList.length == 0?1:element.upaZillaList.length;
                })
            }else {
                dRowSpan = 1
            }
        }else if (zi==0 && !ui){
            dRowSpan = division?.zillaList.length;
        } else{
            dRowSpan = 0;
        }
        return dRowSpan;
    }

    calZSpan(zilla,ui){
        let zRowSpan;
        if (ui === 0){
            if (zilla==null){
                zRowSpan = 1;
            }else if(zilla?.upaZillaList.length==0){
                zRowSpan = 1;
            }else{
                zRowSpan = zilla?.upaZillaList.length;
            }
        }else {
            zRowSpan = 0;
        }
        return zRowSpan;
    }


    /** End Annexure - I: Location Wise Cost Breakdown */

    /** Start Annexure-II */

    async downloadAnnexure2Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['currentUpazilas'] = JSON.stringify(this.currentUpazilas);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    downloadAnnexureIVReport() {
        this.downloadAnnexure2Report('Year Wise Financial & Physical Target Plan', 'rdpp/rdppAnnexure-II');
    }

    /** End Annexure-II */

    /** Start Rdpp Annexure-III-Goods-Works-Service */

    async downloadAnnexure3A_B_CReport($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['project_name'] = JSON.stringify(this.project_name);
        this.data['projectCost'] = JSON.stringify(this.projectCost);
        this.data['goodsWorkAndServiceList'] = JSON.stringify(this.goodsWorkAndServiceList);
        this.data['projectInfo'] = JSON.stringify(this.projectInfo);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    getAnnexureIIIReport(formType: string) {
        this.getProjectInfo((res) => {
            if (res) {
                this.annexure5bData((res) => {
                    if (res) {
                        this.getRdppAnnexureServiceData(formType);
                    }
                })
            }
        })

    }

    async getProjectInfo(callBack) {
        this.spinner = true;
        this.rdppObjectiveCostService.getByProjectConceptUuidAndId(this.uuid, this.rdppMasterId).subscribe(
            async response => {
                if (response.status > 0) {
                    this.projectInfo = response.res;
                    this.project_name = (this.projectSummary?.isForeignAid == false && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ?
                        this.projectInfo.projectTitleBn : this.projectInfo.projectTitleEn;
                    callBack(true);
                }

                this.spinner = false;
            }, error=>{
                this.spinner = false;
            }
        )
    }

    public getRdppAnnexureServiceData(formType: string): any {
        this.rdppAnnexureGoodsService.getDataList(formType + this.rdppMasterId).subscribe(response => {
                if (response.res) {
                    this.goodsWorkAndServiceList = response.res;
                    if (formType == 'get-list/Goods/') {
                        this.downloadAnnexure3A_B_CReport('Annexure-III-(a)-GOODS', 'rdpp/rdppAnnexureIII(a)Report');
                    }
                    if (formType == 'get-list/Works/') {
                        this.downloadAnnexure3A_B_CReport('Annexure-III-(b)-WORKS', 'rdpp/rdppAnnexureIII(b)Report');
                    }
                    if (formType == 'get-list/Service/') {
                        this.downloadAnnexure3A_B_CReport('Annexure-III-(c)-Services', 'rdpp/rdppAnnexureIII(c)Report');
                    }
                } else {
                    this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                    this.isLoading = false;
                }
            }, error => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(error);
                this.isLoading = false;
            }
        );
    }

    annexure5bData(callBack){
        this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rdppMasterId).subscribe((res) => {
            let grandTotal = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].dppAnnualPhasingCostTotal[0];
            this.projectCost.gobAmount = grandTotal.gobAmount;
            this.projectCost.paAmount = grandTotal.spAcAmount + grandTotal.gobThruAmount + grandTotal.thruDpAmount + grandTotal.thruPdAmount;
            this.projectCost.ownFundAmount = grandTotal.ownFundAmount;
            this.projectCost.totalAmount = grandTotal.totalAmount;
            this.projectCost.others = grandTotal.otherAmount;
            callBack(true);
        })
    }

    /** End Rdpp Annexure-III-Goods-Works-Service */

    /** Start Annexure - IV: Amortization Schedule*/

    async downloadAnnexure4Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['amortizationSchedule'] = JSON.stringify(this.amortizationSchedule);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    getRdppAmortizationSchedule() {
        this.spinner = true;
        this.dppAmortizationScheduleService.getRdppAmortizationSchedule(this.rdppMasterId).subscribe(res => {
            if (res.status > 0) {
                this.amortizationSchedule = res;
                this.downloadAnnexure4Report('Annexure-IV-Amortization-Schedule', 'rdpp/rdppAnnexureIvReport')
                this.spinner = false;
            } else {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                this.spinner = false;
            }
            this.spinner = false;
        })
    }

    // End Annexure-IV: Amortization Schedule

    // Start RTAPP Report

    // Start Annexure- I(a) & (b)

    async downloadAnnexure_IA_B_Report($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';
        this.data['projectInfo'] = JSON.stringify(this.rtappProjectInfo);
        this.data['project_name'] = JSON.stringify(this.project_name);
        this.data['projectCost'] = JSON.stringify(this.rtappProjectCost);
        this.data['rtappGoodsAndServiceList'] = JSON.stringify(this.rtappGoodsAndServiceList);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    downloadRtappAnnexureI(formType: string) {
        this.getRtappProjectInfo((res)=> {
            if (res) {
                this.rtappAnnexure5bData((res) => {
                    if (res) {
                        this.getRtappAnnexureServiceData(formType);
                    }
                })
            }
        })
    }

    getRtappProjectInfo(callBack) {
        this.spinner = true;
        this.rtappObjectiveCostService.getProjectConceptByUuid(this.rtappMasterId).subscribe(
            response=>{
                if (response.status > 0){
                    this.rtappProjectInfo = response.res;
                    this.project_name = (this.projectSummary?.isForeignAid == false && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP')?
                        this.rtappProjectInfo.projectTitleBn : this.rtappProjectInfo.projectTitleEn;
                    this.spinner = false;
                }
                this.spinner = false;
                callBack(true);
            }, error=>{
            }
        )
    }

    public getRtappAnnexureServiceData(formType: string): any {
        this.tappAnnexureGoodsService.getDataList(formType + this.rtappMasterId).subscribe(response => {
                if (response.res) {
                    this.rtappGoodsAndServiceList = response.res;
                    if (formType == 'get-list/Tapp-Goods/') {
                        this.downloadAnnexure_IA_B_Report('Annexure_1(a)_Report', 'rtapp/rtappAnnexureI(a)Report');                    }

                    if (formType == 'get-list/Tapp-Service/') {
                        this.downloadAnnexure_IA_B_Report('Annexure-I-(b)-Services', 'rtapp/rtappAnnexureI(b)Report');
                    }
                } else {
                    this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                    this.isLoading = false;
                }
            }, error => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(error);
                this.isLoading = false;
            }
        );
    }

    rtappAnnexure5bData(callBack) {
        this.tappAnnexureGoodsService.getTappAnnexure5bData(this.rtappMasterId).subscribe((res) => {
            let grandTotal = res.filter(f => f.componentName === "Grand_Total")[0].tappAnnualPhasingCostTotal[0];
            this.rtappProjectCost.gobAmount = grandTotal.gobAmount;
            this.rtappProjectCost.paAmount = grandTotal.spAcAmount;
            this.rtappProjectCost.ownFundAmount = grandTotal.ownFundAmount;
            this.rtappProjectCost.totalAmount = grandTotal.totalAmount;
            callBack(true);
        })
    }

    /* End Annexure- I(a) & (b) */

    /* Start RTAPP Part A report */
    private getProjectConceptByUuidRepo() {
        this.subscribe$.add(
            this.tappObjectiveCostService.getProjectConceptByUuid(this.rdppRtappMasterId).subscribe((resp: any) => {
                this.tappGetRespon = resp;
                this.getRtappEstimatedCosts(this.uuid);
                this.getTappMasterData();
                this.dateList = resp;
            })
        );
    }
    getTappMasterData() {
        this.tappObjectiveCostService.getObjCostProjectConceptByUuid(this.uuid).subscribe(res => {
            this.originalCommencementDate = res.res.dateCommencement;
            this.originalCompletionDate = res.res.dateCompletion;
        })
    }
    private getRtappEstimatedCosts(conceptUuid: string) {
        this.tappObjectiveCostService.getEstimatedCosts(conceptUuid).subscribe(
            res => {
                this.estimatedCosts = res;

                let arrSize: number = this.estimatedCosts.length;

                let differenceEstimatedCostInTaka: EstimatedCostModel = new EstimatedCostModel();
                let differenceEstimatedPercentage: EstimatedCostModel = new EstimatedCostModel();

                let keys: string[] = ['paAmount', 'otherFeAmount', 'otherAmount', 'ownFundFeAmount', 'ownFundAmount',
                    'thruDpAmount', 'thruPdAmount', 'spAcAmount', 'gobThruAmount', 'gobFeAmount',
                    'gobAmount', 'totalAmount'];

                keys.map(key => {
                    differenceEstimatedCostInTaka[key] = Math.abs(this.estimatedCosts[arrSize - 1][key] - this.estimatedCosts[arrSize - 2][key]).toFixed(2);
                    differenceEstimatedPercentage[key] = (((differenceEstimatedCostInTaka [key] /
                        this.estimatedCosts[0][key]) * 100).toFixed(2));

                    differenceEstimatedPercentage[key] = differenceEstimatedPercentage[key] === 'NaN' ||
                    differenceEstimatedPercentage[key] === 'Infinity' ? '0.00' : differenceEstimatedPercentage[key];
                })
                differenceEstimatedCostInTaka.revisedVersion = "Difference (" +
                    this.estimatedCosts[arrSize - 1].revisedVersion + " - "
                    + this.estimatedCosts[arrSize - 2].revisedVersion + ")";

                this.estimatedCosts.push(differenceEstimatedCostInTaka, differenceEstimatedPercentage);
            },
            err => {
                this.estimatedCosts = [];
            }
        )
    }

    // 08 no table
    private setValue(data){
        return {
            gobAmount: data? data.gobAmount.toFixed(2):'0.00',
            gobFeAmount: data? data.gobFeAmount.toFixed(2):'0.00',
            rpaAmount: data? (data.gobThruAmount + data.spAcAmount).toFixed(2):'0.00',
            dpaAmount: data? (data.thruPdAmount + data.thruDpAmount).toFixed(2):'0.00',
            ownFundAmount: data? data.ownFundAmount.toFixed(2):'0.00',
            ownFundFeAmount: data? data.ownFundFeAmount.toFixed(2):'0.00',
            otherAmount: data? data.otherAmount.toFixed(2):'0.00',
            otherFeAmount: data? data.otherFeAmount.toFixed(2):'0.00',
            totalAmount: data? data.totalAmount.toFixed(2):'0.00',
        }
    }
    private getRtappYearWiseEstimatiedCost(){
        this.rtappAnnualPhasingCostService.getYearWiseEstimatedCosts(this.uuid).subscribe(
            res =>{
                this.estimatiedCostTotal = res;
                let fiscalYears: any[] = [];

                if(res[0].grandTotal.length){
                    res[0].grandTotal.forEach(element => {
                        fiscalYears.push(element.fiscalYear);
                    });
                }else{
                    res[1].grandTotal.forEach(element => {
                        fiscalYears.push(element.fiscalYear);
                    });
                }
                if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP'){

                    if (fiscalYears.length > 0) {
                        this.fiscalYearsList = [];

                        fiscalYears.forEach(fYear =>{

                            res.forEach((yearTotal, index)=>{
                                if(yearTotal?.grandTotal.length>0){
                                    yearTotal?.grandTotal.forEach(totalData => {
                                        if(fYear==totalData.fiscalYear){

                                            let obj: any = this.setValue(totalData?.tappAnnualPhasingCostTotal);
                                            obj.fiscalYear = fYear,
                                            obj.revisedVersion = yearTotal?.revisedVersion,
                                            this.fiscalYearsList.push(obj);
                                        }
                                    });
                                }else{

                                    let obj: any  = this.setValue(null);
                                    obj.fiscalYear = fYear,
                                    obj.revisedVersion = yearTotal?.revisedVersion,
                                    this.fiscalYearsList.push(obj)
                                }

                                this.estimatiedCostTotal[index].costTotal = this.setValue(yearTotal?.tappAnnualPhasingCostTotal[0]);
                                this.estimatiedCostTotal[index].costTotal.revisedVersion = yearTotal?.revisedVersion;
                            })
                        })
                    }
                }
            },
            err =>{
                console.log('getEstimatedCosts error : ', err);
            }
        );
    }
    // ================= // 08 no table end

    // 10 n0 table start
    private getRtappGrandTotalByMasterId(){
        this.spinner = true;
        this.rtappAnnualPhasingCostService.getRdppGrandTotalByMasterId(this.rdppRtappMasterId).subscribe(
            res => {

                this.rtappAnualCostService = res;
                this.arrangeCurrentGrandTotalList(res.currentGrandTotal);
          this.arrangeReferenceGrandTotalList(res.referenceGrandTotal);

          if (res && res.referenceItemWiseRevenue && res.referenceItemWiseRevenue.tappAnnualPhasingCostTabDetails.length>0) {
            this.refRevenueItemLst = res.referenceItemWiseRevenue.tappAnnualPhasingCostTabDetails;
            this.refRevenueItemGTObj = res.referenceItemWiseRevenue.tappAnnualPhasingCostTotal;
          }
          if (res && res.currentItemWiseRevenue && res.currentItemWiseRevenue.tappAnnualPhasingCostTabDetails.length > 0) {
            this.currRevenueItemLst = res.currentItemWiseRevenue.tappAnnualPhasingCostTabDetails
            this.currRevenueItemGTObj = res.currentItemWiseRevenue.tappAnnualPhasingCostTotal;
          }

          if (res && res.referenceItemWiseCapital && res.referenceItemWiseCapital.tappAnnualPhasingCostTabDetails.length > 0) {
            this.refCapitalItemLst = res.referenceItemWiseCapital.tappAnnualPhasingCostTabDetails
            this.refCapitalItemGTObj = res.referenceItemWiseCapital.tappAnnualPhasingCostTotal;
          }
          if (res && res.currentItemWiseCapital && res.currentItemWiseCapital.tappAnnualPhasingCostTabDetails.length>0) {
            this.currCapitalItems = res.currentItemWiseCapital.tappAnnualPhasingCostTabDetails;
            this.currCapitalItemGTObj = res.currentItemWiseCapital.tappAnnualPhasingCostTotal;
          }
          this.calculateYearWiseGrandTotal();

            },
            error => {
                console.log('getRdppGrandTotalByMasterId() : ',error);
                this.spinner = false;
            }
        );
        this.spinner = false;
    }



    // 10 n0 table End

    // 11 table
    getCumulativeDate() {
        this.rtappObjectiveCostService.getCumulativeDate(this.rdppRtappMasterId, this.uuid).subscribe((res) =>{
            this.cumulativeDate = res.res;
        });
    }
    private getRevenueComponentDataInRtapp() {
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            componentName: DppAnnualPhasingConstant.Revenue_Component,
            rtappMasterId: this.rdppRtappMasterId,
        }).subscribe(res => {
            if (res){
                this.fiscalYearLists = res.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                this.revenueItemList = res.tappAnnualPhasingCostTabDetails;
                this.fiscalYearWiseRevenueCostList = res.fiscalYearWiseCost;
                this.sumOfSubTotal(this.revenueSubTotal, this.revenueItemList);
                this.getEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.economicCodeId), this.revenueItemList);
                this.getSubEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.subEconomicCodeId), this.revenueItemList);
            }
        });
    }
    private getCapitalContiengencyDataInRtapp(): any {
        this.show = true;
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            rtappMasterId: this.rdppRtappMasterId,
            componentName: DppAnnualPhasingConstant.Contingency
        }).subscribe(res => {
            if (res){
                this.contingencyItemList = res.tappAnnualPhasingCostTabDetails;
                this.fiscalYearWiseContingencyCostList = res.fiscalYearWiseCost;
            }
            this.show = false;
        });
    }


    private getCapitalComponentDataInRtapp(): any {
        this.show = true;
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            rtappMasterId: this.rdppRtappMasterId,
            componentName: DppAnnualPhasingConstant.Capital_Component
        }).subscribe(res => {
            if (res){
                this.capitalItemList = res.tappAnnualPhasingCostTabDetails;
                this.fiscalYearWiseCapitalCostList = res.fiscalYearWiseCost;
                this.sumOfSubTotal(this.capitalSubTotal, this.capitalItemList);
                this.getEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.economicCodeId), this.capitalItemList);
                this.getSubEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.subEconomicCodeId), this.capitalItemList);
            }
            this.show = false;
        });
    }
    private getEconomicCodeList(economicCodes: any[], itemList: ITppAnnualPhasingCostTabDetails[]): void {
        this.subscribe$.add(
            this.economicCodeService.getByIdSet(economicCodes).subscribe(
                res => this.mapEconomicCodes(itemList, res),
                err =>console.log('getEconomicCodeList error : ', err)
            )
        );
    }

    private getSubEconomicCodeList(subEconomicCodes: any[], itemList: ITppAnnualPhasingCostTabDetails[]): void {
        this.subscribe$.add(
            this.subEconomicCodeService.getByIdSet(subEconomicCodes).subscribe(
                res => this.mapSubEconomicCodes(itemList, res),
                err => console.log('getSubEconomicCodeList error : ', err)
            )
        );
    }

    private mapSubEconomicCodes(itemList, subEconomicCodeList){
        itemList.forEach(item => {
            item.subEconomicCode = subEconomicCodeList.find(subEconomicCode => item.subEconomicCodeId == subEconomicCode.id);
        });
    }

    private mapEconomicCodes(itemList, economicCodeList){
        itemList.forEach(item => {
            item.economicCode = economicCodeList.find(code => item.economicCodeId == code.id);
        });
    }

    private sumOfSubTotal(subTotal, itemList) {
        subTotal.qty = itemList?.reduce((sum, current) => sum + current?.qty, 0);
        subTotal.quantity = itemList?.reduce((sum, current) => sum + current?.quantity, 0);
        subTotal.totalAmount = itemList?.reduce((sum, current) => sum + current?.totalAmount, 0)
        subTotal.gobAmount = itemList?.reduce((sum, current) => sum + current?.gobAmount, 0);
        subTotal.gobFeAmount = itemList?.reduce((sum, current) => sum + current?.gobFeAmount, 0);
        subTotal.gobThruAmount = itemList?.reduce((sum, current) => sum + current?.gobThruAmount, 0);
        subTotal.spAcAmount = itemList?.reduce((sum, current) => sum + current?.spAcAmount, 0);
        subTotal.thruPdAmount = itemList?.reduce((sum, current) => sum + current?.thruPdAmount, 0);
        subTotal.thruDpAmount = itemList?.reduce((sum, current) => sum + current?.thruDpAmount, 0);
        subTotal.ownFundAmount = itemList?.reduce((sum, current) => sum + current?.ownFundAmount, 0);
        subTotal.ownFundFeAmount = itemList?.reduce((sum, current) => sum + current?.ownFundFeAmount, 0);
        subTotal.otherAmount = itemList?.reduce((sum, current) => sum + current?.otherAmount, 0);
        subTotal.otherFeAmount = itemList?.reduce((sum, current) => sum + current?.otherFeAmount, 0);
    }

    private getRtappGrndTotal() {
        this.subscribe$.add(
            this.rtappAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rdppRtappMasterId).subscribe(
                res => {
                    if (res[0].grandTotal.length > 0) {
                        this.grandTotal = res.find(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)?.tappAnnualPhasingCostTotal[0];
                        this.fiscalYearWiseGrandTotalList = res.find(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                            res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                    }
                    this.show = false;

                }
            )
        );
    }

    //  --------
     printCallMethod(){
        this.spinner = true;
        this.getRtappGrandTotalByMasterId();
        this.getCumulativeDate();
        this.getRevenueComponentDataInRtapp();
        this.getCapitalComponentDataInRtapp();
        this.getCapitalContiengencyDataInRtapp();
        this.getRtappGrndTotal();
        this.spinner = false;
    }


    //   ===============================
    downloadRtappPartAReport_Pdf($fileName = ''){



        this.data['fileName'] = $fileName;

        this.data['templateName'] = 'pps-reports/rtapp/rtappPartAReport';
        this.data['tappGetRespon'] = JSON.stringify(this.tappGetRespon);
        this.data['estimatedCosts'] = JSON.stringify(this.estimatedCosts);
        this.data['originalCommencementDate'] = JSON.stringify(this.originalCommencementDate);
        this.data['originalCompletionDate'] = JSON.stringify(this.originalCompletionDate);
        this.data['dateList'] = JSON.stringify(this.dateList);

        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);

        this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);
        this.data['estimatiedCostTotal'] = JSON.stringify(this.estimatiedCostTotal);
        this.data['mainFeaturesOfRevision'] = JSON.stringify(this.mainFeaturesOfRevision);

        // 10 no table
        // this.getRdppGrandTotalByMasterId();
        this.data['currRevenueItemLst'] = JSON.stringify(this.currRevenueItemLst);
        this.data['currRevenueGTObj'] = JSON.stringify(this.currRevenueGTObj);
        this.data['refRevenueItemLst'] = JSON.stringify(this.refRevenueItemLst);
        this.data['refRevenueItemGTObj'] = JSON.stringify(this.refRevenueItemGTObj);
        this.data['refRevenueGTObj'] = JSON.stringify(this.refRevenueGTObj);
        this.data['currCapitalItems'] = JSON.stringify(this.currCapitalItems);
        this.data['refCapitalItemLst'] = JSON.stringify(this.refCapitalItemLst );
        this.data['refCapitalItemGTObj'] = JSON.stringify(this.refCapitalItemGTObj);
        this.data['refCapitalGTObj'] = JSON.stringify(this.refCapitalGTObj);
        this.data['currCapitalItemGTObj'] = JSON.stringify(this.currCapitalItemGTObj);
        this.data['refPhysicalContingencyGTObj'] = JSON.stringify(this.refPhysicalContingencyGTObj);
        this.data['currPhysicalContingencyGTObj'] = JSON.stringify(this.currPhysicalContingencyGTObj);
        this.data['refPriceContingencyGTObj'] = JSON.stringify(this.refPriceContingencyGTObj);
        this.data['refPriceContingencyGTObj'] = JSON.stringify(this.refPriceContingencyGTObj);
        this.data['currPriceContingencyGTObj'] = JSON.stringify(this.currPriceContingencyGTObj);
        this.data['refGrandTotalObj'] = JSON.stringify(this.refGrandTotalObj);
        this.data['currGrandTotalObj'] = JSON.stringify(this.currGrandTotalObj);
        this.data['currCapitalGTObj'] = JSON.stringify(this.currCapitalGTObj);
        this.data['currRevenueItemGTObj'] = JSON.stringify(this.currRevenueItemGTObj );

        // 11 table
        this.data['cumulativeDate'] = JSON.stringify(this.cumulativeDate );
        this.data['revenueItemList'] = JSON.stringify(this.revenueItemList );
        this.data['revenueSubTotal'] = JSON.stringify(this.revenueSubTotal  );
        this.data['capitalItemList'] = JSON.stringify(this.capitalItemList  );
        this.data['contingencyItemList'] = JSON.stringify(this.contingencyItemList  );
        this.data['capitalSubTotal'] = JSON.stringify(this.capitalSubTotal  );
        this.data['grandTotal'] = JSON.stringify(this.grandTotal  );




        this.data['fiscalYearLists'] = JSON.stringify(this.fiscalYearLists  );
        this.data['fiscalYearWiseRevenueCostList'] = JSON.stringify(this.fiscalYearWiseRevenueCostList  );
        this.data['fiscalYearWiseCapitalCostList'] = JSON.stringify(this.fiscalYearWiseCapitalCostList  );
        this.data['fiscalYearWiseContingencyCostList'] = JSON.stringify(this.fiscalYearWiseContingencyCostList  );
        this.data['fiscalYearWiseGrandTotalList'] = JSON.stringify(this.fiscalYearWiseGrandTotalList  );

         //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
      // =====Rtapp Part A End


    // ==================== RTAPP annexure ii
    downloadRtappAnnexureII_Pdf($fileName = '') {
        this.fiscalYearWiseQuarterData(this.tappWorkPlanList);
        this.data['fileName'] = $fileName;

        this.data['templateName'] = 'pps-reports/rtapp/rtappAnnexureIIReport';
        this.data['fiscalYearList'] = JSON.stringify(this.fiscalYearList);
        this.data['tappWorkPlanReportList'] = JSON.stringify(this.tappWorkPlanReportList);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    checkImplimentingWorkSchedule() {
        this.spinner = true;
        this.pmWorkPlanService.getWorkinngScheduleList(this.rtappMasterId).subscribe(
            (response) => {
                if(response.res == null || response.res == ""){
                    this.isImplementingWorkScheduleEmpty = true;
                }
                this.tappWorkPlanList = response.res;
                // this.fiscalYearWiseQuarterData(response.res);
                this.spinner = false;
            },
            err =>{
                console.log('checkAnnexerI', err);
            }
        )
    }

    fiscalYearWiseQuarterData(tappWorkPlanList){
        this.tappWorkPlanReportList = [...tappWorkPlanList];
        this.tappWorkPlanReportList.forEach(fyQuaData => {
            fyQuaData.fiscalYearList = [];
            this.fiscalYearList.forEach(fYear => {
                fyQuaData.fiscalYearList.push({
                    fYear: fYear,
                    Q1: fyQuaData.selectedQuarter.includes(fYear.fiscalYear+'-Q1,'),
                    Q2: fyQuaData.selectedQuarter.includes(fYear.fiscalYear+'-Q2,'),
                    Q3: fyQuaData.selectedQuarter.includes(fYear.fiscalYear+'-Q3,'),
                    Q4: fyQuaData.selectedQuarter.includes(fYear.fiscalYear+'-Q4,')
                })
            })
        })
    }

    selectQuarter(event, obj, selectStr){
        if (event.checked){
            obj.selectedQuarter = obj.selectedQuarter ? obj.selectedQuarter + selectStr : selectStr;
        }else{
            obj.selectedQuarter = obj.selectedQuarter.replace(selectStr,'');
        }
    }

    getWorkPlanByDppTappUuid( callBack) {
        this.pmWorkPlanService.getWorkinngScheduleList(this.rtappMasterId).subscribe(
            res => {
                this.pmWorkPlanServiceDataList = res;
                if (res.status && res.res) {
                    this.pmWorkPlanList = res.res;
                    callBack(true);
                }else {
                    this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                    this.isLoading = false;
                    callBack(true);
                }
            },
            err => {
                console.log('Get Pd List By DppTappMasterUuid err', err);
            }
        )
    }

    getComplemenceAndCompoetionDate(callBack){
        this.rtappObjectiveCostService.getRTappObjectiveCostByPcUuid(this.uuid, this.rtappMasterId).subscribe(res =>{
            this.rtappObjectiveCostServiceDataList = res;
            this.dateCommencement = res.dateCommencement;
            this.dateCompletion = res.dateCompletion;
            this.getFiscalYearList((res=>{
                callBack(res);
            }));
        })
    }

    getFiscalYearList( callBack) {
        this.fiscalYearList = [];
        const a = new Date(this.dateCommencement);
        const b = new Date(this.dateCompletion);

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

            setTimeout(()=>{

                this.pmWorkPlanList.forEach((pm,indexPm)=>{
                    this.fiscalYearList.forEach((item, index) => {
                        let classList =[];
                        let calssNameOne = this.cleckTest(index, 0, pm);
                        let calssNameTwo = this.cleckTest(index, 1, pm);
                        let calssNameThree = this.cleckTest(index, 2, pm);
                        let calssNameFour = this.cleckTest(index, 3, pm);
                        classList.push({
                            calssNameOne : calssNameOne,
                            calssNameTwo : calssNameTwo,
                            calssNameThree : calssNameThree,
                            calssNameFour: calssNameFour
                        });
                        item.classList = classList;
                    });
                })
                callBack(true) ;
            },70/100);
        });
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

    /** End Annexure- II */
    /** End RTAPP Report */
    /** End Report function */

    /** RDPP Start Revised Project Summary */
    async getReportPartA() {
        this.spinner = true;
        this.getObjectiveCost((res) => {
            this.spinner = false;
            if (res) {
                this.downloadRdppObjectiveCost('Part-A-(Project-Summary)', 'rdpp/revisedProjectSummary')
                this.spinner = false;
            }
        })
    }

    downloadRdppObjectiveCost($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['rdppObjectCost'] = JSON.stringify(this.rdppObjectCost);
        this.data['currentUpazilas'] = JSON.stringify(this.currentUpazilas);
        this.data['originalUpazilas'] = JSON.stringify(this.originalUpazilas);
        this.data['estimatedCostCal'] = JSON.stringify(this.estimatedCostCal);
        // 5.2 Mode of Financing with Source start
        this.data['mofList'] = JSON.stringify(this.mofList);
        this.data['estimatedCosts '] = JSON.stringify(this.estimatedCosts );
        this.data['estimatiedCostTotal  '] = JSON.stringify(this.estimatiedCostTotal  );
        // 5.2 Mode of Financing with Source end
        /** Table no 8 -->>Start */
        this.data['currRevenueItems'] = JSON.stringify(this.currRevenueItems);
        this.data['refRevenueItems'] = JSON.stringify(this.refRevenueItems);
        this.data['refRevenueItemGTObj'] = JSON.stringify(this.refRevenueItemGTObj);
        this.data['refRevenueGTObj'] = JSON.stringify(this.refRevenueGTObj);
        this.data['currRevenueGTObj'] = JSON.stringify(this.currRevenueGTObj);
        this.data['currRevenueItemGTObj'] = JSON.stringify(this.currRevenueItemGTObj);
        this.data['currCapitalItems'] = JSON.stringify(this.currCapitalItems);
        this.data['refCapitalItems'] = JSON.stringify(this.refCapitalItems);
        this.data['refCapitalItemGTObj'] = JSON.stringify(this.refCapitalItemGTObj);
        this.data['refCapitalGTObj'] = JSON.stringify(this.refCapitalGTObj);
        this.data['currCapitalItemGTObj'] = JSON.stringify(this.currCapitalItemGTObj);
        this.data['currCapitalGTObj'] = JSON.stringify(this.currCapitalGTObj);
        this.data['refPhysicalContingencyGTObj'] = JSON.stringify(this.refPhysicalContingencyGTObj);
        this.data['currPhysicalContingencyGTObj'] = JSON.stringify(this.currPhysicalContingencyGTObj);
        this.data['refPriceContingencyGTObj'] = JSON.stringify(this.refPriceContingencyGTObj);
        this.data['currPriceContingencyGTObj'] = JSON.stringify(this.currPriceContingencyGTObj);
        this.data['refGrandTotalObj'] = JSON.stringify(this.refGrandTotalObj);
        this.data['currGrandTotalObj'] = JSON.stringify(this.currGrandTotalObj);
        this.data['currGrandTotalObj'] = JSON.stringify(this.currGrandTotalObj);
        /** Table no 8 -->>End */
        /** Table no 9 -->>Start */
        this.data['fiscalYList'] = JSON.stringify(this.fiscalYearList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['phyContingencySubTotal'] = JSON.stringify(this.phyContingencySubTotal);
        this.data['priceContingencySubTotal'] = JSON.stringify(this.priceContingencySubTotal);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['grandList'] = JSON.stringify(this.grandList);
        this.data['revItemCumulative'] = JSON.stringify(this.revItemCumulative);
        this.data['capItemCumulative'] = JSON.stringify(this.capItemCumulative);
        this.data['capItemYearWIse'] = JSON.stringify(this.capItemYearWIse);
        this.data['revItemYearWIse'] = JSON.stringify(this.revItemYearWIse);
        this.data['contingencyItemYearWIse'] = JSON.stringify(this.contingencyItemYearWIse);
        this.data['estimatedCosts'] = JSON.stringify(this.estimatedCosts);
        /** Table no 9 -->>End */

        // 10 no table
        this.data['financialAnalysisServiceData'] = JSON.stringify(this.financialAnalysisServiceData);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    /** Object and Cost */

    private getYearWiseEstimatiedCost() {
        if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
            this.rdppObjectiveCostService.getYearWiseEstimatedCosts(this.uuid).subscribe(
                res =>{
                    this.estimatiedCostTotal = res;
                },error => {
                    console.log("Error");
                }
            );
        }
    }

    private getEstimatedCosts(conceptUuid: string) {
        this.rdppObjectiveCostService.getEstimatedCosts(conceptUuid).subscribe(
            res => {
                this.estimatedCosts = res;

                let arrSize: number = this.estimatedCosts.length;

                let differenceEstimatedCostInTaka: EstimatedCostModel = new EstimatedCostModel();
                let differenceEstimatedPercentage: EstimatedCostModel = new EstimatedCostModel();

                let keys: string[] = ['paAmount', 'otherFeAmount', 'otherAmount', 'ownFundFeAmount', 'ownFundAmount',
                    'thruDpAmount', 'thruPdAmount', 'spAcAmount', 'gobThruAmount', 'gobFeAmount',
                    'gobAmount', 'totalAmount'];

                keys.map(key => {
                    differenceEstimatedCostInTaka[key] = Math.abs(this.estimatedCosts[arrSize - 1][key] - this.estimatedCosts[arrSize - 2][key]).toFixed(2);
                    differenceEstimatedPercentage[key] = (((differenceEstimatedCostInTaka [key] /
                        this.estimatedCosts[0][key]) * 100).toFixed(2));

                    differenceEstimatedPercentage[key] = differenceEstimatedPercentage[key] === 'NaN' ||
                    differenceEstimatedPercentage[key] === 'Infinity' ? '0.00' : differenceEstimatedPercentage[key];
                })
                differenceEstimatedCostInTaka.revisedVersion = "Difference (" +
                    this.estimatedCosts[arrSize - 1].revisedVersion + " - "
                    + this.estimatedCosts[arrSize - 2].revisedVersion + ")";

                this.estimatedCosts.push(differenceEstimatedCostInTaka, differenceEstimatedPercentage);
            },
            err => {
                this.estimatedCosts = [];
            }
        )
    }

    getObjectiveCost(callBack) {
        this._rdppReportService.getObjectiveCost(this.uuid).subscribe(res => {
                this.rdppObjectCost = res;

                this.arrangeData(res.rdppLocation);
                this.dppArrangeData(res.dppLocation);
                this.arrangeEstimatedCost(res.estimatedCost);
                this.getRdppGrandTotalByMasterId(res.economicCodeWise);
                this.getGrandTotal(res.partAItemWIseCumulative);
                this.getRevCapItemTotal(res.partAItemWIseCumulative);
                callBack(true);
            }, error => {
                console.log("Error");
                this.spinner = false;
            }
        )
    }

    private arrangeEstimatedCost(cost) {
        let currentCost = cost[cost.length-2];
        let proposedCost = cost[cost.length-1];
        let difTotal = proposedCost.totalAmount - currentCost.totalAmount;
        this.estimatedCostCal.percentageTotal = this.estimatedDivided(difTotal, difTotal)
        let difGob = proposedCost.gobAmount - currentCost.gobAmount;
        this.estimatedCostCal.percentageGob = this.estimatedDivided(difTotal, difGob)
        let difOwn = proposedCost.ownFundAmount - currentCost.ownFundAmount;
        this.estimatedCostCal.percentageOwnFund = this.estimatedDivided(difTotal, difOwn)
        let difOther = proposedCost.otherAmount - currentCost.otherAmount;
        this.estimatedCostCal.percentageOther = this.estimatedDivided(difTotal, difOther)
        let difPa = proposedCost.paAmount - currentCost.paAmount;
        this.estimatedCostCal.percentagePA = this.estimatedDivided(difTotal, difPa)

        this.estimatedCostCal.totalOfTotal = cost.map(f => f.totalAmount).reduce((total, amount) => total + amount, 0);
        this.estimatedCostCal.gobTotal = cost.map(f => f.gobAmount).reduce((total, amount) => total + amount, 0);
        this.estimatedCostCal.ownFundTotal = cost.map(f => f.ownFundAmount).reduce((total, amount) => total + amount, 0);
        this.estimatedCostCal.otherAmountTotal = cost.map(f => f.otherAmount).reduce((total, amount) => total + amount, 0);
        this.estimatedCostCal.paTotal = cost.map(f => f.paAmount).reduce((total, amount) => total + amount, 0);
        this.spinner = false;
    }

    private estimatedDivided (difTotal, difAmount): number {
        return (difAmount > 0) ? ((difAmount / difTotal) * 100) : 0;
    }

    private dppArrangeData(res) {
        this.originalUpazilas = [];
        let di = 0;
        res.divisions.forEach(d => {
            let zi = 0;
            let upazilaUnderDivision = d.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0)
            d.zillaList.forEach(z => {
                let ui = 0;
                z.upaZillaList.forEach(u => {
                    const serial = ((!this.projectSummary?.isForeignAid && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(di +1) : di +1);
                    const lwc: IDppLocationWiseCostBreakdown = this.locationWiseCost.find(f => f.upazilaId === u.id);
                    this.originalUpazilas.push(
                        {
                            location: {
                                uuid: lwc ? lwc.uuid : null,
                                id: lwc ? lwc.id : null,
                                dppMasterId: this.rdppMasterId,
                                rdppMasterId: res.dppMasterId,
                                divisionId: u.zilla.division.id,
                                zillaId: u.zilla.id,
                                upazilaId: u.id,
                                projectConceptMasterId: this.conceptId,
                                projectConceptMasterUuid: this.uuid,
                                comment: lwc ? lwc.comment : '',
                                estimatedCost: lwc ? lwc.estimatedCost : 0,
                                quantity: lwc ? lwc.quantity : null,
                            },
                            sl: serial,
                            dSpan: ((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
                            zSpan: ((ui === 0) ? (d.zillaList[zi].upaZillaList.length) : 0),
                            upazila: u
                        }
                    );
                    ui += 1;
                    this.saveDisable = this.originalUpazilas.some(m => m.location.estimatedCost <= 0) && this.originalUpazilas.some(m => m.location.quantity);
                });
                zi += 1;
            });
            di += 1;
        });
    }

    /** For 8 no table-->Start*/
    private getRdppGrandTotalByMasterId(res) {
        this.spinner = true;
            this.arrangeCurrentGrandTotalList(res.currentGrandTotal);
            this.arrangeReferenceGrandTotalList(res.referenceGrandTotal);

            if (res && res.referenceItemWiseRevenue && res.referenceItemWiseRevenue.dppAnnualPhasingCostTabDetails.length>0) {
                this.refRevenueItems = res.referenceItemWiseRevenue.dppAnnualPhasingCostTabDetails;
                this.refRevenueItemGTObj = res.referenceItemWiseRevenue.dppAnnualPhasingCostTotal;
            }
            if (res && res.currentItemWiseRevenue && res.currentItemWiseRevenue.dppAnnualPhasingCostTabDetails.length > 0) {
                this.currRevenueItems = res.currentItemWiseRevenue.dppAnnualPhasingCostTabDetails
                this.currRevenueItemGTObj = res.currentItemWiseRevenue.dppAnnualPhasingCostTotal;
            }

            if (res && res.referenceItemWiseCapital && res.referenceItemWiseCapital.dppAnnualPhasingCostTabDetails.length > 0) {
                this.refCapitalItems = res.referenceItemWiseCapital.dppAnnualPhasingCostTabDetails
                this.refCapitalItemGTObj = res.referenceItemWiseCapital.dppAnnualPhasingCostTotal;
            }
            if (res && res.currentItemWiseCapital && res.currentItemWiseCapital.dppAnnualPhasingCostTabDetails.length>0) {
                this.currCapitalItems = res.currentItemWiseCapital.dppAnnualPhasingCostTabDetails;
                this.currCapitalItemGTObj = res.currentItemWiseCapital.dppAnnualPhasingCostTotal;
            }
            this.calculateYearWiseGrandTotal();
            this.spinner = false;
    }

    arrangeCurrentGrandTotalList(currentGrandTotal){
        if (currentGrandTotal.length > 1) {
            this.currFiscalYearList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
            this.currRevenueList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
            this.currCapitalList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
            this.currContingencyList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0 ?
                currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
            this.currGrandTotalList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];

            let length = this.currContingencyList.length;
            if (length > 0) {
                this.currContingencyList.forEach((e, i) => {
                    if (i < (length / 2)) {
                        this.currPhysicalContingencyList.push(e);
                    } else {
                        this.currPriceContingencyList.push(e);
                    }
                });
            }
        }
    }

    arrangeReferenceGrandTotalList(referenceGrandTotal){
        if (referenceGrandTotal.length > 1) {
            this.refFiscalYearList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
            this.refRevenueList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
            this.refCapitalList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
            this.refContingencyList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0 ?
                referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
            this.refGrandTotalList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];

            let length = this.refContingencyList.length;
            if (length > 0) {
                this.refContingencyList.forEach((e, i) => {
                    if (i < (length / 2)) {
                        this.refPhysicalContingencyList.push(e);
                    } else {
                        this.refPriceContingencyList.push(e);
                    }
                });
            }
        }
    }

    calculateYearWiseGrandTotal() {
        this.currFiscalYearList?.forEach((data, index) => {
            this.arrangeGrandTotalData(this.currRevenueGTObj, this.currRevenueList, index);
            this.arrangeGrandTotalData(this.currCapitalGTObj, this.currCapitalList, index);
            this.arrangeGrandTotalData(this.currPriceContingencyGTObj, this.currPriceContingencyList, index);
            this.arrangeGrandTotalData(this.currPhysicalContingencyGTObj, this.currPhysicalContingencyList, index);
            this.arrangeGrandTotalData(this.currGrandTotalObj, this.currGrandTotalList, index);

        })

        this.refFiscalYearList?.forEach((data, index) => {

            this.arrangeGrandTotalData(this.refRevenueGTObj, this.refRevenueList, index);
            this.arrangeGrandTotalData(this.refCapitalGTObj, this.refCapitalList, index);
            this.arrangeGrandTotalData(this.refPriceContingencyGTObj, this.refPriceContingencyList, index);
            this.arrangeGrandTotalData(this.refPhysicalContingencyGTObj, this.refPhysicalContingencyList, index);
            this.arrangeGrandTotalData(this.refGrandTotalObj, this.refGrandTotalList, index);

        });
        this.spinner = false;
    }

    arrangeGrandTotalData(dataObj: any, fromList: any, index: number){
        if(fromList.length>0){
            dataObj.fiscalYear += fromList[index]?.dppAnnualPhasingCostTotal?.fiscalYear + ', ';
            dataObj.qty += fromList[index]?.dppAnnualPhasingCostTotal?.qty;
            dataObj.totalAmount += fromList[index]?.dppAnnualPhasingCostTotal?.totalAmount;
            dataObj.gobAmount += fromList[index]?.dppAnnualPhasingCostTotal?.gobAmount;
            dataObj.gobFeAmount += fromList[index]?.dppAnnualPhasingCostTotal?.gobFeAmount;
            dataObj.gobThruAmount += fromList[index]?.dppAnnualPhasingCostTotal?.gobThruAmount;
            dataObj.spAcAmount += fromList[index]?.dppAnnualPhasingCostTotal?.spAcAmount;
            dataObj.thruPdAmount += fromList[index]?.dppAnnualPhasingCostTotal?.thruPdAmount;
            dataObj.thruDpAmount += fromList[index]?.dppAnnualPhasingCostTotal?.thruDpAmount;
            dataObj.ownFundAmount += fromList[index]?.dppAnnualPhasingCostTotal?.ownFundAmount;
            dataObj.ownFundFeAmount += fromList[index]?.dppAnnualPhasingCostTotal?.ownFundFeAmount;
            dataObj.otherAmount += fromList[index]?.dppAnnualPhasingCostTotal?.otherAmount;
            dataObj.otherFeAmount += fromList[index]?.dppAnnualPhasingCostTotal?.otherFeAmount;
        }
    }
    /** For 8 no table-->End*/

    /** For 9 no table-->Start*/
    private getRevCapItemTotal(rev) {
        this.spinner = true;
        if (rev.revItemWiseCum != null) {
            if( rev.revItemWiseCum.dppAnnualPhasingCostTabDetails.length > 0) {
                let item : DppAnnualPhasingCostTabDetailsWithName [] = [];
                rev.revItemWiseCum.dppAnnualPhasingCostTabDetails.forEach(f => {
                    item.push(f);
                })
                this.revItemCumulative = item;
                this.revItemYearWIse = rev.revItemWiseCum.fiscalYearWiseCost.filter(f => f.values.length > 0)?.map(m => m.values);
            }else {
                this.revItemCumulative = [];
                this.revItemYearWIse = [];
            }
        }
        if (rev.capItemWiseCum != null) {
            if( rev.capItemWiseCum.dppAnnualPhasingCostTabDetails.length > 0) {
                let item : DppAnnualPhasingCostTabDetailsWithName [] = [];
                rev.capItemWiseCum.dppAnnualPhasingCostTabDetails.forEach(f => {
                    item.push(f);
                })
                this.capItemCumulative = item;
                this.capItemYearWIse = rev.capItemWiseCum.fiscalYearWiseCost.filter(f => f.values.length > 0)?.map(m => m.values);
            }else {
                this.capItemCumulative = [];
                this.capItemYearWIse = [];
            }
        }
        if (rev.contingency != null) {
            this.contingencyItemYearWIse = rev.contingency.fiscalYearWiseCost.filter(f => f.values.length > 0)?.map(m => m.values);
        }else {
            this.contingencyItemYearWIse = [];
        }
        this.spinner = false;
    }

    private getGrandTotal(res) {
        this.spinner = true;
        if (res.grandTotal[0].grandTotal.length > 0) {
            this.fiscalYearList = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
            this.grantTotal = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.dppAnnualPhasingCostTotal[0];
            this.revenueTotal = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.dppAnnualPhasingCostTotal[0];
            this.capitalTotal = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.dppAnnualPhasingCostTotal[0];
            this.phyContingencySubTotal = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal[0];
            this.priceContingencySubTotal = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal[1];
            this.revenueList = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ? res.grandTotal.filter
            (f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
            this.capitalList = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ? res.grandTotal.filter
            (f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.grandTotal : [];
            this.grandList = res.grandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total).length > 0 ? res.grandTotal.filter
            (f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
            this.grantTotal.totalAmount = (this.revenueTotal ? this.revenueTotal.totalAmount : 0) +
                (this.capitalTotal ? this.capitalTotal.totalAmount : 0) +
                (this.phyContingencySubTotal ? this.phyContingencySubTotal.totalAmount : 0) +
                (this.priceContingencySubTotal ? this.priceContingencySubTotal.totalAmount : 0);
            this.spinner = false;
        } else {
            this.emptyArray();
            this.spinner = false;
        }
    }

    emptyArray() {
        this.fiscalYearList = [];
        this.revenueTotal = null;
        this.capitalTotal = null;
        this.grantTotal = null;
        this.revenueList = [];
        this.capitalList = [];
        this.grandList = [];
    }
    /** For 9 no table-->End*/

    /** End */

    // 10 no table

    //   ====
    getFinancialAnalysis() {
        this.financialAnalysisService.getFinancialAnalysis(this.uuid).subscribe((response) => {
            this.financialAnalysisServiceData = response;
        }, error => {
            console.log(error);
        })
    }

    forwardToEcnecOfficer(){
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ECNEC_OFFICERS;
        this.deskUserMovement('Ecnec_Head');
    }

    forwardToEcnecDeskOfficer(){
        if (this.rdppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.rdppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.rtappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ECNEC_DESK;
        this.deskUserMovement('Ecnec_Officer');
    }

    /**
     * Check the assign meeting is done or not.
     **/
    isAssignEcnecMeetingDone(): any {
        this.assignMeetingService.findByPcUuid(this.objectiveAndCostUuid).subscribe( res => {
            if(res == null) {
                this.isEcnecMeetingAssignDone = false;
            } else {
                this.isEcnecMeetingAssignDone = true;
            }
        });
    }

    applyFilterProjectMovement(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceMovementStageAttachment.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceMovementStageAttachment.paginator) {
            this.dataSourceMovementStageAttachment.paginator.firstPage();
        }
    }
    onChangePageProjectMovement(event: PageEvent) {
        this.sizeProjectMovement = +event.pageSize; // get the pageSize
        this.pageProjectMovement = +event.pageIndex; // get the current page
        this.getProjectMovementAttachmentByDppUuid(this.currentMovementStage.id);
    }

    public sendProjectData(){
        this.projectRequestModel.pcUuid = this.projectSummary.uuid;
        this.projectRequestModel.projectType = this.projectSummary.projectTypeDTO.nameEn;
        this.projectRequestModel.access_token = sessionStorage.getItem('access_token');
        this.projectRequestModel.doptor_token = sessionStorage.getItem('doptor_token');

        this.dashboardService.sendProjectData(this.projectRequestModel).subscribe(
            res => {
                if (this.projectSummary.projectTypeDTO.nameEn == 'DPP') {
                    window.open(environment.ibcs.gisUrl+'projectInfo/'+this.rdppMasterId, '_blank');
                } else if (this.projectSummary.projectTypeDTO.nameEn == 'TAPP') {
                    window.open(environment.ibcs.gisUrl+'projectInfo/'+this.rtappMasterId, '_blank');
                }
            }, error => {
                console.log(error);
            }
        );;
    }

    getAllProjectMovementAttachment(projectMovementId) {
        this.projectMovementService.getAllProjectMovementAttachment(projectMovementId).subscribe(
            res => {
                if(res){
                    this.attachmentList = res;
                    this.isPscNotice = this.attachmentList.find(obj => (obj.projectMovementStage.currentStage == 'PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE' && !obj.paperType))? true: false;
                    this.isPscWorkingPaper = this.attachmentList.find(obj => obj.paperType == 'PSC Meeting Working Paper')? true: false;
                }
            },
            err =>{
                console.log('getAllProjectMovementAttachment : ', err);
            }
        );
    }

    findMeetingIndex(attachmentName){
        return this.attachmentList.findIndex(obj => (obj.projectMovementStage.currentStage == attachmentName && !obj.paperType));
    }

    findPaperIndex(paperName){
        return this.attachmentList.findIndex(obj => obj.paperType == paperName);
    }

    downloadMeetingPaper(attachmentName, isMeetingType) {
        let attachmentObj;
        if(isMeetingType){
            attachmentObj = this.attachmentList.find(obj => obj.projectMovementStage.currentStage == attachmentName && !obj.paperType);
        }else{
            attachmentObj = this.attachmentList.find(obj => obj.paperType == attachmentName);
        }
        if(attachmentObj){
            this.fileUploadService.downloadAttachmentInDppService(attachmentObj.attachment.urlPath);
        }else{
            this.snackbarHelper.openWarnSnackBarWithMessage('Please Add Attachment First !!', 'OK');
        }
    }

    closeDialog() {
        this.dialog.closeAll();
    }


    // User Status wise login AGENCY-DESK AGENCY-HEAD
    showHideCommitInformation(){
        if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'ECNEC') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() ==='DPP')  {
            this.isPEC = true;
        }
        if ((this.userGroup.groupStatus === 'MINISTRY-HEAD' ||this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'ECNEC') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() ==='DPP') {
            this.isDPEC = true;
        }
        if ((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-MINISTER') &&  this.projectSummary.projectTypeDTO.nameEn.toUpperCase() ==='TAPP') {
            this.isSPEC = true;
        }
        if ((this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'AGENCY-HEAD' || this.userGroup.groupStatus === 'AGENCY-DESK' || this.userGroup.groupStatus === 'MINISTRY-DESK') && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() ==='TAPP') {
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

    private convertRevisedVersion(version: string): string{
        let bnVersion = '';
        switch(version) {
            case 'Original':
                bnVersion ='মূল';
                break;
            case '1st Revised':
                bnVersion ='১ম সংশোধিত';
                break;
            case '2nd Revised':
                bnVersion ='২য় সংশোধিত';
                break;
            case '3rd Revised':
                bnVersion ='৩য় সংশোধিত';
                break;
            case '4th Revised':
                bnVersion = '৪র্থ  সংশোধিত';
                break;
            case '5th Revised':
                bnVersion = '৫ম সংশোধিত';
                break;
            case '6th Revised':
                bnVersion = '৬ষ্ঠ সংশোধিত';
                break;
            case '7th Revised':
                bnVersion = '৭ম সংশোধিত';
                break;
            case '8th Revised':
                bnVersion = '৮ম সংশোধিত';
                break;
            case '9th Revised':
                bnVersion = '৯ম সংশোধিত';
                break;
            case '10th Revised':
                bnVersion = '১০ম সংশোধিত';
                break;
            default:
                bnVersion = version;
                break;
        }
        return bnVersion;
    }

}
