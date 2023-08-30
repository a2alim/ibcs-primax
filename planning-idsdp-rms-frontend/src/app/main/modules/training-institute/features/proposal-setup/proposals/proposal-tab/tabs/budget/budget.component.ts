import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { BudgetService } from "../../../../../../services/budget.service";
import { ExpeditureItemServiceService } from "../../../../../../../settings/services/expediture-item-service.service";
import { ConfigurationService } from "../../../../../../../settings/services/configuration.service";
import { TrainingBudgetModel } from "../../../../../../models/training-budget.model";
import { AuthService } from "../../../../../../../auth/services/auth.service";
import { ProposalService } from "../../../../../../services/proposal.service";
import { ProposalModel } from "../../../../../../models/proposal.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    deleteFailed,
    deleteSuccess,
    editIcon,
    nextIcon,
    previousIcon,
    saveFailed,
    saveSuccess,
    updateFailed,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-budget',
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit, OnChanges {

    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Input() existingProposal: ProposalModel;

    canSave: boolean;
    existingProposalId: number;
    nextIcon = nextIcon;

    spinner: boolean = false;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'itemOfExpenditure', 'expenditureTaka', 'action'];
    dataSource: MatTableDataSource<any>;

    trainingBudget: TrainingBudgetModel = new TrainingBudgetModel();
    researchBudgetResponses: TrainingBudgetModel[] = [];

    itemOfExpenditures: { expItemsFor: string, expItemsName: string, id: number }[];
    fiscalYears: { id: number, fiscalYear: string, active: boolean }[] = [];
    userType: string = this._authService.getLoggedUserType();

    proposals: ProposalModel[] = [];

    budgetForm: FormGroup;
    fiscalYearId: string;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    previousIcon = previousIcon;
    editIcon = editIcon;
    isUpdateed = false;
    courseScheduleId: any;
    showExpenditureItem: boolean;


    spinner1: boolean;
    spinner2: boolean;
    spinner3: boolean;
    spinner4: boolean;
    spinner5: boolean;
    totalExpenditureAmount: number;
    totalExpenditureAmountStore: number;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private _authService: AuthService,
        private dialog: MatDialog,
        private budgetService: BudgetService,
        private _expenditureItemServiceService: ExpeditureItemServiceService,
        private _configurationService: ConfigurationService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.formTitle = 'Add';
        this.getFiscalYears();
        this.getExpenditureItems();

        this.budgetForm = this._formBuilder.group({
            "id": [""],
            "itemOfExpenditureId": ["", { validators: [Validators.required] }],
            "expenditureAmount": ["", { validators: [Validators.required] }],
            "fiscalYearId": ["",],
            "proposalId": ["",],
            "expenditureName": ["",]
        });
        this.getAvailableFiscalYear();
    }

    getAvailableFiscalYear() {
        this._configurationService.getActiveFiscalYear().subscribe(res => {
            this.totalExpenditureAmount = res.tiBudgetAmount;
            this.totalExpenditureAmountStore = res.tiBudgetAmount;
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposal': {
                        if (this.existingProposal.id) {
                            this.canSave = true;
                            this.existingProposalId = this.existingProposal.id;
                            // this.getListData();
                            this.getAllListData();
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.existingProposalId = res.id;
                                // this.getListData();
                                this.getAllListData();
                            }
                        });
                        break;
                    }
                }
            }
        }
    }


    getListData() {
        if (!this.existingProposalId) {
            return;
        }
        this.researchBudgetResponses = [];
        this.spinner = true;
        this.budgetService.getListData(this.pageSize, this.page, this.existingProposalId).subscribe(
            res => {
                this.totalElements = res.totalItems;
                this.researchBudgetResponses = res.data;
                let data: any[] = this.researchBudgetResponses;
                for (let i = 0; i < data.length; i++) {
                    data[i].itemOfExpenditure = this.getItemOfExpenditure(data[i].itemOfExpenditureId);
                    data[i].fiscalYear = this.getFiscalYearName(data[i].fiscalYearId);
                }
                this.dataSource = new MatTableDataSource(data);
                this.spinner = false;
            },
            error => {
                console.log(error);
                this.spinner = false;
            }
        );
    }

    getAllListData() {
        if (!this.existingProposalId) {
            return;
        }
        this.researchBudgetResponses = [];
        this.spinner = true;
        this.budgetService.getResearchBudgetByProposalId(this.existingProposalId).subscribe(
            res => {
                this.researchBudgetResponses = res;
                for (let i = 0; i < this.researchBudgetResponses.length; i++) {
                    this.researchBudgetResponses[i].itemOfExpenditure = this.getItemOfExpenditure(this.researchBudgetResponses[i].itemOfExpenditureId);
                    this.researchBudgetResponses[i].fiscalYear = this.getFiscalYearName(this.researchBudgetResponses[i].fiscalYearId);
                }
                this.spinner = false;
            },
            error => {
                console.log(error);
                this.spinner = false;
            }
        );
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        console.log(+event.pageSize);
        console.log(+event.pageIndex);
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData()
    }

    /*---- For open popup dialog box----*/
    openDialog(rowUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteBudget(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        }

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /*------------------------/Insert form functions----------------------*/
    saveData() {

        let amount = this.getTotal() + this.budgetForm.value.expenditureAmount;
        if (this.totalExpenditureAmountStore < amount) {
            this.toastr.warning('Exceeded Total Expenditure Amount!')
            return;
        }

        let formD = Object.assign(this.trainingBudget, this.budgetForm.value);
        formD.proposalId = this.existingProposalId;
        formD.fiscalYearId = this.existingProposal.fiscalYearId;

        if (!(formD.itemOfExpenditureId || formD.expenditureName) || !formD.expenditureAmount) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        let filter = this.researchBudgetResponses.filter(f => f.itemOfExpenditureId === formD.itemOfExpenditureId);
        if (filter.length > 0) {
            this.toastr.warning("Expenditure already exist !.", "Warning", this.config);
            return;
        }

        if (formD.id) {
            this.spinner2 = true;
            this.budgetService.editBudget(formD.id, formD).subscribe(
                res => {
                    this.toastr.success(updateSuccess, "Success", this.config);
                    this.getListData();
                    this.getExpenditureItems();
                    this.trainingBudget = new TrainingBudgetModel();
                    this.spinner2 = false;
                },
                (err) => {
                    console.log('err ==== >>>>> ', err);
                    this.spinner2 = false;
                }
            );
        } else {
            this.spinner2 = true;
            this.budgetService.createBudget(formD).subscribe(
                res => {
                    this.toastr.success(saveSuccess, "Success", this.config);
                    this.getListData();
                    this.getExpenditureItems();
                    this.trainingBudget = new TrainingBudgetModel();
                    this.spinner2 = false;
                },
                (err) => {
                    console.log('err ==== >>>>> ', err);
                    this.spinner2 = false;
                }
            );
        }
        this.budgetForm.reset();

    }
    /*------------------------Insert form functions----------------------*/


    editRow(id: number) {

        this.trainingBudget = new TrainingBudgetModel();
        this.trainingBudget = this.researchBudgetResponses.find(rb => rb.id == id);

        this.budgetForm.setValue({
            id: this.trainingBudget.id,
            itemOfExpenditureId: this.trainingBudget.itemOfExpenditureId,
            expenditureAmount: this.trainingBudget.expenditureAmount,
            fiscalYearId: this.trainingBudget.fiscalYearId,
            proposalId: this.trainingBudget.proposalModel ? this.trainingBudget.proposalModel.id : this.existingProposalId,
            expenditureName: ''
        });
    }

    getItemOfExpenditure(itemOfExpenditureId: number) {
        let itemOfExpenditure = this.itemOfExpenditures.find(iOE => iOE.id === itemOfExpenditureId);

        if (itemOfExpenditure)
            return itemOfExpenditure.expItemsName;
        else
            return "XYZ Expenditure";
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    private getFiscalYears() {
        this.spinner4 = true;
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                this.spinner4 = false;
            },
            error => {
                console.log(error);
                this.spinner4 = false;
            }
        )
    }

    private getExpenditureItems() {
        this.spinner5 = true;
        this._expenditureItemServiceService.getAll().toPromise().then(
            res => {
                let iOEItems: any[] = []
                res.items.map(item => {
                    if (item.expItemsFor == 'Institute_Items' || item.expItemsFor == 'Both')
                        iOEItems.push(item)
                })
                this.itemOfExpenditures = iOEItems;
                this.itemOfExpenditures.unshift({ expItemsFor: '', expItemsName: '------ ADD NEW -----', id: 0, });
                this.getListData();
                this.spinner5 = false;
            },
            error => {
                console.log(error);
                this.spinner5 = false;
            }
        )
    }

    private deleteBudget(rowUuid) {
        this.budgetService.deleteBudget(rowUuid).subscribe(
            res => {
                console.log(res)
                this.toastr.success(deleteSuccess, "Success", this.config);
                this.getListData();
                this.trainingBudget = new TrainingBudgetModel();
            },
            () => {
                this.toastr.error(deleteFailed, "Error", this.config);
            }
        );
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    // saveAndNextData() {
    //     this.saveData();
    //     this.nextTab();
    // }

    setFiscalYear($event: any) {
        this.fiscalYearId = $event.value;
        this.getListData();
    }

    reseat() {
        this.trainingBudget = new TrainingBudgetModel();
    }


    onChangeExpenditureItem(event, index) {
        if (event.value) {
            console.log('true ================ >>>>> ');
            setTimeout(() => {
                this.showExpenditureItem = false;
                this.trainingBudget.expenditureName = null;
            }, 100);
        } else {
            console.log('false ================ >>>>> ');
            setTimeout(() => {
                //this.budgetDetails[index].stExpenditureItemId = null;
                this.showExpenditureItem = true;
            }, 100);
        }
    }


    // ==================== previous =======================
    // if (this.userType === "Rms_DO") {
    //     res.data.forEach(result => {
    //         if (result.submitted === true) {
    //             if (Number(result.fiscalYearId) === Number(this.fiscalYearId)) {
    //                 this.researchBudgetResponses.push(result);
    //             }
    //         }
    //     })
    // } else if (this._authService.getLoggedUserType() === "Rms_Training_Institute") {
    //     res.data.forEach(result => {
    //         if (Number(result.fiscalYearId) === Number(this.fiscalYearId)) {
    //             this.researchBudgetResponses.push(result);
    //         }
    //     })
    // }

    getTotal() {
        let total = 0;
        if (this.researchBudgetResponses) {
            total = this.researchBudgetResponses.map(m => m.expenditureAmount).reduce((a, b) => a + b, 0);
        }
        return total;
    }

    calExpAmount(): number {
        return this.totalExpenditureAmount-this.getTotal();
    }

}


