import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { ProgressVerificationModel } from 'app/main/modules/training-institute/models/progress-verification.model';
import { ProgressVerificationService } from 'app/main/modules/training-institute/services/progress-verification.service';
import { reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-progress-verification-view',
    templateUrl: './progress-verification-view.component.html',
    styleUrls: ['./progress-verification-view.component.scss'],
})
export class ProgressVerificationViewComponent implements OnInit {
    spinner: boolean = false;
    displayedColumns: string[] = [
        'sl',
        'instituteName',
        'collectionDate',
        'receivedAmount',
        'mobileNo',
        'isChequeReceived',
        'signaturedDocument',
        'action',
    ];
    dataSource: MatTableDataSource<any>;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    fiscalYears: any[] = [];
    trainingInstitutes: any[] = [];
    userType: string = this._authService.getLoggedUserType();

    progressVerificationModel: ProgressVerificationModel =
        new ProgressVerificationModel();
    tempProgressVerificationId: string;
    progressVerificationId: number;
    deskOfficers: any[] = [];
    data: any = {}; //must have to check the data array declear same way

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: Router,
        private _authService: AuthService,
        private _activatedRoute: ActivatedRoute,
        private _progressVerificationService: ProgressVerificationService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.spinner = true;
        this.getViewPageInfo();
    }

    getViewPageInfo() {
        this.tempProgressVerificationId =
            this._activatedRoute.snapshot.paramMap.get(
                'progressVerificationId'
            );
        if (this.tempProgressVerificationId != null) {
            this.progressVerificationId = Number(
                this.tempProgressVerificationId
            );
        }
        this._authService.getAllUser().subscribe((res) => {
            res.map((user) => {
                if (user.userType === 'Rms_DO') {
                    this.deskOfficers.push(user);
                }
            });

            this._progressVerificationService
                .getProgressVerificationById(this.progressVerificationId)
                .subscribe((res) => {
                    this.spinner = false;
                    this.progressVerificationModel = res;

                    res.examiner = '';

                    if (!res.examinerUserId) {
                        res.examiner = '';
                    } else {
                        JSON.parse(res.examinerUserId).forEach((element) => {
                            let findData = this.deskOfficers.find(
                                (f) => f.id == element
                            );
                            if (findData) {
                                res.examiner += findData.name + ' ,';
                            }
                        });
                    }

                    // let deskOfficer = this.deskOfficers.find(
                    //     (deskOfficer) => deskOfficer.id === res.examinerUserId
                    // );
                    // res.examiner = deskOfficer.name;

                    console.log(
                        '---------------------- Res Data -----------------'
                    );
                    console.log(this.progressVerificationModel);
                });

            console.log(this.deskOfficers);
        });
    }

    viewDetails(id: number) {
        this.route.navigate(['cheque-collection/view/' + id]);
    }

    edit(id: number) {
        this.route.navigate(['cheque-collection/edit/' + id]);
    }

    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/VerificationReport';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['progressVerificationModel'] = JSON.stringify(
            this.progressVerificationModel
        );

        console.log(this.progressVerificationModel);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    print() {
        window.print();
    }
}
