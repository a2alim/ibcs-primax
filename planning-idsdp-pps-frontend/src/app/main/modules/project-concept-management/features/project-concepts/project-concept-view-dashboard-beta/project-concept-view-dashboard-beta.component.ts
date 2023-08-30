import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    ApexChart, ApexDataLabels,
    ApexLegend,
    ApexNonAxisChartSeries, ApexPlotOptions,
    ApexResponsive,
    ApexStates,
    ApexStroke, ApexTheme, ApexTitleSubtitle,
    ChartComponent
} from "ng-apexcharts";
import {ProcurementMethodModel} from "../../../../configuration-management/models/procurement-method.model";
import {DEFAULT_PAGE} from "../../../../../core/constants/constant";
import {DashboardAttachmentModel} from "../../../models/dashboard-attachment.model";
import {MatTableDataSource} from "@angular/material/table";
import {IProjectConcept} from "../../../models/project-concept";
import {IAgency} from "../../../../configuration-management/models/agency";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {SubSectorModel} from "../../../../configuration-management/models/sub-sector.model";
import {SectorDivisionModel} from "../../../../configuration-management/models/sector-division.model";
import {ProjectMovementStageModel} from "../../../../dpp-tapp-management/models/project.movement.model";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ProjectSummaryService} from "../../../services/project-summary.service";
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {
    ProjectMovementService,
    ProjectMovementService as StageMovementService
} from "../../../../dpp-tapp-management/services/project-movement.service";
import {SubSectorService} from "../../../../configuration-management/services/sub-sector.service";
import {SectorDivisionService} from "../../../../configuration-management/services/sector-division.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {ActivatedRoute, Router} from "@angular/router";
import {ReportDataService} from "../../../../../shared/services/report-data.service";
import {ReportCommonService} from "../../../../../core/services/report-common.service";
import {DashboardAttachmentService} from "../../../services/dashboard-attachment.service";
import {EnothiDakSubmissionService} from "../../../../../core/services/enothi-dak-submission.service";
import {FeedbackMovementService} from "../../../../../core/services/feedback-movement.service";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {DatePipe} from "@angular/common";
import {ClassyLayoutComponent} from "../../../../../../layout/layouts/vertical/classy/classy.component";
import {NgxBootstrapConfirmService} from "ngx-bootstrap-confirm";
import {ModeOfFinanceService} from "../../../services/mode-of-finance.service";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {NothiUserService} from "../../../../auth/services/nothi-user.service";
import {locale as lngEnglish} from "../project-concept-edit-dashboard/i18n/en";
import {locale as lngBangla} from "../project-concept-edit-dashboard/i18n/bn";
import {locale as lngEnglishAction} from "../../../../../../layout/layouts/vertical/classy/i18n/en";
import {OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../core/constants/message";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {CommentSourceEnum} from "../../../enums/comment-source.enum";
import {CommentObservationComponent} from "../comment-observation/comment-observation.component";
import {SendToDakComponent} from "../../../../../shared/components/send-to-dak/send-to-dak.component";
import {
    DeskUserMovementComponent
} from "../../../../../shared/components/desk-user-movement/desk-user-movement.component";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import {PotroJariComponent} from "../../../../../shared/components/potro-jari/potro-jari.component";
import {DashboardService} from "../../../../dpp-tapp-management/services/dashboard.service";
import {ProjectRequestModel} from "../../../../dpp-tapp-management/models/project-request.model";
import {CookieService} from "ngx-cookie-service";
import {environment} from "environments/environment";

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
    selector: 'app-project-concept-view-dashboard-beta',
    templateUrl: './project-concept-view-dashboard-beta.component.html',
    styleUrls: ['./project-concept-view-dashboard-beta.component.scss']
})
export class ProjectConceptViewDashboardBetaComponent implements OnInit {

    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callDownloadGODialog') callDownloadGODialog: TemplateRef<any>;
    @ViewChild('callDownloadRelatedInfoDialog') callDownloadRelatedInfoDialog: TemplateRef<any>;
    @ViewChild('callAttachmentDialogForMeeting') callAttachmentDialogForMeeting: TemplateRef<any>;
    chartOptions: Partial<ChartOptions>;

    procurementMethodList: ProcurementMethodModel[] = new Array<ProcurementMethodModel>();
    size: number = 2;
    page: number = DEFAULT_PAGE;
    total: number;

