import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {addNewIcon, deleteIcon, editIcon, 
    refreshIcon, viewIcon, previousIcon,updateSuccess} from '../../../constants/button.constants';
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
import {UploadFileModalComponent} from "../upload-file-modal/upload-file-modal.component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";

@Component({
  selector: 'app-geo-letter-list',
  templateUrl: './geo-letter-list.component.html',
  styleUrls: ['./geo-letter-list.component.scss']
})
export class GeoLetterListComponent implements OnInit {
    @ViewChild('inputForm') inputForm: NgForm;

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;
    updateSuccess = updateSuccess;
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
    submitData: any;

    getInstallmentType: any;
    getTkAmount: any;
    getResearchTitle: any;
    getCategory: any;
    isSend: any;
    goUuid: any;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'researchTitle', 'installmentType', 'amount', 'category', 'fiscalYear', 'ReceiveBankCheque','action'];

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
        private storeElement: CreateGoLetterServiceService,
        private downloadElement: CreateGoLetterServiceService,
        private activatedRoute: ActivatedRoute,
        private _route: Router,
        private _dialog: MatDialog,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.activatedRoute.params.subscribe(params => {
            this.goUuid = params['goUuid'];
        });
    }

    ngOnInit(): void {
        this.getListData();
    }

    goToResearcherProposalList(element) {
        this.getGoLetterID.data = element.id;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '85%';
        dialogConfig.height = '85%';
        dialogConfig.data = {...element};
        const dialogRef = this._dialog.open(UploadFileModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    getListData() {
        this.spinner = true;
        this._createGoLetterServiceService.getGoLetterList(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content ? res.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
            this.spinner = false;
        });
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
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
        this._createGoLetterServiceService.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            }
            else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }

    public editRow(element){
        this.storeElement.mode = 'Edit';
        this.storeElement.element = element;        
        this._route.navigate([`go-letter-list/${element.uuid}/update-go-letter`]).then(r => console.log(r));
    }

    public downloadGoLetter(data){
        console.log(data)
       this.downloadElement.download = data;
        this._route.navigate([`go-letter-list/${data.uuid}/download-go-letter`]).then(r => console.log(r));
    }

    public createPage(){
        this._route.navigate([`go-letter-list/${this.goUuid}/create-go-letter`]).then(r => console.log(r));
    }

    public sendGoLetter(element){
        if(element.isSend == false){
            this.isSend = true;
        }

        this.submitData = {
            "id": element.id,
            "uuid": element.uuid,
            "goCode": element.goCode,
            "researcherProposalId": element.installmentProcess.m1ResearcherProposalId.id,
            "installmentProcessId": element.installmentProcessId,
            "installmentTypeId": element.installmentTypeId,
            "fiscalYearId": element.installmentProcess.fiscalYearResponse.id,
            "researchCatTypeId": element.installmentProcess.researchCategoryType.id,
            "totalAmount": element.totalAmount,
            "subject": element.subject,
            "mailBody": element.mailBody,
            "templateTypeId": element.templateTypeId,
            "predefinedTemplateId": element.predefineTemplate.id,
            "isSend": true,
        };

        this._createGoLetterServiceService.updateData(this.submitData).subscribe(
            res => {
                if (res.success) {
                    this.spinner = false;
                    this.toastr.success(this.updateSuccess, "", this.config);
                    this.getListData();
                } else {
                    this.spinner = false;
                    this.toastr.error(res.message, "", this.config);
                }
            },
        )
    }

    public receiveBankCheck(el): void {
        this.storeElement.element = el;
        this._route.navigate([`go-letter-list/${el.uuid}/bank-cheque-list`]).then(r => console.log(r));
    }

}
