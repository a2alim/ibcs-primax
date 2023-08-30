import { Component, OnInit } from '@angular/core';
import { AwardLatterService } from "../../../../services/award-latter.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
    downloadIcon,
    previousIcon,
    printIcon,
    refreshIcon,
    saveIcon,
    sendIcon,
    editIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { EmailModel } from "../../../../../../shared/model/email.model";
import { ToastrService } from "ngx-toastr";
import { EmailService } from "../../../../../../shared/services/email.service";
import { AwardLatterModel } from "../../../../models/AwardLatterModel";
import { StorageService } from "../../../../../../core/services/storage/storage.service";
import { AuthService } from "../../../../../auth/services/auth.service";
import { locale as lngEnglish } from "../../../../../rpm/features/latter/i18n/en";
import { locale as lngBangla } from "../../../../../rpm/features/latter/i18n/bn";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-award-letter-view',
    templateUrl: './award-letter-view.component.html',
    styleUrls: ['./award-letter-view.component.scss']
})
export class AwardLetterViewComponent implements OnInit {
    data: any = {};

    constructor(private _latterService: AwardLatterService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private emailService: EmailService,
        private storageService: StorageService,
        private _authService: AuthService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    letterId: any;
    latterModelResponse: any;
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    sendIcon = sendIcon;
    printIcon = printIcon;
    editIcon = editIcon;
    spinner2: boolean = false;
    spinner: boolean = false;
    latter: AwardLatterModel = new AwardLatterModel();
    userData: any
    trainingInstitutes: any;

    ngOnInit(): void {
        this.letterId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.letterId) {
            this.getAwardLEtter(res => {
                if (res) {
                    this.getAllTrainersInstitutesList(this.latterModelResponse.proposalModel.trainingInstituteProfileModel.userId);
                }
            })

        }
    }

    private getAllTrainersInstitutesList(id) {
        this._authService.getUserDetailsById(id).subscribe(result => {
            // result.forEach(ti => {
            //     if (ti.userType === 'Rms_Training_Institute') {
            //         this.trainingInstitutes.push(ti);
            //     }
            // })

            this.trainingInstitutes = result
        })
    }



    getAwardLEtter(callback) {
        this._latterService.getLetterById(this.letterId).subscribe(res => {
            if (res) {
                this.latterModelResponse = res
                callback(true)
            }
        }, error => {
            callback(false)
            this.toastr.error("Http error!!", "Http Error", this.config);
        })
        callback(false)
    }

    sendMail() {
        this.updateSentStatus();

    }

    private updateSentStatus() {

        let emailModel = new EmailModel();
        emailModel.to = this.latterModelResponse.proposalModel.trainingInstituteProfileModel.email;
        emailModel.subject = this.latterModelResponse.subject;
        emailModel.body = this.latterModelResponse.mailBody,
            emailModel.templateName = 'default-email-template',
            emailModel.isAttachment = false,

            this.spinner = true;
        this.emailService.sentEmail(emailModel).subscribe(
            res => {
                if (res.status) {
                    this.latter = {
                        subject: this.latterModelResponse.subject,
                        mailBody: this.latterModelResponse.mailBody,
                        mailStatus: true,//this.latterModelResponse.mailStatus,
                        letterType: '1',
                        status: 'Sent',
                        memorandumNo: this.latterModelResponse.memorandumNo,
                        nothiDateBn: this.latterModelResponse.nothiDateBn,
                        nothiDateEn: this.latterModelResponse.nothiDateEn,
                        fiscalYearId: this.latterModelResponse.fiscalYearId,
                        proposalId: this.latterModelResponse.proposalModel.id
                    }
                    this._latterService.editData(this.letterId, this.latter).subscribe(
                        data => {
                            if (data) {
                                this._router.navigate(['/ti-award-letter'])
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
        this._router.navigate(['/ti-award-letter'])

    }

    /*  download(awardLetter: string) {
 
     } */
    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/awrd_letter_view';
        this.data['lng'] = localStorage.getItem("currentLang");
        this.data['latter'] = JSON.stringify(this.latterModelResponse);
        this.data['trainingInstitutes'] = this.trainingInstitutes.name;
        this.data['address'] = this.latterModelResponse.proposalModel.trainingInstituteProfileModel.permanentAddress;


        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

}
