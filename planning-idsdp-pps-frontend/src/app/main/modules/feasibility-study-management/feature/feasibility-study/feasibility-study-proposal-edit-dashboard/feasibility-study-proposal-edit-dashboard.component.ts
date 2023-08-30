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
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SnackbarHelper} from '../../../../../core/helper/snackbar.helper';
import {ActivatedRoute, Router} from '@angular/router';
import {locale as lngEnglish} from '../../../../feasibility-study-management/feature/feasibility-study/feasibility-study-proposal-edit-dashboard/i18n/en';
import {locale as lngBangla} from '../../../../feasibility-study-management/feature/feasibility-study/feasibility-study-proposal-edit-dashboard/i18n/bn';
import {
    ERROR,
    OK,
    SUCCESSFULLY_DAK_SUBMITTED,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_UPDATED
} from '../../../../../core/constants/message';
import {PageEvent} from '@angular/material/paginator';
import {ConfirmDialogConstant} from '../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {DashboardAttachmentModel} from '../../../models/dashboard-attachment.model';
import {FeasibilityStudyProposalSummaryService} from '../../../services/feasibility-study-proposal-summary.service';
import {DashboardAttachmentService} from '../../../services/dashboard-attachment.service';
import {CommentObservationComponent} from '../comment-observation/comment-observation.component';
import {IFeasibilityModel} from "../../../models/feasibility-study-proposal.model";
import {EnothiDakSubmissionService} from 'app/main/core/services/enothi-dak-submission.service';
import {FeedbackMovementService} from 'app/main/core/services/feedback-movement.service';
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import {ProjectMovementService} from "../../../../dpp-tapp-management/services/project-movement.service";


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
  selector: 'app-feasibility-study-proposal-edit-dashboard',
  templateUrl: './feasibility-study-proposal-edit-dashboard.component.html',
  styleUrls: ['./feasibility-study-proposal-edit-dashboard.component.scss']
})
export class FeasibilityStudyProposalEditDashboardComponent implements OnInit {

    // chart design
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

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
    projectStatus: string;
    projectStage: string;
    nothiStatus = 'Draft';
    potroJari: boolean = false;
    potroUrl = null;
    isNoteCompletetion:boolean=false;
    movementStatusList = [];
    userGroup: string;
    usergroup:{
        'groupStatus':null,
        'userId':null
    };


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
                private route: Router,
                private activatedRoute: ActivatedRoute,
                private dashboardAttachmentService: DashboardAttachmentService,
                private formBuilder: FormBuilder,
                private enothiDakSubmissionService: EnothiDakSubmissionService,
                private feedbackMovementService : FeedbackMovementService,
                private fileUploadService : FileUploadService,
                private projectMovementService: ProjectMovementService,
                private userGroupService: UserGroupService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        // Get Value From Router
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
        });


        this.frmGroup = this.formBuilder.group({
            title: ['', Validators.required],
            attachmentId: ['', Validators.required],
            uuid: [''],
        });

        this.getFeasibilitySummary();
        if(this.id > 0) {
            this.getListDashboardAttachment();
        }

    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        })
    }

    // for get Feasibility Proposal Summary
    private getFeasibilitySummary() {
        this.feasibilityStudyProposalSummaryService.getFspSummaryByPcUuid(this.uuid).subscribe(res => {
            this.fspSummary = res;
            this.id = res.id;
            this.initChart(res);
            this.getListDashboardAttachment();
            this.getCurrentStage();
            this.loadMovementStatus();
        });
    }

    // for const info chart
    private initChart(res: IFeasibilityModel) {
        const gobAmount = Number(res.gobAmount.toFixed(2));
        const paAmount = Number(res.paAmount.toFixed(2));
        const ownFundAmount = Number(res.ownFundAmount.toFixed(2));
        const otherAmount = Number(res.otherAmount.toFixed(2));
        this.chartOptions = {
            series: [gobAmount, paAmount, ownFundAmount, otherAmount],
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
                                label: 'Total Cost',
                                formatter: function (w) {
                                    return (gobAmount + paAmount + ownFundAmount + otherAmount).toFixed(2);
                                }
                            }
                        }
                    }
                }
            },
            labels: ['GoB (' + gobAmount + ')', 'Project Aid (' + paAmount + ')', 'Own Fund (' + ownFundAmount + ')', 'Other (' + otherAmount + ')'],
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
        if(this.id > 0) {
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

    showComments(commission: 'A' | 'MD' | 'PC') {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {projectConcept: this.uuid, commission: commission, userGroup: this.userGroup};;
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

    editFeasibilityProposalSummary() {
        this.route.navigate([`feasibility-study/add-feasibility-study-proposal/${this.uuid}`]);
    }


    sendProjectConceptToNothi(){
        console.log('nothi');
        this.enothiDakSubmissionService.submitDak('feasability study').subscribe(res=>{console.log(res)
            if(res){
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DAK_SUBMITTED, OK);
            }
            else if(res.status=='error')
                this.snackbarHelper.openErrorSnackBarWithMessage(res.message, OK)
        },(error)=>{
            this.snackbarHelper.openErrorSnackBarWithMessage(error.message, 'OK');
        });


    }

    navigateToList() {
        this.route.navigate(['feasibility-study']);

    }
    setSourceOriginType(): string {
        let userGroup: string = this.usergroup.groupStatus;
        return userGroup.toString().substring(0, userGroup.indexOf('-'));
    };

    loadMovementStatus() {
        const fs_uuid = this.uuid;
        const srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup,null, fs_uuid, null, null).subscribe(res => {
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
            if(res.result[0].nothi_action==3){
                this.isNoteCompletetion=true;
            }
        })

    }

    getCurrentStage() {
        console.log('this.fspSummary.id');
        console.log(this.fspSummary.id);
        this.projectMovementService.getCurrentStageForFsProposal(this.fspSummary.id).subscribe(res => {
            console.log('res');
            console.log(res);
            this.projectStatus = res?.res?.currentStage ? res.res.currentStage.toString().split('_').join(' ') : 'AGENCY DESK';
            this.checkProjectStage(res.res.currentStage);
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
    }
}
