import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../annexure-goods/i18n/en';
import {locale as lngBangla} from '../annexure-goods/i18n/bn';
import {AnnexureGoods} from '../../../../models/Annexure-goods.model';
import {DppAnnexureGoods} from '../../../../services/dpp-annexure-goods.service';
import {AnnexureWorks} from '../../../../models/Annexure-works.model';
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
import {IProjectConcept} from "../../../../../project-concept-management/models/project-concept";
import {DppObjectiveCostModel} from "../../../../models/dppObjectiveCost.model";
import {TranslateService} from "@ngx-translate/core";
import {DppObjectiveCostService} from "../../../../services/dpp-objective-cost.service";
import {NumberPipe} from "../../../../../../shared/pipes/number-pipe.pipe";
import {UserGroupService} from "../../../../../configuration-management/services/user-group.service";
import {SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN} from "../../../../../../core/constants/message";

@Component({
    selector: 'app-annexure-works',
    templateUrl: './annexure-works.component.html',
    styleUrls: ['./annexure-works.component.scss']
})
export class AnnexureWorksComponent implements OnInit {
    unitTypeList = [];
    procTypeList = [];
    procMethodsList =[];
    projectConceptUuid = this.route.snapshot.params['id'];
    data = [];
    dataSource = new BehaviorSubject<AbstractControl[]>([]);

