import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { addNewIcon, nextIcon, previousIcon, saveIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { locale as lngEnglish } from "../../../i18n/en";
import { locale as lngBangla } from "../../../i18n/bn";
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { BudgetService } from 'app/main/modules/training-institute/services/budget.service';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { PartialFinalPaymentModel, PaymentBillVoucherModel } from "../../../../../../models/partial-final-payment.model";
import { TrainingBudgetModel } from "../../../../../../models/training-budget.model";
import { ProposalService } from "../../../../../../services/proposal.service";
import { ProposalModel } from "../../../../../../models/proposal.model";
import { AgreementService } from "../../../../../../services/agreement.service";
import { AgreementModel } from "../../../../../../models/agreement.model";
import { AgreementInstallmentModel } from "../../../../../../models/agreement-installments.model";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ExpeditureItemServiceService } from "../../../../../../../settings/services/expediture-item-service.service";
import { InstallmentModel } from "../../../../../../models/installment.model";
import { dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { JasperServiceService } from 'app/main/modules/rpm/services/jasper-service.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { OK } from 'app/main/core/constants/message';

@Component({
    selector: 'app-edit-submit-bill-voucher',
    templateUrl: './edit-submit-bill-voucher.component.html',
    styleUrls: ['./edit-submit-bill-voucher.component.scss']
})
export class EditSubmitBillVoucherComponent implements OnInit, OnChanges {

    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    // @Input() newPaymentModel: PartialFinalPaymentModel;
    newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();

    tempPaymentBillVouchers: PaymentBillVoucherModel[];

    // @Input() isEditable: boolean = false;
    isEditable: boolean = false;
    fiscalYearId: number;

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    isUpdatedAction: boolean;

    fiscalYears: any[] = [];
    trainingBudgets: TrainingBudgetModel[] = [];


    installmentType: String[] = [
        "First Installment",
        "Advanced Installment",
        "Adjustment Installment",
        "Final Installment",
    ];


    dataSource: MatTableDataSource<PaymentBillVoucherModel>;

    displayedColumns: string[] = ['sl', 'trainingBudgetId', 'totalBudget', 'expenditureAmount', 'vatAndTaxPercentage', 'vatAndTaxAmount', 'netPaymentAmount', 'voucherNumber'];
    proposals: ProposalModel[] = [];
    agreement: AgreementModel = new AgreementModel();
    agreementInstallments: AgreementInstallmentModel[] = [];
    agreementInstallment: AgreementInstallmentModel = new AgreementInstallmentModel();

    isButtonOk: boolean = false;
    itemOfExpenditures: any[] = [];
    installments: InstallmentModel[] = [];
    installment: InstallmentModel = new InstallmentModel();
    private total: number;
    private totalNetPayment = new Subject<number>();

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private _partialFinalPaymentService: PartialFinalPaymentService,
        private route: Router,
        private _budgetService: BudgetService,
        private _configurationService: ConfigurationService,
        private _proposalService: ProposalService,
        private _agreementService: AgreementService,
        private _expenditureItemServiceService: ExpeditureItemServiceService,
        private jasperService: JasperServiceService,
        private matSnackBar: SnackbarHelper,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        let agreementInstallment = new AgreementInstallmentModel();
        Object.assign(agreementInstallment, {
            percentageOfInstallment: 20,
            totalAmount: 100,
            installmentName: 'string'
        });
        this.agreementInstallment = agreementInstallment;
        this.agreementInstallments.push(agreementInstallment);
    }


    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            console.log('response ==== >>>>> ', res);
                            if (res) {
                                this.newPaymentModel.fiscalYearId = Number(res);
                                console.log('fiscale year ==== >>>> ', this.newPaymentModel.fiscalYearId);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }

    public getTotalNetPayment(): Observable<number> {
        return this.totalNetPayment.asObservable();
    }

    public setTotalNetPayment(totalNetPayment: number): void {
        this.totalNetPayment.next(totalNetPayment);
    }

    ngOnInit(): void {
        console.log(this.isEditable)
        this.getExpenditureItems();
        this._agreementService.getAgreementModel().subscribe(
            res => {
                this.agreement = res;
                this.agreementInstallments = this.agreement.agreementInstallments;               
            }
        )

        this.getPartialFinalPaymentModelData();

        this.checkIfEditable();

        this.getCurrentFiscalYear((res) => {
            this.getCurrentFiscalYearId();
        });

        this.getTotalNetPayment().subscribe(
            res => {
                if (res > this.agreementInstallment.totalAmount) {

                    if (this.total != res) {
                        this._toastrService.error("Total amount cannot be greater than installment amount", "Error")
                        this.isButtonOk = true;
                    }

                } else {
                    this.isButtonOk = false;
                }
                this.total = res;
            }
        )

        this._agreementService.getInstallments().subscribe(
            res => {
                this.installments = res;
                this.installments.map(installment => {
                    if (this.newPaymentModel?.installmentType.includes(installment.installmentName)) {
                        this.installment = installment;
                        if (this.installment.installmentName != "Advance Installment") {
                            this.newPaymentModel.installmentAmount = this.installment.totalAmount;
                            this.agreementInstallment.totalAmount = this.installment.totalAmount;
                        }
                    }
                });

                if (this.newPaymentModel.installmentType == "Advance Installment") {
                    this.installment = this.installments.find(installment => installment.installmentName === "Installment No: 1")
                    this.agreementInstallment.totalAmount = this.installment.totalAmount;
                }
            }
        );    
    }

    checkIfNewPaymentBillVoucherExist(proposalId: number) {
        this._budgetService.getResearchBudgetByProposalId(proposalId).subscribe(
            res => {

                this.trainingBudgets = res;
                for (let i = 0; i < this.trainingBudgets.length; i++) {
                    let isAvailable = false;
                    for (let j = 0; j < this.tempPaymentBillVouchers.length; j++) {
                        if (this.trainingBudgets[i].id == this.tempPaymentBillVouchers[j].trainingBudgetModel.id) {
                            this.tempPaymentBillVouchers[j].trainingBudgetId = this.trainingBudgets[i].id;
                            isAvailable = true;
                        }
                    }

                    if (!isAvailable) {
                        let paymentBillVoucherModel = new PaymentBillVoucherModel();
                        Object.assign(paymentBillVoucherModel, {
                            trainingBudgetModel: this.trainingBudgets[i],
                            trainingBudgetId: this.trainingBudgets[i].id,
                            expenditureAmount: 0,
                            vatAndTaxPercentage: 0,
                            vatAndTaxAmount: 0,
                            netPaymentAmount: 0,
                            voucherNumber: 0
                        });
                        this.tempPaymentBillVouchers.push(paymentBillVoucherModel)
                    }
                }

                // this.newPaymentModel.paymentBillVoucherModels = tempPaymentBillVoucherModels;
                this.dataSource = new MatTableDataSource(this.tempPaymentBillVouchers);
            },
            error => {
                console.log(error);
                this.dataSource = new MatTableDataSource();
            }
        )
    }

    getResearchBudgetByFiscalYear() {

        this.tempPaymentBillVouchers = []

        this._budgetService.getResearchBudgetByFiscalYear(this.newPaymentModel.fiscalYearId).subscribe(
            res => {
                this.trainingBudgets = res;
                // console.log(this.newPaymentModel.paymentBillVoucherModels)

                for (let i = 0; i < this.trainingBudgets.length; i++) {

                    let isAvailable = false;
                    for (let j = 0; j < this.tempPaymentBillVouchers.length; j++) {
                        if (this.trainingBudgets[i].id == this.tempPaymentBillVouchers[j].trainingBudgetModel.id) {
                            this.tempPaymentBillVouchers[j].trainingBudgetId = this.trainingBudgets[i].id;
                            isAvailable = true;
                        }
                    }
                    if (!isAvailable) {
                        let paymentBillVoucherModel = new PaymentBillVoucherModel();
                        Object.assign(paymentBillVoucherModel, {
                            trainingBudgetModel: this.trainingBudgets[i],
                            trainingBudgetId: this.trainingBudgets[i].id,
                            expenditureAmount: 0,
                            vatAndTaxPercentage: 0,
                            vatAndTaxAmount: 0,
                            netPaymentAmount: 0,
                            voucherNumber: 0
                        });
                        this.tempPaymentBillVouchers.push(paymentBillVoucherModel)
                    }
                }

                // this.newPaymentModel.paymentBillVoucherModels = tempPaymentBillVoucherModels;
                this.dataSource = new MatTableDataSource(this.tempPaymentBillVouchers);
                // console.log(this.trainingBudgets)
                // console.log(this.tempPaymentBillVouchers)
            },
            error => {
                console.log(error)
                this.dataSource = new MatTableDataSource();
            }
        )
    }

    getTotalAmountOf(propName) {
        if (this.newPaymentModel.paymentBillVoucherModels === undefined) return 0;

        let total: number = this.newPaymentModel.paymentBillVoucherModels.map(t => t[propName]).reduce((acc, value) => parseInt(acc) + parseInt(value), 0);

        if (propName == 'netPaymentAmount') {
            this.setTotalNetPayment(total);
        }
        return total;
    }

    calculateOtherFields(idx) {
        let tmpBillVoucher = this.tempPaymentBillVouchers[idx];
        // console.log(this.percentage(tmpBillVoucher.vatAndTaxPercentage, tmpBillVoucher.expenditureAmount))
        this.tempPaymentBillVouchers[idx].vatAndTaxAmount = this.percentage(tmpBillVoucher.vatAndTaxPercentage, tmpBillVoucher.expenditureAmount);
        this.tempPaymentBillVouchers[idx].netPaymentAmount = tmpBillVoucher.expenditureAmount + this.percentage(tmpBillVoucher.vatAndTaxPercentage, tmpBillVoucher.expenditureAmount);
    }

    save(isNext: boolean) {
        //   return;
        // this.newPaymentModel.paymentBillVoucherRequests = this.newPaymentModel.paymentBillVoucherModels;
        this.newPaymentModel.paymentBillVoucherModels = this.tempPaymentBillVouchers;
        this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);

        // console.log(this.newPaymentModel)
        this._partialFinalPaymentService.editPartialFinalPayment(this.newPaymentModel, this.newPaymentModel.id).subscribe(
            res => {
                // console.log(res);
                this._toastrService.success(saveSuccess, "Success");
                if (isNext)
                    this.nextTab()
                else
                    this.route.navigate(["/partial-and-final-payment"]);
            },
            error => {
                console.log(error);
                this._toastrService.error(saveFailed, "Error");
            }
        )
    }

    percentage(percent, total) {
        return parseInt(((percent / 100) * total).toFixed(2));
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    saveAndNext() {
        this.save(true)
    }

    getItemOfExpenditure(itemOfExpenditureId: number) {
        let itemOfExpenditure = this.itemOfExpenditures.find(iOE => iOE.id === itemOfExpenditureId);

        if (itemOfExpenditure)
            return itemOfExpenditure.expItemsName;
        else
            return "Not Found";
    }

    changeProposal(value: number) {
        let proposal = this.proposals.find(p => p.id === value);
        this.fiscalYearId = proposal.fiscalYearId;
        console.log('fiscalYearId ==== >>>> ', this.fiscalYearId);

        this._agreementService.getAgreementByProposalId(proposal.id).subscribe(
            res => {
                this.agreement = res;
                this.agreementInstallments = this.agreement.agreementInstallments;
                // console.log(this.agreement)
            },
            error => {
                if (error.status == 404)
                    this._toastrService.error(dataNotFount, "Error");
                else
                    this._toastrService.error("There's a problem on getting agreement", "Error");

            }
        )

        this.tempPaymentBillVouchers = []

        this._budgetService.getResearchBudgetByProposalId(this.newPaymentModel.proposalId).subscribe(
            res => {
                this.trainingBudgets = res;
                // console.log(this.newPaymentModel.paymentBillVoucherModels)

                for (let i = 0; i < this.trainingBudgets.length; i++) {

                    let isAvailable = false;
                    for (let j = 0; j < this.tempPaymentBillVouchers.length; j++) {
                        if (this.trainingBudgets[i].id == this.tempPaymentBillVouchers[j].trainingBudgetModel.id) {
                            this.tempPaymentBillVouchers[j].trainingBudgetId = this.trainingBudgets[i].id;
                            isAvailable = true;
                        }
                    }
                    if (!isAvailable) {
                        let paymentBillVoucherModel = new PaymentBillVoucherModel();
                        Object.assign(paymentBillVoucherModel, {
                            trainingBudgetModel: this.trainingBudgets[i],
                            trainingBudgetId: this.trainingBudgets[i].id,
                            expenditureAmount: 0,
                            vatAndTaxPercentage: 0,
                            vatAndTaxAmount: 0,
                            netPaymentAmount: 0,
                            voucherNumber: 0
                        });
                        this.tempPaymentBillVouchers.push(paymentBillVoucherModel)
                    }
                }

                // this.newPaymentModel.paymentBillVoucherModels = tempPaymentBillVoucherModels;
                this.dataSource = new MatTableDataSource(this.tempPaymentBillVouchers);
                // console.log(this.trainingBudgets)
                // console.log(this.tempPaymentBillVouchers)
            },
            error => {
                console.log(error)
                this.dataSource = new MatTableDataSource();
            }
        )

    }

    getTotalAmountOfTotal(totalBudget: string) {
        if (this.newPaymentModel.paymentBillVoucherModels === undefined) return 0;
        return this.newPaymentModel.paymentBillVoucherModels.map(t => t['trainingBudgetModel']['expenditureAmount']).reduce((acc, value) => acc + (value), 0);
    }

    onInstallmentChange(value: string) {
        this.agreementInstallment = this.agreement.agreementInstallments.find(a => a.installmentName === value)
        this.newPaymentModel.installmentType = this.agreementInstallment.installmentName;
        this.newPaymentModel.installmentAmount = this.agreementInstallment.totalAmount;
    }

    private getExpenditureItems() {
        this._expenditureItemServiceService.getAll().subscribe(
            res => {

                // let iOEItems: any[] = []
                // res.items.map(item => {
                //     if (item.expItemsFor == 'Institute_Items')
                //         iOEItems.push(item)
                // })
                // this.itemOfExpenditures = iOEItems
                this.itemOfExpenditures = res.items.filter(f => f.expItemsFor == 'Institute_Items' || f.expItemsFor == 'Both');
                console.log(this.itemOfExpenditures)
            },
            error => {
                console.log(error)
            }
        )
    }

    private getPartialFinalPaymentModelData() {
        this._partialFinalPaymentService.getPartialFinalPaymentModel().subscribe(
            res => {
                this.newPaymentModel = res;
                console.log(this.newPaymentModel);

                this.tempPaymentBillVouchers = this.newPaymentModel.paymentBillVoucherModels;

                console.log("----PaymentBillVouchers----")
                console.log(this.newPaymentModel.paymentBillVoucherModels)
                console.log(this.tempPaymentBillVouchers)

                this.agreementInstallment.installmentName = this.newPaymentModel.installmentType;
                this.agreementInstallment.totalAmount = this.newPaymentModel.installmentAmount;

                console.log("----Bill Agreement----")
                console.log(this.agreementInstallment)

                console.log(this.itemOfExpenditures)

                // this.newPaymentModel.paymentBillVoucherModels.map(pbvm => {
                //     console.log(this.itemOfExpenditures)
                //     let itemOfExpenditure = this.itemOfExpenditures.find(iOE => iOE.id == pbvm.trainingBudgetModel.itemOfExpenditureId)
                //
                //     console.log(itemOfExpenditure)
                //     pbvm.trainingBudgetModel.itemOfExpenditureName = itemOfExpenditure.itemOfExpenditureName;
                // })

                this.dataSource = new MatTableDataSource(this.tempPaymentBillVouchers);
                this.checkIfNewPaymentBillVoucherExist(this.newPaymentModel.proposalId)

            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )
    }

    private checkIfEditable() {
        this._partialFinalPaymentService.getIsEditable().subscribe(
            res => {
                this.isEditable = res;
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )
    }

    getCurrentFiscalYear(callBack) {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                callBack(true);
            },
            error => {
                console.log(error);
                callBack(true);
            }
        );
    }

    getCurrentFiscalYearId() {
        // this.jasperService.advertiseDateValidity().subscribe(validRes => {
        //     if (!validRes.success) {
        //         this.matSnackBar.openWarnSnackBarWithMessage(validRes.message, OK);
        //     }
        //     else {
        //         this.fiscalYears = this.fiscalYears.filter(f => f.id === validRes.stFiscalYearId);
        //     }
        // });
    }
}

