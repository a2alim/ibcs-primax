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
import {addNewIcon, deleteIcon, editIcon, refreshIcon, viewIcon, previousIcon, sendIcon} from '../../../constants/button.constants';
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

@Component({
  selector: 'app-download-go-letter',
  templateUrl: './download-go-letter.component.html',
  styleUrls: ['./download-go-letter.component.scss']
})
export class DownloadGoLetterComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    datetime = new Date();

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
    goUuid: any;

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
      this.data = this.storeElement.download;
      console.log("-----")
      console.log(this.data);
     // this.getDataForDownloadFile();
  }

  getDataForDownloadFile(){
      this.getInstallmentType = this.data.installmentProcess.installmentType.installmentType
      this.getTkAmount= this.data.totalAmount
      this.getResearchTitle = this.data.installmentProcess.m1ResearcherProposalId.researchTitle
      this.getCategory = this.data.installmentProcess.researchCategoryType.categoryName
      this.getFiscalYear = this.data.installmentProcess.fiscalYearResponse.fiscalYear

      this.getSubject = this.data.subject
      this.getTemplateType = this.data.templateType.templateType
      this.getMailData = this.data.mailBody

  }

    back(){
        //this.router.navigate([`go-letter-list/${this.goUuid}`]);
        this.router.navigate([`installment-process`]);
    }

    //print() {
        //var data = document.getElementById('downloadable-content');
        // html2canvas(data, {scale: 2}).then(canvas => {
        //     var myImage = canvas.toDataURL("image/png");
        //     var tmp = window.open("");
        //     tmp.document.body.innerHTML =
        //         "<img src=" + myImage + " alt='' style='width:100%;'>";
        //     setTimeout(() => {
        //         tmp.print();
        //         tmp.focus();
        //     }, 300);
        // });
    //}

    download() {
        var data = document.getElementById('downloadable-content');
        // html2canvas(data, {scale: 2}).then(canvas => {
        //     var imgWidth = 208;
        //     var imgHeight = canvas.height * imgWidth / canvas.width;

        //     const contentDataURL = canvas.toDataURL('image/png', 'high')

        //     let pdf = new jsPDF('p', 'mm', 'a4');
        //     var position = 0;
        //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        //     pdf.save(`GO-Letter-${this.datetime.getDate()}/${this.datetime.getMonth()}/${this.datetime.getFullYear()}-${this.data.subject}.pdf`);
        // });
    }

    openDialogForSend() {
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
                this.sendGoLetter();
            }
            dialogRef.close(true);
        });
    }

    sendGoLetter(){
        this.submitData = {
            "id": this.storeElement.element.id,
            "uuid": this.storeElement.element.uuid,
            "goCode": this.storeElement.element.goCode,
            "researcherProposalId": this.storeElement.element.installmentProcess.m1ResearcherProposalId.id,
            "installmentProcessId": this.storeElement.element.installmentProcessId,
            "installmentTypeId": this.storeElement.element.installmentTypeId,
            "fiscalYearId": this.storeElement.element.installmentProcess.fiscalYearResponse.id,
            "researchCatTypeId": this.storeElement.element.installmentProcess.researchCategoryType.id,
            "totalAmount": this.storeElement.element.totalAmount,
            "subject": this.storeElement.element.subject,
            "mailBody": this.storeElement.element.mailBody,
            "templateTypeId": this.storeElement.element.templateTypeId,
            "predefinedTemplateId": this.storeElement.element.predefineTemplate.id,
            "isSend": true,
        };

        this._createGoLetterServiceService.updateData(this.submitData).subscribe(
            res => {
                if (res.success) {
                    this.spinner = false;
                    this.toastr.success(res.message, "", this.config);
                    this.back();
                } else {
                    this.spinner = false;
                    this.toastr.error(res.message, "", this.config);
                }
            },
        )
    }

    print(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        window.open(`go-letter-list/${this.goUuid}`)
        //this.router.navigate([`go-letter-list/${this.goUuid}`]);
        document.body.innerHTML = originalContents;
    }

}