    projectSummary: IProjectConcept;
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
        otherFeAmount:0,
        totalAmount:0
    };


    frmGroup:FormGroup;
    rows:FormArray;

    userId : any;
    ministry_name: string;
    agency_name : string;
    paripatraVersion: any;
    isParipatra2016: boolean;

    constructor(
        private fb: FormBuilder,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private unitTypeService: UnitTypeService,
        private procTypeService: ProcurementTypeService,
        private procMethodService: ProcurementMethodService,
        private annxGoodService: DppAnnexureGoodsIiiAService,
        private validation: GlobalValidationService,
        private matSnackBar: SnackbarHelper,
        private nof : UtilityFunctionsService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        public numberPipe : NumberPipe,
        private _translateService: TranslateService,
        private objectiveAndCostService: DppObjectiveCostService,
        private projectSummaryService: ProjectSummaryService,
        private userGroupService: UserGroupService
    ) {
        /*---- Translate language Bng and Eng ----*/
        this.fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.rows = this.fb.array([]);
        this.frmGroup = this.fb.group({
            id:[''],
            uuid:[''],
            totalAmount: ['', Validators.required],
            status: '',
            formType:'Works',
            totalAmountView:[''],
            projectConceptMasterId: [1],
            projectConceptUuid: this.projectConceptUuid,
            list: this.rows,
        });
        this.getProjectConceptById();
    }

    ngOnInit(): void {

        this.getUnitTypeList();
        this.getProcMethods();
        this.getProcurementTypeList();
        // this.setFormFieldValue();
        this.getProjectSummary();

    }
    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userId = res.res.userId;
            this.getUserInfoByUserId(this.userId);
        })
    }
    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = (this.projectSummary?.isForeignAid == false && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP')?
                res.agency.nameBn: res.agency.nameEn;
            this.ministry_name = (this.projectSummary?.isForeignAid == false && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP')?
                res.agency.ministryDivision.nameBn: res.agency.ministryDivision.nameEn;
        })
    }

    private getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }

            this.projectSummary = res;
            if(res.id>0)
            {
                this.annexure5bData(res.id);
            }
            this.setFormFieldValue();
            this.getUserGroup();
        })
    }
    /*-----------Get Grand total amount from annexure 5B --------*/

    annexure5bData(pcId){
        this.annxGoodService.getAnnexure5bData(pcId).subscribe((res) => {
            let grandTotal = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].dppAnnualPhasingCostTotal[0];

            this.projectCost.gobAmount = grandTotal.gobAmount;
            this.projectCost.gobFeAmount = grandTotal.gobFeAmount;
            this.projectCost.paAmount = grandTotal.spAcAmount + grandTotal.gobThruAmount + grandTotal.thruDpAmount + grandTotal.thruPdAmount;
            this.projectCost.paRpaAmount = grandTotal.spAcAmount + grandTotal.gobThruAmount;
            this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount;
            this.projectCost.ownFundAmount = grandTotal.ownFundAmount;
            this.projectCost.othersAmount = grandTotal.otherAmount;
            this.projectCost.otherFeAmount = grandTotal.otherFeAmount;
            this.projectCost.totalAmount = grandTotal.totalAmount;
        })
    }
    /*-----------/Get Grand total amount from annexure 5B --------*/

    /*----Go back to dashboard----*/
    goBackToHome()
    {
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
            id:[''],
            uuid:[''],
            packageName: ['', Validators.required],
            packageDppTppService: ['', Validators.required],
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
            invitationForEoi: ['',],
            issueOfRfp: ['', Validators.required],
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
        this.annxGoodService.save(this.frmGroup.value).subscribe((res:any) => {
            this.matSnackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
            if(res.status >0)
            {
                this.setFormFieldValue();
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
        else
        {
            if(rowId.id > 0)
                {
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
                else
                {
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
        this.annxGoodService.deleteRow(rowId).subscribe((res) => {
            if(res.status == 1)
            {
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

    /*----Set form field value----*/
    setFormFieldValue() {
        this.annxGoodService.getDataList('get-list/Works/'+this.projectConceptUuid).subscribe((response) => {

            if (response.status > 0) {
                let res = response.res;

                if(res.anxFiveBAmount){
                    this.projectCost = res.anxFiveBAmount;
                }

                this.frmGroup.controls['id'].patchValue(res.id);
                this.frmGroup.controls['uuid'].patchValue(res.uuid);
                this.frmGroup.controls['totalAmount'].patchValue(res.totalAmount);

                // let amount = this.nof.numberWithComma(res.totalAmount);
                let amount = (res.totalAmount > 0) ? res.totalAmount.toFixed(2) : 0.00;
                this.frmGroup.controls['totalAmountView'].setValue((!this.projectSummary.isForeignAid && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(amount) : amount);
                this.frmGroup.controls['projectConceptUuid'].patchValue(this.projectConceptUuid);

                let root = this;
                let listVal = res.list;

                if(listVal.length > 0)
                {
                    this.rows.clear();

                    listVal.forEach((val) => {
                        const row = root.fb.group({
                            id:[val.id],
                            uuid:[val.uuid],
                            packageName: [val.packageName, Validators.required],
                            // tappGoods: [val.tappGoods, Validators.required],
                            packageDppTppService: [val.packageDppTppService, Validators.required],
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
                            invitationForEoi: [val.invitationForEoi,],
                            issueOfRfp: [val.issueOfRfp, Validators.required],
                            signingOfContract: [val.signingOfContract, Validators.required],
                            completionOfContract: [val.completionOfContract, Validators.required],
                        });
                        root.rows.push(row);
                        root.updateView();

                    });
                }
            }
            else
            {
                this.addRow();
            }
        });
    }

    /*---- Calculate the total cost by quantity and estimated cost wise ----*/
    calculateCostAndQty(){
        const listVal = this.frmGroup.controls['list'].value;
        let totalValue_of_Goods = 0;

        listVal.forEach(val => {
            totalValue_of_Goods += Number(val.estdCostAmount);
        });
        this.frmGroup.controls['totalAmount'].patchValue(totalValue_of_Goods.toFixed(2));

        let viewAmount = this.nof.numberWithComma(totalValue_of_Goods);
        this.frmGroup.controls['totalAmountView'].patchValue((this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(totalValue_of_Goods.toFixed(2)) : totalValue_of_Goods.toFixed(2));

    }


    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            this.projectSummary = res;
            this.titleEn = res.titleEn;
            this.titleBn = res.titleBn;
            this.id = res.id;
            this._translateService.use(res.isForeignAid ? 'en' : 'bn');
            this.getObjectiveCostByPcUuid();
        });
    }

    private getObjectiveCostByPcUuid() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.projectConceptUuid).subscribe(res => {
                this.objectiveAndCost = res;
                if (this.objectiveAndCost) {
                    this.titleEn = this.objectiveAndCost.projectTitleEn ? this.objectiveAndCost.projectTitleEn : this.projectSummary.titleEn;
                    this.titleBn = this.objectiveAndCost.projectTitleBn ? this.objectiveAndCost.projectTitleBn : this.projectSummary.titleBn;
                }
            }
        );
    }

}