    dashboardAttachmentModels: DashboardAttachmentModel[] = new Array<DashboardAttachmentModel>();
    displayedColumns: string[] = ['id', 'name', 'progress', 'action'];
    dataSource = new MatTableDataSource(this.dashboardAttachmentModels);
    projectSummary: IProjectConcept;
    agencyModel: IAgency;
    observer: 'A' | 'MD' | 'PC' = 'A';
    frmGroup: FormGroup;
    file: File;
    title: any;
    id: number;
    uuid: string;
    commencementDate: string;
    completionDate: string;
    movementStatusList = [];
    projectStatus = 'Agency';
    nothiStatus = 'Draft';
    projectStage = 'In Agency';
    actionPermission = [];
    userGroupModel: any;
    userGroup:{
        'groupStatus':null,
        'userId':null
    };
    potroJari:boolean=false;
    potroUrl=null;
    isNoteCompletetion:boolean=false;
    manualPotroJari:boolean=false;
    sector: SectorModel;
    subSector: SubSectorModel;
    sectorDivision: SectorDivisionModel;
    pcMasterId: number;
    currentStage: string;
    isReturnToAgencyDesk: boolean = false;
    isReturnToAgencyHead: boolean = false;
    isForwardToMinistryHead: boolean = false;
    isForwardToMinistryDesk: boolean = false;
    isForwardToPlanningHead: boolean = false;
    isForwardToPlanningDesk: boolean = false;
    isForwardToPlanningMinister: boolean = false;
    isReturnToMinistryHead: boolean = false;
    isForwardToEcnec: boolean = false;
    isInPlanningMinister: boolean = false;
    isInEcnec: boolean = false;
    isInMinistry: boolean = false;
    isMinisterialMeetingNotice: boolean = false;
    showButtonSendToNothi: boolean = false;
    showNothiButtonMOFAndTotalEstimatedCostIsEqual: boolean = false;
    isPotroJariAttach: boolean = false;
    isPotroJariAttachMinistry: boolean = false;
    modelOfFinanceList = [];
    modeOfFinanceTotal: number;
    totalAmountModeOfFinance: number;
    forwardReturnAction: string;
    isAbleToAttach: boolean = false;

    projectMovementModel: ProjectMovementStageModel = new ProjectMovementStageModel();
    projectRequestModel: ProjectRequestModel = new ProjectRequestModel();
    canEdit = true;
    show = true;
    daakSenderEmp;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private sectorService: SectorService,
                private stageMovementService: StageMovementService,
                private subSectorService: SubSectorService,
                private sectorDivisionService: SectorDivisionService,
                private dialog: MatDialog,
                private agencyService: AgencyService,
                private snackbarHelper: SnackbarHelper,
                private route: Router, private _reportDataService: ReportDataService,
                private activatedRoute: ActivatedRoute, private _reportCommonService: ReportCommonService,
                private dashboardAttachmentService: DashboardAttachmentService,
                private formBuilder: FormBuilder,
                private enothiDakSubmissionService: EnothiDakSubmissionService,
                private feedbackMovementService: FeedbackMovementService,
                private fileUploadService: FileUploadService,
                private datePipe: DatePipe,
                private projectMovementService: ProjectMovementService,
                private classyLayoutComponent: ClassyLayoutComponent,
                private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
                private modeOfFinanceService: ModeOfFinanceService,
                private userGroupService: UserGroupService,
                private nothiUserService: NothiUserService,
                private dashboardService: DashboardService,
                private cookieService: CookieService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.actionPermission = lngEnglishAction.data.ACTION;
        if (this.actionPermission == null)
            this.callActionSubject();
        else
            this.show = false;

