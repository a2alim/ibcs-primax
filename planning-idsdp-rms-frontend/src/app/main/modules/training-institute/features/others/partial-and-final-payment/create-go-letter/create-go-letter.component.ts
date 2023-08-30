import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {DEFAULT_SIZE} from "../../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ApiService} from "../../../../../../core/services/api/api.service";
import {ToastrService} from "ngx-toastr";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DataComService} from "../../../../../../core/services/data-com/data-com.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalValidationServiceService} from "../../../../../../core/services/global-validation-service.service";
import {CreateGoLetterServiceService} from "../../../../../rpm/services/create-go-letter-service.service";
import {InstallmentProcessService} from "../../../../../rpm/services/installment-process.service";
import {locale as lngEnglish} from "../../../../../rpm/features/create-go-letter/i18n/en";
import {locale as lngBangla} from "../../../../../rpm/features/create-go-letter/i18n/bn";
import {UploadFileModalComponent} from "../../../../../rpm/features/create-go-letter/upload-file-modal/upload-file-modal.component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {
    addNewIcon,
    deleteIcon,
    editIcon,
    previousIcon,
    refreshIcon,
    viewIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {GoLetterService} from "../../../../services/go-letter.service";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";

@Component({
  selector: 'app-create-go-letter',
  templateUrl: './create-go-letter.component.html',
  styleUrls: ['./create-go-letter.component.scss']
})
export class CreateGoLetterComponent implements OnInit {
    @ViewChild("ckeditor") ckeditor: any;
    @ViewChild('inputForm') inputForm: NgForm;

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;


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
    predifinedTemplate: any;
    installmentProcess: any;
    getInstallmentProcess: any;
    submitData: any;
    dataSource: any;
    templateId: any;
    predifinedTemplateId: any;
    element: any;

