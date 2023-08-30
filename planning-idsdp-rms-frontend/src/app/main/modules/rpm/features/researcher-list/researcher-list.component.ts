import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
//----Lng Translation----
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ExpertEvaluator } from 'app/main/modules/settings/models/expert-evaluator.model';
import { ExpertEvaluatorService } from 'app/main/modules/settings/services/expert-evaluator.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { ResearchCategoryTypeService } from 'app/main/modules/settings/services/research-category-type.service';
import { SectorTypeService } from 'app/main/modules/settings/services/sector-type.service';
import {
    SubmitConfirmationDialogComponent
} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment,reportBackend } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { addNewIcon, deleteIcon, downloadIcon, editIcon, pdfIcon, viewIcon } from '../../constants/button.constants';
import { ResearcherCategoryType } from "../../enums/enum-list.enum";
import { FiscalYearWiseDocFilesModel } from "../../models/FiscalYearWiseDocFilesModel";
import { FiscalYearWiseDocFilesService } from '../../services/fiscal-year-wise-doc-files.service';
import { JasperServiceService } from "../../services/jasper-service.service";
import { ResearchProfileMultiFormService } from '../../services/research-profile-multi-form.service';
import { ResearcherListService } from '../../services/researcher-list.service';
import { ResearcherProposalService } from '../../services/researcher-proposal.service';
import {
    ProposalEligibilityCheckModalComponent
} from '../researcher-proposal/proposal-eligibility-check-modal/proposal-eligibility-check-modal.component';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
import * as bl2Js from 'bl2-js-report';