        // Get Value From Router
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
        });


        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
        });

        this.getProjectSummary();
        this.getUserGroup();
        this.loadProjectConceptMasterId();
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
            if (res) {
                this.getAgency();
            }
        });
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
            this.projectSummary = res;
            this.commencementDate = this.datePipe.transform(res.expCommencementDate, 'dd/MM/yyyy');
            this.completionDate = this.datePipe.transform(res.expCompletionDate, 'dd/MM/yyyy');
            this.id = res.id;
            this.initChart(res);
            this.getListDashboardAttachment();
            this.getSector(res);
            this.getSubSector(res);
            this.getSectorDivision(res);
            // this.getProjectStage(res.id);
            this.checkUserCanEdit();
            this.getUserGroupByUserId();
        });
    }

    getProjectStage(id) {
        this.stageMovementService.getCurrentStageForProjectConcept(id).subscribe(res => {
            if(res.res){
                this.projectStage = res.res.currentStage ? (res.res.currentStage).toString().split('_').join(' ') : 'IN AGENCY';
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

    // for const info chart
    private initChart(res: IProjectConcept) {
        const gobAmount = Number(res.gobAmount.toFixed(2));
        const paAmount = Number(res.paAmount.toFixed(2));
        const ownFundAmount = Number(res.ownFundAmount.toFixed(2));
        const otherAmount = Number(res.otherAmount.toFixed(2));
        this.chartOptions = {
            series: [gobAmount, paAmount, ownFundAmount, otherAmount],
            chart: {
                type: "pie",
                width: 350,
                height: 350
            },
            colors: ["#adc5e4", "#03bcd0", "#f7ba16", "#b4ce39"],
            labels: ['GoB (' + gobAmount + ')', 'Project Aid (' + paAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'],
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
                                label: 'Total Cost',
                                formatter: function (w) {
                                    return (gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2);
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

    saveAttachment() {
        const uuid = this.frmGroup.value.uuid;
        const title = this.frmGroup.value.title;
        if (uuid) {
            this.dashboardAttachmentService.updateDashboardAttachment(this.file, title, uuid, this.id, 'projectConcept').subscribe(res => {
                this.loadData();
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });

        } else {
            this.dashboardAttachmentService.createDashBoardAttachment(this.file, title, this.id, 'projectConcept').subscribe(res => {
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
        }, this.id, 'projectConcept').subscribe(res => {
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            sourceId: this.projectSummary.id,
            source: CommentSourceEnum.PROJECT_SUMMARY,
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
            width: '455px',
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
        this.route.navigate([`project-concept/add-project-concept/${this.uuid}/${false}`]);
    }

    navigateToList() {
        this.route.navigate(['project-concept']);
    }

    goToReport() {
        this.route.navigate([`project-concept/report-view/${this.uuid}`]);
        this.dialog.closeAll();
    }

    downloadProjectConceptReport() {
        this._reportDataService.getProjectConceptReport(this.uuid).subscribe(
            res => {
                console.log('call dawonlod report ===== >>>>>');
                this._reportCommonService.previewReport(res, "PDF");
            },
            err => {
                this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                console.log(err);
            }
        );
    }


    closeReportDownloadDialog() {
        this.dialog.closeAll();
    }

    /* Start Approval Process Flow */


    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            console.log(res);
            this.userGroup = res.res;
            if (res.res.groupStatus == 'AGENCY-DESK' || res.res.groupStatus == 'AGENCY-HEAD') {
                this.isAbleToAttach = true;
            }
        })
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    sendProjectConceptToNothi() {
        console.log('nothi');
        let srcUserGroup = this.setSourceOriginType();
        console.log('setSourceOriginType:'+srcUserGroup);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {source: 'pc', sourceId: this.uuid, pcUuid: this.uuid, srcUserGroup: srcUserGroup};
        const dialogRef = this.dialog.open(SendToDakComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    setSourceOriginType():string{
        let userGroup : string = this.userGroup.groupStatus;
        return  userGroup.toString().substring(0,userGroup.indexOf('-'));
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
                    this.projectStatus = 'AGENCY DESK';
                    this.projectStage = 'IN AGENCY';
                    this.isReturnToAgencyDesk = false;
                } else if(userGroupType === 'Ministry') {
                    this.isForwardToMinistryDesk = false;
                    this.projectStatus = 'MINISTRY DESK';
                    this.projectStage = 'IN MINISTRY';
                }
            }
        });
    }

    loadProjectConceptMasterId() {
        this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
            console.log(res);
            if (res) {
                this.pcMasterId = res.id;
                this.getCurrentStage();
                this.loadMovementStatus();
                this.getModeOfFinanceList();
            }
        });
    }

    forwardToMinistry() {
        this.forwardReturnAction = 'Forward';
        this.openDialogProjectMovement( (res) => {
            this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                this.isForwardToMinistryHead = false;
                this.showButtonSendToNothi = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Ministry successfully', 'OK');
                this.projectStatus = 'MINISTRY HEAD';
                this.projectStage = 'IN MINISTRY';
            });
        });

    }

    forwardToMinistryDesk() {
        this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_DESK;
        this.deskUserMovement('Ministry');
    }

    toAgencyHead() {
        this.forwardReturnAction = 'Return';
        this.openDialogProjectMovement( (res) => {
            this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isReturnToAgencyHead = false;
                this.showButtonSendToNothi = false;
                this.isInMinistry = false;
                this.projectStatus = 'AGENCY HEAD';
                this.projectStage = 'IN AGENCY';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Agency successfully', 'OK')
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage('Something Went Wrong', OK);
            });
        });
    }

    returnToAgencyDesk() {
        this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_DESK;
        this.deskUserMovement('Agency');
    }

    savePotroJariAttachment(){
        this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI;
        this.projectMovementModel.userId = this.userGroup.userId;
        console.log(this.projectMovementModel);
        const dialogConfigPotroJari = new MatDialogConfig();
        dialogConfigPotroJari.disableClose = false;
        dialogConfigPotroJari.autoFocus = false;
        dialogConfigPotroJari.width = '50%';
        dialogConfigPotroJari.height = 'auto';
        dialogConfigPotroJari.data = {
            message: 'Attached Potrojari successfully',
            projectMovementStageModel: this.projectMovementModel
        };
        const dialogRef = this.dialog.open(PotroJariComponent, dialogConfigPotroJari);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res=>{
            if(res){
                this.isPotroJariAttach = false;
                // this.showButtonSendToNothi = false;
                this.isForwardToMinistryHead = true;
                this.manualPotroJari = true;
                dialogRef.close(true);
            }
        })
    }

    // returnToMinistry() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_HEAD;
    //     this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
    //         console.log(res);
    //         this.isForwardToPlanningHead = false;
    //         this.snackbarHelper.openSuccessSnackBarWithMessage('Returned to Ministry successfully', 'OK')
    //     });
    // }

    // forwardToPlanning() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD;
    //     this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
    //         console.log(res);
    //         this.isForwardToPlanningHead = false;
    //         this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Planning successfully', 'OK');
    //     });
    // }

    // forwardToPlanningDesk() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_DESK;
    //     this.deskUserMovement('Planning_Commission');
    // }

    // forwardToPlanningMinister() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER;
    //     this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
    //         console.log(res);
    //         this.isForwardToPlanningMinister = false;
    //         this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Minister successfully', 'OK');
    //     });
    // }


    // approvedByPlanningMinister() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED;
    //     this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
    //         console.log(res);
    //         this.isInPlanningMinister = false;
    //         this.snackbarHelper.openSuccessSnackBarWithMessage('Approved By Minister successfully', 'OK');
    //     });
    // }



    approvedByMinstry() {
        this.forwardReturnAction = 'Approve';
        this.openDialogProjectMovement( res => {

            this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.projectStatus = 'APPROVED';
                this.projectStage = 'APPROVED BY MINISTRY';
                this.showButtonSendToNothi = false;
                this.isReturnToAgencyHead = false;
                this.isInMinistry = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage('Approved By Ministry successfully', 'OK');
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage('Something Went Wrong', OK);
            });
        });
    }

    setMinisterialMeetingNotice(){
        console.log('setMinisterialMeetingNotice');
        const dialogRef = this.dialog.open(this.callAttachmentDialogForMeeting, {
            height: '380px',
            width: '600px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });

    }

    saveMinisterialMeetingNoticeWithAttachment(){
        console.log(this.file);
        this.openDialogProjectMovement( res =>{
            this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTERIAL_MEETING_NOTICE;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res=>{
                console.log(res);
                const projectMovementStage = res.res;
                this.fileUploadService.uploadApprovalProcessFlowAttachment(this.file,projectMovementStage).subscribe(res2=>{
                    console.log(res2);
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Ministerial Meeting Notified successfully', 'OK');
                    this.isMinisterialMeetingNotice = false;
                    this.projectStatus = "Ministerial Meeting Notified";
                    this.dialog.closeAll();
                });

            })
        })
    }


    // forwardToEcnec() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.IN_ECNEC;
    //     this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
    //         console.log(res);
    //         this.isInPlanningMinister = false;
    //         this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to ECNEC successfully', 'OK');
    //     });
    // }

    // approvedByEcnec() {
    //     this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
    //     this.projectMovementModel.currentStage = ProjectMovementStageConstant.ECNEC_APPROVED;
    //     this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
    //         console.log(res);
    //         this.isInEcnec = false;
    //         this.snackbarHelper.openSuccessSnackBarWithMessage('Approved by ECNEC successfully', 'OK');
    //     });
    // }


    getCurrentStage() {
        this.projectMovementService.getCurrentStageForProjectConcept(this.pcMasterId).subscribe(res => {
            console.log('current Status');
            console.log(res);
            this.projectStatus = res.res.currentStage ? (res.res.currentStage).toString().split('_').join(' ') : 'AGENCY DESK';
            if(res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK || res.res.currentStage === ProjectMovementStageConstant.AGENCY_HEAD) {
                this.projectStage = 'IN AGENCY';
            } else if(res.res.currentStage === ProjectMovementStageConstant.MINISTRY_DESK || res.res.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD) {
                this.projectStage = 'IN MINISTRY';
            } else if(res.res.currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || res.res.currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
                this.projectStage = 'IN PLANNING COMMISSION';
            } else if(res.res.currentStage === ProjectMovementStageConstant.PLANNING_MINISTER) {
                this.projectStage = 'IN PLANNING MINISTER';
            } else if(res.res.currentStage === ProjectMovementStageConstant.IN_ECNEC) {
                this.projectStage = 'IN ECNEC';
            } else if(res.res.currentStage === ProjectMovementStageConstant.MINISTRY_APPROVED) {
                this.projectStage = 'APPROVED BY MINISTRY';
            } else if(res.res.currentStage === ProjectMovementStageConstant.ECNEC_APPROVED) {
                this.projectStage = 'APPROVED BY ECNEC';
            } else if(res.res.currentStage === ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
                this.projectStage = 'APPROVED BY PLANNING MINISTER';
            } else if(res.res.currentStage === ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY) {
                this.projectStage = 'IN MINISTRY';
            }
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
        const currentStageUserId = response.res.userId;
        if(this.currentStage === ProjectMovementStageConstant.AGENCY_DESK && (this.userGroup.groupStatus=='AGENCY-DESK'||this.userGroup.groupStatus=='OTHER')) {
            if(currentStageUserId === this.userGroup.userId)
                this.isForwardToMinistryHead = true;
            this.showButtonSendToNothi = true;
            this.isReturnToAgencyDesk = false;
            this.isPotroJariAttach = true;
        }
        else if(this.currentStage === ProjectMovementStageConstant.AGENCY_HEAD && (this.userGroup.groupStatus=='AGENCY-HEAD'||this.userGroup.groupStatus=='OTHER')) {
            this.isReturnToAgencyDesk = true;

        }
        else if(this.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD && (this.userGroup.groupStatus==='MINISTRY-HEAD'||this.userGroup.groupStatus==='OTHER')) {
            this.isForwardToMinistryDesk = true;
        }
        else if(this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK && (this.userGroup.groupStatus==='MINISTRY-DESK'||this.userGroup.groupStatus==='OTHER')) {
            if(currentStageUserId === this.userGroup.userId){
                this.isReturnToAgencyHead = true;
                this.isInMinistry = true;
                this.showButtonSendToNothi = true;
                //this.isMinisterialMeetingNotice = true;
                this.isPotroJariAttachMinistry = true;
            }
        }
        else if(this.currentStage == ProjectMovementStageConstant.MINISTRY_APPROVED)  {
            this.projectStatus = "APPROVED";
            this.isInMinistry = false;
            this.isReturnToAgencyDesk = false;
            this.isReturnToAgencyHead = false;
            this.showButtonSendToNothi = false;
        }
        else if(this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI){
            if(currentStageUserId === this.userGroup.userId){
                this.isForwardToMinistryHead = true;
                this.showButtonSendToNothi = true;
                this.manualPotroJari = true;
            }
        }
        else if(this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY){
            if(currentStageUserId === this.userGroup.userId){
                this.isReturnToAgencyHead = true;
                this.isInMinistry = true;
            }
        }


    }

    waitToGetUserGroup(callBack) {
        console.log("awaiting");
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            console.log(res)
            callBack(true);
        })
    }



    loadMovementStatus(){
        const pc_uuid = this.uuid;
        let srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup,pc_uuid,null,null,null).subscribe(res=>{console.log(res);
            if(res.message=='Got Feedback'){
                this.movementStatusList = res.result;
                if(res.result[0].nothi_message!=null){
                    this.nothiStatus=res.result[0].nothi_message;
                }
                else if(res.result[0].decision_note!=null){
                    this.nothiStatus=res.result[0].decision_note;
                }
            }
            else if(res.message=='No Feedback')
                this.nothiStatus = 'Submitted as a Daak to E-Nothi' ;
            else if(res.message=='Daak is not submitted')
                this.nothiStatus = 'DRAFT';
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

        this.feedbackMovementService.getDaakSubmission(srcUserGroup,pc_uuid,null,null,null).subscribe(res=>{
            const empId = res.senderEmpId;
            this.nothiUserService.getNothiUserByNothiDaakSender(empId).subscribe(res2=>{
                console.log(res2);
                this.daakSenderEmp = res2.name;
            })
        })



    }
    gotToEditDashboard() {
        this.route.navigate([`project-concept/edit-dashboard/${this.projectSummary.uuid}`]);
    }

    private checkUserCanEdit() {
        this.stageMovementService.getCurrentStageInPc(this.projectSummary.id).subscribe(async res => {
            if (res.res) {
                if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
                    this.canEdit = true;
                    // await this.router.navigate([`project-concept/edit-dashboard/${row.uuid}`]);
                } else {
                    this.canEdit = false;
                }
            } else {
                this.canEdit = true;
            }
        });
    }

    private openDialogProjectMovement(callback) {
        let options ={
            title: 'Are you sure that you want to ' + this.forwardReturnAction +  ' this Project?',
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

    // for get ModeOfFinanceList
    private getModeOfFinanceList() {
        console.log('inzamamul-haque');
        this.modeOfFinanceService.getModeOfFinanceListByProjectSummaryId(this.pcMasterId).subscribe(res => {
            this.modelOfFinanceList = res;
            console.log('this.modelOfFinanceList');
            console.log(this.modelOfFinanceList);
            this.modeOfFinanceTotal = res?.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
            this.getTotalModeData();
        })
    }

    getTotalModeData() {
        this.totalAmountModeOfFinance = this.modelOfFinanceList.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
        console.log('this.totalAmountModeOfFinance');
        console.log(this.totalAmountModeOfFinance);
        console.log(this.totalAmountModeOfFinance);
        console.log(this.projectSummary.totalAmount);
        if(this.projectSummary.totalAmount === this.totalAmountModeOfFinance) {
            this.showNothiButtonMOFAndTotalEstimatedCostIsEqual = true;
        }
    }

    savePotroJariAttachmentMinistry(){
        this.projectMovementModel.projectConceptMasterId = this.pcMasterId;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY;
        this.projectMovementModel.userId = this.userGroup.userId;
        console.log(this.projectMovementModel);
        const dialogConfigPotroJari = new MatDialogConfig();
        dialogConfigPotroJari.disableClose = false;
        dialogConfigPotroJari.autoFocus = false;
        dialogConfigPotroJari.width = '50%';
        dialogConfigPotroJari.height = 'auto';
        dialogConfigPotroJari.data = {
            message: 'Attached Potrojari successfully',
            projectMovementStageModel: this.projectMovementModel
        };
        const dialogRef = this.dialog.open(PotroJariComponent, dialogConfigPotroJari);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res=>{
            console.log(res);
            if(res){
                dialogRef.close(true);
                this.isPotroJariAttachMinistry = false;
                this.showButtonSendToNothi = false;
                this.projectStage = 'IN MINISTRY';
                this.projectStatus = 'POTRO JARI ATTACHED IN MINISTRY';
            }
        })
    }

    public sendProjectData(){
        this.projectRequestModel.pcUuid = this.projectSummary.uuid;
        this.projectRequestModel.projectType = 'PC';
        this.projectRequestModel.access_token = sessionStorage.getItem('access_token');
        this.projectRequestModel.doptor_token = sessionStorage.getItem('doptor_token');

        this.dashboardService.sendProjectData(this.projectRequestModel).subscribe(res => {

            window.open(environment.ibcs.gisUrl+'projectInfo/'+this.id, '_blank');

            // if (res.status == 0) {
            //     window.open(environment.ibcs.gisUrl, '_blank');
            // }
        }, error => {
            console.log(error);
        });;
    }

}
