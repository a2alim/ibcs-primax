import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { locale as lngEnglish } from '../procurement-plan-goods/i18n/en';
import { locale as lngBangla } from '../procurement-plan-goods/i18n/bn';
import { UnitTypeService } from 'app/main/modules/configuration-management/services/unit-type.service';
import { ProcurementTypeService } from 'app/main/modules/configuration-management/services/procurement-type.service';
import { ProcurementMethodService } from 'app/main/modules/configuration-management/services/procurement-method.service';
import { DppAnnexureGoodsIiiAService } from 'app/main/modules/dpp-tapp-management/services/dpp-annexure-goods_iii_a.service';
import { BehaviorSubject } from 'rxjs';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UtilityFunctionsService } from 'app/global/functions/utility-functions.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { IProjectConcept } from 'app/main/modules/project-concept-management/models/project-concept';
import { DppObjectiveCostModel } from 'app/main/modules/dpp-tapp-management/models/dppObjectiveCost.model';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { NumberPipe } from 'app/main/shared/pipes/number-pipe.pipe';
import { TranslateService } from '@ngx-translate/core';
import { DppObjectiveCostService } from 'app/main/modules/dpp-tapp-management/services/dpp-objective-cost.service';
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';
import { ProcurementPlanService } from 'app/main/modules/project-management/service/procurement-plan.service';

@Component({
    selector: 'app-procurement-plan-works',
    templateUrl: './procurement-plan-works.component.html',
    styleUrls: ['./procurement-plan-works.component.scss']
})
export class ProcurementPlanWorksComponent implements OnInit {

    @Input() dppTappMasterId: number;
    @Input() dppTappMasterUuid: string;
    @Input() projectConceptMasterId: number;
    @Input() projectConceptUuid: string;

    unitTypeList = [];
    procTypeList = [];
    procMethodsList = [];
    // projectConceptUuid = this.route.snapshot.params['id'];
    data = [];
    dataSource = new BehaviorSubject<AbstractControl[]>([]);

    // projectSummary: IProjectConcept;
    titleEn: string;
    titleBn: string;
    id: number;
    objectiveAndCost: DppObjectiveCostModel = new DppObjectiveCostModel();

    spinner: boolean;

    /* ---- For table heading number----*/
    subHeader = [
        'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8',
        'num9', 'num10', 'num11', 'num12', 'num13', 'num14', 'num15'
    ];

    /* ---- Input fields name----*/
    displayColumns = [
        'sl',
        'packageNumCol',
        'tappGoodsCol',
        'unitId',
        'quantityCol',
        'procurementMethodIdCol',
        'procurementTypeIdCol',
        'contractApproveAuthoriityCol',
        'sourceOfFundCol',
        'estdCostCol',
        'invitationForTenderWorkCol',
        'invitationForTenderCol',
        'signingOfContractCol',
        'completionOfContractCol',
        'action',
    ];

    projectCost = {
        gobAmount: 0,
        gobFeAmount: 0,
        paAmount: 0,
        paRpaAmount: 0,
        ownFeAmount: 0,
        ownFundAmount: 0,
        othersAmount: 0,
        otherFeAmount: 0,
        totalAmount: 0
    };


    frmGroup: FormGroup;
    rows: FormArray;

    userId: any;
    ministry_name: string;
    agency_name: string;

    constructor(
        private fb: FormBuilder,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private unitTypeService: UnitTypeService,
        private procTypeService: ProcurementTypeService,
        private procMethodService: ProcurementMethodService,
        private annxGoodService: DppAnnexureGoodsIiiAService,
        private validation: GlobalValidationService,
        private matSnackBar: SnackbarHelper,
        private nof: UtilityFunctionsService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        public numberPipe: NumberPipe,
        private procurementPlanService: ProcurementPlanService,
    ) {
        /*---- Translate language Bng and Eng ----*/
        this.fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.createForm();
        this.getUnitTypeList();
        this.getProcMethods();
        this.getProcurementTypeList();
        this.getProcurementPlan();
    }

    createForm() {
        this.rows = this.fb.array([]);
        this.frmGroup = this.fb.group({
            id: [''],
            uuid: [''],
            totalAmount: ['', Validators.required],
            status: '',
            formType: 'Works',
            totalAmountView: [''],

            projectConceptUuid: [this.projectConceptUuid],
            dppTappMasterId: [this.dppTappMasterId],
            dppTappMasterUuid: [this.dppTappMasterUuid],
            projectConceptMasterId: [this.projectConceptMasterId],

            list: this.rows,
        });
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }

