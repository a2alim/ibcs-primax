import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { BudgetService } from 'app/main/modules/training-institute/services/budget.service';
import { ExpeditureItemServiceService } from 'app/main/modules/settings/services/expediture-item-service.service';
import { environment, reportBackend } from 'environments/environment';
import moment from 'moment';
import { PaymentBillVoucherModel } from 'app/main/modules/training-institute/models/partial-final-payment.model';
import { TrainingBudgetModel } from 'app/main/modules/training-institute/models/training-budget.model';
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-partial-and-final-payment-view-two',
    templateUrl: './partial-and-final-payment-view-two.component.html',
    styleUrls: ['./partial-and-final-payment-view-two.component.scss'],
})
export class PartialAndFinalPaymentViewTwoComponent implements OnInit {
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;

    partialFinalPaymentData: any;
    partialPaymentId: number;
    itemOfExpenditures: {
        expItemsFor: string;
        expItemsName: string;
        id: number;
    }[];

    grantTotalBudget: number;
    grantTotalExpenditureAmount: number;
    grantTotalVatAndTaxAmount: number;
    grantTotalVatAndTaxPercentage: number;
    grantTotalNetPaymentAmount: number;

    trainingInstitutes: any[] = [];
    billVoucherList: any[] = [];
    trainingBudgets: TrainingBudgetModel[] = [];
    tempPaymentBillVouchers: PaymentBillVoucherModel[] = [];

    data: any = {};

    minioFileDownloadEndPointHost: string =
        environment.ibcs.minioFileDownloadEndPointHost;

