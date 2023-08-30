import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

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
import {DashboardAttachmentService} from "../../../../../project-concept-management/services/dashboard-attachment.service";
import {EnothiDakSubmissionService} from "../../../../../../core/services/enothi-dak-submission.service";
import {DatePipe} from "@angular/common";
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../../core/constants/message";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {CommentObservationComponent} from "../../../../../project-concept-management/features/project-concepts/comment-observation/comment-observation.component";
import {ReportDataService} from 'app/main/shared/services/report-data.service';
import {ReportCommonService} from 'app/main/core/services/report-common.service';
import {DppObjectiveCostService} from "../../../../services/dpp-objective-cost.service";
import {TranslateService} from "@ngx-translate/core";
import {DppAnnualPhasingCostService} from "../../../../services/dpp-annual-phasing-cost.service";
import {DppAnnualPhasingConstant} from "../../../../constants/dpp-annual-phasing.constant";
import {TappAnnualPhasingCostService} from "../../../../services/tapp-annual-phasing-cost.service";
import {SendToDakComponent} from 'app/main/shared/components/send-to-dak/send-to-dak.component';
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {MatSelectChange} from "@angular/material/select";
import {DateBengaliPipe} from '../../../../../../shared/pipes/date-bengali-pipe';
import {DATE_BENGALI_FORMAT, DATE_ENG_FORMAT} from '../../../../../../shared/constant/formatter.constant';
import {FileUploadService} from "../../../../../../core/services/file-upload.service";
import {NumberPipe} from "../../../../../../shared/pipes/number-pipe.pipe";
import {ProjectMovementStageConstant} from "../../../../constants/project-movement-stage-constant";
import {
    ProjectMovementService as StageMovementService,
    ProjectMovementService
} from "../../../../services/project-movement.service";
import {ProjectMovementStageModel} from "../../../../models/project.movement.model";
import {UserGroupService} from 'app/main/modules/configuration-management/services/user-group.service';
import {DeskUserMovementComponent} from "../../../../../../shared/components/desk-user-movement/desk-user-movement.component";
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
import {IAgency} from "../../../../../configuration-management/models/agency";
import {AgencyService} from "../../../../../configuration-management/services/agency.service";
import {ClassyLayoutComponent} from "../../../../../../../layout/layouts/vertical/classy/classy.component";
import {NgxBootstrapConfirmService} from "ngx-bootstrap-confirm";
import {ModeOfFinanceModel} from "../../../../../feasibility-study-management/models/mode-of-finance.model";
import {map, switchMap} from "rxjs/operators";
import {IDppAnnualPhasingCostWithChildDetailsResponse} from "../../../../models/dpp-annual-phasing-cost-with-child-respone";
import {IFiscalYearRequest} from "../../../../models/fiscal-year-request";
import {IDppPhasingCostTotal} from "../../../../models/dpp-phasing-cost-total";
import {values} from "lodash-es";
import {FinancialAnalysisService} from "../../project-details/services/financial-analysis.service";
import {DppLocationWiseCostBreakdownService} from "../../../../services/dpp-location-wise-cost-breakdown.service";
import {ProjectConceptEditDashboardComponent} from "../../../../../project-concept-management/features/project-concepts/project-concept-edit-dashboard/project-concept-edit-dashboard.component";
import {DppProjectManagementSetupService} from "../../../../services/dpp-project-management-setup.service";
import {DppAnnexureServices} from "../../../../services/dpp-annexure-services.service";
import {DppAnnexureGoods} from "../../../../services/dpp-annexure-goods.service";
import {DppAnnexureGoodsIiiAService} from "../../../../services/dpp-annexure-goods_iii_a.service";
import {ProjectDetailsPartbService} from "../../project-details/services/project-details-partb.service";
import { UserProfileService } from 'app/main/modules/auth/services/user.profile.service';


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
    theme: ApexTheme;
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: 'app-dpp-tapp-view-dashboard',
    templateUrl: './dpp-tapp-view-dashboard.component.html',
    styleUrls: ['./dpp-tapp-view-dashboard.component.scss']
})
export class DppTappViewDashboardComponent implements OnInit {

    // chart design
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callDownloadGODialog') callDownloadGODialog: TemplateRef<any>;
    @ViewChild('callDownloadRelatedInfoDialog') callDownloadRelatedInfoDialog: TemplateRef<any>;
    @ViewChild('callAttachmentDialogForMeeting') callAttachmentDialogForMeeting: TemplateRef<any>;

    procurementMethodList: ProcurementMethodModel[] = new Array<ProcurementMethodModel>();
    size: number = 2;
    page: number = DEFAULT_PAGE;
    total: number;
    totalAmountAnnexure5B: number;
    projectMovementModel: ProjectMovementStageModel = new ProjectMovementStageModel();