    emptyTable(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            return true;
        }
    }

    /*----For add new rows----*/
    addRow(): any {
        const row = this.fb.group({
            id: [''],
            uuid: [''],
            packageName: ['', Validators.required],
            tappGoods: ['', Validators.required],
            unitId: ['', Validators.required],
            quantity: ['', Validators.required],
            procurementMethodId: ['', Validators.required],
            procurementTypeId: ['', Validators.required],
            contractApproveAuthoriity: ['', Validators.required],
            sourceOfFund: ['', Validators.required],
            estdCostAmount: ['',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            invitationForTenderWork: ['', Validators.required],
            invitationForTender: ['', Validators.required],
            signingOfContract: ['', Validators.required],
            completionOfContract: ['', Validators.required],
        });
        this.rows.push(row);
        this.updateView();
        this.frmGroup.markAsUntouched();
    }

    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }

    /*----Form submit----*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.saveData();
        } else {
            this.matSnackBar.openErrorSnackBar();
        }
    }

    /*----If validation is true then form will be submit----*/
    saveData() {
        this.spinner = true;
        this.procurementPlanService.createProcurementPlan(this.frmGroup.value).subscribe((res: any) => {
            this.matSnackBar.openSuccessSnackBarWithMessage(res.message, "ok");
            if (res.status > 0) {
                this.getProcurementPlan();
            }
            this.spinner = false;
        });
    }

    /*----Delete confirmation dialog box----*/
    confirmationDelete(rowIndex) {
        let rowId = this.frmGroup.controls['list'].value[rowIndex];

        if (this.rows.length === 1) {
            return false;
        }
        else {
            if (rowId.id > 0) {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = false;
                dialogConfig.autoFocus = false;
                dialogConfig.width = ConfirmDialogConstant.WIDTH;
                dialogConfig.height = ConfirmDialogConstant.HEIGHT;
                dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
                dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
                const dialogRef = this.dialog.open(
                    SubmitConfirmationDialogComponent,
                    dialogConfig
                );
                dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
                    if (res) {
                        this.delete(rowId.id, rowIndex);
                    }
                    dialogRef.close(true);
                });
            }
            else {
                this.rows.removeAt(rowIndex);
                this.updateView();
                this.calculateCostAndQty();
                return true;

            }
        }

    }

    /*----Delete Records from database table----*/
    delete(rowId, rowIndex) {
        this.spinner = true;
        this.procurementPlanService.deleteById(rowId).subscribe((res) => {
            if (res.status == 1) {
                this.matSnackBar.openSuccessSnackBarWithMessage(
                    'Deleted Successfully',
                    'Ok'
                );
                this.spinner = false;
                this.rows.removeAt(rowIndex);
                this.updateView();
                // this.setFormFieldValue();
                this.calculateCostAndQty();
                return true;
            }
            this.spinner = false;
        });
    }

    /*----For get list value from list of frmGroup object----*/
    get list() {
        return this.frmGroup.controls['list'] as FormArray;
    }

    /*----For get unit type list----*/
    getUnitTypeList() {
        this.unitTypeList = [];
        this.unitTypeService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.unitTypeList.push(m);
            });
        });
    }

    /*----For get procurement type list----*/
    getProcurementTypeList() {
        this.procTypeList = [];
        this.procTypeService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.procTypeList.push(m);
            });
        });
    }

    /*----For get procurement method list----*/
    getProcMethods() {
        this.procMethodsList = [];
        this.procMethodService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.procMethodsList.push(m);
            });
        });
    }

    getProcurementPlan() {
        this.procurementPlanService.getGetProcurementPlanByDppTappMasterUuid('Works', this.dppTappMasterUuid).subscribe(
            response => {
                if (response && response.status) {
                    this.setFormFieldValue(response, true);
                } else {
                    this.getProcurementPlanFromDppTapp();
                }
            }
        )
    }

    getProcurementPlanFromDppTapp() {
        this.annxGoodService.getDataList('get-list/Works/' + this.projectConceptUuid).subscribe(
            response => {
                if (response) {
                    this.setFormFieldValue(response, false);
                }
            }
        )
    }

    /*----Set form field value----*/
    setFormFieldValue(response, isFromDppTapp) {

        if (response.status > 0) {
            let res = response.res;

            if (res.anxFiveBAmount) {
                this.projectCost = res.anxFiveBAmount;
            }
            if (isFromDppTapp) {
                this.frmGroup.controls['id'].patchValue(res.id);
                this.frmGroup.controls['uuid'].patchValue(res.uuid);
            }
            this.frmGroup.controls['totalAmount'].patchValue(res.totalAmount);
            let amount = (res.totalAmount > 0) ? res.totalAmount.toFixed(2) : 0.00;
            this.frmGroup.controls['totalAmountView'].setValue(amount);
            this.frmGroup.controls['projectConceptUuid'].patchValue(this.projectConceptUuid);

            let root = this;
            let listVal = res.list;

            if (listVal.length > 0) {
                this.rows.clear();

                listVal.forEach((val) => {
                    const row = root.fb.group({
                        id: [isFromDppTapp ? val.id : ''],
                        uuid: [isFromDppTapp ? val.uuid : ''],
                        packageName: [val.packageName, Validators.required],
                        tappGoods: [val.tappGoods, Validators.required],
                        unitId: [val.unitId, Validators.required],
                        quantity: [val.quantity, Validators.required],
                        procurementMethodId: [val.procurementMethodId, Validators.required],
                        procurementTypeId: [val.procurementTypeId, Validators.required],
                        contractApproveAuthoriity: [val.contractApproveAuthoriity, Validators.required],
                        sourceOfFund: [val.sourceOfFund, Validators.required],
                        estdCostAmount: [val.estdCostAmount,
                        [
                            Validators.required,
                            root.validation.decimalNumber('this'),
                            root.validation.checkString('this')
                        ]
                        ],
                        invitationForTenderWork: [val.invitationForTenderWork, Validators.required],
                        invitationForTender: [val.invitationForTender, Validators.required],
                        signingOfContract: [val.signingOfContract, Validators.required],
                        completionOfContract: [val.completionOfContract, Validators.required],
                    });
                    root.rows.push(row);
                    root.updateView();

                });
            }
        }
        else {
            this.addRow();
        }
    }

    /*---- Calculate the total cost by quantity and estimated cost wise ----*/
    calculateCostAndQty() {
        const listVal = this.frmGroup.controls['list'].value;
        let totalValue_of_Goods = 0;

        listVal.forEach(val => {
            totalValue_of_Goods += Number(val.estdCostAmount);
        });
        this.frmGroup.controls['totalAmount'].patchValue(totalValue_of_Goods.toFixed(2));

        let viewAmount = this.nof.numberWithComma(totalValue_of_Goods);
        this.frmGroup.controls['totalAmountView'].patchValue(totalValue_of_Goods.toFixed(2));

    }

}
