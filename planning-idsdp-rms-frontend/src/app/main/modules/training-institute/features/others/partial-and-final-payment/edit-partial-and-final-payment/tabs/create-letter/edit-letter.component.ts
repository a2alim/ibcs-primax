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
import {MIN_EDITOR_CONFIG} from "../../../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-edit-letter',
    templateUrl: './edit-letter.component.html',
    styleUrls: ['./edit-letter.component.scss']
})
export class EditLetterComponent implements OnInit {

    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    fiscalYearId: number;


    test: any;
    // @Input() newPaymentModel: PartialFinalPaymentModel;
    newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();

    // @Input() isEditable: boolean = false;
    isEditable: boolean;


    @Input() partialPaymentId: number;
    // Icons for buttons
    saveIcon = saveIcon;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    templateTypeList: any[];
    predefinedTemplates: any[];
    agreement: AgreementModel = new AgreementModel();
    proposals: ProposalModel[] = [];
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
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

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
        this._partialFinalPaymentService.getPartialFinalPaymentModel().subscribe(
            res => {
                this.newPaymentModel = res;
                console.log('zzzzzzzzzzzzzzz ----- >>>> ',this.newPaymentModel);
                this.changeProposal(res.proposalModel.id);
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

        this._partialFinalPaymentService.getIsEditable().subscribe(
            res => {
                this.isEditable = res;
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

        this._predefinedTemplateServiceService.getAll().subscribe(
            res => {
                this.predefinedTemplates = res.items;
                // console.log(this.predefinedTemplates);
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

        this._proposalService.getProposals(2000, 0).toPromise().then(
            res => {
                this.proposals = res.data;
                // console.log(this.proposals);
                // this.changeProposal(this.newPaymentModel.proposalId)

            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

    }

    nextTab() {
        this.nextStep.emit(true);
    }

    save(isNext: boolean) {
        let tempData = this.newPaymentModel.paymentBillVoucherModels ? this.newPaymentModel.paymentBillVoucherModels : [];

        tempData.map(item => {
            item.trainingBudgetId = item.trainingBudgetId ? item.trainingBudgetId : item.trainingBudgetModel.id;
        });

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
                            this.tempPaymentBillVouchers.push(paymentBillVoucherModel)
                        }
                    }

                    this.newPaymentModel.paymentBillVoucherModels = this.tempPaymentBillVouchers;
                    this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                },
                error => {
                    console.log(error)
                }
            )

        }
    }

    changeProposal(value: number) {
        let proposal = this.proposals.find(p => p.id === value);
        this.fiscalYearId = proposal.fiscalYearId;
        console.log('fiscalYearId ==== >>>> ', this.fiscalYearId);

        this._partialFinalPaymentService.getPreviousPayments(value).subscribe(
            res => {
                this.previousPaymentModels = res;

                this.previousPaymentModels.map(previousPayment => {
                    this.agreementInstallments.map(agreementInstallment => {
                        if (agreementInstallment.name == previousPayment.installmentType
                            && agreementInstallment.name != this.newPaymentModel.installmentType) {
                            this.agreementInstallments.splice(this.agreementInstallments.indexOf(agreementInstallment), 1);
                        }
                    });
                })

            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

        this._agreementService.getInstallmentsByProposalId(value).subscribe(
            res => {
                // this._agreementService.setInstallments(res)

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
        )

    }

    saveAndUpdate() {
        this.nextTab();
    }

    saveAndNext() {
        this.save(true)
    }

    selectLetter($event: MatSelectChange) {

        this.predefinedTemplates.map(item => {
            if (item.id == $event.value) {

            }
        })
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

    onInstallmentChange(value: any) {

    }

    private saveNetworkCall(isNext: boolean) {
        this._partialFinalPaymentService.editPartialFinalPayment(this.newPaymentModel, this.newPaymentModel.id).subscribe(
            res => {

                this.brodCastChange.next(this.fiscalYearId);
                this._toastrService.success(updateSuccess, "Success");


                this._agreementService.getInstallmentsByProposalId(this.newPaymentModel.proposalId).subscribe(
                    res => {

                        if (this.newPaymentModel.installmentType == "Adjustment & Installment No: 1") {
                            let advance = this.previousPaymentModels.find(f => f.installmentType == "Advance Installment");

                            res.map(installment => {
                                if (installment.installmentName == "Installment No: 1" && advance) {
                                    installment.totalAmount = installment.totalAmount - advance.installmentAmount;
                                }
                            })
                            console.log(res)
                        }

                        this._agreementService.setInstallments(res)

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
                console.log(error);
                this._toastrService.error(updateFailed, "Error");
            }
        )
    }

    /*Get  template  group*/
    private getTemplateType() {
        this.templateTypeServiceService.getAllActive().subscribe(res => {
            this.templateTypeList = res.items ? res.items : [];
        });

    }
}
