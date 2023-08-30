import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import {
    downloadIcon,
    nextIcon,
    previousIcon,
    printIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { ExpeditureItemServiceService } from "../../../../../settings/services/expediture-item-service.service";
import { ExpenditureBudgetModel } from "../../../../models/ExpenditureBudgetModel";
import { InstallmentProcessExpenditureItemsModel } from "../../../../models/InstallmentProcessExpenditureItemsModel";
import { InstallmentProcessService } from "../../../../services/installment-process.service";
import { ResearcherProposalBudgetDetailsService } from "../../../../services/researcher-proposal-budget-details.service";
import { locale as lngBangla, locale as lngEnglish } from "../../i18n/en";

@Component({
    selector: 'app-expenditure-items',
    templateUrl: './expenditure-items.component.html',
    styleUrls: ['./expenditure-items.component.scss']
})
export class ExpenditureItemsComponent implements OnInit {
    @Input() getData: number;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Input() mode: string;
    @Input() installment: number;
    @Input() amount: number;
    @Input() installmentName: string;


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    nextIcon = nextIcon;
    saveIcon = saveIcon;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    expenditureItem: InstallmentProcessExpenditureItemsModel = new InstallmentProcessExpenditureItemsModel();

    ExpenditureItems: any = [];
    BudgetDetails: any = [];
    SavedExpenditureItems: any = [];

    newExpenditureItems: any = [];
    total: number = 0;
    expense: number = 0;
    receivable: number = 0;
    spinner: boolean = false;

    BudgetDetailsModels: ExpenditureBudgetModel[] = new Array();

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private expenditureItems: ExpeditureItemServiceService,
        private BudgetDetailsService: ResearcherProposalBudgetDetailsService,
        private Installmentprocess: InstallmentProcessService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getExpenditureItem();
        if (this.mode == 'edit') {
            this.getExpenditureById();
        } else {
            this.getProposalBudget();
        }
    }


    /*
     * Bottom Default Tab Options
     * */
    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    saveAndNext() {
        this.save()
        this.nextTab();
    }

    save() {
        this.Installmentprocess.createBudget(this.BudgetDetailsModels).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config)
                this.BudgetDetailsModels = [];
                this.BudgetDetailsModels = res.items;
                this.preparingDataUpdate()
                if (this.mode === 'edit') {
                    this.preparingDataUpdateEditMode();
                }

            } else {
                this.toastr.error(res.message, "", this.config)
            }
        }, error => {
            this.toastr.error('Http Error Happened !.', "", this.config)
        })

    }

    changeTemplateType($event: MatSelectChange) {
        let status = $event.value
        alert(status)

    }

    //get All expenditure from configure
    getExpenditureItem() {
        this.expenditureItems.getAll().subscribe(res => {
            if (res.success) {
                this.ExpenditureItems = res.items;

            }

        }, error => {

        })
    }


    //checkNewExpenditureItem

    getNewExpenditureItems(proposalId) {
        this.BudgetDetailsService.getByResearcherProposalId(proposalId).subscribe(res => {
            if (res.success) {
                this.newExpenditureItems = res.items;
                this.preparingDataEditMode();
            }

        });


    }


    getProposalBudget() {
        this.spinner = true
        this.BudgetDetailsService.getByResearcherProposalId(+localStorage.getItem("proposalIdForInstallment")).subscribe(res => {
            if (res.success) {
                this.BudgetDetails = res.items;
                this.preparingData();
                this.spinner = false

            }
        }, error => {
            this.spinner = false

        })
    }


    //////////////for update mode///////////
    getExpenditureById() {
        this.spinner = true
        this.Installmentprocess.getByProcessId(localStorage.getItem('m2_installment_process_id')).subscribe(res => {
            this.SavedExpenditureItems = res.items ? res.items : [];
            this.getNewExpenditureItems(res.items[0]?.m2InstallmentProcessId?.m1ResearcherProposalId?.id);
            this.spinner = false
        })

    }


    //Push saved data in BudgetDetailsModels with set Expenditure Items Name
    preparingDataEditMode() {

        this.SavedExpenditureItems.forEach(res => {

            this.ExpenditureItems.forEach(data => {
                if (data.id === res.stExpenditureItemId) {
                    //    pushing data
                    this.BudgetDetailsModels.push(
                        {
                            id: res.id,
                            uuid: res.uuid,
                            processId: +localStorage.getItem("m2_installment_process_id"),
                            stExpenditureItem: data.expItemsName,
                            stExpenditureItemId: res.stExpenditureItemId,
                            purpose: res.purpose,
                            totalAmount: res.totalAmount,
                            expenseAmount: res.expenseAmount,
                            receivableAmount: res.receivableAmount,
                            isEditable: res.isEditable
                        }
                    )

                }
            })


        })
        this.checkAvailability();
        this.getSum();


    }


    /*
    * now need to check new expenditure with proposal id getting from response
    * if available then set it in new items list
    * if check list grater than saved items then further process will be started
    * */

    checkAvailability() {
        let originalLength = this.newExpenditureItems.length;
        let savedLength = this.BudgetDetailsModels.length;
        if (originalLength > savedLength) {
            this.BudgetDetailsModels.forEach(budget => {
                this.newExpenditureItems.forEach((newexp, index) => {
                    if (budget.stExpenditureItemId === newexp.stExpenditureItemId) {
                        this.newExpenditureItems.splice(index, 1)
                    }

                })
            })

            /*
            * now need to set expenditure Name
            * */

            this.newExpenditureItems.forEach(nItems => {
                this.ExpenditureItems.forEach(expItems => {

                    if (nItems.stExpenditureItemId === expItems.id) {

                        this.BudgetDetailsModels.push(
                            {
                                id: null,
                                uuid: '',
                                processId: +localStorage.getItem("m2_installment_process_id"),
                                stExpenditureItem: expItems.expItemsName,
                                stExpenditureItemId: nItems.stExpenditureItemId,
                                purpose: nItems.purpose,
                                totalAmount: nItems.totalAmount,
                                expenseAmount: 0,
                                receivableAmount: nItems.totalAmount,
                                isEditable: true
                            }
                        )

                    }

                })


            })


            // this.BudgetDetailsModels.push(
            //     {
            //         id: null,
            //         uuid: '',
            //         processId: +localStorage.getItem("m2_installment_process_id"),
            //         stExpenditureItem:"test",
            //         stExpenditureItemId: 60,
            //         purpose:" res.purpose",
            //         totalAmount: 1000,
            //         expenseAmount: 0,
            //         receivableAmount: 100,
            //         isEditable: true
            //     }
            // )

        }


    }


    //set Exp Items Names for edit Mode After Save
    preparingDataUpdateEditMode() {
        let index = 0;

        this.SavedExpenditureItems.forEach(res => {

            this.ExpenditureItems.forEach(data => {
                if (data.id === res.stExpenditureItemId) {
                    //    pushing data
                    this.BudgetDetailsModels[index].stExpenditureItem = data.expItemsName

                }
            })

            index++
        })
        this.getSum();


    }

    /////////////////// End for Edit///////////////////


    preparingData() {

        this.BudgetDetails.forEach(res => {

            this.ExpenditureItems.forEach(data => {
                if (data.id === res.stExpenditureItemId) {
                    //    pushing data
                    this.BudgetDetailsModels.push(
                        {
                            id: null,
                            uuid: '',
                            processId: +localStorage.getItem("m2_installment_process_id"),
                            stExpenditureItem: data.expItemsName,
                            stExpenditureItemId: res.stExpenditureItemId,
                            purpose: res.purpose,
                            totalAmount: res.totalAmount,
                            expenseAmount: 0,
                            receivableAmount: res.totalAmount,
                            isEditable: true
                        }
                    )

                }
            })


        })
        this.getSum();


    }


    preparingDataUpdate() {
        let index = 0;

        this.BudgetDetails.forEach(res => {

            this.ExpenditureItems.forEach(data => {
                if (data.id === res.stExpenditureItemId) {
                    //    pushing data
                    this.BudgetDetailsModels[index].stExpenditureItem = data.expItemsName

                }
            })

            index++
        })
        this.getSum();


    }


    getSum() {
        this.total = 0;
        this.expense = 0;
        this.receivable = 0;
        this.BudgetDetailsModels.forEach(res => {
            this.total = this.total + res.totalAmount;
            this.expense = this.expense + res.expenseAmount;
            this.receivable = this.receivable + res.receivableAmount;
        })

    }

    getSumTotal() {
        let total = 0;
        this.BudgetDetailsModels.forEach(res => {
            total += res.expenseAmount;
        })
        return total
    }


    // modifyExpense(value: any, index: number) {
    //     let expense = this.BudgetDetailsModels[index].expenseAmount = value;
    //     let ta = this.BudgetDetailsModels[index].totalAmount;
    //     if (ta - expense < 0) {
    //         this.toastr.warning("Max Value: 0 to " + ta, "Alert!", this.config)
    //         this.BudgetDetailsModels[index].expenseAmount = 0;
    //         this.BudgetDetailsModels[index].receivableAmount = ta;
    //         this.getSum();
    //     } else {
    //         this.BudgetDetailsModels[index].receivableAmount = ta - expense;
    //         this.getSum();
    //     }
    //
    // }

    modifyExpense(value: any, index: number) {
        let expense = this.BudgetDetailsModels[index].expenseAmount = value;
        let ta = this.BudgetDetailsModels[index].totalAmount;

        const sumTotal = this.getSumTotal();
        console.log('t', sumTotal)
        console.log('a', this.amount)
        if (sumTotal > this.amount) {
            this.toastr.warning("Max Value: 0 to " + this.amount, "Alert!", this.config)
            this.BudgetDetailsModels[index].expenseAmount = 0;
            this.BudgetDetailsModels[index].receivableAmount = ta;
            this.getSum();
        } else {
            this.BudgetDetailsModels[index].receivableAmount = ta - expense;
            this.getSum();
        }

    }


}
