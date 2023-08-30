import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';

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

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ProjectSummaryService} from 'app/main/modules/project-concept-management/services/project-summary.service';
import {
    CommentObservationComponent
} from 'app/main/modules/project-concept-management/features/project-concepts/comment-observation/comment-observation.component';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {
    DashboardAttachmentService
} from 'app/main/modules/project-concept-management/services/dashboard-attachment.service';
import {DashboardAttachmentModel} from 'app/main/modules/project-concept-management/models/dashboard-attachment.model';
import {ProcurementMethodModel} from 'app/main/modules/configuration-management/models/procurement-method.model';
import {
    SubmitConfirmationDialogComponent
} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN} from 'app/main/core/constants/message';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {ActivatedRoute, Router} from '@angular/router';
import {SectorDivisionService} from 'app/main/modules/configuration-management/services/sector-division.service';
import {ProjectMovementService} from 'app/main/modules/configuration-management/services/project-movement.service';
import {ProjectTypeService} from 'app/main/modules/configuration-management/services/project-type.service';
import {
    DppProjectSummeryHelperService
} from 'app/main/modules/dpp-tapp-management/services/dpp-project-summery-helper.service';
import {UnsubscribeAdapterComponent} from '../../../../../../core/helper/unsubscribeAdapter';
import {IProjectConcept} from '../../../../../project-concept-management/models/project-concept';
import {DashboardService} from 'app/main/modules/dpp-tapp-management/services/dashboard.service';
import {EnothiDakSubmissionService} from 'app/main/core/services/enothi-dak-submission.service';
import {MatSort} from "@angular/material/sort";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {DppObjectiveCostService} from "../../../../services/dpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../../models/dppObjectiveCost.model";
import {DppAnnualPhasingCostService} from "../../../../services/dpp-annual-phasing-cost.service";
import {DppAnnualPhasingConstant} from "../../../../constants/dpp-annual-phasing.constant";
import {TappAnnualPhasingCostService} from "../../../../services/tapp-annual-phasing-cost.service";
import {
    DashboardAttachmentDetailsModel
} from "../../../../../project-concept-management/models/dashboard-attachment-details.model";
import {SendToDakComponent} from 'app/main/shared/components/send-to-dak/send-to-dak.component';
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {DateBengaliPipe} from "../../../../../../shared/pipes/date-bengali-pipe";
import {DATE_BENGALI_FORMAT, DATE_ENG_FORMAT} from "../../../../../../shared/constant/formatter.constant";
import {FileUploadService} from "../../../../../../core/services/file-upload.service";
import {NumberPipe} from "../../../../../../shared/pipes/number-pipe.pipe";
import {SectorModel} from "../../../../../configuration-management/models/sector.model";
import {SubSectorModel} from "../../../../../configuration-management/models/sub-sector.model";
import {SectorDivisionModel} from "../../../../../configuration-management/models/sector-division.model";
import {SectorService} from "../../../../../configuration-management/services/sector.service";
import {SubSectorService} from "../../../../../configuration-management/services/sub-sector.service";
import {UserGroupService} from "../../../../../configuration-management/services/user-group.service";
import {ProjectMovementService as StageMovementService} from "../../../../services/project-movement.service";
import {TappObjectiveCostModel} from "../../../../models/tappObjectiveCost.model";
import {CommentSourceEnum} from "../../../../../project-concept-management/enums/comment-source.enum";
import {AgencyService} from "../../../../../configuration-management/services/agency.service";
import {locale as lngEnglishAction} from "../../../../../../../layout/layouts/vertical/classy/i18n/en";
import {ClassyLayoutComponent} from "../../../../../../../layout/layouts/vertical/classy/classy.component";
import {ProjectMovementStageConstant} from "../../../../constants/project-movement-stage-constant";
import {FeedbackMovementService} from "../../../../../../core/services/feedback-movement.service";
import {ProjectMovementStageModel} from "../../../../models/project.movement.model";
import {StatusStage} from "../../../../constants/stage-status-constant";

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
    colors: string[];
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
};


@Component({
    selector: 'app-dpp-dashboard',
    templateUrl: './dpp-dashboard.component.html',
    styleUrls: ['./dpp-dashboard.component.scss']
})

export class DppDashboardComponent extends UnsubscribeAdapterComponent implements OnInit {

