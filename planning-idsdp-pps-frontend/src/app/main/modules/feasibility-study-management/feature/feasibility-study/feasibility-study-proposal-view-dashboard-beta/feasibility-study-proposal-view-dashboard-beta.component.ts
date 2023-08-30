import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from 'app/main/core/constants/constant';
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
} from "ng-apexcharts";
import {locale as lngEnglish} from '../../../../feasibility-study-management/feature/feasibility-study/feasibility-study-proposal-view-dashboard-beta/i18n/en';
import {locale as lngBangla} from '../../../../feasibility-study-management/feature/feasibility-study/feasibility-study-proposal-view-dashboard-beta/i18n/bn';
import {MatTableDataSource} from "@angular/material/table";
import {DashboardAttachmentModel} from '../../../models/dashboard-attachment.model';
import {IFeasibilityModel} from "../../../models/feasibility-study-proposal.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectMovementStageModel} from "../../../../dpp-tapp-management/models/project.movement.model";
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import {ActivatedRoute, Router } from '@angular/router';
import {FeasibilityStudyProposalSummaryService} from "../../../services/feasibility-study-proposal-summary.service";
import {DashboardAttachmentService} from '../../../services/dashboard-attachment.service';
import { ReportDataService } from 'app/main/shared/services/report-data.service';
import { ReportCommonService } from 'app/main/core/services/report-common.service';
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';
import {ProjectMovementService} from "../../../../dpp-tapp-management/services/project-movement.service";
import {FeedbackMovementService} from "../../../../../core/services/feedback-movement.service";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {ModeOfFinanceService} from "../../../services/mode-of-finance.service";
import {NgxBootstrapConfirmService} from "ngx-bootstrap-confirm";
import {OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../core/constants/message";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {CommentSourceEnum} from "../../../../project-concept-management/enums/comment-source.enum";
import {CommentObservationComponent} from 'app/main/modules/project-concept-management/features/project-concepts/comment-observation/comment-observation.component';
import {SendToDakComponent} from "../../../../../shared/components/send-to-dak/send-to-dak.component";
import {
    DeskUserMovementComponent
} from "../../../../../shared/components/desk-user-movement/desk-user-movement.component";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import { PotroJariComponent } from 'app/main/shared/components/potro-jari/potro-jari.component';
import {MatSelectChange} from "@angular/material/select";
import {ProjectSummariesService} from "../../../../../shared/services/project-summaries.service";


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
    selector: 'app-feasibility-study-proposal-view-dashboard-beta',
    templateUrl: './feasibility-study-proposal-view-dashboard-beta.component.html',
    styleUrls: ['./feasibility-study-proposal-view-dashboard-beta.component.scss']
})
export class FeasibilityStudyProposalViewDashboardBetaComponent implements OnInit {

    // chart design
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callDownloadGODialog') callDownloadGODialog: TemplateRef<any>;
    @ViewChild('callDownloadRelatedInfoDialog') callDownloadRelatedInfoDialog: TemplateRef<any>;

    totalNumber: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    dashboardAttachmentModels: DashboardAttachmentModel[] = new Array<DashboardAttachmentModel>();
    displayedColumns: string[] = ['id', 'name', 'progress', 'action'];
    dataSource = new MatTableDataSource(this.dashboardAttachmentModels);
    // fspSummary: FeasibilityStudyProposalSummaryModel = new FeasibilityStudyProposalSummaryModel();
    fspSummary: IFeasibilityModel;
    chartOptions: Partial<ChartOptions>;
    observer: 'A' | 'MD' | 'PC' = 'A';
    frmGroup: FormGroup;
    file: File;
    title: any;
    id: number;
    uuid: string;
    currentStage: string;
    projectMovementModel: ProjectMovementStageModel = new ProjectMovementStageModel();
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
    isPotroJariAttachMinistry: boolean = false;
    isPotroJariAttachPlanning: boolean = false;
    showButtonSendToNothi: boolean = false;
    showNothiButtonMOFAndTotalEstimatedCostIsEqual: boolean = false;
    projectStatus: string;
    projectStage: string;
    nothiStatus = 'Draft';
    potroJari: boolean = false;
    potroUrl = null;
    isNoteCompletetion: boolean = false;
    totalAmountModeOfFinance: number;
    modeOfFinanceTotal: number;
    modelOfFinanceList = [];