/*export interface CommonTbl {
  uuid: any;
  stFiscalYearId: any;
  stSectorTypeId: any;
  stSubSectorId: number;
  active: boolean;
}*/
@Component({
    selector: 'app-researcher-list',
    templateUrl: './researcher-list.component.html',
    styleUrls: ['./researcher-list.component.scss']
})
export class ResearcherListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit
    spinner2: boolean = false;
    isProposal: boolean = false;
    scope: string = "";
    formSubmit: boolean;

    dataPDF:any ={};

    dataSet = new Array<{
        uuid: any;
        stFiscalYearId: any;
        stSectorTypeId: any;
        stSubSectorId: number;
        active: boolean;

        researcher_name: '',
        research_title: '',
        st_fiscal_year_id: '',
        st_research_cat_type_id: '',
        st_sector_type_id: '',
        proposal: '',
        ProfileProposalMarks: '',
        ApprovalStatus: '',
        Action: '',

    }>();


    approvalStatusList = [
        { id: 1, value: 'Approved' },
        { id: 2, value: 'Not Approved' },
        { id: 3, value: 'Panding' },
        { id: 4, value: 'Cancaled' },
        { id: 5, value: 'Completed' },
        { id: 6, value: 'Not Approved' },
        { id: 6, value: 'Defaulter' },
        { id: 7, value: 'Final Report Submit' },

    ];


    //dataSet: CommonTbl[] = new Array<CommonTbl>();

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    //displayedColumns: string[] = ['sl', 'researcher_name', 'research_title', 'st_fiscal_year_id', 'st_research_cat_type_id', 'st_sector_type_id', 'ProfileProposalMarks', 'ApprovalStatus', 'action'];
    displayedColumns: string[] = ['sl', 'researcher_name', 'st_research_cat_type_id', 'st_sector_type_id', 'ProfileProposalMarks', 'ApprovalStatus', 'action'];
    displayedColumnsSecond: string[] = ['sl', 'researcher_name', 'st_research_cat_type_id', 'st_sector_type_id', 'ProfileProposalMarks', 'ApprovalStatus', 'action'];
    //dataSource: any;
    "content": [
        {
            "id": 2,
            "uuid": "0dcb7b2c-8c8c-40c2-9a24-a5ca2dc8b0a7",
            "templateType": "First Installment",
            "active": true
        },
        {
            "id": 1,
            "uuid": "0d8a8531-6ef2-4cad-967f-70b0611cd956",
            "templateType": "Template Type-1",
            "active": true
        }
    ];

    dataSource: any = [
        {
            researcher_name: '',
            research_title: '',
            st_fiscal_year_id: '',
            st_research_cat_type_id: '',
            st_sector_type_id: '',
            proposal: '',
            ProfileProposalMarks: '',
            ApprovalStatus: '',
            Action: '',
        },
        {
            researcher_name: '',
            research_title: '',
            st_fiscal_year_id: '',
            st_research_cat_type_id: '',
            st_sector_type_id: '',
            proposal: '',
            ProfileProposalMarks: '',
            ApprovalStatus: '',
            Action: '',
        }
    ];

    baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector-selection/';


    sectorTypeList = [];
    subSectorTypeListStore = [];

    fiscalYearList: any[] = [];
    researcherList: any[] = [];
    researchTitleList: any[] = [];
    researchCategoryTypeList: any[] = [];
    docFileList: any[] = [];
    file: File;

    sendData: { stFiscalYearId: number, profileId: number } = { stFiscalYearId: null, profileId: null }
    sendDataForGrid: {

        stFiscalYearId: number,
        profileId: number,
        proposalId: number,
        stResearchCatTypeId: number,
        approvalStatus: number,
        userId: number,
        stProfileOfExpertEvaluatorsId: number,
        isFinalSubmit: boolean,
        orderBy: string,

        pageableRequestBodyDTO: {
            page: number,
            size: number
        }

    } = {
            stFiscalYearId: null,
            profileId: null,
            proposalId: null,
            stResearchCatTypeId: null,
            approvalStatus: null,
            userId: null,
            stProfileOfExpertEvaluatorsId: null,
            isFinalSubmit: null,
            orderBy: null,

            pageableRequestBodyDTO: {
                page: this.page,
                size: this.pageSize
            }

        };

    fiscalYearWiseDocFilesModel: FiscalYearWiseDocFilesModel = new FiscalYearWiseDocFilesModel();
    userDetails: { id: null, userId: null, name: null, userType: null, emailId: null, designation: null, mobileNumber: null, isActive: false, isInstitutional: false };

    canExpand: boolean;
    data = {};
    downloadIcon = downloadIcon;
    pdfIcon = pdfIcon;
    evaluatortype: number;
    loagedEvaluator : ExpertEvaluator = new ExpertEvaluator();
    langVal: string;

    storeValForReport:any;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private _fiscalYearService: FiscalYearServiceService,
        private _researcherListService: ResearcherListService,
        private _researchCategoryTypeService: ResearchCategoryTypeService,
        private _sectorTypeService: SectorTypeService,
        private _route: Router,
        private _dialog: MatDialog,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private _researcherProposalService: ResearcherProposalService,
        private _fiscalYearWiseDocFilesService: FiscalYearWiseDocFilesService,
        private storageService: StorageService,
        private expertEvaluatorService: ExpertEvaluatorService,
        private jasperService: JasperServiceService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.totalElements = this.dataSet.length;
        this.dataSource = new MatTableDataSource(this.dataSet);

        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });

    }

    ngOnInit(): void {
        this.checkValidity();

        this.spinner = false;

        this.frmGroup = this.formBuilder.group({
            stFiscalYearId: [''],
            profileId: [''],
            proposalId: [''],
            stResearchCatTypeId: [''],
            approvalStatus: [''],
            orderBy: [''],
        });

        this.userDetails = this.storageService.getUserData();
        this.getSectorTypeList();
        this.onInit();
        this.getFiscalYearList();
        this.getResearchCategoryTypeList();
    }


    onSubmit() {
        const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
        const profileId = this.frmGroup.value.profileId;
        const proposalId = this.frmGroup.value.proposalId;
        const stResearchCatTypeId = this.frmGroup.value.stResearchCatTypeId;
        const approvalStatus = this.frmGroup.value.approvalStatus;
        const orderBy = this.frmGroup.value.orderBy;

        this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
        this.sendDataForGrid.profileId = profileId ? profileId : null;
        this.sendDataForGrid.proposalId = proposalId ? proposalId : null;
        this.sendDataForGrid.stResearchCatTypeId = stResearchCatTypeId ? stResearchCatTypeId : null;
        this.sendDataForGrid.approvalStatus = approvalStatus ? approvalStatus : null;
        this.sendDataForGrid.orderBy = orderBy ? orderBy : null;

        this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
        this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
        this.onInit();
    }


    getListData() {
        const getUrl = this.baseUrl + 'get-list/' + this.page + '/' + this.pageSize;
        this.api.get(getUrl).subscribe(res => {

            let storeVal = res.page.content;
            storeVal.forEach((element, index) => {
                let val = this.findALl(element);
                storeVal[index].fiscalYear = val.fiscslYear;
                storeVal[index].sectorTypeName = val.sectorTypeName;
                storeVal[index].subSector = val.subSector;
            });            
            this.spinner = false;
            this.dataSource = new MatTableDataSource(res.page ? storeVal : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
    }

    findALl(row) {
        let fiscalYear = this.fiscalYearList.filter(res => row.stFiscalYearId == res.id)[0];
        let sectorTypeName = this.sectorTypeList.filter(res => row.stSectorTypeId == res.id)[0].fieldName;
        let ar = JSON.parse(row.stSubSectorId);
        const subSector = this.subSectorTypeListStore.filter((elem) => ar.find((v) => elem.id == v));
        return {
            "fiscslYearId": fiscalYear.id,
            "fiscslYear": fiscalYear.fiscalYear,
            "sectorTypeName": sectorTypeName,
            "subSector": subSector
        };
    }

    getDropdownData() {
        this.api.get(this.baseUrl + 'get-active-fiscal-years').subscribe(res => {
            if (res) {
                this.fiscalYearList = res.fiscalYear;
                this.sectorTypeList = res.sectorTypes;
                this.subSectorTypeListStore = res.subSectors;
                this.getListData();
            }
        });
    }

    /*---- For open popup dialog box----*/
    private openDialog(rowUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    delete(rowUuid) {
        this.api.delete(this.baseUrl + 'delete/', rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            } else {
                this.toastr.error(res.message, "", this.config);
            }
        });
    }

    editRow(row) {
        this.dataCom.setPassedItemData(row);
        this.router.navigate(['/add-sector-sub-sector']);
    }

    add() {
        this.dataCom.setPassedItemData(false);
        this.router.navigate(['/add-sector-sub-sector']);
    }

    viewDetails(row) {

        this.spinner = true;
        let storeData = [];
        const getUrl = this.baseUrl + 'get-fyw-sector-sub-sector/' + row.stFiscalYearId;
        this.api.get(getUrl).subscribe(res => {
            if (res.success) {
                res.items.forEach(element => {
                    var data = this.findALl(element);
                    storeData.push(data);
                });
                this.dataCom.setPassedItemData(storeData);
                this.router.navigate(['/sector-sub-sector-details']);
            }
        });

    }

    getFiscalYearList() {

        this.spinner = true;
        this._fiscalYearService.getAllActive().subscribe(
            response => {
                this.fiscalYearList = response.items ? response.items : [];
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }

    getResearcherList(stFiscalYearId: any) {
        this.spinner = true;
        this._researcherListService.findAllByStFiscalYearId(stFiscalYearId).subscribe(
            response => {
                this.researcherList = response.items ? response.items : [];       
                this.researcherList = this.researcherList.filter(f => { if (f.isFinalSubmit) return f });         
                this.researcherList = [...new Map(this.researcherList.map(item =>[item['researcherProfilePersonalInfoMasterId'], item])).values()]; 
                this.spinner = false;               
            },
            error => {
                this.spinner = false;
            }
        );
    }

    getResearchTitleList() {
        this.spinner = true;
        this._researcherListService.findAllByStFiscalYearIdAndProfileId(this.sendData).subscribe(
            response => {
                this.spinner = false;
                this.researchTitleList = response.items ? response.items : [];
                this.researchTitleList = this.researchTitleList.filter(f => { if (f.isFinalSubmit) return f }); 
            },
            error => {
                this.spinner = false;
            }
        );
    }

    getResearchCategoryTypeList() {
        this.spinner = true;
        this._researchCategoryTypeService.getAllActiveList().subscribe(
            response => {
                this.researchCategoryTypeList = response.items ? response.items : [];
                this.spinner = false;
            }
        );
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {

        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page

        const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
        const profileId = this.frmGroup.value.profileId;
        const proposalId = this.frmGroup.value.proposalId;
        const stResearchCatTypeId = this.frmGroup.value.stResearchCatTypeId;
        const approvalStatus = this.frmGroup.value.approvalStatus;

        this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
        this.sendDataForGrid.profileId = profileId ? profileId : null;
        this.sendDataForGrid.proposalId = proposalId ? proposalId : null;
        this.sendDataForGrid.stResearchCatTypeId = stResearchCatTypeId ? stResearchCatTypeId : null;
        this.sendDataForGrid.approvalStatus = approvalStatus ? approvalStatus : null;

        this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
        this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;

        this.onInit();
    }


    // =============  RESEARCHER_GRID_LIST ===============
    getGridList() {        
        this._researcherListService.getResearcherGridList(this.sendDataForGrid).subscribe(
            res => {
                let resVal = res.content ? res.content : [];
                this.dataSource = new MatTableDataSource(resVal);
                this.totalElements = res.totalElements;
                this.spinner = false;
                console.log('resVal == ',resVal);
                this.storeValForReport = resVal
            },
            error => {
                this.spinner = false;
            }
        );

    }

    onChangeFiscalYear(event: any) {
        if (event.value) {
            this.getResearcherList(event.value);
        }
        this.sendData.stFiscalYearId = event.value ? event.value : null;
        this.getResearchTitleList();
    }

    onSelectResearcherName(event: any) {
        this.sendData.profileId = event.value ? event.value : null;
        this.getResearchTitleList();
    }

    onSelectResearchTitle(event: any) {
        this.getResearchTitleList();
    }

    editResearcherProposal(uuId: any) {
        this._route.navigate(['researcher-proposal-informationn/edit/' + "edit" + "/" + uuId]);
    }

    showResearcherProposal(uuid: string) {
        this._route.navigate(['researcher-proposal-details/view/' + uuid]);
    }

    getSectorTypeList() {
        this.spinner = false;
        this._sectorTypeService.getAllActiveList().subscribe(
            response => {
                this.sectorTypeList = response.items ? response.items : [];
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }

    // showProfile(uuid: string, isInstitutional: boolean) {
    //     this._route.navigate([
    //         'researcher-profile-information/' + uuid + '/' + isInstitutional + '/view',
    //     ]);
    // }

    showProfile(uuid: string, isInstitutional) {
        this._route.navigate(['researcher-profile-information/' + uuid + '/' + isInstitutional + '/view']);
    }

    editProfile(data: any) {
        this._route.navigate(['researcher-profile-information/' + data.profileUuid + '/edit/' + data.profileId])
    }

    goToProfileView(uuid: string) {
        this._route.navigate(['researcher/profile/' + uuid]);

    }

    private openProfileDeleteDialog(uuid: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this._dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteProfile(uuid);
            }
            dialogRef.close(true);
        });
    }

    deleteProfile(uuId: string) {
        this._researchProfileMultiFormService.deleteProfile(uuId).subscribe(res => {
            if (res) {
                this.toastr.success(res.message, "", this.config);
                this.onInit();
            } else {
                this.toastr.warning(res.message, "", this.config);
            }
        }, err => {
            this.toastr.error('Http Error Occurred !.', "", this.config);
        });
    }

    //============== For Change Approval Status =====================
    onUpdateApprovalStatus(event: any, data: any) {
        this.spinner = true;

        const sendData = {
            id: data.proposalId,
            approvalStatus: event.value
        }

        this._researcherProposalService.updateApprovalStatus(sendData).subscribe(
            response => {
                if (response.success) {
                    this.matSnackBar.openSuccessSnackBarWithMessage(response.message, OK);
                    this.onInit();
                } else {
                    this.matSnackBar.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }

    openUpdateApprovalStatusDialog(event: any, data: any) {      

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        let msg = [
            'Do you want to approve?',
            'Do you want to not approve?',
            'Do you want to not approve?',
            'Do you want to pending?',
            'Do you want to cancel proposal?',
            'Do you want to complete?',
            'Do you want to default?',
            'Do you want to submit final report?',
        ];

        // if(event.value == 1)
        // {
        dialogConfig.data = { message: msg[event.value], 'profileNumber': data?.profileMarks };
        // }
        // else
        // {
        //     dialogConfig.data = { message: `Do you want to ${this.showApprovalStatusMessage(event.value)}`, 'profileNumber': data?.profileMarks};
        // }


        const dialogRef = this._dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.onUpdateApprovalStatus(event, data);
            }
            dialogRef.close(true);
        });


    }

    uploadFile(file: FileList) {
        this.file = file.item(0);
    }

    onSaveFileDoc() {

        if (!this.fiscalYearWiseDocFilesModel.stFiscalYearId || !this.fiscalYearWiseDocFilesModel.fileShortDescription || !this.fiscalYearWiseDocFilesModel.fileName) {
            return;
        }

        this.spinner = true;
        this._fiscalYearWiseDocFilesService.uploadFile(this.file, this.fiscalYearWiseDocFilesModel.stFiscalYearId, this.fiscalYearWiseDocFilesModel.fileShortDescription).subscribe(
            response => {
                if (response.success) {
                    this.matSnackBar.openSuccessSnackBarWithMessage('Upload successfully .', OK);
                    this.getDocFileListByStFiscalYearId(response.obj.stFiscalYearId);
                    this.fiscalYearWiseDocFilesModel = new FiscalYearWiseDocFilesModel();
                    this.spinner = false;
                } else {
                    this.matSnackBar.openErrorSnackBarWithMessage('Upload failed !.', ERROR);
                    this.spinner = false;
                }
            },
            error => {
                this.matSnackBar.openErrorSnackBarWithMessage("HTTP Error occeared !.", ERROR);
            }
        );
    }

    getDocFileListByStFiscalYearId(stFiscalYearId: number) {
        this.spinner = true;
        this._fiscalYearWiseDocFilesService.findAllByStFiscalYearId(stFiscalYearId).subscribe(
            response => {
                this.docFileList = response.items ? response.items : [];
                this.spinner = false;
            }
        );
    }

    expand(expand: boolean): void {
        this.canExpand = expand;
    }

    onPageChange(event: PageEvent) {

        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page


        const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
        const profileId = this.frmGroup.value.profileId;
        const proposalId = this.frmGroup.value.proposalId;
        const stResearchCatTypeId = this.frmGroup.value.stResearchCatTypeId;
        const approvalStatus = this.frmGroup.value.approvalStatus;

        this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
        this.sendDataForGrid.profileId = profileId ? profileId : null;
        this.sendDataForGrid.proposalId = proposalId ? proposalId : null;
        this.sendDataForGrid.stResearchCatTypeId = stResearchCatTypeId ? stResearchCatTypeId : null;
        this.sendDataForGrid.approvalStatus = approvalStatus ? approvalStatus : null;

        this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
        this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;


        this.onInit();
    }

    onSelectFiscalYearForDoc(event: any) {
        if (event.value) {
            this.getDocFileListByStFiscalYearId(event.value);
        }
    }

    // downloadFile(data: any) {
    //     this.spinner = true;
    //     this._fiscalYearWiseDocFilesService.downloadFile(data.fileDownloadUrl).subscribe(
    //         response => {
    //             this.spinner = false;
    //         },
    //         error => {
    //             this.spinner = false;
    //         }
    //     );
    // }

    private openfileDeleteDialog(id: number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this._dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteFile(id);
            }
            dialogRef.close(true);
        });
    }

    deleteFile(id: number) {
        this.spinner = true;
        this._fiscalYearWiseDocFilesService.deleteFile(id).subscribe(
            response => {
                if (response.success) {
                    this.spinner = false;
                    this.matSnackBar.openSuccessSnackBarWithMessage(response.message, OK);
                    this.getDocFileListByStFiscalYearId(response.obj.stFiscalYearId);
                } else {
                    this.spinner = false;
                    this.matSnackBar.openErrorSnackBarWithMessage(response.message, ERROR);
                }
            },
            error => {
                this.spinner = false;
                this.matSnackBar.openErrorSnackBarWithMessage("HTTP error occerd!.", ERROR)
            }
        );
    }

    addResearcherProposalMarks(proposalUuid: string) {
        this.router.navigate(['researcher-proposal-marks/' + proposalUuid]);
    }

    addResearcherProfileMarks(data: any) {        
        const catType = this.researchCategoryTypeList.find(f => f.id === data.stResearchCatTypeId);
        if (catType) {
            if (catType.categoryName === ResearcherCategoryType.PROMOTIONAL) {
                this.router.navigate(['researcher-profile-promotional-marks/' + data.proposalUuid +'/'+data.profileUuid]);
            } else if (catType.categoryName === ResearcherCategoryType.FELLOWSHIP) {
                this.router.navigate(['researcher-profile-fellowship-marks/' + data.proposalUuid +'/'+data.profileUuid]);
            } else if ((catType.categoryName === ResearcherCategoryType.MPHIL) || (catType.categoryName === ResearcherCategoryType.PHD)) {
                this.router.navigate(['researcher-profile-institutional-marks/' + data.proposalUuid +'/'+data.profileUuid]);
            } else if (catType.categoryName === ResearcherCategoryType.INSTITUTIONAL) {
                this.router.navigate(['researcher-profile-institution-research-marks/' + data.proposalUuid +'/'+data.profileUuid]);
            }
            /*if (catType.categoryName === ResearcherCategoryType.PROMOTIONAL) {
                this.router.navigate(['researcher-profile-promotional-marks/' + data.proposalUuid]);
            } else if (catType.categoryName === ResearcherCategoryType.FELLOWSHIP) {
                this.router.navigate(['researcher-profile-fellowship-marks/' + data.proposalUuid]);
            } else if (catType.categoryName === ResearcherCategoryType.INSTITUTIONAL) {
                this.router.navigate(['researcher-profile-institutional-marks/' + data.proposalUuid]);
            } else if (catType.categoryName === ResearcherCategoryType.INSTITUTION_RESEARCH) {
                this.router.navigate(['researcher-profile-institution-research-marks/' + data.proposalUuid]);
            }*/
        }
    }

    showFiscalYear(id: number) {
        if (!id) {
            return '';
        }
        return this.fiscalYearList.find(f => f.id == id).fiscalYear;
    }

    showApprovalStatusMessage(id: number) {
        if (!id) {
            return '';
        }
        return this.approvalStatusList.find(f => f.id == id) ? this.approvalStatusList.find(f => f.id == id).value : '';
    }

    onInit() {

        if (this.userDetails.userType == 'Rms_DO') {
            this.spinner = true;
            this.sendDataForGrid.isFinalSubmit = true;
            this.getGridList();
        }

        if (this.userDetails.userType == 'Rms_Researcher') {
            this.spinner = true;
            this.sendDataForGrid.userId = this.userDetails.id;
            this.displayedColumns = ['sl', 'researcher_name', 'st_research_cat_type_id', 'st_sector_type_id', 'ProfileProposalMarks', 'ApprovalStatus', 'action'];
            this.getGridList();
        }

        if (this.userDetails.userType == 'Rms_Evaluator') {
            this.findEvaluatorUserId(this.userDetails.id, response => {
                if (response) {                    
                    this.loagedEvaluator = response;
                    this.sendDataForGrid.stProfileOfExpertEvaluatorsId = response.id;
                    this.evaluatortype = response.evaluatortype;                   
                    this.getGridList();
                } else {
                    console.log('Not Found ..........');
                }
            });
        }
    }

    findEvaluatorUserId(userId: number, callback) {
        this.expertEvaluatorService.findByUserId(userId).subscribe(
            response => {
                if (response.success && response.obj) {
                    callback(response.obj);
                } else {
                    callback(false);
                }
            },
            error => {
                callback(false);
            }
        );
    }

    goToAddNewProposal() {        
        if (!this.userDetails) {
            this.matSnackBar.openErrorSnackBarWithMessage('User not found !.', ERROR);
            return;
        }
        this._researchProfileMultiFormService.findByUserId(this.userDetails.id).subscribe(
            response => {

                if(response?.uuid){                    
                    this.jasperService.advertiseDateValidity().subscribe(validRes => {
                        if (!validRes.success) {
                            this.matSnackBar.openWarnSnackBarWithMessage(validRes.message, OK);
                        }
                        else {
                            this.jasperService.isProposalCreatable(response.uuid).subscribe(data => {
                                if (data.success) {
                                    this.matSnackBar.openWarnSnackBarWithMessage('You cannot submit multiple proposals in the same financial year!', OK);
                                } else {
                                    if (response && response.uuid) {
                                        // this._route.navigate(['researcher-proposal-informationn/' + response.uuid]);
                                        this.openDialogForEligibilityChecker(response.uuid);
                                    } else {
                                        this.matSnackBar.openErrorSnackBarWithMessage('User profile not found !.', ERROR);
                                    }
                                }
                            })
                        }
                    });
                }
                else{
                    this.matSnackBar.openErrorSnackBarWithMessage('Update your profile.', '');
                }
                /*
                * check is proposal open for creation
                */

                
            },
            error => {
                this.matSnackBar.openErrorSnackBarWithMessage('User profile not found !.', ERROR);
            }
        );
    }


    pdfGen() {
        this.spinner2 = true;
        let lang = localStorage.getItem("currentLang");
        this.jasperService.proposalMarksPdf(this.frmGroup.value, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })
    }


    checkValidity() {
        this.jasperService.advertiseDateValidity().subscribe(res => {
            this.isProposal = res.success;
            this.scope = res.message;
        }, error => {

        })
    }


    openDialogForEligibilityChecker(uuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '70%';
        dialogConfig.height = 'auto';
        dialogConfig.data = { uuid: uuid, isInstitutional: this.userDetails.isInstitutional };

        const dialogRef = this.dialog.open(ProposalEligibilityCheckModalComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    //added by Abdul Alim
    addEditFinalReportSubmissionOfResearch(data: any) {
        this.router.navigate(['research-final-submission/' + data.researcherProfilePersonalInfoMasterId + "/" + data.proposalId + "/" + data.proposalUuid]);
    }

    //added by Abdul Alim
    viewFinalReportSubmissionOfResearch(data: any) {
        this.router.navigate(['view-final-report-of-research-submission/' + data.researcherProfilePersonalInfoMasterId + "/" + data.proposalId + "/" + data.proposalUuid]);
    }

    goToResearcherInfo(data: any) {
        this._route.navigate([`researcher-information/${data.proposalUuid}`]);
    }

    downloadFile(data: any) {
        // saveAs.saveAs(environment.ibcs.minioEndPointHost+data.fileDownloadUrl, "File.pdf");
        window.open(environment.ibcs.minioEndPointHost + data.fileDownloadUrl);
    }


    downloadPdf($fileName = '') {
        this.dataPDF['fileName'] = $fileName;
        this.dataPDF['templateName'] = 'rms-reports/summaryReportOfResearchProposal';
        this.dataPDF['lng'] = localStorage.getItem("currentLang"); 
        this.dataPDF['storeValForReport'] = JSON.stringify(this.storeValForReport);
        this.dataPDF['formData']=JSON.stringify(this.frmGroup.value);
        this.dataPDF['researchCategoryTypeList']=JSON.stringify(this.researchCategoryTypeList);
        this.dataPDF['fiscalYearList']=JSON.stringify(this.fiscalYearList);
        this.dataPDF['sectorTypeList']=JSON.stringify(this.sectorTypeList);
        this.dataPDF['page']=JSON.stringify(this.page);
        this.dataPDF['pageSize']=JSON.stringify(this.pageSize);
        // this.data['downloadUrl'] = environment.ibcs.minioEndPointHost;
        console.log('this.data = ', JSON.stringify(this.storeValForReport));
        //Optional
        this.dataPDF['view'] = 0; // 0 = false or 1 = true
        this.dataPDF['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.dataPDF, actionUrl);
    }


}