    dashboardAttachmentModels: DashboardAttachmentModel[] = new Array<DashboardAttachmentModel>();
    displayedColumns: string[] = ['id', 'name', 'progress', 'action'];
    dataSource = new MatTableDataSource(this.dashboardAttachmentModels);
    projectSummary: IProjectConcept;
    chartOptions: Partial<ChartOptions>;
    observer: 'A' | 'MD' | 'PC' = 'A';
    frmGroup: FormGroup;
    file: File;
    title: any;
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

    isDownloadGO = false;

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
    agencyModel: IAgency;

    isLoading: boolean | false;

    movementStatusList = [];
    projectStatus: string;
    nothiStatus = 'Draft';

    potroJari: boolean = false;
    potroUrl = null;
    isNoteCompletetion:boolean=false;
    projectStage: string;

    downloadReportFormGroup: FormGroup;
    actionPermission = [];
    show = true;
    canEdit = true;
    objectivesAndCost: DppObjectiveCostModel | TappObjectiveCostModel;
    modelOfFinanceList = [];
    totalModeOfFinance: ModeOfFinanceModel = {} as ModeOfFinanceModel;
    isDppPartAConcernedDivisionIdEmpty: boolean = false;
    isDppObjectiveTargetsDataEmpty: boolean = false;
    isDppAnnexure5BDataEmpty: boolean = false;
    isDppPartBDataEmpty: boolean = false;
    isDppPartADataEmpty: boolean = false;
    isDppAnnexureIDataEmpty: boolean = false;
    isDppAnnexureIIDataEmpty: boolean = false;
    isDppAnnexureIIIDataEmpty: boolean = false;