    movementStatusList = [];
    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    spinner: boolean;
    manualPotroJari: boolean;
    isPotroJariAttach: boolean;
    meetingAttachment: any;
    isInApproveMinistry: boolean;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
                private route: Router,
                private activatedRoute: ActivatedRoute,
                private dashboardAttachmentService: DashboardAttachmentService,
                private formBuilder: FormBuilder,
                private snackBar: SnackbarHelper,
                private _reportDataService: ReportDataService,
                private _reportCommonService: ReportCommonService,
                private userGroupService: UserGroupService,
                private projectMovementService: ProjectMovementService,
                private feedbackMovementService: FeedbackMovementService,
                private fileUploadService: FileUploadService,
                private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
                private modeOfFinanceService: ModeOfFinanceService,
                private projectSummariesService : ProjectSummariesService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.getUserGroup();
        // Get Value From Router
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
        });


        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
            summariesType : ['select']
        });

        this.getFeasibilityProposalSummary();
        if (this.id > 0) {
            this.getListDashboardAttachment();
        }

    }

    // for get Feasibility Proposal Summary
    private getFeasibilityProposalSummary() {
        this.feasibilityStudyProposalSummaryService.getFspSummaryByPcUuid(this.uuid).subscribe(res => {
            this.fspSummary = res;
            this.id = res.id;
            this.initChart(res);
            this.getListDashboardAttachment();
            this.getCurrentStage();
            this.loadMovementStatus();
            // this.getModeOfFinanceList();
        });
    }

    private initChart(res: IFeasibilityModel) {
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

    save() {
        const uuid = this.frmGroup.value.uuid;
        const title = this.frmGroup.value.title;
        if (uuid) {
            this.dashboardAttachmentService.updateDashboardAttachment(this.file, title, uuid, this.id).subscribe(res => {
                this.loadData();
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });

        } else {
            this.dashboardAttachmentService.createDashBoardAttachment(this.file, title, this.id).subscribe(res => {
                this.loadData();
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }


    loadData(): any {
        if (this.id > 0) {
            this.getListDashboardAttachment();
        }
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
        }, this.id).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content);
            this.totalNumber = res.totalElements;
        });
    }


    openUrl(row: any) {
        this.fileUploadService.downloadAttachmentInFsService(row.attachment.urlPath);
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

    showComments(commission: 'A' | 'MD' | 'PC' | 'PM') {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            sourceId: this.fspSummary.id,
            source: CommentSourceEnum.FS_PROPOSAL,
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

    editProjectSummary() {
        // this.route.navigate([`project-concept/add-project-concept/${this.uuid}`]);
    }

    navigateToList() {
        this.route.navigate(['feasibility-study']);
    }

    // goToReport() {
    //     this.feasibilityStudyProposalSummaryService.getFspSummaryByPcUuid(this.uuid).subscribe(res => {
    //         if (res) {
    //             this.route.navigate([`feasibility-study/report-view/${this.uuid}`]);
    //             this.dialog.closeAll();
    //         } else {
    //             this.snackBar.openWarnSnackBarWithMessage("Feasibility Study Proposal Report Not Found", "Ok");
    //         }
    //     });
    // }

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
            width: '460px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.frmGroup.reset();
        });
    }

    closeReportDownloadDialog() {
        this.dialog.closeAll();
    }


    // ================= For P. S. P. Report ========================

    isLoading: boolean;

    downloadFSPReport() {
        this.isLoading = true;
        this.dialog.closeAll();
        this._reportDataService.getFSPRReport(this.uuid).subscribe(
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


    /*Start Approval Process Flow*/

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        })
    }


    sendFsToNothi() {
        console.log('nothi');
        let srcUserGroup = this.setSourceOriginType();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            source: 'fs',
            sourceId: this.fspSummary.uuid,
            pcUuid: this.uuid,
            srcUserGroup: srcUserGroup
        };
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
        // projectMovementStageModel.fsProposalMasterId = this.fsProposalMasterId;
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
        const dialogRef = this.dialog.open(DeskUserMovementComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                let message = "";
                if (userGroupType === 'Agency') {
                    this.projectStatus = 'AGENCY DESK';
                    this.projectStage = 'IN AGENCY';
                    this.isReturnToAgencyDesk = false;
                    message = "Forwarded to Agency Desk Officer successfully";
                } else if (userGroupType === 'Ministry') {
                    this.isForwardToMinistryDesk = false;
                    this.projectStatus = 'MINISTRY DESK';
                    this.projectStage = 'IN MINISTRY';
                    message = "Forwarded to Ministry Desk Officer successfully";
                } else if (userGroupType === 'Planning_Commission') {
                    this.isForwardToPlanningDesk = false;
                    this.projectStatus = 'PLANNING DESK';
                    this.projectStage = 'IN PLANNING';
                    message = "Forwarded to Planning Commision Desk Officer successfully";
                }
                this.snackbarHelper.openSuccessSnackBarWithMessage(message, 'OK');
            }
        });
    }

    forwardToMinistry() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
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
        this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_DESK;
        this.deskUserMovement('Ministry');
    }

    toAgencyHead() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
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
        this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.AGENCY_DESK;
        this.deskUserMovement('Agency');
    }

    returnToMinistry() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
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
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isForwardToPlanningHead = false;
                this.isReturnToAgencyHead = false;
                this.showButtonSendToNothi = false;
                this.projectStatus = 'PLANNING HEAD';
                this.projectStage = 'IN PLANNING';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Planning successfully', 'OK');
            });
        });
    }

    forwardToPlanningDesk() {
        this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_COMMISSION_DESK;
        this.deskUserMovement('Planning_Commission');
    }

    forwardToPlanningMinister() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.PLANNING_MINISTER;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.showButtonSendToNothi = false;
                this.isReturnToMinistryHead = false;
                this.isForwardToPlanningMinister = false;
                this.projectStatus = 'PLANNING MINISTER';
                this.projectStage = 'IN PLANNING MINISTER';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to Minister successfully', 'OK');
            });
        });
    }


    approvedByPlanningMinister() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
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

    approvedByMinstry() {
        this.openDialogProjectMovement( res => {

            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.MINISTRY_APPROVED;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.projectStatus = 'APPROVED';
                this.projectStage = 'APPROVED BY MINISTRY';
                this.showButtonSendToNothi = false;
                this.isReturnToAgencyHead = false;
                this.isInApproveMinistry = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage('Approved By Ministry successfully', 'OK');
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage('Something Went Wrong', OK);
            });
        });
    }

    forwardToEcnec() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
            this.projectMovementModel.currentStage = ProjectMovementStageConstant.IN_ECNEC;
            this.projectMovementService.forward(this.projectMovementModel).subscribe(res => {
                console.log(res);
                this.isInPlanningMinister = false;
                this.isForwardToEcnec = false;
                this.isInEcnec = false;
                this.projectStatus = 'ECNEC';
                this.projectStage = 'IN ECNEC';
                this.snackbarHelper.openSuccessSnackBarWithMessage('Forwarded to ECNEC successfully', 'OK');
            });
        });
    }

    approvedByEcnec() {
        this.openDialogProjectMovement((res) => {
            this.projectMovementModel.fsProposalMasterId = this.fspSummary.id;
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


    getCurrentStage() {
        this.projectMovementService.getCurrentStageForFsProposal(this.fspSummary.id).subscribe(res => {
            this.projectStatus = res?.res?.currentStage ? res.res.currentStage.toString().split('_').join(' ') : 'AGENCY DESK';
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
        if (currentStage === ProjectMovementStageConstant.AGENCY_DESK || currentStage === ProjectMovementStageConstant.AGENCY_HEAD) {
            this.projectStage = 'IN AGENCY';
        } else if (currentStage === ProjectMovementStageConstant.MINISTRY_DESK || currentStage === ProjectMovementStageConstant.MINISTRY_HEAD) {
            this.projectStage = 'IN MINISTRY';
        } else if(currentStage === ProjectMovementStageConstant.MINISTRY_APPROVED){
            this.projectStage = 'APPROVED BY MINISTRY';
        }
        else if (currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || currentStage === ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            this.projectStage = 'IN PLANNING COMMISSION';
        } else if (currentStage === ProjectMovementStageConstant.PLANNING_MINISTER) {
            this.projectStage = 'IN PLANNING MINISTER';
        } else if (currentStage === ProjectMovementStageConstant.IN_ECNEC) {
            this.projectStage = 'IN ECNEC';
        } else if (currentStage === ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStage = 'APPROVED BY ECNEC';
        } else if (currentStage === ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStage = 'APPROVED BY PLANNING MINISTER';
        }
    }

    checkCurrentStage(response: any) {
        this.currentStage = response.res.currentStage;
        const currentStageUserId = response.res.userId;
        console.log(this.userGroup)


        if (this.currentStage === ProjectMovementStageConstant.AGENCY_DESK && (this.userGroup.groupStatus == 'AGENCY-DESK' || this.userGroup.groupStatus == 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId)
                this.isForwardToMinistryHead = true;
            this.showButtonSendToNothi = true;
        } else if (this.currentStage === ProjectMovementStageConstant.AGENCY_HEAD && (this.userGroup.groupStatus == 'AGENCY-HEAD' || this.userGroup.groupStatus == 'OTHER')) {
            this.isReturnToAgencyDesk = true;

        } else if (this.currentStage === ProjectMovementStageConstant.MINISTRY_HEAD && (this.userGroup.groupStatus === 'MINISTRY-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.isForwardToMinistryDesk = true;
        } else if (this.currentStage == ProjectMovementStageConstant.MINISTRY_DESK && (this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isReturnToAgencyHead = true;
                //this.isForwardToPlanningHead = true;
                this.showButtonSendToNothi = true;
                this.isPotroJariAttachMinistry = true;
            }
        } else if(this.currentStage == ProjectMovementStageConstant.MINISTRY_APPROVED){
            if(this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'MINISTRY-HEAD'){
                this.projectStatus = "APPROVED";
            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD && (this.userGroup.groupStatus === 'PLANNING-HEAD' || this.userGroup.groupStatus === 'OTHER')) {
            this.isForwardToPlanningDesk = true;
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK && (this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'OTHER')) {
            if (currentStageUserId === this.userGroup.userId) {
                this.isForwardToPlanningMinister = true;
                this.isReturnToMinistryHead = true;
                this.showButtonSendToNothi = true;
                this.isPotroJariAttachPlanning = true;
            }

        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER && (this.userGroup.groupStatus === 'PLANNING-MINISTER' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInPlanningMinister = true;
            //this.isForwardToEcnec = true;
        } else if (this.currentStage == ProjectMovementStageConstant.IN_ECNEC && (this.userGroup.groupStatus === 'ECNEC' || this.userGroup.groupStatus === 'OTHER')) {
            this.isInEcnec = true;
        } else if (this.currentStage == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            this.projectStatus = "APPROVED";
        } else if (this.currentStage == ProjectMovementStageConstant.ECNEC_APPROVED) {
            this.projectStatus = "APPROVED";
        }
        else if (this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI) {
            this.projectStatus =  "Potro Jari Attached";
            this.projectStage = 'IN AGENCY';
            this.getMeetingAttachment(response.res.id);
            if (this.userGroup.groupStatus == 'AGENCY-DESK' || this.userGroup.groupStatus == 'AGENCY-HEAD') {
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardToMinistryHead = true;
                    //this.showButtonSendToNothi = true;
                    this.manualPotroJari = true;
                } else {
                    this.isForwardToMinistryHead = true;
                    this.manualPotroJari = true;
                }

            }
        }
        else if (this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY){
            this.projectStatus =  "Potro Jari Attached";
            this.projectStage = 'IN MINISTRY';
            this.getMeetingAttachment(response.res.id);
            if(this.userGroup.groupStatus === 'MINISTRY-DESK' || this.userGroup.groupStatus === 'MINISTRY-HEAD' ){
                if (currentStageUserId === this.userGroup.userId) {
                    this.isReturnToAgencyHead = true;
                    if(this.fspSummary.totalAmount>500){
                        this.isForwardToPlanningHead = true;
                    }
                    else{
                        this.isInApproveMinistry = true;
                    }

                }
                else{
                    this.isReturnToAgencyHead = true;
                    if(this.fspSummary.totalAmount>500){
                        this.isForwardToPlanningHead = true;
                    }
                    else{
                        this.isInApproveMinistry = true;
                    }

                }
            }
        }
        else if(this.currentStage == ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM){
            this.projectStatus =  "Potro Jari Attached";
            this.projectStage = 'IN PLANNING';
            this.getMeetingAttachment(response.res.id);

            if(this.userGroup.groupStatus === 'PLANNING-DESK' || this.userGroup.groupStatus === 'PLANNING-HEAD' ){
                if (currentStageUserId === this.userGroup.userId) {
                    this.isForwardToPlanningMinister = true;
                    this.isReturnToMinistryHead = true;
                }
                else{
                    this.isForwardToPlanningMinister = true;
                    this.isReturnToMinistryHead = true;
                }
            }
        }
        this.getModeOfFinanceList();
    }

    waitToGetUserGroup(callBack) {
        console.log("awaiting");
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            console.log(res)
            callBack(true);
        })
    }

    loadMovementStatus() {
        const fs_uuid = this.uuid;
        const srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup, null, fs_uuid, null, null).subscribe(res => {
            console.log(res);
            if (res.message == 'Got Feedback') {
                this.movementStatusList = res.result;
                if (res.result[0].nothi_message != null) {
                    //this.projectStatus=res.result[0].nothi_message;
                } else if (res.result[0].decision_note != null) {
                    this.nothiStatus = res.result[0].decision_note;
                }
            } else if (res.message == 'No Feedback')
                this.nothiStatus = 'Submitted as a Daak to E-Nothi';
            else if (res.message == 'Daak is not submitted')
                this.nothiStatus = this.nothiStatus;
            else
                this.nothiStatus = 'AGENCY';


            //potro jari
            if (res.result[0].nothi_action == 4) {
                this.potroJari = true;
                this.potroUrl = res.result[0].potro_url;
            }
            //note
            if (res.result[0].nothi_action == 3) {
                this.isNoteCompletetion = true;
            }
        })

    }

    /*End Approval Process Flow*/

    private openDialogProjectMovement(callback) {
        let options = {
            title: 'Are you sure that you want to Forward this Project?',
            confirmLabel: 'Okay',
            declineLabel: 'Cancel',
        };
        this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
            if (res) {
                callback(true);
            } else {
            }
        });
    }


    // for get ModeOfFinanceList
    private getModeOfFinanceList() {
        this.modeOfFinanceService.getModeOfFinanceListByFsProposalSummary(this.fspSummary.id, DEFAULT_PAGE, MAX_PAGE_SIZE).subscribe(res => {
            this.modelOfFinanceList = res.content;
            this.modeOfFinanceTotal = res.content?.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
            this.getTotalModeData();
        })
    }

    getTotalModeData() {
        this.totalAmountModeOfFinance = this.modelOfFinanceList.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
        if (this.fspSummary.totalAmount === this.totalAmountModeOfFinance) {
            this.showNothiButtonMOFAndTotalEstimatedCostIsEqual = true;
        }
    }

    savePotroJari(){
        console.log("save feasibility");
        this.projectMovementModel.fsProposalMasterId=this.fspSummary.id;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI; const dialogConfigPotroJari = new MatDialogConfig();
        this.projectMovementModel.userId = this.userGroup.userId;
        dialogConfigPotroJari.disableClose = false;
        dialogConfigPotroJari.autoFocus = false;
        dialogConfigPotroJari.width = '50%';
        dialogConfigPotroJari.height = 'auto';
        dialogConfigPotroJari.data = {
            message: 'Attached Potrojari successfully',
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
                this.projectStage = 'IN AGENCY';
            }

        })
    }

     /*
        agEncY SaVe Potrojari
    */

    downloadMeetingAttachment(urlPath){
        this.fileUploadService.downloadAttachmentInDppService(urlPath);
    }

    getMeetingAttachment(ProjectMovementStageId) {
        console.log(ProjectMovementStageId);
        this.projectMovementService.getProjectMovementAttachment(ProjectMovementStageId).subscribe(res => {
            if (res) {
                //this.isDownloadMeetingAttachment = true;
                this.meetingAttachment = res;
            }

        });
    }

    savePotroJariMinistry(){

        this.projectMovementModel.fsProposalMasterId=this.fspSummary.id;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY;
        this.projectMovementModel.userId = this.userGroup.userId;
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
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.isPotroJariAttach = false;
                this.manualPotroJari = true;
                this.isPotroJariAttachMinistry = false;
                this.showButtonSendToNothi = false;
                this.projectStage = 'IN MINISTRY';
            }

        })
    }

    /*
        minIstrY SaVe Potrojari
    */

    savePotroJariPlanning(){

        this.projectMovementModel.fsProposalMasterId=this.fspSummary.id;
        this.projectMovementModel.currentStage = ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM;
        this.projectMovementModel.userId = this.userGroup.userId;
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
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.isPotroJariAttach = false;
                this.manualPotroJari = true;
                this.isPotroJariAttachPlanning = false;
                this.showButtonSendToNothi = false;
                this.projectStage = 'IN PLANNING';
            }

        })
    }

    /*
        pLANcOMM SaVe Potrojari
    */
    gotoProjectSummaries() {
        this.route.navigate(['feasibility-study/project-summaries/' + this.uuid])
    }

    getProjectSummaries($event: MatSelectChange){
        if($event.value){
            if($event.value == 'select'){

            }else{
                this.projectSummariesService.getProjectSummaries(this.uuid, $event.value).subscribe(res =>{
                    if(res.status == 0){
                        this.snackbarHelper.openWarnSnackBarWithMessage("Project Summaries Not Created !", "OK")
                    }else{
                        if($event.value == 'FOR_PLANCOM_FS' || $event.value == 'FOR_MINISTRY_FS'){
                            this.spinner = true;
                            this._reportDataService.getSummaryReportByUrl(this.uuid, $event.value).subscribe(
                                res => {
                                    this._reportCommonService.previewReport(res, "PDF");
                                    this.spinner = false;
                                },
                                err => {
                                    this.snackbarHelper.openWarnSnackBarWithMessage("Report Not Found !", "OK")
                                    console.log(err);
                                    this.spinner = false;
                                }
                            );
                        }
                    }
                })
            }
        }
    }

    summarySelectChange() {

    }
}
