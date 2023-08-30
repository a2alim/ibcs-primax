import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {ExpeditureItemServiceService} from 'app/main/modules/settings/services/expediture-item-service.service';
import {BudgetService} from 'app/main/modules/training-institute/services/budget.service';
import {PartialFinalPaymentService} from 'app/main/modules/training-institute/services/partial-final-payment.service';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {NominatedInstituteService} from 'app/main/modules/training-institute/services/nominated-institute.service';
import {NominatedInstituteModel} from 'app/main/modules/training-institute/models/nominated-institute.model';

@Component({
    selector: 'app-e-documents-view',
    templateUrl: './e-documents-view.component.html',
    styleUrls: ['./e-documents-view.component.scss']
})
export class EDocumentsViewComponent implements OnInit {
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    spinner: boolean = false;
    partialFinalPaymentData: any;
    partialPaymentId: number;
    itemOfExpenditures: { expItemsFor: string, expItemsName: string, id: number }[];

    size: any;
    page: any;

    fiscalYears: any [] = [];
    trainingInstitutes: any[] = [];
    isShortListed: any;
    trainingInstituteId: any;
    nominatedInstitutes: NominatedInstituteModel[];
    fiscalYearId: any;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _budgetService: BudgetService,
        private _partialFinalPaymentService: PartialFinalPaymentService,
        private _expenditureItemServiceService: ExpeditureItemServiceService,
        private _nominatedInstituteService: NominatedInstituteService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // :page/:size/:isl/:tid/:fid
        this.page = Number(this._activatedRoute.snapshot.paramMap.get('page'));
        this.size = Number(this._activatedRoute.snapshot.paramMap.get('size'));

        let isl = this._activatedRoute.snapshot.paramMap.get('isl');

        if (isl == "undefined")
            this.isShortListed = undefined;
        else if (isl == "true")
            this.isShortListed = true;
        else if (isl == "false")
            this.isShortListed = false;

        this.fiscalYearId = Number(this._activatedRoute.snapshot.paramMap.get('fid'));
        this.trainingInstituteId = Number(this._activatedRoute.snapshot.paramMap.get('tid'));

    }

    ngOnInit(): void {
        this.getNominatedInstitutes();
    }

    getTrainingInstituteName(createdBy: number) {

        let trainingInstitute = this.trainingInstitutes.find(ti => ti.id == createdBy);

        if (trainingInstitute)
            return trainingInstitute.name;
        else
            return "Not Provided";
    }

    back() {
        this._router.navigate(['//nominate-institutes']);
    }

    download() {
    }

    print() {
        window.print();
    }

    getPartialFinalPaymentById() {
        this._partialFinalPaymentService.getPartialFinalPaymentById(this.partialPaymentId).subscribe(
            res => {
                console.log(res)
                this.partialFinalPaymentData = res;
                this.getResearchBudgetByFiscalYear();
            }
        );
    }

    getResearchBudgetByFiscalYear() {

        let ficalYearId = this.partialFinalPaymentData.fiscalYearId;
        this._budgetService.getResearchBudgetByFiscalYear(ficalYearId).subscribe(
            res => {
                let
                    paymentModels = this.partialFinalPaymentData.paymentBillVoucherModels;
                // concating totalBudget property to all payments object to show in the table
                for (let i = 0; i < paymentModels.length; i++) {
                    for (let j = 0; j < res.length; j++) {
                        if (res[j].id == paymentModels[i].trainingBudgetModel.id) {
                            paymentModels[i].totalBudget = res[j].expenditureAmount;

                        }
                    }
                }
                this.partialFinalPaymentData.paymentBillVoucherModels = paymentModels;
                console.log(this.partialFinalPaymentData.paymentBillVoucherModels)
            },
            error => {
                console.log(error)
            }
        )
    }

    private getNominatedInstitutes() {
        this._nominatedInstituteService.getNominateInstitutes(this.page, this.size, this.isShortListed,
            this.trainingInstituteId, this.fiscalYearId).subscribe(
            res => {
                this.nominatedInstitutes = res.data;
                console.log(this.nominatedInstitutes)
            },
            error => {
                console.log(error)
            }
        )
    }

    private getExpenditureItems() {
        this._expenditureItemServiceService.getAll().toPromise().then(
            res => {

                let iOEItems: any[] = []
                res.items.map(item => {
                    if (item.expItemsFor == 'Institute_Items' || item.expItemsFor == 'Both')
                        iOEItems.push(item)
                })
                this.itemOfExpenditures = iOEItems
            },
            error => {
                console.log(error)
            }
        )
    }

}

