import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import {
    PartialFinalPaymentModel,
    PaymentBillVoucherModel
} from 'app/main/modules/training-institute/models/partial-final-payment.model';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PredefinedTemplateServiceService } from "../../../../../../../settings/services/predefined-template-service.service";
import { MatSelectChange } from "@angular/material/select";
import { AgreementService } from "../../../../../../services/agreement.service";
import { AgreementModel } from "../../../../../../models/agreement.model";
import { ProposalModel } from "../../../../../../models/proposal.model";
import { ProposalService } from "../../../../../../services/proposal.service";
import { TemplateTypeServiceService } from "../../../../../../../settings/services/template-type-service.service";
import { BudgetService } from "../../../../../../services/budget.service";
import { PreviousPaymentModel } from "../../../../../../models/previous-payment.model";
import { dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
    selector: 'app-create-letter',
    templateUrl: './create-letter.component.html',
    styleUrls: ['./create-letter.component.scss']
})
export class CreateLetterComponent implements OnInit {

    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();


    test: any;
    // @Input() newPaymentModel: PartialFinalPaymentModel;
    newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();

    // @Input() isEditable: boolean = false;
    isEditable: boolean;


    @Input() partialPaymentId: number;
    // Icons for buttons
    saveIcon = saveIcon;

    templateTypeList: any[];
    predefinedTemplates: any[];
    agreement: AgreementModel = new AgreementModel();
    proposals: ProposalModel[] = [];
    selectedProposal: ProposalModel[] = [];

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    dataNotFount = dataNotFount;
    fiscaleYearId: number;

    agreementInstallments: { name: string, amount: number, totalAmount: number }[] =
        [
            { name: "Advance Installment", amount: 0, totalAmount: 0 },
            { name: "Adjustment & Installment No: 1", amount: 0, totalAmount: 0 },
            { name: "Installment No: 2", amount: 0, totalAmount: 0 },
            { name: "Installment No: 3", amount: 0, totalAmount: 0 },
            { name: "Installment No: 4", amount: 0, totalAmount: 0 }
        ];
    previousPaymentModels: PreviousPaymentModel[] = [];
    private trainingBudgets: any[];
    private tempPaymentBillVouchers: any[] = [];


    spinner: boolean;
    spinner1: boolean;
    spinner2: boolean;
    spinner3: boolean;
    spinner4: boolean;
    spinner5: boolean;
    spinner6: boolean;
    spinner7: boolean;

    spinner10: boolean;
    spinner11: boolean;

    installmentList: any[] = [];
    previousPayment: any[] = [];

    constructor(private _partialFinalPaymentService: PartialFinalPaymentService,
        private _toastrService: ToastrService,
        private route: Router,
        private templateTypeServiceService: TemplateTypeServiceService,
        private _predefinedTemplateServiceService: PredefinedTemplateServiceService,
        private _agreementService: AgreementService,
        private _proposalService: ProposalService,
        private _budgetService: BudgetService) {
        this.getTemplateType();
    }

    ngOnInit(): void {
        this.getPartialFinalPayment();
        this.getIsEditable();
        this.getTemplateService();
        this.getProposal();
    }


    onSubmite(isNext: boolean) {
        if (this.newPaymentModel.id) {
            this.beforeUpdate((res) => {
                if (res) {
                    this.onUpdate(isNext);
                }
            });
        } else {
            this.onSave(isNext);
        }
    }