    getInstallmentType: any;
    getTkAmount: any;
    getResearchTitle: any;
    getCategory: any;
    getFiscalYear: any;
    goUuid: any;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'Subject', 'tempType', 'preTemplate', 'ReceiveBankCheque', 'action'];
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
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
        private getElement: CreateGoLetterServiceService,
        private _installmentProcess: InstallmentProcessService,
        private activatedRoute: ActivatedRoute,
        private _route: Router,
        private _goLetterService: GoLetterService,
        private _dialog: MatDialog,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.activatedRoute.params.subscribe(params => {
            this.goUuid = params['id'];
        });
    }

    ngOnInit(): void {
        this.element = this.getElement.element;

        this.getActiveTemplateType();
        this.getInstallmentProcessById();
        this.getListData();
        if(this.getElement.mode == "Edit") {
            this._createGoLetterServiceService.getInstallmentProcessById(this.element.installmentProcessId).subscribe(res => {
                this.getInstallmentProcess = res.obj;
                this.getFiscalYear = this.getInstallmentProcess.fiscalYearResponse.fiscalYear;
                this.getInstallmentType = this.getInstallmentProcess.installmentType.installmentType;
                this.getTkAmount = this.getInstallmentProcess.tkAmount;
                this.getCategory = this.getInstallmentProcess.researchCategoryType.categoryName;
                this.getResearchTitle = this.getInstallmentProcess.m1ResearcherProposalId.researchTitle;
            })
            this.formTitle = this.getElement.mode;
        }

        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            id: [''],
            subject: ['', [this.globalVal.trimValidator('Subject')]],
            templateType: ['', [this.globalVal.trimValidator('Template Type')]],
            predefineTemplate: ['', [this.globalVal.trimValidator('Predefine Template')]],
            mailData: ['', [this.globalVal.trimValidator('Mail Data')]],
            isSend: [false],
            goLetterStatus: [''],
            enothiNumber: [''],
            dateBangla: [''],
            dateEnglish: [''],
        });

        if(this.getElement.mode == "Edit") {
            this.frmGroup.controls["subject"].setValue(this.element.subject);
            this.frmGroup.controls["mailData"].setValue(this.element.mailBody);
            this.frmGroup.controls["templateType"].setValue(this.element.templateType.id);
            this.frmGroup.controls["goLetterStatus"].setValue(this.element.approvedStatus);
            this.frmGroup.controls["enothiNumber"].setValue(this.element.enothiNumber);
            this.frmGroup.controls["dateBangla"].setValue(this.element.bnDate);
            this.frmGroup.controls["dateEnglish"].setValue(this.element.enDate);

            this._createGoLetterServiceService
                .getPredefineTemplateTypeBySelectedTemplateType(this.element.templateType.id)
                .subscribe(res => {
                    this.predifinedTemplate = res.items;
                    this.frmGroup.controls["predefineTemplate"].setValue(this.element.predefineTemplate.id);
                })

        }
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
        this._createGoLetterServiceService.getGoLetterList(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content ? res.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
    }

    //Pagination Page Change onChangeClick

    compareFn(x: any, y: any): boolean {
        return x && y ? x.id === y : x.id === y;
    }

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


    public onSubmit() {
        if(this.formTitle == 'Save') {
            this.submitData = {
                "subject": this.frmGroup.value.subject,
                "mailBody": this.frmGroup.value.mailData,
                "goLetterStatus": this.frmGroup.value.goLetterStatus,
                "enothiNo": this.frmGroup.value.enothiNumber,
                "dateBangla": this.frmGroup.value.dateBangla,
                "dateEnglish": this.frmGroup.value.dateEnglish,
                "partialFinalPaymentId": this.goUuid,
            };
        }else if(this.formTitle == 'Edit') {
            this.submitData = {
                "subject": this.frmGroup.value.subject,
                "mailBody": this.frmGroup.value.mailData,
                "goLetterStatus": this.frmGroup.value.goLetterStatus,
                "enothiNo": this.frmGroup.value.enothiNumber,
                "dateBangla": this.frmGroup.value.dateBangla,
                "dateEnglish": this.frmGroup.value.dateEnglish,
                "partialFinalPaymentId": this.goUuid,
            };
        }
        if (this.formTitle == 'Save') {
            this._goLetterService.saveGoLetter(this.submitData).subscribe(
                res => {
                    console.log(res)
                    this.router.navigate(['partial-and-final-payment']);
                },
                error => {
                    console.log(error)
                }
            )
        }else{
            this.spinner = true;
            this._createGoLetterServiceService.updateData(this.submitData).subscribe(
                res => {
                    if (res.success) {
                        this.spinner = false;
                        this.toastr.success(updateSuccess, "SSuccess", this.config);
                        this.reset();
                        this.getListData();
                        this.back();
                    } else {
                        this.spinner = false;
                        this.toastr.error(updateFailed, "Error", this.config);
                    }
                },
            )
        }

    }

    getInstallmentProcessById() {
        if(this.formTitle == 'Save') {
            this._createGoLetterServiceService.getInstallmentProcessById(this._installmentProcess.processId).subscribe(res => {
                this.installmentProcess = res.obj;
                this.getFiscalYear = this.installmentProcess.fiscalYearResponse.fiscalYear;
                this.getInstallmentType = this.installmentProcess.installmentType.installmentType;
                this.getTkAmount = this.installmentProcess.tkAmount;
                this.getCategory = this.installmentProcess.researchCategoryType.categoryName;
                this.getResearchTitle = this.installmentProcess.m1ResearcherProposalId.researchTitle;
            })
        }
    }

    getActiveTemplateType() {
        this._createGoLetterServiceService.getAllActiveTemplateType().subscribe(res => {
            this.templateType = res.items;
        })
    }

    selectTemplateType(event) {
        this.templateId = event.id;
        this.ckeditor.instance.setData('');
        this._createGoLetterServiceService.getPredefineTemplateTypeBySelectedTemplateType(event.id).subscribe(res => {
            this.predifinedTemplate = res.items;
        })
    }

    selectPredefinedTemplate(event) {
        this.predifinedTemplateId = event.id;

        if(!event.header == null || event.header != ''){
            this.ckeditor.instance.setData(event.header);
        }else{
            this.ckeditor.instance.setData('');
        }
    }

    button() {
        this.formTitle = 'Edit'
        this.ckeditor.instance.setData('');
    }

    reset() {
        this.formTitle = 'Save';
        this.frmGroup.reset();
        this.inputForm.resetForm();
        setTimeout(() => {
            this.ckeditor.instance.setData('');
        }, 500);

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
                this.toastr.success(deleteSuccess, "Success", this.config);
                this.getListData();
            }
            else {
                this.toastr.warning(deleteFailed, "Error", this.config);
            }
        });
    }

    public receiveBankCheck(): void {
        this._route.navigate(['receive-bank-cheque']).then(r => console.log(r));
    }

    back(){
        this.formTitle = "Save"
        this.getElement.mode = "Save"
        this.router.navigate(['partial-and-final-payment']);
    }

}
