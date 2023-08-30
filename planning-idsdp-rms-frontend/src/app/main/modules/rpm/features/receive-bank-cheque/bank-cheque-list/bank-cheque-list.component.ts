import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {addNewIcon, deleteIcon, editIcon, refreshIcon, viewIcon, previousIcon, sendIcon} from '../../../constants/button.constants';
import {Subscription} from "rxjs";
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ApiService} from "../../../../../core/services/api/api.service";
import {ToastrService} from "ngx-toastr";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DataComService} from "../../../../../core/services/data-com/data-com.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalValidationServiceService} from "../../../../../core/services/global-validation-service.service";
import {CreateGoLetterServiceService} from "../../../services/create-go-letter-service.service";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { ReceiveBankChequeService } from '../../../services/receive-bank-cheque.service';
import { UploadBankChequeFileModalComponent } from '../upload-bank-cheque-file-modal/upload-bank-cheque-file-modal.component';
import {MatSelectChange} from "@angular/material/select";
import {FiscalYearServiceService} from "../../../../settings/services/fiscal-year-service.service";
import {ResearcherListService} from "../../../services/researcher-list.service";
import {ResearchCategoryTypeService} from "../../../../settings/services/research-category-type.service";
import {StorageService} from "../../../../../core/services/storage/storage.service";
//import {saveAs as importedSaveAs} from 'file-saver';
import {UploadbankChequeFileFormModel} from "../../../models/UploadFileFormModel";

@Component({
  selector: 'app-bank-cheque-list',
  templateUrl: './bank-cheque-list.component.html',
  styleUrls: ['./bank-cheque-list.component.scss']
})
export class BankChequeListComponent implements OnInit {
    @ViewChild('inputForm') inputForm: NgForm;

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = 'Save'; //Edit

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    templateType: any;
    installmentProcess: any;
    dataSource: any;
    predifinedTemplateId: any;
    predifinedTemplate: any;
    templateId: any;
    fiscalYearList: any[] = [];
    researcherList: any;
    researchTitleList: any;
    researchCategoryTypeList: any[] = [];
    userDetails: any;
    FileData?: UploadbankChequeFileFormModel[];

