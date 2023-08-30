import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
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
import {addNewIcon, deleteIcon, editIcon, saveIcon, refreshIcon,
     viewIcon, previousIcon, sendIcon, 
     downloadIcon, printIcon, 
     sentSuccess} from '../../../constants/button.constants';
import { ReceiveBankChequeService } from '../../../services/receive-bank-cheque.service';
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {UploadbankChequeFileFormModel} from "../../../models/UploadFileFormModel";
import {SubSink} from "subsink";


@Component({
  selector: 'app-download-bank-cheque',
  templateUrl: './download-bank-cheque.component.html',
  styleUrls: ['./download-bank-cheque.component.scss']
})
export class DownloadBankChequeComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    saveIcon = saveIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    sentSuccess = sentSuccess;

    uploadFileFormModelList: UploadbankChequeFileFormModel[] = [];
    fileList: File[]= new Array();
    updatedFileList: any[] = [];
    subscribe$ = new SubSink();

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
    data: any;
    submitData: any;

    getInstallmentType: any;
    getTkAmount: any;
    getResearchTitle: any;
    getCategory: any;
    getFiscalYear: any;

    getSubject: any;
    getTemplateType: any;
    getPredifinedTemplate: any;
    getMailData: any;
    bankChequeInfo: any;
    goLetterInfo: any;
    goLetterId: any;
    chequeId: any;
    // jsPdfMaker = new jsPDF();


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
      private getGoLetterID: CreateGoLetterServiceService,
      private storeElement: CreateGoLetterServiceService,
      private _route: Router,
      private _dialog: MatDialog,
      private activatedRoute: ActivatedRoute,
      private snackbarHelper: SnackbarHelper,

      private createGoLetterService: CreateGoLetterServiceService,
      private bankChequeService: ReceiveBankChequeService,
  ) {
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
      this.activatedRoute.params.subscribe(params => {
        this.goLetterId = params['goLetterId'];
        this.chequeId = params['chequeId'];
    });
  }

  ngOnInit(): void {
      this.data = this.bankChequeService.element;
      this.getBankChequeById();
      this.uploadFileFormModelList.push(
          {
              id: null,
              uuid: null,
              receivedBankChequeId: this.data.id,
              fileTitle: '',
              fileName: '',
              bucketName: '',
              downloadUrl: '',
              isEditable: 0,
              deleted: 0
          }
      );
      this.getGoLetterInfo();
      this.getBankChequeInfo();
      this.getDataForDownloadFile();
  }

    save(next: boolean) {
        this.spinner = true;
        this.uploadFileFormModelList = this.uploadFileFormModelList.map(m => ({ ...m, receivedBankChequeId: this.data.id}));
        this.bankChequeService.saveFile(this.uploadFileFormModelList, this.fileList, this.updatedFileList).subscribe(
            response => {
                if (response.success) {
                    this.spinner = false;
                    this.uploadFileFormModelList = response.items.map(m => ({ ...m, deleted: 0 }));
                    this.fileList = [];
                    this.updatedFileList = [];
                    this.router.navigate([`go-letter-list/${this.goLetterId}/bank-cheque-list`]);
                    this.snackbarHelper.openSuccessSnackBar();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                }
            },
            error => {
                this.spinner = false;
            }
        );
    }

    handleFileInput(file: FileList, index: number, id: number) {
        this.fileList.push(file.item(0));
        this.updatedFileList[index] = id ? id : 1000 + index;
    }

    getBankChequeById() {
        this.subscribe$.add(
            this.bankChequeService.getBankChequeById(this.data.id).subscribe(res => {
                if (res.success) {
                    this.uploadFileFormModelList = res.items.map(m => ({ ...m, deleted: 0 }));
                }
            })
        );
    }

    getDataForDownloadFile(){
        console.log('this.data == ', this.data);
        this.getInstallmentType = this.data?.createGOLetter?.installmentProcess?.installmentType?.installmentType
        this.getTkAmount= this.data?.createGOLetter?.totalAmount
        this.getResearchTitle = this.data?.createGOLetter?.installmentProcess?.m1ResearcherProposalId?.researchTitle
        this.getCategory = this.data?.createGOLetter?.installmentProcess?.researchCategoryType?.categoryName
        this.getFiscalYear = this.data?.createGOLetter?.installmentProcess?.fiscalYearResponse?.fiscalYear

        this.getSubject = this.data?.subject
        this.getTemplateType = this.data?.templateTypeId
        this.getMailData = this.data?.mailBody

    }

  private getGoLetterInfo(): void {
        this.createGoLetterService.getGoLetterInfo(this.goLetterId).subscribe(d => {
            this.goLetterInfo = d.obj;
            this.installmentProcess = this.goLetterInfo.installmentProcess;
        });
  }

  public getBankChequeInfo() {
    this.bankChequeInfo = this.bankChequeService.getWorkingBankCheque();

  }

    back(){
        this.router.navigate([`go-letter-list/${this.goLetterId}/bank-cheque-list`]);
    }

    download() {
      console.log(this.bankChequeInfo);
      var data = document.getElementById('downloadable-content');
      // html2canvas(data, {scale: 2}).then(canvas => {
      //    var imgWidth = 208;
      //    var imgHeight = canvas.height * imgWidth / canvas.width;

      //    const contentDataURL = canvas.toDataURL('image/png', 'high')
      //    let pdf = new jsPDF('p', 'mm', 'a4');
      //    var position = 0;
      //    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      //    pdf.save(`bank-cheque-${this.bankChequeInfo.chequeNumber}.pdf`);
      // });
    }

    print(Name) {
        var printContents = document.getElementById(Name).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        this.router.navigate([`research-cancellation`]);
    }

    private openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.SEND };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.sendBankCheque();
            }
            dialogRef.close(true);
        });
    }

    sendBankCheque(){
        this.submitData = {
            "researcherProposalId": this.installmentProcess.m1ResearcherProposalId.id,
            "installmentProcessId": this.installmentProcess.id,
            "installmentTypeId": this.installmentProcess.stInstallmentTypeId,
            "fiscalYearId": this.installmentProcess.m1ResearcherProposalId.stFiscalYearId,
            "researchCatTypeId": this.installmentProcess.researchCategoryType.id,
            "totalAmount": this.installmentProcess.tkAmount,
            "subject": this.bankChequeInfo.subject,
            "mailBody": this.bankChequeInfo.mailBody,
            "createGoLetterId" : this.goLetterId,
            "predefinedTemplate" : this.bankChequeInfo.predefinedTemplate,
            "grantAmount" : this.bankChequeInfo.grantAmount,
            "receivedAmount" : this.bankChequeInfo.receivedAmount,
            "chequeNumber" : this.bankChequeInfo.chequeNumber,
            "chequeDate" : this.bankChequeInfo.chequeDate,
            "tokenNo" : this.bankChequeInfo.tokenNo,
            "isSend" : true,
            "status" : this.bankChequeInfo.status,
            "receivedStatus" : this.bankChequeInfo.receivedStatus,
        };

        this.submitData.id = this.bankChequeInfo.id;
        this.submitData.uuid = this.bankChequeInfo.uuid;
        this.bankChequeService.saveBankCheque(this.submitData).subscribe(
            res => {
                if (res.success) {
                    this.spinner = false;
                    this.toastr.success(res.message + " " + this.sentSuccess, "", this.config);
                    this.back();
                } else {
                    this.spinner = false;
                    this.toastr.error(res.message, "Error!", this.config);
                }
            },
        )
    }
}