    // conceptId = this.route.snapshot.params['id'];
    // chart design
    @ViewChild('projectTotalChart') chartTotalProject: ChartComponent;
    chartOptions: Partial<ChartOptions>;

    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

    procurementMethodList: ProcurementMethodModel[] = new Array<ProcurementMethodModel>();

    dashboardAttachmentModels: DashboardAttachmentModel[] = new Array<DashboardAttachmentModel>();
    attachmentModel: DashboardAttachmentDetailsModel[] = new Array<DashboardAttachmentDetailsModel>();

    displayedColumns: string[] = ['id', 'name', 'fileType', 'progress'];
    displayedColumnsOtherAttachment: string[] = ['id', 'fileType', 'fileName', 'progress'];

    dataSource: MatTableDataSource<DashboardAttachmentDetailsModel>;
    dataSourceOtherAttachment = new MatTableDataSource(this.attachmentModel);

    projectSummary: IProjectConcept;
    objectiveAndCost: DppObjectiveCostModel = new DppObjectiveCostModel();
    observer: 'A' | 'MD' | 'PC' = 'A';
    frmGroup: FormGroup;
    file: File;
    title: any;
    projectStage: string;
    currentStage: string;
    projectStatus: string;
    dppMasterId: number;
    tappMasterId: number;

    projectType: string;
    isForeignAid: boolean;
    // conceptId: string;
    projectTypeId: number;
    projectId: any;
    pcId: any;
    objectiveAndCostUuid: string;
    totalAnnexureAmount: number = 0;

    pcUuidAndIdUrl: any;

    titleEn: string;
    titleBn: string;
    commencementDate: string;
    completionDate: string;

    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    userGroupModel: any;
    sector: SectorModel;
    subSector: SubSectorModel;
    sectorDivision: SectorDivisionModel;
    agencyModel: any;

    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;

    sizeOther: number = DEFAULT_SIZE;
    pageOther: number = DEFAULT_PAGE;
    totalOther: number;
    objectivesAndCost: DppObjectiveCostModel | TappObjectiveCostModel;
    statusStage = new StatusStage();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    show = true;
    actionPermission = [];
    conceptId: string;

    // nothi status
    isForwardToMinistryHead: boolean = false;
    movementStatusList = [];
    nothiStatus = 'Draft';
    potroJari: boolean = false;
    potroUrl = null;
    isNoteCompletetion: boolean = false;

    movementStageList: ProjectMovementStageModel[] = [];