    expenditureList: {
        expenditureId: string;
        budgetExpenditureAmount: number;
        expenditureAmount: number;
        vatAndTaxPercentage: number;
        vatAndTaxAmount: number;
        netPaymentAmount: number;
        voucherNumber: number;
    }[] = [];

    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _partialFinalPaymentService: PartialFinalPaymentService,
        private _expenditureItemServiceService: ExpeditureItemServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.getExpenditureItems();
        this.partialPaymentId = Number(
            this.activateRoute.snapshot.paramMap.get('id')
        );
        if (this.partialPaymentId) {
            this.getPartialFinalPaymentById();
        }
    }

    getTrainingInstituteName(createdBy: number) {
        let trainingInstitute = this.trainingInstitutes.find(
            (ti) => ti.id == createdBy
        );
        if (trainingInstitute) return trainingInstitute.name;
        else return 'Not Provided';
    }

    imgSrc(img, idx) {
        console.log(img);
        console.log(
            this.minioFileDownloadEndPointHost +
                img?.boucherImage?.bucketName +
                '/' +
                img?.boucherImage?.fileName
        );
        let path =
            this.minioFileDownloadEndPointHost +
            img?.boucherImage?.bucketName +
            '/' +
            img?.boucherImage?.fileName;
        // {{minioFileDownloadEndPointHost+img[i]?.boucherImage?.bucketName+'/'+img[i]?.boucherImage?.fileName}}
        // minioFileDownloadEndPointHost+img[i]?.boucherImage?.bucketName+'/'+img[i]?.boucherImage?.fileName
        return path;
    }

    backToCourseSchedule() {
        this._router.navigate(['/partial-and-final-payment']);
    }

    back() {
        this._router.navigate(['/partial-and-final-payment']);
    }

    print() {
        window.print();
    }

    getPartialFinalPaymentById() {
        this.spinner1 = true;
        this._partialFinalPaymentService
            .getPartialFinalPaymentNewById(this.partialPaymentId)
            .subscribe(
                (res) => {
                    this.partialFinalPaymentData = res.obj;
                    this.getBillVoucherByPartialFinalPaymentId(
                        this.partialFinalPaymentData.id
                    );
                    this.spinner1 = false;
                },
                (error) => {
                    console.log(error);
                    this.spinner1 = false;
                }
            );
    }

    getItemOfExpenditure(itemOfExpenditureId: number) {
        if (!this.itemOfExpenditures) {
            return;
        }

        let itemOfExpenditure = this.itemOfExpenditures.find(
            (iOE) => iOE.id === itemOfExpenditureId
        );

        if (itemOfExpenditure) return itemOfExpenditure.expItemsName;
        else return 'Not Found';
    }

    downloadVoucher(i: number) {
        window.open(
            this.minioFileDownloadEndPointHost +
                this.partialFinalPaymentData.paymentVoucherModels[i]
                    ?.boucherImage?.bucketName +
                '/' +
                this.partialFinalPaymentData.paymentVoucherModels[i]
                    ?.boucherImage?.fileName,
            '_blank'
        );
    }

    private setGrantTotalFields(res) {
        this.spinner4 = false;
        this.grantTotalBudget = this.calculateFieldsTotalValue(
            res,
            'budgetExpenditureAmount',
            false
        );
        this.grantTotalExpenditureAmount = this.calculateFieldsTotalValue(
            res,
            'expenditureAmount',
            false
        );
        this.grantTotalVatAndTaxAmount = this.calculateFieldsTotalValue(
            res,
            'vatAndTaxAmount',
            false
        );
        this.grantTotalVatAndTaxPercentage = this.calculateFieldsTotalValue(
            res,
            'vatAndTaxPercentage',
            false
        );
        this.grantTotalNetPaymentAmount = this.calculateFieldsTotalValue(
            res,
            'netPaymentAmount',
            false
        );
    }

    private calculateFieldsTotalValue(data, propName, inTrainerBugetModel) {
        if (inTrainerBugetModel)
            return data
                .map((v) => v.trainingBudgetModel[propName])
                .reduce((sum, val) => parseInt(sum) + parseInt(val));
        else
            return data
                .map((v) => v[propName])
                .reduce((sum, val) => parseInt(sum) + parseInt(val));
    }

    private getExpenditureItems() {
        this.spinner3 = true;
        this._expenditureItemServiceService
            .getAll()
            .toPromise()
            .then(
                (res) => {
                    this.itemOfExpenditures = res.items.filter(
                        (f) =>
                            f.expItemsFor == 'Institute_Items' ||
                            f.expItemsFor == 'Both'
                    );
                    this.spinner3 = false;
                },
                (error) => {
                    console.log(error);
                    this.spinner3 = false;
                }
            );
    }

    convertDate(installmentDate: any) {
        return moment(installmentDate).format('DD-MM-YYYY');
    }

    download($fileName = '') {
        this.billVoucherList.forEach((budget) => {
            this.expenditureList.push({
                expenditureId: this.getItemOfExpenditure(budget.expenditureId),
                budgetExpenditureAmount: budget.budgetExpenditureAmount,
                expenditureAmount: budget.expenditureAmount,
                vatAndTaxPercentage: budget.vatAndTaxPercentage,
                vatAndTaxAmount: budget.vatAndTaxAmount,
                netPaymentAmount: budget.netPaymentAmount,
                voucherNumber: budget.voucherNumber,
            });
        });

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/installmentInformation';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['partialFinalPaymentData'] = JSON.stringify(
            this.partialFinalPaymentData
        );

        this.data['billVoucherList'] = JSON.stringify(this.billVoucherList);
        this.data['expenditureList'] = JSON.stringify(this.expenditureList);

        this.data['grantTotalBudget'] = this.grantTotalBudget;

        this.data['grantTotalExpenditureAmount'] =
            this.grantTotalExpenditureAmount;
        this.data['grantTotalVatAndTaxPercentage'] =
            this.grantTotalVatAndTaxPercentage;
        this.data['grantTotalVatAndTaxAmount'] = this.grantTotalVatAndTaxAmount;
        this.data['grantTotalNetPaymentAmount'] =
            this.grantTotalNetPaymentAmount;

        console.log('this.expenditureList = ', this.expenditureList);
        //return 0;

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // download($fileName = '') {
    //     this.data.partialFinalPaymentData = JSON.stringify(this.partialFinalPaymentData);
    //     this.data.grantTotalBudget = this.grantTotalBudget;
    //     this.data.grantTotalExpenditureAmount = this.grantTotalExpenditureAmount;
    //     this.data.grantTotalVatAndTaxAmount = this.grantTotalVatAndTaxAmount;
    //     this.data.grantTotalVatAndTaxPercentage = this.grantTotalVatAndTaxPercentage;
    //     this.data.grantTotalNetPaymentAmount = this.grantTotalNetPaymentAmount;
    //     this.data['fileName'] = $fileName;
    //     this.data['currentLang'] = localStorage.getItem("currentLang");

    //     const form = document.createElement('form');
    //     form.target = '_blank';
    //     form.method = 'post';
    //     form.action = 'http://localhost/IPFF2/backend/public/api/test-pdf';
    //     var params = this.data;
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
    // }

    getBillVoucherByPartialFinalPaymentId(partialFinalPaymentId: number) {
        this.spinner4 = true;
        this._partialFinalPaymentService
            .getBillVoucherByPartialFinalPaymentId(partialFinalPaymentId)
            .subscribe(
                (response) => {
                    this.billVoucherList = response.items ? response.items : [];
                    this.billVoucherList = this.billVoucherList =
                        this.billVoucherList.map((m) => {
                            m.expenditureId =
                                m.trainingBudgetModel.itemOfExpenditureId;
                            m.budgetExpenditureAmount =
                                m.trainingBudgetModel.expenditureAmount;
                            return m;
                        });
                    this.setGrantTotalFields(this.billVoucherList);
                    this.spinner4 = false;
                },
                (error) => {
                    this.spinner4 = false;
                }
            );
    }
}