    getInstallmentType: any;
    getTkAmount: any;
    getResearchTitle: any;
    getCategory: any;
    isSend: any;
    fiscalId: any;
    researchId: any;
    categoryId: any;
    sendData: { stFiscalYearId: number, profileId: number } = {stFiscalYearId: null, profileId: null}
    sendDataForGrid: {
        stFiscalYearId: null,
        proposalId: null,
        stResearchCatTypeId: null,

        pageableRequestBodyDTO: {
            page: number,
            size: number
        }

    } = {
        stFiscalYearId: null,
        proposalId: null,
        stResearchCatTypeId: null,

        pageableRequestBodyDTO: {
            page: this.page,
            size: this.pageSize
        }

    };

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'ResearchTitle', 'GrantAmount', 'ReceivedAmount', 'ChequeNumber', 'ChequeDate', 'ReceivedStatus', 'acknowledgement', 'action'];
    private pageableRequestBodyDTO = {
        page: this.page,
        size: this.pageSize
    };
    goLetterId: any;
    goLetterInfo: any;
    baseUrl: any;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private globalVal: GlobalValidationServiceService,
        private _createGoLetterServiceService: CreateGoLetterServiceService,
        private getGoLetterID: CreateGoLetterServiceService,
        private _route: Router,
        private _dialog: MatDialog,
        private bankChequeService: ReceiveBankChequeService,
        private activatedRoute: ActivatedRoute,
        private _fiscalYearService: FiscalYearServiceService,
        private _researcherListService: ResearcherListService,
        private _researchCategoryTypeService: ResearchCategoryTypeService,
        private storageService: StorageService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.activatedRoute.params.subscribe(params => {
            this.goLetterId = params['goLetterId'];
        });
    }

    ngOnInit(): void {
        this.baseUrl = this.bankChequeService.minioEndPointHost;
        this.userDetails = this.storageService.getUserData();
        this.frmGroup = this.formBuilder.group({
            stFiscalYearId: [''],
            proposalId: [''],
            stResearchCatTypeId: [''],
        });
        this.getListData();
        this.getGoLetterInfo();
        this.getFiscalYearList();
        this.getResearchCategoryTypeList();
    }

    private getGoLetterInfo(): void {
        this.spinner = true;

        this._createGoLetterServiceService.getGoLetterInfo(this.goLetterId).subscribe(d => {
            this.goLetterInfo = d.obj;
            this.installmentProcess = this.goLetterInfo.installmentProcess;
            this.spinner = false;
        });
    }

    onSubmit() {
        this.getListData();
    }

    getListData() {
        this.spinner = true;
        this.bankChequeService.getChequeList({pageableRequestBodyDTO: this.pageableRequestBodyDTO, "fiscalYearId": this.fiscalId ? this.fiscalId : null,
            "researcherProposalId": this.researchId ? this.researchId: null, "researchCatTypeId": this.categoryId ? this.categoryId:null}).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content ? res.content : []);
            this.totalElements = res.totalElements;
            this.spinner = false;
        });
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page

        this.pageableRequestBodyDTO.page = this.page;
        this.pageableRequestBodyDTO.size = this.pageSize;
        this.getListData();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getActiveTemplateType() {
        this._createGoLetterServiceService.getAllActiveTemplateType().subscribe(res => {
            this.templateType = res.items;
        })
    }

    selectTemplateType(event) {
        this.templateId = event.id;
        this._createGoLetterServiceService.getPredefineTemplateTypeBySelectedTemplateType(event.id).subscribe(res => {
            this.predifinedTemplate = res.items;
        })
    }


    public uploadFile(element: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '85%';
        dialogConfig.height = '85%';
        dialogConfig.data = {...element};
        const dialogRef = this._dialog.open(UploadBankChequeFileModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

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

    delete(rowUuid) {
        this.bankChequeService.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            }
            else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }

    editRow(element = {uuid: 'create'}): void {
        this.bankChequeService.setWorkingBankCheque(element);
        this.bankChequeService.element = element;
        this._route.navigate([`go-letter-list/${this.goLetterId}/receive-bank-cheque/${element.uuid}`]).then(r => console.log(r));
    }

    download(element){
        if (!element) {
            return;
        }
        this.bankChequeService.setWorkingBankCheque(element);
        this.bankChequeService.element = element;
        this._route.navigate([`go-letter-list/${this.goLetterId}/download-bank-cheque/${element.uuid}`]).then(r => console.log(r));

    }

    public receiveBankCheck(): void {
        this._route.navigate(['receive-bank-cheque']).then(r => console.log(r));
    }

    openDialogForStatus($event: MatSelectChange, row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.STATUS};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.receivedStatus(row);
            } else {
                this.getListData();
            }
            dialogRef.close(true);
        });

    }

    receivedStatus(row) {
        this.bankChequeService.saveBankCheque(row).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            } else {
                this.toastr.warning(res.message, "", this.config);
                this.getListData();
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

    getResearchTitleList() {
        this.spinner = true;
        this._researcherListService.findAllByStFiscalYearIdAndProfileId(this.sendData).subscribe(
            response => {
                this.spinner = false;
                this.researchTitleList = response.items ? response.items : [];
            },
            error => {
                this.spinner = false;
            }
        );
    }

    getResearchProposalId(event: any){
        console.log(event.value.proposalId);
        this.researchId = event.value.proposalId;
        this.getListData();
    }

    onChangeFiscalYear(event: any) {
        console.log(event.value);
        this.fiscalId = event.value ? event.value : null;
        this.sendData.stFiscalYearId = event.value ? event.value : null;
        this.getListData();
        this.getResearchTitleList();
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

    getCategoryId(event: any){
        this.categoryId = event.value.id;
        this.getListData();
    }

    acknowledgementLetter(element){
        if (!element) {
            return;
        }
        this.bankChequeService.setWorkingBankCheque(element);
        this.bankChequeService.element = element;
        this._route.navigate([`go-letter-list/${this.goLetterId}/create-acknowledgment-letter/${element.uuid}`]).then(r => console.log(r));

    }

    /*downloadFile(row): void  {
        const fileName = row.receivedBankChequeUploadDoc[0].fileName;
        this.bankChequeService.downloadFile(fileName).subscribe(blob =>
            importedSaveAs(blob, fileName)
        );
    }*/

    downloadFile(row): void  {
        // const fileName = row.receivedBankChequeUploadDoc[0].downloadUrl;
        // this.bankChequeService.downloadFile(fileName).subscribe(blob =>
        //     importedSaveAs(blob, fileName)
        // );
    }

}
