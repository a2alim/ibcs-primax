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
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { BudgetService } from 'app/main/modules/training-institute/services/budget.service';
import { ExpeditureItemServiceService } from 'app/main/modules/settings/services/expediture-item-service.service';
import { environment, reportBackend } from 'environments/environment';
import moment from "moment";
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-partial-and-final-payment-view',
    templateUrl: './partial-and-final-payment-view.component.html',
    styleUrls: ['./partial-and-final-payment-view.component.scss']
})
export class PartialAndFinalPaymentViewComponent implements OnInit {

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
    itemOfExpenditures: { expItemsFor: string, expItemsName: string, id: number }[];

    grantTotalBudget: number;
    grantTotalExpenditureAmount: number;
    grantTotalVatAndTaxAmount: number;
    grantTotalVatAndTaxPercentage: number;
    grantTotalNetPaymentAmount: number;

    trainingInstitutes: any[] = [];
    data: any = {};

    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;


    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _budgetService: BudgetService,
        private _partialFinalPaymentService: PartialFinalPaymentService,
        private _expenditureItemServiceService: ExpeditureItemServiceService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getExpenditureItems();
        this.partialPaymentId = Number(this.activateRoute.snapshot.paramMap.get('id'));
        if (this.partialPaymentId) {
            this.getPartialFinalPaymentById();
        }

    }

    getTrainingInstituteName(createdBy: number) {
        let trainingInstitute = this.trainingInstitutes.find(ti => ti.id == createdBy);
        if (trainingInstitute)
            return trainingInstitute.name;
        else
            return "Not Provided";
    }

    imgSrc(img, idx) {
        console.log(img)
        console.log(this.minioFileDownloadEndPointHost + img?.boucherImage?.bucketName + '/' + img?.boucherImage?.fileName)
        let path = this.minioFileDownloadEndPointHost + img?.boucherImage?.bucketName + '/' + img?.boucherImage?.fileName
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
        this._partialFinalPaymentService.getPartialFinalPaymentById(this.partialPaymentId).subscribe(
            res => {
                this.partialFinalPaymentData = res;               
                this.getResearchBudgetByFiscalYear();
                this.setGrantTotalFields(res);
                this.spinner1 = false;
            }
        );
    }

    getResearchBudgetByFiscalYear() {

        let ficalYearId = this.partialFinalPaymentData.fiscalYearId;
        this.spinner2 = true;
        this._budgetService.getResearchBudgetByFiscalYear(ficalYearId).subscribe(
            res => {
                let paymentModels = this.partialFinalPaymentData.paymentBillVoucherModels;
                // concating totalBudget property to all payments object to show in the table
                for (let i = 0; i < paymentModels.length; i++) {
                    for (let j = 0; j < res.length; j++) {
                        if (res[j].id == paymentModels[i].trainingBudgetModel.id) {
                            paymentModels[i].totalBudget = res[j].expenditureAmount;

                        }
                    }
                }
                this.partialFinalPaymentData.paymentBillVoucherModels = paymentModels;
                this.spinner2 = false;
            },
            error => {
                console.log(error);
                this.spinner2 = false;
            }
        )
    }

    getItemOfExpenditure(itemOfExpenditureId: number) {
        let itemOfExpenditure = this.itemOfExpenditures.find(iOE => iOE.id === itemOfExpenditureId);

        if (itemOfExpenditure)
            return itemOfExpenditure.expItemsName;
        else
            return "Not Found";
    }

    downloadVoucher(i: number) {
        window.open(this.minioFileDownloadEndPointHost + this.partialFinalPaymentData.paymentVoucherModels[i]?.boucherImage?.bucketName
            + '/' + this.partialFinalPaymentData.paymentVoucherModels[i]?.boucherImage?.fileName, "_blank");

    }

    private setGrantTotalFields(res) {
        this.grantTotalBudget = this.calculateFieldsTotalValue(res.paymentBillVoucherModels, "expenditureAmount", true);
        this.grantTotalExpenditureAmount = this.calculateFieldsTotalValue(res.paymentBillVoucherModels, "expenditureAmount", false);
        this.grantTotalVatAndTaxAmount = this.calculateFieldsTotalValue(res.paymentBillVoucherModels, "vatAndTaxAmount", false);
        this.grantTotalVatAndTaxPercentage = this.calculateFieldsTotalValue(res.paymentBillVoucherModels, "vatAndTaxPercentage", false);
        this.grantTotalNetPaymentAmount = this.calculateFieldsTotalValue(res.paymentBillVoucherModels, "netPaymentAmount", false);
    }

    private calculateFieldsTotalValue(data, propName, inTrainerBugetModel) {
        if (inTrainerBugetModel)
            return data.map(v => v.trainingBudgetModel[propName]).reduce((sum, val) => parseInt(sum) + parseInt(val));
        else
            return data.map(v => v[propName]).reduce((sum, val) => parseInt(sum) + parseInt(val));
    }

    private getExpenditureItems() {
        this.spinner3 = true;
        this._expenditureItemServiceService.getAll().toPromise().then(
            res => {               
                this.itemOfExpenditures = res.items.filter(f=>f.expItemsFor == 'Institute_Items' || f.expItemsFor=='Both');
                this.spinner3 = true;
            },
            error => {
                console.log(error);
                this.spinner3;
            }
        )
    }

    convertDate(installmentDate: any) {
        return moment(installmentDate).format('DD-MM-YYYY');
    }


    download($fileName = '') {        
        this.data.partialFinalPaymentData = JSON.stringify(this.partialFinalPaymentData);
        this.data.grantTotalBudget = this.grantTotalBudget;
        this.data.grantTotalExpenditureAmount = this.grantTotalExpenditureAmount;
        this.data.grantTotalVatAndTaxAmount = this.grantTotalVatAndTaxAmount;
        this.data.grantTotalVatAndTaxPercentage = this.grantTotalVatAndTaxPercentage;
        this.data.grantTotalNetPaymentAmount = this.grantTotalNetPaymentAmount;
        this.data['fileName'] = $fileName;
        this.data['currentLang'] = localStorage.getItem("currentLang");
        
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);        
    }
}
