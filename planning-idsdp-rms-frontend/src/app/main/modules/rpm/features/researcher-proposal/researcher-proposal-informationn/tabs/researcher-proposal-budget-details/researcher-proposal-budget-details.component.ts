import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { ResearcherProposalBudgetDetails } from "../../../../../models/ResearcherProposalBudgetDetails";
import { UnsubscribeAdapterComponent } from "../../../../../../../core/helper/unsubscribeAdapter";
import { ExpeditureItemServiceService } from "../../../../../../settings/services/expediture-item-service.service";
import { ResearcherProposalBudgetDetailsService } from "../../../../../services/researcher-proposal-budget-details.service";
import { SnackbarHelper } from "../../../../../../../core/helper/snackbar.helper";
import { ResearcherProposal } from "../../../../../models/ResearcherProposal";
import { BehaviorSubject } from "rxjs";
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { ProposalSubmissionService } from 'app/main/modules/training-institute/services/proposal-submission.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';

@Component({
    selector: 'app-researcher-proposal-budget-details',
    templateUrl: './researcher-proposal-budget-details.component.html',
    styleUrls: ['./researcher-proposal-budget-details.component.scss']
})
export class ResearcherProposalBudgetDetailsComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {

    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    activeFisYear: any = {};
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    existingProposalInfoId: number = 0;
    spinner = true;
    budgetDetails: ResearcherProposalBudgetDetails[] = [];
    items: any[] = [];
    canSave: boolean;
    showExpenditureItem: boolean;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    formSubmit: Boolean;
    catagoryId: number;
    showMessage: boolean = false;
    totalBudget: number = 0;
    langVal: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private expeditureItemServiceService: ExpeditureItemServiceService,
        private service: ResearcherProposalBudgetDetailsService,
        private snackbarHelper: SnackbarHelper,
        private _route: Router,
        private matDialog: MatDialog,
        private _toastrService: ToastrService,
        private _proposalSubmissionService: ProposalSubmissionService,
        private dataCom: DataComService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        
        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }

    ngOnInit(): void {
        this.getItems();
        this.getCurrentFiscalYearInfo();
    }

    getCurrentFiscalYearInfo() {
        this._proposalSubmissionService.getProposalSubmissionDates().subscribe(
            response => {
                this.activeFisYear = response;
            },
            error => {
                console.log('error ----- >>>>> ', error);
            }
        );
    }

    private getItems() {
        this.subscribe$.add(
            this.expeditureItemServiceService.getAll().subscribe(res => {
                this.items = res.items ? res.items.filter(f => f.active) : [];
                this.items.unshift({ id: 0, expItemsName: '------ ADD NEW -----' });
                this.addNewRow();
                this.spinner = false;
            })
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.existingProposalInfoId = this.existingProposalInfo.id;
                            this.catagoryId = this.existingProposalInfo.stResearchCatTypeId;
                            this.getByResearcherProposalId(this.existingProposalInfo.id);
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.existingProposalInfoId = res.id;
                                this.catagoryId = res.stResearchCatTypeId;
                                this.getByResearcherProposalId(res.id);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }

    getByResearcherProposalId(id: number) {
        this.subscribe$.add(
            this.service.getByResearcherProposalId(id).subscribe(res => {
                if (res.success) {
                    this.budgetDetails = res.items.map(m => ({ ...m, isDeleted: 0 }));
                }
            })
        );
    }

    onSubmit(next: boolean, del: boolean = false) {

        if(this.existingProposalInfoId < 1 || this.existingProposalInfoId == null){
            this._toastrService.warning("Submit the proposal information first!.", "", this.config);
            return;
        }

        if (this.catagoryId == 1) {// Institutional
            this.totalBudget = this.activeFisYear.instCatBudgetAmount ? this.activeFisYear.instCatBudgetAmount : 0;
        } else if (this.catagoryId == 2) {// Fellowship            
            this.totalBudget = this.activeFisYear.fellowCatBudgetAmount ? this.activeFisYear.fellowCatBudgetAmount : 0;
        } else if (this.catagoryId == 4) { // PhD
            this.totalBudget = this.activeFisYear.phdCatBudgetAmount ? this.activeFisYear.phdCatBudgetAmount : 0;
        } else if (this.catagoryId == 5) { // MPhil
            this.totalBudget = this.activeFisYear.mphilCatBudgetAmount ? this.activeFisYear.mphilCatBudgetAmount : 0;
        } else if (this.catagoryId == 6) { // Promotional
            this.totalBudget = this.activeFisYear.promoCatBudgetAmount ? this.activeFisYear.promoCatBudgetAmount : 0;
        }

        let total = this.budgetDetails.filter(f => !f.isDeleted).map(m => m.totalAmount).reduce((a, b) => { return a + b }, 0);

        if (total > this.totalBudget) {
            window.scrollTo({
			    top: 0,
			    left: 100,
			    behavior: "smooth"
			  });

            this.showMessage = true;
            this._toastrService.warning("Sorry! You can\'t apply for more than the approved budget amount.", "", this.config);
            
            return;
        } else {
            this.showMessage = false;
        }

        this.formSubmit = true;
        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        this.spinner = true;
        this.canSave = false;
        const details: ResearcherProposalBudgetDetails[] = this.budgetDetails.map(m => ({ ...m, researcherProposalId: this.existingProposalInfoId }));
        this.subscribe$.add(
            this.service.saveList(details).subscribe(res => {
                if (res.success) {

                    if (del) {
                        this.snackbarHelper.deleteSuccessSnackBar()
                    } else {
                        this.snackbarHelper.openSuccessSnackBar();
                    }

                    this.subscribe$.add(
                        this.expeditureItemServiceService.getAll().subscribe(res => {
                            this.items = res.items ? res.items.filter(f => f.active) : [];
                            this.items.unshift({ id: 0, expItemsName: '------ ADD NEW -----' });
                            this.spinner = false;
                        })
                    );
                    this.spinner = false;
                    this.canSave = true;
                    this.budgetDetails = res.items.map(m => ({ ...m, isDeleted: 0 }));
                    if (next) {
                        // this.nextTab();
                        this.showResearcherProposal(res.items[0].researcherProposalDto.uuid);
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                }
            })
        );
    }

    private openDialog(i) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.budgetDetails[i].isDeleted = 1;
                this.onSubmit(false, true);
            }
            dialogRef.close(true);
        });
    }

    addNewRow() {
        this.budgetDetails.push(
            {
                id: null,
                uuid: null,
                researcherProposalId: null,
                stExpenditureItemId: null,
                purpose: '',
                totalAmount: 0,
                isEditable: 0,
                isDeleted: 0,
                expenditureName: '',
                showExpenditureItem: false
            }
        );
    }

    deleteNewRelativeForm(i: any) {
        if (this.budgetDetails[i].uuid) {
            this.openDialog(i);
            //this.budgetDetails[i].isDeleted = 1;
        } else {
            this.budgetDetails.splice(i, 1);
        }
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    // for preview
    showResearcherProposal(uuid: string) {
        this._route.navigate(['researcher-proposal-details/view/' + uuid]);
    }


    checkRequirdField(): Boolean {
        let isValied = true;
        this.budgetDetails.forEach(f => {
            if (!(f.stExpenditureItemId || f.expenditureName) || !f.totalAmount) {
                return isValied = false;
            }
        });
        return isValied;
    }

    onChangeExpenditureItem(event, index) {
        let budgetDetails = this.budgetDetails;
        console.log('event.value ==', event.value);
        if(budgetDetails.length > 0)
        {
            this.showMessage = false;      
            let countVal = budgetDetails.filter(x => x.stExpenditureItemId === event.value).length;
            //console.log('countVal =', countVal);
            if(countVal > 1)
            {
                this.budgetDetails[index].stExpenditureItemId = "";
                this.budgetDetails[index].totalAmount = 0;
                this.showMessage = true;
                this._toastrService.warning("Item already exists.", "", this.config);
            }
        }

        if (event.value) {
            setTimeout(() => {
                this.budgetDetails[index].showExpenditureItem = false;
                this.budgetDetails[index].expenditureName = null;
            }, 100);
        } else {
            setTimeout(() => {
                this.budgetDetails[index].showExpenditureItem = true;
            }, 100);
        }
    }
    $set(desserts: any, row_index: any, arg2: any) {
        throw new Error('Method not implemented.');
    }
}