    //google chart
    financialAmountChartData: any;
    spinner: boolean;
    totalExpenseByAgency: number = 0;
    totalAllocationByAgency: number = 0;
    year: number;
    month: number;
    isEnLabel: boolean;
    isParipatra2016: boolean = true;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private projectSummaryService: ProjectSummaryService,
        private sectorService: SectorService,
        private subSectorService: SubSectorService,
        private dppObjectiveCostService: DppObjectiveCostService,
        private agencyService: AgencyService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private userGroupService: UserGroupService,
        private dialog: MatDialog,
        private snackbarHelper: SnackbarHelper,
        private feedbackMovementService: FeedbackMovementService,
        private dashboardAttachmentService: DashboardAttachmentService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router,
        public datePipe: DatePipe,
        public numberPipe: NumberPipe,
        private _translateService: TranslateService,
        private projectMovementService: ProjectMovementService,
        private projectTypeService: ProjectTypeService,
        private sectorDivisionService: SectorDivisionService,
        private objectiveAndCostService: DppObjectiveCostService,
        private stageMovementService: StageMovementService,
        private dppHelperService: DppProjectSummeryHelperService,
        private dashboardService: DashboardService,
        private enothiDakSubmissionService: EnothiDakSubmissionService,
        private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private classyLayoutComponent: ClassyLayoutComponent,
        private dateBengaliPipe: DateBengaliPipe,
        private fileUploadService: FileUploadService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
        });
        this.route.params.subscribe(params => {
            this.conceptId = params['id'];
        });
        this.actionPermission = lngEnglishAction.data.ACTION;
        if (this.actionPermission == null)
            this.callActionSubject();
        else
            this.show = false;
        this.pcUuidAndIdUrl = this.pcId + '/' + this.conceptId;
        this.getProjectConceptById();
        this.getUserGroup();
    }

    getTotalExpenseByAgency(agencyId) {
        this.subscribe$.add(
            this.dashboardService.getGrandTotalByProjectConceptIdList(agencyId).subscribe(res => {
                this.totalExpenseByAgency = res;
                this.spinner = false;
            }, error => this.spinner = false)
        )
    }

    getAllStageByMasterId(source, id) {
        this.stageMovementService.getAllStageByMasterId(source, id).subscribe(res => {
            this.movementStageList = res;
            this.movementStageList.forEach(e => {
                let time = e.movementTime.split(':');
                // e.movementTime = Number(time[0]) > 12 ? (Number(time[0] - 12) + '.' + time[1] + ' PM') : (Number(time[0]) + '.' + time[1] + ' AM');
                // e.currentStage = e.currentStage ? e.currentStage.split('_').join(' ') : 'AGENCY DESK';
                e.currentStage = e.currentStage ? (this.isEnLabel ? (e.currentStage).toString().replace('_', ' ') : this.statusStage.getProjectStatus(e.currentStage)) : (this.isEnLabel ? 'AGENCY DESK' : 'এজেন্সী এর ডেস্ক');
                e.movementTime = this.isEnLabel ? (Number(time[0]) > 12 ? (Number(time[0] - 12) + '.' + time[1] + ' PM') : (Number(time[0]) + '.' + time[1] + ' AM')) :
                    (Number(time[0]) > 12 ? (this.numberPipe.convertToBanglaNumber(Number(time[0] - 12)) + '.' + this.numberPipe.convertToBanglaNumber(time[1]) + ' পি .এম') : (this.numberPipe.convertToBanglaNumber(time[0]) + '.' + this.numberPipe.convertToBanglaNumber(time[1]) + ' এ.এম'));
            });
        })
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

    //  -------------------------
    private getProjectConceptById() {
        this.spinner = true;
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptId).subscribe(res => {
                this.projectSummary = res;
                this.titleEn = res.titleEn;
                this.titleBn = res.titleBn;
                this.isParipatra2016 = res?.isParipatra2016;
                this.commencementDate = this.datePipe.transform(res.expCommencementDate, 'dd/MM/yyyy');
                this.completionDate = this.datePipe.transform(res.expCompletionDate, 'dd/MM/yyyy');
                // this.commencementDate = this.getFormattedDate(res.expCommencementDate);
                // this.completionDate = this.getFormattedDate(res.expCompletionDate);
                this.setValuePcIdAndPcUuid(res.id, res.uuid);
                this.isForeignAid = res.isForeignAid;
                this.projectTypeId = res.projectTypeId;
                this.pcId = res.id;
                this._translateService.use(res.isForeignAid ? 'en' : 'bn');
                this.isEnLabel = this._translateService.currentLang === 'en';
                this.getAgency();
                this.getTotalExpenseByAgency(res.agencyId);
                res.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? this.getDppObjectiveCostByPcUuid() : this.getTappObjectiveCostByPcUuid();
                this.getGrandTotal(res.id, res);
                // this.getDashboarData(res.uuid, res.id, res.projectTypeId);
                this.getProjectTypes();
                this.getListDashboardAttachment();
                // this.getOtherAttachmentForPartB();
                this.getSector(res);
                this.getSubSector(res);
                this.getSectorDivision(res);
                //   this.getProjectStage(res);
                this.getUserGroupByUserId();
                const diffDays = (startDate, endDate) => Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
                const totalDays: number = diffDays(new Date(res.expCommencementDate), new Date(res.expCompletionDate));
                this.year = Math.floor(totalDays / 365);
                this.month = Math.floor((totalDays % 365) / 30);
            }, _ => {
                this.spinner = false;
            })
        );
    }

    getUserGroupByUserId() {
        this.userGroupService.getUserGroupByUserId().subscribe(res => {
            this.userGroupModel = res;
            if (res && this.userGroupModel.ministryDivision) {
                this.getProjectStage(res);
            }
        });
    }

    // getUserGroupByUserId() {
    //     this.userGroupService.getUserGroupByUserId().subscribe(res => {
    //         this.userGroupModel = res;
    //         if (res && this.userGroupModel.ministryDivision) {
    //             this.getAgency();
    //         }
    //     });
    // }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
            this.totalAllocationByAgency = res.ceilingAmount ? res.ceilingAmount : 0;
        })
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
                // this.projectStage = res.res.currentStage ? (res.res.currentStage).toString().split('_').join(' ') : 'IN AGENCY';
                this.projectStage = res.res.currentStage ? this.projectSummary?.isForeignAid ? (res.res.currentStage).toString().split('_').join(' ') : this.statusStage.getProjectStatus(res.res.currentStage) : (this.projectSummary?.isForeignAid ? 'IN AGENCY' : 'সংস্থায় আছে');
            }
        });
    }

    getTappCurrentStage(tappMasterId) {
        this.stageMovementService.getCurrentStageInTapp(tappMasterId).subscribe(async res => {
            if (res.res) {
                // this.projectStage = res.res.currentStage ? (res.res.currentStage).toString().split('_').join(' ') : 'IN AGENCY';
                this.projectStage = res.res.currentStage ? this.projectSummary?.isForeignAid ? (res.res.currentStage).toString().split('_').join(' ') : this.statusStage.getProjectStatus(res.res.currentStage) : (this.projectSummary?.isForeignAid ? 'IN AGENCY' : 'সংস্থায় আছে');
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
        return (this._translateService.currentLang == 'en') ? this.datePipe.transform(date, DATE_ENG_FORMAT) : this.dateBengaliPipe.transform(date.toString(), DATE_BENGALI_FORMAT);
    }

    private getDppGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.financialInfoApexChart(total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount);
            } else {
                this.financialInfoApexChart(projectConcept.gobAmount, projectConcept.paAmount, projectConcept.ownFundAmount, projectConcept.otherAmount);
            }
        });
    }

    private getTappGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                this.financialInfoApexChart(total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount);
            } else {
                this.financialInfoApexChart(projectConcept.gobAmount, projectConcept.paAmount, projectConcept.ownFundAmount, projectConcept.otherAmount);
            }
        });
    }

    private getGrandTotal(conceptId: number, projectConcept: IProjectConcept) {
        this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? this.getDppGrandTotal(conceptId, projectConcept) : this.getTappGrandTotal(conceptId, projectConcept);
    }

    // public getDashboarData(projectConceptUuid, projectConceptId, projectTypeId) {
    //     this.dashboardService.getDataList('dpp-dashboard/get-data/' + projectConceptUuid + "/" + projectConceptId + "/" + projectTypeId).subscribe((response: any) => {
    //         if (response.status > 0) {
    //             this.projectSummary = response.res;
    //             this.initChart(response.res);
    //         }
    //     });
    // }

    private setProjectInfoTitleAndDate(res) {
        this.titleEn = res.projectTitleEn ? res.projectTitleEn : this.projectSummary.titleEn;
        this.titleBn = res.projectTitleBn ? res.projectTitleBn : this.projectSummary.titleBn;
        this.commencementDate = res.dateCommencement ? this.datePipe.transform(res.dateCommencement, 'dd/MM/yyyy') : this.commencementDate;
        this.completionDate = res.dateCompletion ? this.datePipe.transform(res.dateCompletion, 'dd/MM/yyyy') : this.completionDate;
        // this.commencementDate = this.getFormattedDate(res.expCommencementDate);
        // this.completionDate = this.getFormattedDate(res.expCompletionDate);
    }

    private getDppObjectiveCostByPcUuid() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.conceptId).subscribe(res => {
                if (res) {
                    this.objectiveAndCostUuid = res.uuid;
                    this.objectivesAndCost = res;
                    this.getAllStageByMasterId("dpp", res.dppMasterId);
                    this.setProjectInfoTitleAndDate(res);
                    this.loadMovementStatus();
                    this.loadDppMasterId();
                }
            }
        );
    }

    private getTappObjectiveCostByPcUuid() {
        this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.conceptId).subscribe(res => {
                if (res) {
                    this.objectiveAndCostUuid = res.uuid;
                    this.objectivesAndCost = res;
                    this.getAllStageByMasterId("tapp", res.tappMasterId);
                    this.setProjectInfoTitleAndDate(res);
                    this.loadMovementStatus();
                    this.loadTppMasterId();
                }
            }
        );
    }

    setValuePcIdAndPcUuid(id: number, uuid: string) {
        this.dppHelperService.projectSummaryCreateId = id;
        this.dppHelperService.projectSummaryUuid = uuid;
    }

    private getProjectTypes() {
        this.projectTypeService.getList().subscribe(res => {
            res.forEach(value => {
                if (value.id === this.projectTypeId) {
                    this.projectType = value.nameEn;
                }

            });
        });

    }

    private financialInfoChart(gobAmount, paAmount, ownFundAmount, otherAmount) {
        gobAmount = Number(gobAmount.toFixed(2));
        paAmount = Number(paAmount.toFixed(2));
        ownFundAmount = Number(ownFundAmount.toFixed(2));
        otherAmount = Number(otherAmount.toFixed(2));
        if (this.projectSummary.isForeignAid) {
            this.financialAmountChartData = [
                ['GoB (' + gobAmount + ')', gobAmount],
                ['Project Aid (' + paAmount + ')', paAmount],
                ['Own Fund (' + ownFundAmount + ')', ownFundAmount],
                ['Other (' + otherAmount + ')', otherAmount]
            ];
        } else if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP') {
            this.financialAmountChartData = [
                ['GoB (' + gobAmount + ')', gobAmount],
                ['Own Fund (' + ownFundAmount + ')', ownFundAmount],
                ['Other (' + otherAmount + ')', otherAmount]
            ];
        } else if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
            this.financialAmountChartData = [
                ['জিওবি (' + gobAmount + ')', gobAmount],
                ['নিজস্ব অর্থ (' + ownFundAmount + ')', ownFundAmount],
                ['অন্যান্য (' + otherAmount + ')', otherAmount]
            ];
        }

    }

    private financialInfoApexChart(gobAmount, paAmount, ownFundAmount, otherAmount) {
        gobAmount = Number(gobAmount.toFixed(2));
        paAmount = Number(paAmount.toFixed(2));
        ownFundAmount = Number(ownFundAmount.toFixed(2));
        otherAmount = Number(otherAmount.toFixed(2));
        this.totalAnnexureAmount = Number(gobAmount + paAmount + ownFundAmount + otherAmount);
        const totalCost = (this.projectSummary.isForeignAid)
            ? ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) :
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

    // for const info chart
    private initChart(gobAmount, paAmount, ownFundAmount, otherAmount) {
        gobAmount = Number(gobAmount.toFixed(2));
        paAmount = Number(paAmount.toFixed(2));
        ownFundAmount = Number(ownFundAmount.toFixed(2));
        otherAmount = Number(otherAmount.toFixed(2));
        const totalCost = (this.projectSummary.isForeignAid)
            ? ((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2)) :
            this.convertToBanglaNumber((gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2));
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
                                label: this.projectSummary.isForeignAid ? 'Total Cost' : 'মোট খরচ',
                                formatter: function (w) {
                                    return totalCost;
                                }
                            }
                        }
                    }
                }
            },
            labels: this.projectSummary.isForeignAid ? ['GoB (' + gobAmount + ')', 'Project Aid (' + paAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
                // (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' && this.projectSummary.isForeignAid == false) ? ['GoB (' + gobAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'] :
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

    isDppProject(): any {
        if (this.projectType.toLowerCase() === 'DPP'.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    }

    isTappProject(): any {
        if (this.projectType.toLowerCase() === 'TAPP'.toLowerCase()) {
            return true;
        } else {
            return false;
        }
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

    create() {
        this.spinner = true;
        const title = this.frmGroup.value.title;
        this.dashboardAttachmentService.createDashBoardAttachment(this.file, title, this.pcId, this.projectType).subscribe(res => {
            this.getListDashboardAttachment();
            this.frmGroup.reset();
            this.dialog.closeAll();
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
            this.spinner = false;
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
            this.spinner = false;
        });
    }


    uploadFile(files: FileList) {
        this.file = files.item(0);
    }

    getListDashboardAttachment(): any {
        this.dashboardAttachmentService.getByPcIdAndProjectType(this.pcId, this.projectSummary.projectTypeDTO.nameEn).subscribe(dr => {
            dr?.forEach(e => e.module = 'pc');
            this.dashboardAttachmentService.getOtherAttachmentForPartBWithoutPageable(this.pcId).subscribe(or => {
                if (or) {
                    or.forEach(e => e.module = 'dpp');
                    this.dataSource = new MatTableDataSource(dr?.concat(or));
                    this.dataSource.paginator = this.paginator;
                    this.total = dr?.concat(or).length;
                } else {
                    this.dataSource = new MatTableDataSource(dr);
                    this.dataSource.paginator = this.paginator;
                    this.total = dr?.length;
                }
            })
        });
    }

    getOtherAttachmentForPartB(): any {
        this.dashboardAttachmentService.getOtherAttachmentForPartB({
            page: this.pageOther,
            size: this.sizeOther
        }, this.pcId).subscribe(res => {
            this.dataSourceOtherAttachment = new MatTableDataSource(res.content);
            this.totalOther = res.totalElements;
        });
    }


    openUrl(row: DashboardAttachmentDetailsModel) {
        row.module == 'pc' ? this.fileUploadService.download(row.urlPath) : this.fileUploadService.downloadAttachmentInDppService(row.urlPath);
    }

    openUrlOtherAttachment(row: any) {
        this.fileUploadService.download(row.urlPath);
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        // this.getListDashboardAttachment();
    }

    onChangePageOther(event: PageEvent) {
        this.sizeOther = +event.pageSize; // get the pageSize
        this.pageOther = +event.pageIndex; // get the current page
        // this.getOtherAttachmentForPartB();
    }

    update() {
        const uuid = this.frmGroup.value.uuid;
        const title = this.frmGroup.value.title;
        const attachmentId = this.frmGroup.value.attachmentId;
        if (attachmentId) {

        }
        this.dashboardAttachmentService.updateDashboardAttachment(this.file, title, uuid, this.pcId, this.projectType).subscribe(res => {
            this.getListDashboardAttachment();
            this.frmGroup.reset();
            this.dialog.closeAll();
            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
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
            sourceId: sourceId,
            source: source,
            commission: commission,
            userGroup: this.userGroup.groupStatus,
            projectStage: this.currentStage
        };
        const dialogRef = this.dialog.open(CommentObservationComponent, dialogConfig);
        // dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
        //     if (res) {
        //     }
        //     dialogRef.close(true);
        // });
    }

    resetValue() {
        this.frmGroup.reset();
        this.dialog.closeAll();
    }

    /*--------------For Dashboard--------------*/

    loadProjectSummery() {
        this._router.navigate([`dpp-tapp/add-new/${this.conceptId}`]);
    }

    getAmortizationScheduleTotal() {
        this._router.navigate([`dpp-tapp/amortization_schedule/${this.conceptId}`]);
    }

    getProjectManagementSetup() {
        this._router.navigate([`dpp-tapp/project-management-setup/${this.conceptId}`]);
    }

    getLocationWiseCostBreakdown() {
        this._router.navigate([`dpp-tapp/location-wise-cost-breakdown/${this.conceptId}`]);
    }

    getReference() {
        this._router.navigate([`dpp-tapp/tpp-annexure-two/${this.conceptId}`]);
    }

    getConsultant() {
        this._router.navigate([`dpp-tapp/tpp-annexure-three/${this.conceptId}`]);
    }

    getProjectSummaryId(url, forUrl = "") {
        let routeUrl = '';
        if (forUrl == "") {
            routeUrl = "dpp-tapp/" + url + "/" + this.conceptId;
        } else {
            routeUrl = url;
        }
        this._router.navigate([routeUrl]);

    }

    /*--------------/For Dashboard--------------*/
    editProjectSummary() {
        this._router.navigate([`project-concept/add-project-concept/${this.conceptId}`]);
    }


    sendProjectConceptToNothi() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {source: 'dpp', sourceId: this.objectiveAndCost?.uuid};
        const dialogRef = this.dialog.open(SendToDakComponent, dialogConfig);
    }

    navigateToList() {
        this._router.navigate([`dpp-tapp`]);
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

    gotToViewDashboard() {
        this._router.navigate([`dpp-tapp/view-dashboard/${this.conceptId}`]);
    }

    loadDppMasterId() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.conceptId).subscribe(res => {
            if (res) {
                this.dppMasterId = res.dppMasterId;
                this.getCurrentStage(this.dppMasterId, 'DPP');
            }
        });
    }


    loadTppMasterId() {
        this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(this.conceptId).subscribe(res => {
            if (res) {
                this.tappMasterId = res.tappMasterId;
                if (this.tappMasterId != null) {
                    this.getCurrentStage(this.tappMasterId, 'TAPP');
                }
            }
        });
    }

    getCurrentStage(masterId: number, projectType: string) {
        this.stageMovementService.getCurrentStage(masterId, projectType).subscribe(res => {
            // this.projectStatus = res.res.currentStage ? (res.res.currentStage).toString().split('_').join(' ') : 'AGENCY DESK';
            this.projectStatus = res.res.currentStage ? (this.projectSummary?.isForeignAid ? (res.res.currentStage).toString().split('_').join(' ') : this.statusStage.getProjectStatus(res.res.currentStage)) : (this.projectSummary?.isForeignAid ? 'IN AGENCY' : 'সংস্থায় আছে');

            if (this.userGroup) {
                this.checkCurrentStage(res);
            } else {
                this.waitToGetUserGroup((r) => {
                    this.checkCurrentStage(res);
                });
            }

        });
    }


    checkCurrentStage(response: any) {
        this.currentStage = response.res.currentStage;
        if (this.currentStage === ProjectMovementStageConstant.AGENCY_DESK && (this.userGroup.groupStatus == 'AGENCY-DESK' || this.userGroup.groupStatus == 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
        } else if (this.currentStage === ProjectMovementStageConstant.AGENCY_HEAD && (this.userGroup.groupStatus == 'AGENCY-HEAD' || this.userGroup.groupStatus == 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN AGENCY' : 'সংস্থায় আছে';
        } else if (this.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD && (this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK && (this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN MINISTRY' : 'মন্ত্রণালয়ে আছে';
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD && (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা মিনিস্টারে আছে';
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK && (this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING COMMISSION' : 'পরিকল্পনা মিনিস্টারে আছে';
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER && (this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN PLANNING MINISTER' : 'পরিকল্পনা মিনিস্টারে আছে';
        } else if (this.currentStage == ProjectMovementStageConstant.IN_ECNEC && (this.userGroup.groupStatus === 'ECNEC' || this.userGroup.groupStatus === 'OTHER')) {
            this.projectStage = this.isEnLabel ? 'IN ECNEC' : 'একনেকে আছে';
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStage = this.isEnLabel ? 'APPROVED BY PLANNING MINISTER' : 'পরিকল্পনা মিনিস্টার দ্বারা অনুমোদিত';
        } else if (this.currentStage == ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStage = this.isEnLabel ? 'APPROVED BY ECNEC' : 'একনেক দ্বারা অনুমোদিত';
        }
    }

    waitToGetUserGroup(callBack) {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            callBack(true);
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    setSourceOriginType(): string {
        let userGroup: string = this.userGroup.groupStatus;
        return userGroup.toString().substring(0, userGroup.indexOf('-'));
    };

    loadMovementStatus() {
        let dpp_uuid: string, tapp_uuid: string;
        this.projectSummary.projectTypeDTO.nameBn.toUpperCase() == 'DPP' || 'ডিপিপি' ? dpp_uuid = this.objectiveAndCostUuid : tapp_uuid = this.objectiveAndCostUuid;
        let srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup, null, null, dpp_uuid, tapp_uuid).subscribe(res => {
            if (res.message == 'Got Feedback') {
                this.movementStatusList = res.result;
                if (res.result[0].nothi_message != null) {
                    this.nothiStatus = res.result[0].nothi_message;
                } else if (res.result[0].decision_note != null) {
                    this.nothiStatus = res.result[0].decision_note;
                }
            } else if (res.message == 'No Feedback')
                this.nothiStatus = 'Submitted as a Daak to E-Nothi';
            else if (res.message == 'Daak is not submitted')
                this.nothiStatus = this.nothiStatus;
            else
                this.nothiStatus = this.isEnLabel ? 'AGENCY' : 'এজেন্সী';

            //potro jari
            if (res.result[0].nothi_action == 4) {
                this.potroJari = true;
                this.potroUrl = res.result[0].potro_url;
                this.isForwardToMinistryHead = true;
            }
            //note
            if (res.result[0].nothi_action == 3) {
                this.isNoteCompletetion = true;
                this.isForwardToMinistryHead = true;
            }
        })


    }
}