    isTappDesignationContactPersonDataEmpty: boolean = false;
    isTappObjectiveTargetsDataEmpty: boolean = false;
    isTappResponsiblePreparation: boolean = false;
    isTappAnnexureIDataEmpty: boolean = false;
    isTappPartADataEmpty: boolean = false;

    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private sectorService: SectorService,
                private stageMovementService: StageMovementService,
                private subSectorService: SubSectorService,
                private sectorDivisionService: SectorDivisionService,
                private agencyService: AgencyService,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
                private route: Router,
                private dppObjectiveCostService: DppObjectiveCostService,
                private tappObjectiveCostService: TappObjectiveCostService,
                private activatedRoute: ActivatedRoute,
                private dashboardAttachmentService: DashboardAttachmentService,
                private formBuilder: FormBuilder,
                private _translateService: TranslateService,
                private enothiDakSubmissionService: EnothiDakSubmissionService,
                private datePipe: DatePipe,
                public numberPipe: NumberPipe,
                private _reportDataService: ReportDataService,
                private objectiveAndCostService: DppObjectiveCostService,
                private projectDetailsPartbService: ProjectDetailsPartbService,
                private dppLocationWiseCostBreakdownService : DppLocationWiseCostBreakdownService,
                private dppProjectManagementSetupService : DppProjectManagementSetupService,
                private dppAnnexureGoodsIiiAService : DppAnnexureGoodsIiiAService,
                private classyLayoutComponent: ClassyLayoutComponent,
                private _reportCommonService: ReportCommonService,
                private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
                private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
                private dateBengaliPipe: DateBengaliPipe,
                private fileUploadService: FileUploadService,
                private projectMovementService: ProjectMovementService,
                private userGroupService: UserGroupService,
                private feedbackMovementService: FeedbackMovementService,
                private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
                private userProfileService: UserProfileService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        // Get Value From Router
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['id'];
        });


        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
        });
        this.actionPermission = lngEnglishAction.data.ACTION;
        if (this.actionPermission == null)
            this.callActionSubject();
        else
            this.show = false;
        this.getUserGroup();
        this.initDownloadReportSelect();
        this.getProjectSummary();
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
            if (res && this.userGroupModel.ministryDivision) {
                this.getAgency();
            }
        });
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    initDownloadReportSelect() {
        this.downloadReportFormGroup = new FormGroup({
            committeeSelect: new FormControl(''),
            summarySelect: new FormControl(''),
            workingSelect: new FormControl(''),
            // selectAdministrative: new FormControl('')
        });
        // this.downloadReportFormGroup.patchValue({
        //     committeeSelect: '1',
        //     summarySelect: '1',
        //     workingSelect: '1',
        //     selectAdministrative: '1'
        // });
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
            this._translateService.use(res.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' ? 'en' : res.isForeignAid ? 'en' : 'bn');
            this.projectSummary = res;
            this.titleEn = res.titleEn;
            this.titleBn = res.titleBn;
            // this.commencementDate = this.getFormattedDate(res.expCommencementDate);
            // this.completionDate = this.getFormattedDate(res.expCompletionDate);
            this.commencementDate = this.datePipe.transform(res.expCommencementDate, 'dd/MM/yyyy');
            this.completionDate = this.datePipe.transform(res.expCompletionDate, 'dd/MM/yyyy');
            this.id = res.id;
            res.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? this.getDppObjectiveCostByPcUuid() : this.getTappObjectiveCostByPcUuid();
            this.getGrandTotal(res.id, res);
            this.getListDashboardAttachment();
            this.getSector(res);
            this.getSubSector(res);
            this.getSectorDivision(res);
           // this.getProjectStage(res);
            this.checkUserCanEdit();
            this.getUserGroupByUserId();
        });
    }

    getProjectStage(row) {
        if (row.projectTypeDTO.nameEn.toLowerCase() === 'dpp') {
            this.dppObjectiveCostService.getObjectiveCostByPcUuid(row.uuid).subscribe(res => {
                if (res) {
                    this.getDppCurrentStage(res.dppMasterId)
                }
            });
        } else if (row.projectTypeDTO.nameEn.toLowerCase() === 'tapp') {
            this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(row.uuid).subscribe(res => {
                if (res) {
                    this.getTappCurrentStage(res.tappMasterId)
                }
            });
        }
    }

    getDppCurrentStage(dppMasterId) {
        this.stageMovementService.getCurrentStage(dppMasterId, 'DPP').subscribe(async res => {
            if (res.res) {
                this.projectStage = res.res.currentStage ? (res.res.currentStage).toString().replace('_', ' ') : 'IN AGENCY';
            }
        });
    }

    getTappCurrentStage(tappMasterId) {
        this.stageMovementService.getCurrentStageInTapp(tappMasterId).subscribe(async res => {
            if (res.res) {
                this.projectStage = res.res.currentStage ? (res.res.currentStage).toString().replace('_', ' ') : 'IN AGENCY';
            }
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

    private getFormattedDate(date) {
        // return (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() === 'TAPP') ? this.datePipe.transform(date, DATE_ENG_FORMAT) :
        //     this.projectSummary.isForeignAid ? this.datePipe.transform(date, DATE_ENG_FORMAT) : this.dateBengaliPipe.transform(date.toString(), DATE_BENGALI_FORMAT);
        return (this._translateService.currentLang === 'en') ? this.datePipe.transform(date, DATE_ENG_FORMAT) : this.dateBengaliPipe.transform(date.toString(), DATE_BENGALI_FORMAT);
    }

    private getDppGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.totalAmountAnnexure5B = total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount;

                this.initChart(total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount);
            } else {
                this.initChart(projectConcept.gobAmount, projectConcept.paAmount, projectConcept.ownFundAmount, projectConcept.otherAmount);
                this.totalAmountAnnexure5B = projectConcept.gobAmount + projectConcept.paAmount + projectConcept.ownFundAmount + projectConcept.otherAmount;

            }
        });
    }

    private getTappGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                this.initChart(total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount);
            } else {
                this.initChart(projectConcept.gobAmount, projectConcept.paAmount, projectConcept.ownFundAmount, projectConcept.otherAmount);
            }
        });
    }

    private getGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? this.getDppGrandTotal(conceptId, projectConcept) : this.getTappGrandTotal(conceptId, projectConcept);
    }

    private getDppObjectiveCostByPcUuid() {
        this.objectiveAndCostService.getByProjectConceptUuid(this.uuid).subscribe(res => {
            console.log('getDppObjectiveCostByPcUuid');
            console.log(res);
            if (res.res == '') {
                this.isDppPartADataEmpty = true;
            }
            if (res.res != '') {
                this.objectiveAndCostUuid = res.res.uuid;
                this.objectivesAndCost = res;
                this.setProjectInfoTitleAndDate(res);
                this.loadMovementStatus();
                this.loadDppMasterId();
                this.getTotalModeData(res);
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

    private setProjectInfoTitleAndDate(res) {
        this.titleEn = res.projectTitleEn ? res.projectTitleEn : this.projectSummary.titleEn;
        this.titleBn = res.projectTitleBn ? res.projectTitleBn : this.projectSummary.titleBn;
        this.commencementDate = res.dateCommencement ? this.datePipe.transform(res.dateCommencement, DATE_ENG_FORMAT) : this.commencementDate;
        this.completionDate = res.dateCompletion ? this.datePipe.transform(res.dateCompletion, DATE_ENG_FORMAT) : this.completionDate;
        //         this.commencementDate = res.dateCommencement ? this.getFormattedDate(res.dateCommencement) : this.commencementDate;
        //         this.completionDate = res.dateCompletion ? this.getFormattedDate(res.dateCompletion) : this.completionDate;
    }

    private getTappObjectiveCostByPcUuid() {
        this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.uuid).subscribe(res => {
            console.log('getTappObjectiveCostByPcUuid');
            console.log(res);
            if(res == null) {
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

    // for const info chart
    private initChart(gobAmount: number, paAmount: number, ownFundAmount: number, otherAmount: number) {
        gobAmount = Number(gobAmount.toFixed(2));
        paAmount = Number(paAmount.toFixed(2));
        ownFundAmount = Number(ownFundAmount.toFixed(2));
        otherAmount = Number(otherAmount.toFixed(2));
        const totalCost = (this.projectSummary.isForeignAid)
            ? ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) :
            (!this.projectSummary.isForeignAid && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') ?
                ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) : this.convertToBanglaNumber((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2));
        console.log('---------------------------');
        console.log(gobAmount + paAmount + ownFundAmount + otherAmount);
        this.chartOptions = {
            series: this.projectSummary.isForeignAid ? [gobAmount, paAmount, ownFundAmount, otherAmount] : [gobAmount, ownFundAmount, otherAmount],
            chart: {
                width: 380,
                type: 'donut',
                dropShadow: {
                    enabled: true,
                    color: '#111',
                    top: -1,
                    left: 3,
                    blur: 3,
                    opacity: 0.2
                }
            },
            stroke: {
                width: 0
            },
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
            labels: this.projectSummary.isForeignAid ? ['GoB (' + gobAmount + ')', 'Project Aid (' + paAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
                (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' && this.projectSummary.isForeignAid == false) ? ['GoB (' + gobAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
                    ['জিওবি (' + this.convertToBanglaNumber(gobAmount) + ')', 'নিজস্ব অর্থ (' + this.convertToBanglaNumber(ownFundAmount) + ')', 'অন্যান্য (' + this.convertToBanglaNumber(otherAmount) + ')'],
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
            states: {
                hover: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            theme: {
                palette: 'palette2'
            },
            title: {
                text: ''
            },

            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
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
        if (uuid) {
            this.dashboardAttachmentService.updateDashboardAttachment(this.file, title, uuid, this.id, this.projectSummary.projectTypeDTO.nameEn).subscribe(res => {
                this.loadData();
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });

        } else {
            this.dashboardAttachmentService.createDashBoardAttachment(this.file, title, this.id, this.projectSummary.projectTypeDTO.nameEn).subscribe(res => {
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


    uploadFile(files: FileList) {
        this.file = files.item(0);
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

    showComments(commission: 'A' | 'MD' | 'PC') {
        let sourceId;
        let source;
        if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
            sourceId = this.objectivesAndCost.id;
            source = CommentSourceEnum.DPP
        } else {
            sourceId = this.objectivesAndCost.id;
            source = CommentSourceEnum.TAPP
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
            userGroup: this.userGroup.groupStatus
        };
        const dialogRef = this.dialog.open(CommentObservationComponent, dialogConfig);
        // dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
        //     if (res) {
        //     }
        //     dialogRef.close(true);
        // });
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

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        });
    }


    sendDppTappToNothi() {
        console.log('nothi'+this.objectiveAndCostUuid);
        const reportType = (this.projectSummary.isForeignAid)? 'en' : 'bn';
        const source = this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? 'dpp' : 'tapp';
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
            message: 'Forwarded to Ministry successfully',
            projectMovementStageModel: this.projectMovementModel
        };
        // dialogConfig.data = { userGroupType: userGroupType, dppTappMasterId: this.dppMasterId, currentStage: ProjectMovementStageConstant.MINISTRY_HEAD };
        const dialogRef = this.dialog.open(DeskUserMovementComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                if(userGroupType === 'Agency') {
                    this.projectStatus = 'AGENCY DESK OFFICER ASSIGNED';
                    this.projectStage = 'IN AGENCY';
                    this.isReturnToAgencyDesk = false;
                } else if(userGroupType === 'Ministry') {
                    this.isForwardToMinistryDesk = false;
                    this.projectStatus = 'MINISTRY DESK OFFICER ASSIGNED';
                    this.projectStage = 'IN MINISTRY';
                } else if(userGroupType === 'Planning_Commission') {
                    this.isForwardToPlanningDesk = false;
                    this.projectStatus = 'PLANNING DESK OFFICER ASSIGNED';
                    this.projectStage = 'IN PLANNING';
                }
            }
        });
    }

    loadDppMasterId() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.uuid).subscribe(res => {
            if (res) {
                this.dppMasterId = res.dppMasterId;
                if(this.dppMasterId != null){
                    this.getCurrentStage(this.dppMasterId, 'DPP');
                }
            }
        });
    }

    loadTppMasterId() {
        this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.uuid).subscribe(res => {
            if (res) {
                this.tappMasterId = res.tappMasterId;
                if(this.tappMasterId != null) {
                    this.getCurrentStage(this.tappMasterId, 'TAPP');
                }
            }
        });
    }

    forwardToMinistry() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Ministry successfully', 'OK');
                this.projectStatus = 'MINISTRY HEAD';
                this.projectStage = 'IN MINISTRY';
                this.isForwardToMinistryHead = false;
                this.showButtonSendToNothi = false;
            });
        });

    }

    forwardToMinistryDesk() {
        if(this.dppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.dppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.tappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_DESK;
        console.log(this.projectMovementModel);
        this.deskUserMovement('Ministry');
        // this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
        //     console.log(res);
        //     this.isForwardToMinistryDesk=false;
        //     this.snackbarHelper.openSuccessSnackBarWithMessage('Move Down to Desk successfully', 'OK')
        // });
    }

    toAgencyHead() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isReturnToAgencyHead = false;
                this.isForwardToPlanningHead = false;
                this.showButtonSendToNothi = false;
                this.projectStatus = 'AGENCY HEAD';
                this.projectStage = 'IN AGENCY';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Agency successfully', 'OK')
            });
        });
    }

    returnToAgencyDesk() {
        if(this.dppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.dppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.tappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_DESK;
        this.deskUserMovement('Agency');
    }

    returnToMinistry() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
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
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD;

            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
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
        if(this.dppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.dppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.tappMasterId;
        }
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_DESK;
        this.deskUserMovement('Planning_Commission');
    }

    forwardToPlanningMinister() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.showButtonSendToNothi = false;
                this.isReturnToMinistryHead = false;
                this.isForwardToPlanningMinister = false;
                this.isReturnToAgencyHead = false;
                this.isInpecMeetingNotice = false;
                this.isInpecMeetingHeld = false;
                this.projectStatus = 'PLANNING MINISTER';
                this.projectStage = 'IN PLANNING MINISTER';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Minister successfully', 'OK');
            });
        });
    }


    approvedByPlanningMinister() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.projectStatus = 'APPROVED';
                this.projectStage = 'APPROVED BY Minister';
                this.isInPlanningMinister = false;
                this.isForwardToEcnec = false;
                this.isInEcnec = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage('Approved By Minister successfully', 'OK');
            });
        });
    }

    forwardToEcnec() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.IN_ECNEC;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isInPlanningMinister = false;
                this.isForwardToEcnec = false;
                this.isInEcnec = false;
                this.projectStatus = 'Forwarded to ECNEC';
                this.projectStage = 'IN ECNEC';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to ECNEC successfully', 'OK');
            });
        });
    }

    approvedByEcnec() {
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.ECNEC_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isInEcnec = false;
                this.projectStatus = 'APPROVED';
                this.projectStage = 'APPROVED BY ECNEC';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Approved by ECNEC successfully', 'OK');
            });
        });
    }

    setUnderExamine(){
        this.openDialogProjectMovement( (res) => {
            if(this.dppMasterId != null) {
                this.projectMovementModel.rdppMasterId = this.dppMasterId;
            } else {
                this.projectMovementModel.rtappMasterId = this.tappMasterId;
            }
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.UNDER_EXAMINE;
            this.projectMovementModel.userId = this.userGroup.userId;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isInUnderExamine = false;
                this.projectStatus = 'UNDER EXAMINE';
                this.projectStage = 'IN PLANNING COMMISSION';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Under Examined successfully', 'OK');
            });
        });
    }



    setMeetingNotice(meetingType){
        console.log('setMinisterialMeetingNotice');
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
        if(this.dppMasterId != null) {
            this.projectMovementModel.rdppMasterId = this.dppMasterId;
        } else {
            this.projectMovementModel.rtappMasterId = this.tappMasterId;
        }
        this.projectMovementModel.userId = this.userGroup.userId;
        let meetingAttachmentTypeContent  = document.getElementById('meetingAttachmentType');
        let projectStatus;
        console.log(meetingAttachmentTypeContent.textContent);
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
            console.log(res);
            const projectMovementStage = res.res;
            this.fileUploadService.uploadApprovalProcessFlowAttachment(this.file,projectMovementStage).subscribe(res2=>{
                console.log(res2);
                this.snackbarHelper.openSuccessSnackBarWithMessage('Meeting Notified successfully', 'OK');
                this.isInProjectScrutinyCommitteeNotice = false;
                this.projectStatus = projectStatus;
                this.dialog.closeAll();
            },error=>{
                this.snackbarHelper.openErrorSnackBarWithMessage('Attachment is failed to save', 'OK');
            });
        })
    }


    getCurrentStage(masterId, projectType: string) {
        this.projectMovementService.getCurrentStage(masterId, projectType).subscribe( res => {
            this.projectStatus = res.res.currentStage ? (res.res.currentStage).toString().replace('_', ' ') : '';
            console.log('this.projectStatus');
            console.log(this.projectStatus);
            this.checkProjectStage(res.res.currentStage);
            if (this.userGroup) {
                this.checkCurrentStage(res);
            } else {
                this.waitToGetUserGroup((r) => {
                    this.checkCurrentStage(res);
                });
            }

        });
    }

    checkProjectStage(currentStage) {
        if(currentStage === ProjectMovementStageConstant.AGENCY_DESK || currentStage === ProjectMovementStageConstant.AGENCY_HEAD) {
            this.projectStage = 'IN AGENCY';
        } else if(currentStage === ProjectMovementStageConstant.MINISTRY_DESK || currentStage === ProjectMovementStageConstant.MINISTRY_HEAD) {
            this.projectStage = 'IN MINISTRY';
        } else if(currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            this.projectStage = 'IN PLANNING COMMISSION';
        } else if(currentStage === ProjectMovementStageConstant.PLANNING_MINISTER) {
            this.projectStage = 'IN PLANNING MINISTER';
        } else if(currentStage === ProjectMovementStageConstant.IN_ECNEC) {
            this.projectStage = 'IN ECNEC';
        } else if(currentStage === ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStage = 'APPROVED BY ECNEC';
        } else if(currentStage === ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStage = 'APPROVED BY PLANNING MINISTER';
        }
        else if(currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE){
            this.projectStage = 'IN MINISTRY';
        }
        else if(currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD){
            this.projectStage = 'IN MINISTRY';
        }
        else if(currentStage == ProjectMovementStageConstant.DPEC_MEETING_NOTICE){
            this.projectStage = 'IN MINISTRY';
        }
        else if(currentStage == ProjectMovementStageConstant.DPEC_MEETING_HELD){
            this.projectStage = 'IN MINISTRY';
        }
        else if(currentStage == ProjectMovementStageConstant.UNDER_EXAMINE){
            this.projectStage = 'IN PLANNING COMMISSION';
        }
        else if(currentStage == ProjectMovementStageConstant.PEC_MEETING_NOTICE){
            this.projectStage = 'IN PLANNING COMMISSION';
        }
        else if(currentStage == ProjectMovementStageConstant.PEC_MEETING_HELD){
            this.projectStage = 'IN PLANNING COMMISSION';
        }
    }

    checkCurrentStage(response: any) {
        this.currentStage = response.res.currentStage;
        const currentStageUserId = response.res.userId;
        console.log(this.userGroup);
        if (this.currentStage === ProjectMovementStageConstant.AGENCY_DESK && (this.userGroup.groupStatus == 'AGENCY-DESK' || this.userGroup.groupStatus == 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isForwardToMinistryHead = true;
                this.showButtonSendToNothi = true;
            }
        }
        else if (this.currentStage === ProjectMovementStageConstant.AGENCY_HEAD ) {
            this.projectStatus = "Received from Ministry/Division";
            if((this.userGroup.groupStatus == 'AGENCY-HEAD' || this.userGroup.groupStatus == 'OTHER')){
                this.isReturnToAgencyDesk = true;
            }

        } else if (this.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD && (this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.isForwardToMinistryDesk = true;
        } else if (this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK && (this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isReturnToAgencyHead = true;
                this.isForwardToPlanningHead = true;
                this.showButtonSendToNothi = true;
                this.isInProjectScrutinyCommitteeNotice = true;
                if(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' || 'ডিপিপি'){
                    this.isInDpecMeetingNotice=true;
                }
                else if(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') {
                    this.isInDspecMeetingNotice=true;
                }
            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            this.projectStatus="Forwarded to Planning Commission";
            if((this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')){
                this.projectStatus="Received from Ministry/Division";
                this.isForwardToPlanningDesk = true;
            }

        }
        else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK ) {
            if(this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER'){
                this.getDeskOfficer(currentStageUserId);
                if((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')){
                    if (currentStageUserId === this.userGroup.userId) {
                        this.isForwardToPlanningMinister = true;
                        this.isReturnToMinistryHead = true;
                        this.showButtonSendToNothi = true;
                        this.isInpecMeetingNotice = true;
                        this.isInUnderExamine = true;
                    }
                }
            }

            console.log(this.assignedPlanningDeskOfficer);
        }
        else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER && (this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInPlanningMinister = true;
            if(this.totalAmountAnnexure5B>=5000){
                this.isForwardToEcnec = true;
            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.IN_ECNEC && (this.userGroup.groupStatus === 'ECNEC' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInEcnec = true;
        }
        else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStatus = "APPROVED";
            this.isDownloadGO = true;
        }
        else if (this.currentStage == ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStatus = "APPROVED";
            this.isDownloadGO = true;
        }
        else if(this.currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE ){
            this.projectStatus = "Awaiting for Project Scrutiny Committee Meeting"
            if(this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER'){
                if (currentStageUserId === this.userGroup.userId) {
                    this.isReturnToAgencyHead = true;
                    this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isInProjectScrutinyCommitteeHeld = true;

                    this.getMeetingAttachment(response.res.id);
                }
            }


        }
        else if(this.currentStage == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD ){
            this.projectStatus = "Project Scrutiny Committee Meeting Held";
            if((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')){
                if (currentStageUserId === this.userGroup.userId) {
                    this.isReturnToAgencyHead = true;
                    this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isDownloadMeetingAttachment = true;

                    this.getMeetingAttachment(response.res.id);
                }
            }

        }
        else if(this.currentStage == ProjectMovementStageConstant.DPEC_MEETING_NOTICE){
            this.projectStatus = "Awaiting for DPEC Meeting";
            this.getMeetingAttachment(response.res.id);
                if((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')){
                    if (currentStageUserId === this.userGroup.userId) {
                        this.isReturnToAgencyHead = true;
                        this.isForwardToPlanningHead = true;
                        this.showButtonSendToNothi = true;
                        this.isDownloadMeetingAttachment = true;
                        this.isInDpecMeetingHeld = true;


                    }

                }

        }
        else if(this.currentStage == ProjectMovementStageConstant.DPEC_MEETING_HELD){
            this.projectStatus = "DPEC Meeting Held";
            this.getMeetingAttachment(response.res.id);
                if((this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')){
                    this.isReturnToAgencyHead = true;
                    this.isForwardToPlanningHead = true;
                    this.showButtonSendToNothi = true;
                    this.isInDpecMeetingHeld = true;
                }

        }
        else if(this.currentStage == ProjectMovementStageConstant.UNDER_EXAMINE){
            this.projectStatus = "UNDER EXAMINE";
            if((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')){
                this.isReturnToAgencyHead = true;
                this.isForwardToPlanningMinister = true;
                this.showButtonSendToNothi = true;
                this.isInpecMeetingNotice = true;
            }
        }
        else if(this.currentStage == ProjectMovementStageConstant.PEC_MEETING_NOTICE){
            this.projectStatus = "PEC Meeting Notice";
            this.getMeetingAttachment(response.res.id);
                if((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')){
                    this.isReturnToAgencyHead = true;
                    this.isForwardToPlanningMinister = true;
                    this.showButtonSendToNothi = true;
                    this.isInpecMeetingHeld = true;
                }

        }
        else if(this.currentStage == ProjectMovementStageConstant.PEC_MEETING_HELD){
            this.projectStatus = "PEC Meeting Held";
            this.getMeetingAttachment(response.res.id);
                if((this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')){
                    this.isReturnToAgencyHead = true;
                    this.isForwardToPlanningMinister = true;
                    this.showButtonSendToNothi = true;
                }

        }




    }
    getDeskOfficer(currentStageUserId: any) {
        this.userProfileService.getUserById(currentStageUserId).subscribe(res=>{
            console.log(res);
            this.assignedPlanningDeskOfficer = res;
        });
    }

    getMeetingAttachment(ProjectMovementStageId) {
        console.log(ProjectMovementStageId);
        this.projectMovementService.getProjectMovementAttachment(ProjectMovementStageId).subscribe(res => {
            if (res) {
                this.isDownloadMeetingAttachment = true;
                this.meetingAttachment = res;
                console.log(this.meetingAttachment);
            }

        });
    }

    waitToGetUserGroup(callBack) {
        console.log("awaiting");
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            console.log(res);
            callBack(true);
        })
    }


    loadMovementStatus() {
        let dpp_uuid:string, tapp_uuid:string;
        this.projectSummary.projectTypeDTO.nameBn.toUpperCase() == 'DPP' || 'ডিপিপি' ? dpp_uuid = this.objectiveAndCostUuid : tapp_uuid = this.objectiveAndCostUuid;
        let srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup,null, null, dpp_uuid, tapp_uuid).subscribe(res => {
            console.log(res);
            if (res.message == 'Got Feedback') {
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
            if(res.result[0].nothi_action==4){
                this.potroJari = true;
                this.potroUrl = res.result[0].potro_url;
            }
            //note
            if(res.result[0].nothi_action==3){
                this.isNoteCompletetion=true;
            }
        })


    }

    downloadMeetingAttachment(urlPath){
        console.log('download meeting attachment:'+urlPath);
        this.fileUploadService.downloadAttachmentInDppService(urlPath);
    }

    navigateToList() {
        this.route.navigate([`rdpp-rtapp`]);
    }

    getProjectSummaryId(url, forUrl = "") {


    }

    gotoSelectedTab(url: string) {
        if (this.isDppPartADataEmpty && url == 'add-new') {
            const routeUrl = 'rdpp-rtapp/' + url + '/' + this.uuid;
            this.route.navigate([routeUrl]);
        } else if (this.isTappPartADataEmpty && url == 'tapp-project-summery') {
            const routeUrl = 'rdpp-rtapp/' + url + '/' + this.uuid;
            this.route.navigate([routeUrl]);
        } else if (this.isDppAnnexureIDataEmpty || this.isDppAnnexureIIDataEmpty || this.isDppAnnexureIIIDataEmpty || this.isDppPartBDataEmpty) {
            if(this.isDppPartADataEmpty) {
                this.snackbarHelper.openWarnSnackBarWithMessage('Require to save Part-A (Project Summary)', OK)
            } else {
                const routeUrl = 'rdpp-rtapp/' + url + '/' + this.uuid;
                this.route.navigate([routeUrl]);
            }
        } else if (this.isTappAnnexureIDataEmpty) {
            if(this.isTappPartADataEmpty) {
                this.snackbarHelper.openWarnSnackBarWithMessage('Require to save Part-A (Project Summary)', OK)
            } else {
                const routeUrl = 'rdpp-rtapp/' + url + '/' + this.uuid;
                this.route.navigate([routeUrl]);
            }
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
                console.log(err);
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
                console.log(err);
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
                console.log(err);
                this.isLoading = false;
            }
        );
    }

    downloadAnnexureIVReport() {
        this.isLoading = true;
        let methodName = this.projectSummary.isForeignAid ? 'getAnnexureFourReport' : 'getAnnexureFourBanglaReport';

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
                console.log(err);
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
                console.log('call dawonlod report ===== >>>>>');
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
                console.log('call dawonlod report ===== >>>>>');
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
                console.log('call dawonlod report ===== >>>>>');
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
                console.log('call dawonlod report ===== >>>>>');
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

    downloadTappAnexSixReport() {
        this.isLoading = true;
        this._reportDataService.getTappAnexSixReport(this.uuid).subscribe(
            res => {
                console.log('call dawonlod report ===== >>>>>');
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
                console.log('call dawonlod report ===== >>>>>');
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


    // downloadAnnualCostReport() {
    //     this._annualCostReportService.getAnnualCostReport(this.uuIdForAnnexureFive).subscribe(
    //         res => {
    //             console.log('call dawonlod report ===== >>>>>');
    //             this._reportCommonService.previewReport(res, "PDF");
    //         }
    //     );
    // }


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

    committeeSelectChange($event: MatSelectChange) {
        if ($event.value) {
            this.isLoading = true;
            this._reportDataService.getCommitteeReportByUrl(this.uuid, $event.value).subscribe(res => {
                this._reportCommonService.previewReport(res, "PDF");
                this.isLoading = false;
            }, error => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(error);
                this.isLoading = false;
            });
        }
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
            this.dppObjectiveCostService.getObjectiveCostByPcUuid(this.projectSummary.uuid).subscribe(res => {
                if (res) {
                    this.findDppCurrentStage(res.dppMasterId, this.projectSummary.uuid)
                } else {
                    this.canEdit = true;
                    // this.router.navigate([`rdpp-rtapp/dashboard/${row.uuid}`]);
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
        console.log('sufian');
        console.log('can = ', this.canEdit);
    }

    findDppCurrentStage(dppMasterId, uuid) {
        this.stageMovementService.getCurrentStage(dppMasterId, 'DPP').subscribe(async res => {
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

    findTappCurrentStage(tappMasterId, uuid) {
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
        this.route.navigate([`rdpp-rtapp/dashboard/${this.uuid}`]);
    }

    private openDialogProjectMovement(callback) {
        let options ={
            title: 'Are you sure that you want to Forward this Project?',
            confirmLabel: 'Okay',
            declineLabel: 'Cancel',
        };
        this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
            if (res) {
                callback(true);
                console.log('ok');
            } else {
                console.log('Cancel');
            }
        });
    }


    //get mode of finance total value and annexure 5b total data for show send to nothi button

    getTotalModeData(res: any) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.id).subscribe(response => {
            if (response.length > 1) {
                let total = response.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.totalAmountAnnexure5B = total[0].totalAmount;
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

                if(this.totalModeOfFinance.totalAmount === this.totalAmountAnnexure5B) {
                    console.log('hello');
                    this.enableNothiButtonMOFAndAnnexure5BDataIsEqual = true;
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
            if( res.res.concernedDivisionId == null) {
                this.isDppPartAConcernedDivisionIdEmpty = true;
            }
            if( res.res.objectivesTargets == null || res.res.objectivesTargets == '') {
                this.isDppObjectiveTargetsDataEmpty = true;
            }
    }

    checkDppPartBProjectDetails() {
        this.projectDetailsPartbService.getProjectDetailsByProjectId(this.uuid).subscribe( res => {
            if( res == null || res == '') {
                this.isDppPartBDataEmpty = true;
            }
        })
    }

    checkDppAnnexureIData() {
        this.dppLocationWiseCostBreakdownService.getByProjectConceptMasterId(this.id).subscribe( res => {
            console.log('getDppAnnexureIData');
            console.log(res);
            if( res.length == 0) {
                this.isDppAnnexureIDataEmpty = true;
            }
        })
    }

    checkDppAnnexureIIIData() {
        this.dppAnnexureGoodsIiiAService.getDataList('get-list/Goods/'+this.uuid).subscribe( res => {
            if( res.res == null || res.res == '') {
                this.isDppAnnexureIIIDataEmpty = true;
            }
        })
    }

    checkDppAnnexureIIData() {
        this.dppProjectManagementSetupService.getProjectManagementSetup(this.uuid).subscribe( res => {
            if(res.res.dppProjectManagementSetupMasterId === null) {
                this.isDppAnnexureIIDataEmpty = true;
            }
        })
    }


    /* Check Tapp Data validation for send to nothi*/

    checkTappAnnexureIData() {
        this.tappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            projectConceptId: this.id,
            componentName: DppAnnualPhasingConstant.Revenue_Component
        }).subscribe( res => {
            if( res == null) {
                this.isTappAnnexureIDataEmpty = true;
            }

        })
    }

    checkTappPartAData(res: TappObjectiveCostModel) {
        if (res == null) {
            this.isTappDesignationContactPersonDataEmpty = true;
            this.isTappObjectiveTargetsDataEmpty = true;
            this.isTappResponsiblePreparation = true;
        }
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

    downloadAllAttachments(){
        this.fileUploadService.downloadDppAttachementsZip(this.id);
    }



}
