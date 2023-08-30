import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {environment} from "../../../../../../../environments/environment";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ApiService} from "../../../../../core/services/api/api.service";
import {ToastrService} from "ngx-toastr";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LatterService} from "../../../services/latter.service";
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {
    addNewIcon,
    deleteFailed,
    deleteIcon,
    deleteSuccess,
    editIcon,
    moneyIcon,
    uploadIcon,
    viewIcon
} from '../../../constants/button.constants';
import {AgreementWithResearcherServiceService} from "../../../services/agreement-with-researcher-service.service";
import {MatSelectChange} from '@angular/material/select';
import {AgreementWithResearcherModel} from '../../../models/AgreementWithResearcherModel';
import {StatusModel} from '../../../models/StatusModel';
import {FiscalYearServiceService} from 'app/main/modules/settings/services/fiscal-year-service.service';
import {ResearchCategoryTypeService} from 'app/main/modules/settings/services/research-category-type.service';
import {AuthService} from "../../../../auth/services/auth.service";
@Component({
    selector: 'app-agreement-process-list',
    templateUrl: './agreement-process-list.component.html',
    styleUrls: ['./agreement-process-list.component.scss']
})
export class AgreementProcessListComponent implements OnInit {
    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    uploadIcon = uploadIcon;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    moneyIcon = moneyIcon;
    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit
    dataSet = new Array<{
        id: any;
        uuid: any;
        researcherTitle: any;
        researcherName: any;
        fiscalYear: any;
        category: any;
        researchStartAndEndTime: any;
        totalInstallment: any;
        agreementId: any;
        approvalStatus: any;
        researcherProposalId: any;
        researchStartDate: any;
        researchEndDate: any;
    }>();
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    displayedColumnsDo: string[] = ['sl', 'researcherTitleAndName', 'category', 'researchStartAndEndTime', 'totalInstallment', 'approvalStatus', 'agreementId', 'action'];
    displayedColumnsRes: string[] = ['sl', 'researcherTitleAndName', 'category', 'researchStartAndEndTime', 'totalInstallment', 'approvalStatus', 'action'];
    dataSource: any;
    dataSourceFull: any;
    baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector-selection/';
    fiscalYearList = [];
    userList = [];
    sectorTypeList = [];
    researchCategoryList = [];
    subSectorTypeListStore = [];
    agreementWithResearcherModel: AgreementWithResearcherModel = new AgreementWithResearcherModel();
    statusModel: StatusModel = new StatusModel();
    userType: any
    userDetails: any
    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _agreementWithResearcherServiceService: AgreementWithResearcherServiceService,
        private _latterService: LatterService,
        private _router: Router,
        private fiscalyearservice: FiscalYearServiceService,
        private researchcategory: ResearchCategoryTypeService,
        private auth_service: AuthService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }
    ngOnInit(): void {
        this.userType = this.auth_service.getLoggedUserType();
        this.userDetails = this.auth_service.getLoggedUserDetails()
        this.spinner = true;
        this.getUsers()
        this.getAgreementList();
        this.getFiscalyearList();
        this.getResearchCategoryList();
    }
    getUsers() {
        this._agreementWithResearcherServiceService.getUser().subscribe(res => {
            if (res) {
                this.userList = res;
            }
        })
    }
    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getAgreementList();
    }
    /*---- For open popup dialog box----*/
    private openDialog(id: string) {
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
                this._agreementWithResearcherServiceService.deleteAgreement(id).subscribe(res => {
                    if (res.success) {
                        this.toastr.success(this.deleteSuccess);
                        this.getAgreementList();
                    } else {
                        this.toastr.error(this.deleteFailed);
                    }
                }, err => {
                    this.toastr.error("Something went wrong!");
                })
            }
            dialogRef.close(true);
        });
    }
    //for update status
    private openDialogForStatus($event: MatSelectChange, data, proposal, uuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        let status = 'Are you sure that you want to ';
        if ($event.value == 0) {
            dialogConfig.data = {message: status + 'Pending?'};
        } else if ($event.value == 1) {
            dialogConfig.data = {message: status + 'Approved?'};
        }else if ($event.value == 2) {
            dialogConfig.data = {message: status + 'Rejected?'};
        }else if ($event.value == 3) {
            dialogConfig.data = {message: status + 'Query?'};
        }
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.status($event, data, proposal, uuid)
            } else {
                this.getAgreementList()
            }
            dialogRef.close(true);
        });
    }
    editRow(id: string) {
        this._router.navigate(['/agreement-process/' + id + '/edit'])
    }
    viewDetails(row: any) {
        let aggUuid = row.uuid;
        let researcherProfileUuid = row?.researcherProposalId?.researcherProfilePersonalInfoMaster?.uuid;
        let userId = row?.researcherProposalId?.researcherProfilePersonalInfoMaster?.userId
        //console.log('row = ', row)
        this._router.navigate(['agreement-process/' + aggUuid + '/view/'+researcherProfileUuid+'/'+userId])
    }
    submitInstallment(proposalUuid) {
        this._router.navigate(['installment-process/add/' + proposalUuid]);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    addNew() {
        this._router.navigate(['/agreement-process/add'])
    }
    private getAgreementList() {
        this.dataSet = [];
        this._agreementWithResearcherServiceService.getAgreementsList(this.page, this.pageSize).subscribe(value => {
            this.dataSourceFull = value?.page?.content;
            value?.page?.content.forEach(item => {
                if (this.userDetails.userType != 'Rms_DO') {
                    if (+this.userDetails.id === +item.researcherProposalId.researcherProfilePersonalInfoMaster.userId) {
                        this.dataSet.push({
                            id: item.id,
                            uuid: item.uuid,
                            researcherTitle: item.researcherProposalId.researchTitle,
                            researcherName: item.researcherProposalId.researcherProfilePersonalInfoMaster.userId,
                            fiscalYear: item.researcherProposalId.stFiscalYearId,
                            category: item.researcherProposalId.stResearchCatTypeId,
                            researchStartAndEndTime: item.researchStartDate + '-' + item.researchEndDate,
                            totalInstallment: item.installmentNo + ' (' + item.totalGrantAmount + 'tk)',
                            agreementId: item.id,
                            approvalStatus: item.approvalStatus,
                            researcherProposalId: item.researcherProposalId,
                            researchStartDate: item.researchStartDate,
                            researchEndDate: item.researchEndDate,
                        })
                    }
                } else {
                    this.dataSet.push({
                        id: item.id,
                        uuid: item.uuid,
                        researcherTitle: item.researcherProposalId.researchTitle,
                        researcherName: item.researcherProposalId.researcherProfilePersonalInfoMaster.userId,
                        fiscalYear: item.researcherProposalId.stFiscalYearId,
                        category: item.researcherProposalId.stResearchCatTypeId,
                        researchStartAndEndTime: item.researchStartDate + '-' + item.researchEndDate,
                        totalInstallment: item.installmentNo + ' (' + item.totalGrantAmount + 'tk)',
                        agreementId: item.id,
                        approvalStatus: item.approvalStatus,
                        researcherProposalId: item.researcherProposalId,
                        researchStartDate: item.researchStartDate,
                        researchEndDate: item.researchEndDate,
                    })
                }
            })
            this.totalElements = this.dataSet.length;
            this.dataSource = new MatTableDataSource(this.dataSet);
        }, error => {
        })
    }
    uploadFile(id) {
        this._router.navigate(['/agreement-file/' + id + '/upload'])
    }
    status($event: MatSelectChange, data, proposal, uuid) {
        let status = $event.value
        this.statusModel.id = data;
        this.statusModel.infoId = proposal;
        this.statusModel.approvalStatus = status;
        this.statusModel.uuid = uuid;
        this._agreementWithResearcherServiceService.updateStatus(this.statusModel).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getAgreementList();
            } else {
                this.toastr.error(res.message, "", this.config);
            }
        });
    }
    getFiscalyearList() {
        this.fiscalyearservice.getAll().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
            }
        );
    }
    getResearchCategoryList() {
        this.researchcategory.geResearchCategorytList().subscribe(res => {
            if (res.success) {
                this.researchCategoryList = res.items;
            }
        });
    }
}
