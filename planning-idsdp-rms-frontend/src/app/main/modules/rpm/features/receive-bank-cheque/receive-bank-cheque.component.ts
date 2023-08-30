import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from "@angular/router";
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { cloneDeep } from 'lodash';
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { DEFAULT_SIZE } from "../../../../core/constants/constant";
import { FuseTranslationLoaderService } from "../../../../core/services/translation-loader.service";
import { addNewIcon, deleteIcon, editIcon, refreshIcon, viewIcon } from '../../constants/button.constants';
import { BankChequeReceivedStatuses } from '../../enums/enum-list.enum';
import { CreateGoLetterServiceService } from '../../services/create-go-letter-service.service';
import { ReceiveBankChequeService } from '../../services/receive-bank-cheque.service';
import { locale as lngBangla } from "../receive-bank-cheque/i18n/bn";
import { locale as lngEnglish } from "../receive-bank-cheque/i18n/en";

@Component({
    selector: 'app-receive-bank-cheque',
    templateUrl: './receive-bank-cheque.component.html',
    styleUrls: ['./receive-bank-cheque.component.scss']
})
export class ReceiveBankChequeComponent implements OnInit {
    @ViewChild("ckeditor1") public ckeditor1: any;
    @ViewChild("ckeditor2") public ckeditor2: any;

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;

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
    templateId: any;
    predifinedTemplate: any;
    predifinedTemplateId: any;
    data: any;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'GrantAmount', 'ReceivedAmount', 'ChequeNumber', 'ChequeDate', 'TokenNumber', 'Subject', 'ReceivedStatus', 'Status', 'action'];
    public receivedStatuses = BankChequeReceivedStatuses;
    public goLetterId: string;
    public installmentProcess: any;
    public goLetterInfo: any;
    private submitData: any;
    private pageableRequestBodyDTO = {
        page: this.page,
        size: this.pageSize
    };
    dataSource;
    isEditMode: boolean;
    onEditCheque: any;
    chequeId: any;
    rData: any;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    constructor(
        private router: Router,
        private dateAdapter: DateAdapter<Date>,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private _createGoLetterServiceService: CreateGoLetterServiceService,
        private createGoLetterService: CreateGoLetterServiceService,
        private bankChequeService: ReceiveBankChequeService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
        this.activatedRoute.params.subscribe(params => {
            this.goLetterId = params['goLetterId'];
            this.chequeId = params['chequeId'];
        });

    }

    ngOnInit(): void {
        this.rData = this.createGoLetterService.element;
        this.frmGroup = this.formBuilder.group({
            predefineTemplate: [''],
            templateType: [''],
            isSend: [false],
            subject: [''],
            mailBody: [''],
            grantAmount: [''],
            receivedAmount: [''],
            chequeNumber: [''],
            chequeDate: [new Date()],
            tokenNo: [''],
            receivedStatus: [''],
            status: [false],
        });

        this.getGoLetterInfo();
        if (this.chequeId !== 'create') {
            this.getBankChequeInfo();
            this.data = this.bankChequeService.element;
            this.rData = this.createGoLetterService.element;
        }
        this.getActiveTemplateType();
    }

    onSubmit(){
        if(this.frmGroup.value.grantAmount < this.frmGroup.value.receivedAmount){
            this.toastr.error("Received amount should not be greater than Grant Amount!");
        }
        else{
            this.save();
        }
    }

    public save(){
        this.submitData = {
            "researcherProposalId": this.data ? this.data.researcherProposalId : this.rData.researcherProposalId,
            "installmentProcessId": this.data ? this.data.installmentProcessId : this.rData.installmentProcessId,
            "installmentTypeId": this.data ? this.data.installmentTypeId : this.rData.installmentTypeId,
            "fiscalYearId": this.data ? this.data.fiscalYearId : this.rData.fiscalYearId,
            "researchCatTypeId": this.data ? this.data.researchCatTypeId : this.rData.researchCatTypeId,
            "totalAmount": this.data ? this.data.totalAmount : this.rData.totalAmount,
            "subject": this.frmGroup.value.subject,
            "mailBody": this.frmGroup.value.mailBody,
            "createGoLetterId" : this.data ? this.data.createGOLetter.id : this.rData.id,
            "templateTypeId" : this.data ? this.data.templateTypeId : this.rData.templateTypeId,
            'templateType': this.frmGroup.value.templateType,
            "predefineTemplate" : this.frmGroup.value.predefineTemplate,
            "grantAmount" : this.frmGroup.value.grantAmount,
            "receivedAmount" : this.frmGroup.value.receivedAmount,
            "chequeNumber" : this.frmGroup.value.chequeNumber,
            "chequeDate" : this.frmGroup.value.chequeDate,
            "tokenNo" : this.frmGroup.value.tokenNo,
            "isSend" : this.frmGroup.value.isSend,
            "status" : this.frmGroup.value.status,
            "receivedStatus" : this.frmGroup.value.receivedStatus,
        };

        if (this.formTitle == 'Save' || this.formTitle == 'Edit') {
            if (this.onEditCheque) {
                this.submitData.id = this.onEditCheque.id;
                this.submitData.uuid = this.onEditCheque.uuid;
            }
            this.spinner = true;
            this.bankChequeService.saveBankCheque(this.submitData).subscribe(
                res => {
                    if (res.success) {
                        this.spinner = false;
                        this.toastr.success(res.message, "Success!", this.config);
                        this.back();
                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, "Error!", this.config);
                    }
                },
            )
        }
    }


    //Pagination Page Change onChangeClick
    public onChangePage(event: PageEvent) {

        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page

        this.pageableRequestBodyDTO.page = this.page;
        this.pageableRequestBodyDTO.size = this.pageSize;

    }

    public getBankChequeInfo() {
        const c = this.bankChequeService.getWorkingBankCheque();
        this.formTitle = 'Edit';
        this.onEditCheque = cloneDeep(c);
        for (const key in this.frmGroup.controls) {
            if (c[key]) {
                this.frmGroup.controls[key].setValue(c[key]);
            }
        }
    }

    compareFn(x: any, y: any): boolean {
        return x && y ? x.templateType === y : x.templateType === y;
    }


    private getGoLetterInfo(): void {
        this.createGoLetterService.getGoLetterInfo(this.goLetterId).subscribe(d => {
            this.goLetterInfo = d.obj;
            this.installmentProcess = this.goLetterInfo.installmentProcess;
        });
    }

    getActiveTemplateType() {
        this._createGoLetterServiceService.getAllActiveTemplateType().subscribe(res => {
            this.templateType = res.items;
        })
    }

    selectTemplateType(event) {
        this.templateId = event.id;
        this.ckeditor2.instance.setData('');
        this._createGoLetterServiceService.getPredefineTemplateTypeBySelectedTemplateType(event.id).subscribe(res => {
            this.predifinedTemplate = res.items;
        })
    }

    selectPredefinedTemplate(event) {
        this.predifinedTemplateId = event.id;

        if (!event.header == null || event.header != '') {
            this.ckeditor2.instance.setData(event.header);
        } else {
            this.ckeditor2.instance.setData('');
        }
    }


    button() {
        this.formTitle = 'Edit'
    }
    reset(){
        this.onEditCheque = null;

        this.formTitle = 'Save';
        this.frmGroup.reset();
        setTimeout(() => {
            this.ckeditor2.instance.setData('');
        }, 500);
    }

    back(){
        this.router.navigate([`go-letter-list/${this.goLetterId}/bank-cheque-list`]);
    }

    public prevent(event){
        if(event.key == '-' || event.key == '+' || event.key == 'e' || event.key == 'E'){
            event.preventDefault();
        }
    }

}
