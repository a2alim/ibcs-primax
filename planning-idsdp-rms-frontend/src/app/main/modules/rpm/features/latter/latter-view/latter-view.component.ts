import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ApiService } from "../../../../../core/services/api/api.service";
import { ToastrService } from "ngx-toastr";
import { GlobalValidationServiceService } from "../../../../../core/services/global-validation-service.service";
import { SnackbarHelper } from "../../../../../core/helper/snackbar.helper";
import { MatDialog } from "@angular/material/dialog";
import { DataComService } from "../../../../../core/services/data-com/data-com.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateLetterGedServiceService } from "../../../services/create-letter-ged-service.service";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import {
    downloadIcon,
    previousIcon,
    printIcon,
    refreshIcon,
    saveIcon,
    sendIcon,
    editIcon,
} from '../../../constants/button.constants';
import { LatterService } from "../../../services/latter.service";
import { LatterModel } from "../../../models/LatterModel";
import { FiscalYearServiceService } from "../../../../settings/services/fiscal-year-service.service";
import { environment, reportBackend } from 'environments/environment';
import { EmailService } from 'app/main/shared/services/email.service';
import { EmailModel } from 'app/main/shared/model/email.model';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { sdgsGoalsList } from '../../../contants/sdgs-goals-list.constant';
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-latter-view',
    templateUrl: './latter-view.component.html',
    styleUrls: ['./latter-view.component.scss']
})
export class LatterViewComponent implements OnInit {
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    sendIcon = sendIcon;
    printIcon = printIcon;
    editIcon = editIcon;
    spinner: boolean;
    latterModelResponse: any;
    proposalId: number
    rmsUserSignatureId: number;

    spinner2: boolean = false;

    letterId: string;
    fiscalYear: string;

    minioHost = environment.ibcs.minioEndPointHost;

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    latter: LatterModel = new LatterModel();
    user: any = {};
    sdgsGoalsList = sdgsGoalsList;
    data: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private gedService: CreateLetterGedServiceService,
        private fiscalYearServiceService: FiscalYearServiceService,
        private _router: Router,
        private _latterService: LatterService,
        private emailService: EmailService,
        private storage: StorageService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        //Id
        this.letterId = this._activatedRoute.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.user = this.storage.getUserData();
        this.getLatterById();
        this.getLetterDetailsById();
    }

    getLatterById() {
        this.spinner = true;
        this._latterService.getLetterById(this.letterId).subscribe(value => {
            if (value.success) {
                this.proposalId = value.obj.researcherProposalId.id;
                this.rmsUserSignatureId = value.obj.rmsUserSignatureId.id;
            }
            // this.getFiscalYearList();
            this.spinner = false;
        }, error => {
            this.toastr.error('Data Not Found!');
            this.spinner = false;
        });
    }

    getLetterDetailsById() {
        this.spinner = true;
        this._latterService.getLetterDetailsById(this.letterId).subscribe(
            value => {
                if (value.success) {
                    this.latterModelResponse = value.obj;
                }
                this.spinner = false;
            }, error => {
                this.toastr.error('Data Not Found!');
                this.spinner = false;
            });
    }

    sendMail() {
        this.updateSentStatus();
    }

    print() {
        console.log('Print click!');
    }

    private getFiscalYearList() {
        this.fiscalYearServiceService.getAll().subscribe(value => {
            this.fiscalYear = value.items.filter(item => item.id === this.latterModelResponse.researcherProposalId.stFiscalYearId)[0].fiscalYear;
        })
    }

    private updateSentStatus() {

        let emailModel = new EmailModel();
        emailModel.to = this.latterModelResponse.emailAddress;
        emailModel.subject = this.latterModelResponse.subject;
        emailModel.body = this.latterModelResponse.mailBody,
            emailModel.templateName = 'default-email-template',
            emailModel.isAttachment = false,

            this.spinner = true;
        this.emailService.sentEmail(emailModel).subscribe(
            res => {
                if (res.status) {
                    this.latter = {
                        researcherProposalId: this.proposalId,
                        subject: this.latterModelResponse.subject,
                        mailBody: this.latterModelResponse.mailBody,
                        mailStatus: true,//this.latterModelResponse.mailStatus,
                        letterType: '1',
                        status: 'Sent',
                        rmsUserSignatureId: this.rmsUserSignatureId,
                        memorandumNo: this.latterModelResponse.memorandumNo,
                        nothiDateBn: this.latterModelResponse.nothiDateBn,
                        nothiDateEn: this.latterModelResponse.nothiDateEn
                    }
                    this._latterService.editData(this.letterId, this.latter).subscribe(
                        data => {
                            if (data.success) {
                                this.router.navigate(['/letter'])
                                this.toastr.success(data.message, "", this.config);
                            } else {
                                this.toastr.error(data.message, "", this.config);
                            }
                        },
                        error => {
                            console.log('update error', error);
                            this.toastr.error('Something went wrong!', "", this.config);
                        }
                    )
                }

                this.spinner = false;
            },
            err => {
                console.log('Mail send error', err);
                this.spinner = false;
            }
        )

    }

    previous() {
        this.router.navigate(['/letter']);
    }

    gotoPrevious() {

    }



    printDiv(divName) {
        //window.location.href = window.location.href;
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        //return false;
        window.location.reload();
        document.body.innerHTML = originalContents;
    }


    showSdgsGoalS(getVal: string) {
        if (!getVal) {
            return '';
        }
        let data = JSON.parse(getVal);
        let sdgsGoalS = '';
        data.forEach(e => {
            this.sdgsGoalsList.forEach(e1 => {
                if (e == e1.id) {
                    sdgsGoalS += e1.name + ' , ';
                }
            });
        });
        return sdgsGoalS;
    }

    // download(){
    //     const form = document.createElement('form');
    //     form.target = '_blank';
    //     form.method = 'post';
    //     form.action = 'http://localhost/IPFF2/backend/public/api/test-pdf';
    //     var params = this.latterModelResponse;
    //     for (const key in params) {
    //         if (params.hasOwnProperty(key)) {
    //             const hiddenField = document.createElement('input');
    //             hiddenField.type = 'hidden';
    //             hiddenField.name = key;
    //             hiddenField.value = params[key];
    //             form.appendChild(hiddenField);
    //         }
    //     }
    //     document.body.appendChild(form);
    //     form.submit();
    //  }



     download($fileName = '', $templateName) {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = $templateName;
        this.data['lng'] = localStorage.getItem("currentLang");
        this.data['latter'] = JSON.stringify(this.latterModelResponse);
        this.data['latterUserName'] = JSON.stringify(this.latterModelResponse.userDto);

        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
        
        // const form = document.createElement('form');
        // form.target = '_blank';
        // form.method = 'post';

        // form.action = `${reportBackend}/pdf-generate-post`
        // var params = this.data;
        // for (const key in params) {
        //     if (params.hasOwnProperty(key)) {
        //         const hiddenField = document.createElement('input');
        //         hiddenField.type = 'hidden';
        //         hiddenField.name = key;
        //         hiddenField.value = params[key];
        //         form.appendChild(hiddenField);
        //     }
        // }
        // document.body.appendChild(form);
        // form.submit();
    }
}