    beforeUpdate(callback) {
        let tempData = this.newPaymentModel.paymentBillVoucherModels ? this.newPaymentModel.paymentBillVoucherModels : [];
        tempData.map(item => { item.trainingBudgetId = item.trainingBudgetId ? item.trainingBudgetId : item.trainingBudgetModel.id; });


        if (this.newPaymentModel.paymentBillVoucherModels != null) {
            this._budgetService.getResearchBudgetByProposalId(this.newPaymentModel.proposalId).toPromise().then(
                res => {
                    this.trainingBudgets = res;
                    this.tempPaymentBillVouchers = this.newPaymentModel.paymentBillVoucherModels;

                    for (let i = 0; i < this.tempPaymentBillVouchers.length; i++) {
                        let isAvailable = false;
                        for (let j = 0; j < this.trainingBudgets.length; j++) {
                            if (this.trainingBudgets[j].id == this.tempPaymentBillVouchers[i].trainingBudgetModel.id) {
                                isAvailable = true;
                            }
                        }

                        if (!isAvailable) {
                            this.tempPaymentBillVouchers.reduce((a, b) => {
                                if (a.id == this.tempPaymentBillVouchers[i].id) {
                                    this.tempPaymentBillVouchers.splice(i, 1);
                                }
                                return a;
                            }, 0);
                        }
                    }
                    this.newPaymentModel.paymentBillVoucherModels = this.tempPaymentBillVouchers;
                    this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                    callback(true);
                },
                error => {
                    console.log(error);
                    callback(false);
                }
            )

        }

        if (this.newPaymentModel.paymentBillVoucherModels == null) {
            this._budgetService.getResearchBudgetByProposalId(this.newPaymentModel.proposalId)
                .subscribe(
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
                                this.tempPaymentBillVouchers.push(paymentBillVoucherModel);
                            }
                        }
                        this.newPaymentModel.paymentBillVoucherModels = this.tempPaymentBillVouchers;
                        this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                        callback(true);
                    },
                    error => {
                        console.log(error);
                        callback(false);
                    }
                )

        }
    }

    save(isNext: boolean) {

        let tempData = this.newPaymentModel.paymentBillVoucherModels ? this.newPaymentModel.paymentBillVoucherModels : [];
        tempData.map(item => { item.trainingBudgetId = item.trainingBudgetId ? item.trainingBudgetId : item.trainingBudgetModel.id; });

        if (this.newPaymentModel.paymentBillVoucherModels != null) {

            this._budgetService.getResearchBudgetByProposalId(this.newPaymentModel.proposalId).toPromise().then(
                res => {
                    this.trainingBudgets = res;
                    this.tempPaymentBillVouchers = this.newPaymentModel.paymentBillVoucherModels;

                    for (let i = 0; i < this.tempPaymentBillVouchers.length; i++) {
                        let isAvailable = false;
                        for (let j = 0; j < this.trainingBudgets.length; j++) {
                            if (this.trainingBudgets[j].id == this.tempPaymentBillVouchers[i].trainingBudgetModel.id) {
                                isAvailable = true;
                            }
                        }
                        if (!isAvailable) {
                            this.tempPaymentBillVouchers.reduce((a, b) => {
                                if (a.id == this.tempPaymentBillVouchers[i].id) {
                                    this.tempPaymentBillVouchers.splice(i, 1);
                                }
                                return a;
                            }, 0);
                        }
                    }
                    this.newPaymentModel.paymentBillVoucherModels = this.tempPaymentBillVouchers;
                    this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                    this.saveNetworkCall(isNext);
                },
                error => {
                    console.log(error)
                }
            )

        } else {
            this.saveNetworkCall(isNext);
        }


        if (this.newPaymentModel.paymentBillVoucherModels == null) {
            this._budgetService.getResearchBudgetByProposalId(this.newPaymentModel.proposalId).subscribe(
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
                            this.tempPaymentBillVouchers.push(paymentBillVoucherModel);
                        }
                    }

                    this.newPaymentModel.paymentBillVoucherModels = this.tempPaymentBillVouchers;
                    this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                },
                error => {
                    console.log(error);
                }
            )

        }
    }

    changeProposal(value: number) {

        this.setFiscaYearIdByTitle(value);
        let proposal = this.proposals.find(p => p.id === value);
        this.brodCastChange.next(proposal.fiscalYearId);
        this.fiscaleYearId = proposal.fiscalYearId;
        this.newPaymentModel.proposalModel = proposal;

        this._partialFinalPaymentService.getPreviousPayments(value).subscribe(
            res => {
                this.previousPaymentModels = res;

                if (res.length > 0) {
                    this.previousPaymentModels.map(previousPayment => {
                        this.agreementInstallments.map(agreementInstallment => {
                            if (agreementInstallment.name == previousPayment.installmentType) {
                                this.agreementInstallments.splice(this.agreementInstallments.indexOf(agreementInstallment), 1);
                            }
                        });
                    });
                }
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        );

        this._agreementService.getInstallmentsByProposalId(value).subscribe(
            res => {
                // this._agreementService.setInstallments(res)
                console.log("---Installments---\n" + res);

                let arrLength = this.agreementInstallments.length;
                for (let j = 0; j < arrLength; j++) {
                    let isAvailable = false;
                    for (let i = 0; i < res.length; i++) {
                        if (this.agreementInstallments[j].name.includes(res[i].installmentName)) {
                            isAvailable = true;
                            break;
                        }
                    }
                    if (!isAvailable && this.agreementInstallments[j].name != "Advance Installment") {
                        this.agreementInstallments.splice(this.agreementInstallments.indexOf(this.agreementInstallments[j]), 1);
                        j = 0;
                        arrLength--;
                    }
                }

            },
            err => {
                console.log(err);
            }
        );

        // this._agreementService.getAgreementByProposalId(proposal.id).subscribe(
        //     res => {
        //         this.agreement = res;
        //         this.agreementInstallments = this.agreement.agreementInstallments;
        //
        //         console.log(this.agreement.agreementInstallments)
        //
        //         this._agreementService.setAgreementModel(this.agreement);
        //     },
        //     err => {
        //         this._toastrService.error(err.error.message, "Error");
        //         console.log(err);
        //     }
        // )


    }

    setFiscaYearIdByTitle(proposalId: any) {
        this.selectedProposal = this.proposals.filter(pro => pro.id = proposalId);
        sessionStorage.setItem('fiscalYearId', this.selectedProposal[0].fiscalYearId.toString());
    }

    saveAndUpdate() {
        this.nextTab();
    }

    saveAndNext() {
        this.save(true)
    }


    saveNetworkCall(isNext: boolean) {
        console.log('rrrrrrrrrrrrrr ----------- >>>> ' , this.newPaymentModel);
        this._partialFinalPaymentService.createPartialFinalPayment(this.newPaymentModel).subscribe(
            res => {
                // console.log(res);
                console.log('save response ==== >>>>> ', res);
                this.brodCastChange.next(this.fiscaleYearId);
                this.newPaymentModel.id = res.data
                this.isEditable = true

                console.log('this.newPaymentModel new ', this.newPaymentModel);
                this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                this._partialFinalPaymentService.setIsEditable(this.isEditable);
                // console.log(this.newPaymentModel)
                this._toastrService.success(saveSuccess, "Success");

                this._agreementService.getInstallmentsByProposalId(this.newPaymentModel.proposalId).subscribe(
                    res => {

                        console.log(res)
                        console.log('yes')
                        if (this.newPaymentModel.installmentType == "Adjustment & Installment No: 1") {
                            let advance = this.previousPaymentModels.find(f => f.installmentType == "Advance Installment");

                            console.log(advance)
                            res.map(installment => {
                                if (installment.installmentName == "Installment No: 1" && advance) {
                                    console.log(installment)
                                    console.log(advance)
                                    installment.totalAmount = installment.totalAmount - advance.installmentAmount;
                                }
                            })
                            console.log(res)
                        }

                        this._agreementService.setInstallments(res)
                        console.log("---Installments---\n" + res);


                        if (isNext)
                            this.nextTab()
                        else
                            this.route.navigate(["/partial-and-final-payment"]);

                    },
                    err => {
                        console.log(err);
                    }
                )
            },
            error => {
                this._toastrService.error("There's a problem on saving installment", "Error");
                console.log(error);
            }
        )


    }


    onChangeProposalNew(value) {
        // this.newPaymentModel = new PartialFinalPaymentModel();
        let proposal = this.proposals.find(p => p.id === value);
        this.newPaymentModel.fiscalYearId = proposal.fiscalYearId;

        this.getInstallmentsByProposalId(value, (res) => {
            if (res) {
                this.getPreviousPayments(value, (res) => {

                    console.log('this.previousPayment ', this.previousPayment);
                    console.log('this.installmentList ', this.installmentList);

                    this.agreementInstallments = this.agreementInstallments.filter(f => {
                        if (f.name == 'Advance Installment') return f;
                        if (f.name == 'Adjustment & Installment No: 1') return f;
                        let find = this.installmentList.find(f2 => f2.installmentName == f.name);
                        if (find) {
                            return f;
                        }
                    });

                    if (this.installmentList && this.previousPayment) {
                        this.installmentList.forEach(e1 => {
                            this.previousPayment.forEach(e2 => {
                                if (e1.installmentName == e2.installmentType) {
                                    this.agreementInstallments.splice(this.agreementInstallments.indexOf(this.agreementInstallments.find(f => f.name == e2.installmentType)), 1);
                                }
                            });
                        });
                    }

                    let f = this.previousPayment.find(f => f.installmentType == 'Advance Installment');
                    if (f) {
                        this.agreementInstallments = this.agreementInstallments.filter(f => f.name != 'Advance Installment');
                    }

                    let f2 = this.previousPayment.find(f => f.installmentType == 'Adjustment & Installment No: 1');
                    if (f2) {
                        this.agreementInstallments = this.agreementInstallments.filter(f => f.name != 'Adjustment & Installment No: 1');
                    }
                    console.log(this.agreementInstallments);
                });
            }
        });



    }

    getInstallmentsByProposalId(value, callback) {
        this.spinner = true;
        this._agreementService.getInstallmentsByProposalId(value).subscribe(
            res => {
                console.log('res ===== >>>>> ', res);
                this.installmentList = res;
                this.spinner = false;
                callback(true);
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
                this.spinner = false;
                callback(false);
            }
        );
    }

    getPreviousPayments(value, callBack) {
        this.spinner1 = true;
        this._partialFinalPaymentService.getPreviousPayments(value).subscribe(
            res => {
                console.log('res ===== >>>>> ', res);
                this.previousPayment = res;
                this.spinner1 = false;
                callBack(true);
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
                this.spinner1 = false;
                callBack(true);
            }
        );
    }


    getPartialFinalPayment() {
        this.spinner3 = true;
        this._partialFinalPaymentService.getPartialFinalPaymentModel().subscribe(
            res => {
                this.newPaymentModel = res;                
                this.spinner3 = false;
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
                this.spinner3 = false;
            }
        )
    }

    getIsEditable() {
        this.spinner4 = true;
        this._partialFinalPaymentService.getIsEditable().subscribe(
            res => {
                this.isEditable = res;
                this.spinner4 = false;
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
                this.spinner4 = false;
            }
        )
    }

    getTemplateService() {
        this.spinner5 = true;
        this._predefinedTemplateServiceService.getAll().subscribe(
            res => {
                this.predefinedTemplates = res.items;
                this.spinner5 = false;
                console.log('predefinedTemplates  ', this.predefinedTemplates);
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
                this.spinner5 = false;
            }
        );
    }

    getProposal() {
        this.spinner6 = true;
        this.proposals = [];
        this._agreementService.getProposalByTiUser().subscribe(
            res => {
                if (res) {
                    res.forEach(element => { this.proposals.push(element.proposalModel); });
                }
                this.spinner6 = false;
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
                this.spinner6 = false;
            }
        )
    }

    /*Get Predefine template via group*/
    onChangeTemplateType($event: MatSelectChange, addIn: string) {
        this._predefinedTemplateServiceService.getByTemplateTypeId($event.value).subscribe(res => {
            this.predefinedTemplates = res.items ? res.items : [];
        });
    }

    /*Get Predefine template text via Predefine id*/
    onChangePredefinedTemplateType($event: MatSelectChange, addIn: string) {
        const type = this.predefinedTemplates.find(f => f.id === $event.value);
        this.newPaymentModel.letterText = type.header;
    }

    /*Get  template  group*/
    getTemplateType() {
        this.templateTypeServiceService.getAllActive().subscribe(res => {
            this.templateTypeList = res.items ? res.items : [];
        });
    }

    selectLetter($event: MatSelectChange) {
        this.predefinedTemplates.map(item => {
            if (item.id == $event.value) {
            }
        });
    }






    onSave(isNext: boolean) {
        this.spinner10 = true;
        this._partialFinalPaymentService.createPartialFinalPayment(this.newPaymentModel).subscribe(
            res => {
                this.spinner10 = false;
                this.brodCastChange.next('');
                this.newPaymentModel.id = res.data;
                this.isEditable = true;               
                this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                this._partialFinalPaymentService.setIsEditable(this.isEditable);
                this._toastrService.success(saveSuccess, "Success");
                this.spinner11 = true;
                this._agreementService.getInstallmentsByProposalId(this.newPaymentModel.proposalId).subscribe(
                    res => {
                        this.spinner11 = false;
                        if (this.newPaymentModel.installmentType == "Adjustment & Installment No: 1") {
                            let advance = this.previousPaymentModels.find(f => f.installmentType == "Advance Installment");
                            res.map(installment => {
                                if (installment.installmentName == "Installment No: 1" && advance) {
                                    installment.totalAmount = installment.totalAmount - advance.installmentAmount;
                                }
                            });
                        }

                        console.log('res ===== >>>>> ', res);
                        this._agreementService.setInstallments(res);
                        //this.getPartialFinalPaymentById(this.newPaymentModel.id);
                        if (isNext)
                            this.nextTab();
                    },
                    err => {
                        this.spinner11 = false;
                        console.log(err);
                    }
                )
            },
            error => {
                this.spinner10 = false;
                this._toastrService.error("There's a problem on saving installment", "Error");
                console.log(error);
            }
        )
    }


    onUpdate(isNext: boolean) {
        this.spinner10 = true;
        this._partialFinalPaymentService.editPartialFinalPayment(this.newPaymentModel, this.newPaymentModel.id).subscribe(
            res => {
                this.newPaymentModel.id = res.data;
                this.spinner10 = false;
                this.brodCastChange.next(this.fiscaleYearId);
                this._toastrService.success(updateSuccess, "Success");


                this.spinner11 = true;
                this._agreementService.getInstallmentsByProposalId(this.newPaymentModel.proposalId).subscribe(
                    res => {
                        this.spinner11 = false;
                        if (this.newPaymentModel.installmentType == "Adjustment & Installment No: 1") {
                            let advance = this.previousPaymentModels.find(f => f.installmentType == "Advance Installment");
                            res.map(installment => {
                                if (installment.installmentName == "Installment No: 1" && advance) {
                                    installment.totalAmount = installment.totalAmount - advance.installmentAmount;
                                }
                            });
                        }
                       // this.getPartialFinalPaymentById(this.newPaymentModel.id);
                        this._agreementService.setInstallments(res);
                        if (isNext)
                            this.nextTab();

                    },
                    err => {
                        this.spinner11 = false;
                        console.log(err);
                    }
                )
            },
            error => {
                this.spinner10 = false;
                console.log(error);
                this._toastrService.error(updateFailed, "Error");
            }
        )
    }


    nextTab() {
        this.nextStep.emit(true);
    }

    getPartialFinalPaymentById(partialPaymentId: number) {
        this.spinner7 = true;
        this._partialFinalPaymentService.getPartialFinalPaymentById(partialPaymentId)
            .subscribe(
                res => {
                    this.newPaymentModel = res;
                    this.newPaymentModel.proposalId = res.proposalModel.id;
                    this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                    this._partialFinalPaymentService.setIsEditable(this.isEditable);
                    this.spinner7 = false;
                },
                error => {
                    this.spinner7 = false;
                }
            );
    }




}
