import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ProjectSummaryService} from '../../../services/project-summary.service';

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
import {CommentObservationComponent} from '../comment-observation/comment-observation.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PageEvent} from '@angular/material/paginator';
import {DEFAULT_PAGE} from '../../../../../core/constants/constant';
import {DashboardAttachmentService} from '../../../services/dashboard-attachment.service';
import {DashboardAttachmentModel} from '../../../models/dashboard-attachment.model';
import {SnackbarHelper} from '../../../../../core/helper/snackbar.helper';
import {OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from '../../../../../core/constants/message';
import {ConfirmDialogConstant} from '../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ProcurementMethodModel} from '../../../../configuration-management/models/procurement-method.model';
import {ActivatedRoute, Router} from "@angular/router";
import {IProjectConcept} from '../../../models/project-concept';
import {EnothiDakSubmissionService} from 'app/main/core/services/enothi-dak-submission.service';
import {DatePipe} from '@angular/common';
import {SendToDakComponent} from '../../../../../shared/components/send-to-dak/send-to-dak.component';
import {FeedbackMovementService} from 'app/main/core/services/feedback-movement.service';
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {SubSectorModel} from "../../../../configuration-management/models/sub-sector.model";
import {SectorDivisionModel} from "../../../../configuration-management/models/sector-division.model";
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {
    ProjectMovementService,
    ProjectMovementService as StageMovementService
} from "../../../../dpp-tapp-management/services/project-movement.service";
import {SubSectorService} from "../../../../configuration-management/services/sub-sector.service";
import {SectorDivisionService} from "../../../../configuration-management/services/sector-division.service";
import {CommentSourceEnum} from "../../../enums/comment-source.enum";
import {IAgency} from "../../../../configuration-management/models/agency";
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {locale as lngEnglishAction} from "../../../../../../layout/layouts/vertical/classy/i18n/en";
import {ClassyLayoutComponent} from "../../../../../../layout/layouts/vertical/classy/classy.component";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";

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
    selector: 'app-project-concept-edit-dashboard',
    templateUrl: './project-concept-edit-dashboard.component.html',
    styleUrls: ['./project-concept-edit-dashboard.component.scss']
})
export class ProjectConceptEditDashboardComponent implements OnInit {

    // chart design
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

    procurementMethodList: ProcurementMethodModel[] = new Array<ProcurementMethodModel>();
    size: number = 2;
    page: number = DEFAULT_PAGE;
    total: number;

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
    commencementDate: string;
    completionDate: string;
    movementStatusList = [];
    projectStatus: string;
    projectStage: string;
    nothiStatus: string = '';
    userGroup:{
        'groupStatus':null,
        'userId':null
    };
    userGroupModel: any;
    sector: SectorModel;
    subSector: SubSectorModel;
    sectorDivision: SectorDivisionModel;
    agencyModel: IAgency;
    actionPermission = [];
    show = true;
    pcMasterId: number;
    potroJari:boolean=false;
    potroUrl=null;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private sectorService: SectorService,
                private stageMovementService: StageMovementService,
                private subSectorService: SubSectorService,
                private agencyService: AgencyService,
                private sectorDivisionService: SectorDivisionService,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
                private route: Router,
                private activatedRoute: ActivatedRoute,
                private dashboardAttachmentService: DashboardAttachmentService,
                private formBuilder: FormBuilder,
                private classyLayoutComponent: ClassyLayoutComponent,
                private enothiDakSubmissionService: EnothiDakSubmissionService,
                private feedbackMovementService: FeedbackMovementService,
                private fileUploadService: FileUploadService,
                private datePipe: DatePipe,
                private projectMovementService: ProjectMovementService,
                private userGroupService: UserGroupService) {
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
            console.log('uuid = ' + this.uuid);
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


    loadProjectConceptMasterId() {
        this.projectSummaryService.getByUuid(this.uuid).subscribe(res => {
            if (res) {
                this.pcMasterId = res.id;
                this.getCurrentStage();
                this.loadMovementStatus();
            }
        });
    }

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
            }
            console.log(this.projectStatus);
        });
    }

    loadMovementStatus(){
        const pc_uuid = this.uuid;
        let srcUserGroup = this.setSourceOriginType();
        this.feedbackMovementService.getFeedbackById(srcUserGroup,pc_uuid,null,null,null).subscribe(res=>{console.log(res);
            if(res.message=='Got Feedback'){
                this.movementStatusList = res.result;
                if(res.result[0].nothi_message!=null){
                    //this.projectStatus=res.result[0].nothi_message;
                }
                else if(res.result[0].decision_note!=null){
                    this.nothiStatus=res.result[0].decision_note;
                }
            }
            else if(res.message=='No Feedback')
                this.nothiStatus = this.projectStatus + 'Submitted as a Daak to E-Nothi' ;
            else if(res.message=='Daak is not submitted')
                this.nothiStatus = this.projectStatus;
            else
                this.nothiStatus = 'AGENCY';

            //potro jari
            if(res.result[0].nothi_action==4){
                this.potroJari = true;
                this.potroUrl = res.result[0].potro_url;
            }
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
            this.userGroup = res.res.groupStatus;
        })
    }

    getProjectStage(id) {
        this.stageMovementService.getCurrentStageInPc(id).subscribe(async res => {
            if(res.res){
                this.projectStage = res.res.currentStage ? (res.res.currentStage).toString().replace('_', ' ') : 'IN AGENCY';
            }
        });
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
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
          //  this.getProjectStage(res.id);
            this.getUserGroupByUserId();
        });
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
            userGroup: this.userGroup
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
        this.route.navigate([`project-concept/add-project-concept/${this.uuid}/${true}`]);
    }

    getUserGroupByUserId() {
        this.userGroupService.getUserGroupByUserId().subscribe(res => {
            this.userGroupModel = res;
            if (res && this.userGroupModel.ministryDivision) {
                this.getAgency();
            }
        });
    }

    sendProjectConceptToNothi() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {source: 'pc', sourceId: this.uuid};
        const dialogRef = this.dialog.open(SendToDakComponent, dialogConfig);

        /*  console.log('nothi');
          this.enothiDakSubmissionService.submitDak('project concept').subscribe(res=>{console.log(res)
              if(res){
                  this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DAK_SUBMITTED, OK);
              }

          });*/
    }

    setSourceOriginType(): string {
        let userGroup: string = this.userGroup.groupStatus;
        return userGroup.toString().substring(0, userGroup.indexOf('-'));
    };

    navigateToList() {
        this.route.navigate(['project-concept']);

    }

    gotToViewDashboard() {
        this.route.navigate([`project-concept/view-dashboard/${this.uuid}`]);
    }
}
