import { Component, OnInit } from '@angular/core';
import { AnnexureGoods } from '../../../../models/Annexure-goods.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DppAnnexureGoods } from '../../../../services/dpp-annexure-goods.service';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from '../tpp-annexure-eightfirst/i18n/en';
import { locale as lngBangla } from '../tpp-annexure-eightfirst/i18n/bn';
import { UnitTypeService } from 'app/main/modules/configuration-management/services/unit-type.service';
import { ProcurementTypeService } from 'app/main/modules/configuration-management/services/procurement-type.service';
import { ProcurementMethodService } from 'app/main/modules/configuration-management/services/procurement-method.service';
import { DppAnnexureGoodsIiiAService } from 'app/main/modules/dpp-tapp-management/services/dpp-annexure-goods_iii_a.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TappAnnexureGoodsService } from 'app/main/modules/dpp-tapp-management/services/tapp-annexure/tapp-annexure-goods.service';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UtilityFunctionsService } from 'app/global/functions/utility-functions.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import {TappObjectiveCostModel} from "../../../../models/tappObjectiveCost.model";
import {IProjectConcept} from "../../../../../project-concept-management/models/project-concept";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {ProjectType} from "../../../../../configuration-management/models/project-type.model";
import {NumberPipe} from "../../../../../../shared/pipes/number-pipe.pipe";
import {AgencyService} from "../../../../../configuration-management/services/agency.service";

@Component({
    selector: 'app-tpp-annexure-eightfirst',
    templateUrl: './tpp-annexure-eightfirst.component.html',
    styleUrls: ['./tpp-annexure-eightfirst.component.scss'],
})
export class TppAnnexureEightfirstComponent implements OnInit {

    unitTypeList = [];
    procTypeList = [];
    procMethodsList = [];

    spinner: boolean;

    frmGroup:FormGroup;
    rows:FormArray;
    tappObjectiveCostUuid = '';
    title: string;
    projectCode: any;

    projectUuid:any;
    isParipatra2016: boolean;
    isForeignAid: boolean;
    projectTitle: any;
    objectiveAndCost: TappObjectiveCostModel = new TappObjectiveCostModel();
    titleEn: string;
    titleBn: string;
    projectSummary: IProjectConcept;
    agencyModel: any;

    projectCost = {
        gobAmount: '0',
        gobFeAmount: '0',
        paAmount: '0',
        paRpaAmount: '0',
        ownFeAmount: '0',
        ownFundAmount: '0',
        othersAmount: '0',
        otherFeAmount: '0',
        totalAmount: '0'
    };

    constructor(
        private fb: FormBuilder,
        private unitTypeService: UnitTypeService,
        private procTypeService: ProcurementTypeService,
        private procMethodService: ProcurementMethodService,
        private tappAnnexureGoodsService: TappAnnexureGoodsService,
        private matSnackBar: SnackbarHelper,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private validation:GlobalValidationService,
        private nof : UtilityFunctionsService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private projectSummaryService :ProjectSummaryService,
        private tappObjectiveCostService :TappObjectiveCostService,
        public numberPipe: NumberPipe,
        private agencyService: AgencyService
    ) {
        /*---- Translate language Bng and Eng ----*/
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.frmGroup = this.fb.group({
            uuid:[''],
            totalAmount: ['', Validators.required],
            status: '',
            formType: 'Tapp-Goods',
            totalAmountView:['0.00'],
            tappObjectiveCostUuid: this.route.snapshot.params['id'],
            projectConceptUuid: this.route.snapshot.params['id'],
            list: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        this.projectUuid = this.route.snapshot.params['id'];
        this.getProjectConceptById();
        this.getUnitTypeList();
        this.getProcMethods();
        this.getProcurementTypeList();
    }

     getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.projectUuid).subscribe(res => {
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            this.projectSummary = res;
            this.isParipatra2016 = res.isParipatra2016;
            this.isForeignAid = res.isForeignAid;
            this.getAgency();
            this.setFormFieldValue();
            if(res.id>0)
            {
                this.projectCode = res.projectCode;
                this.annexure5bData(res.id);
                this.getObjectiveCostByPcUuid();
                this.projectTitle = res.isForeignAid ? res.titleEn : res.titleBn;
            }
        })
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    getObjectiveCostByPcUuid() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.projectUuid).subscribe(res => {
                this.objectiveAndCost = res.res;
                if (this.objectiveAndCost) {
                    this.titleEn = this.objectiveAndCost.projectTitleEn ? this.objectiveAndCost.projectTitleEn : this.projectSummary.titleEn;
                    this.titleBn = this.objectiveAndCost.projectTitleBn ? this.objectiveAndCost.projectTitleBn : this.projectSummary.titleBn;
                }
            }
        );

    }

    /*-----------Get Grand total amount from annexure 1 --------*/
    annexure5bData(pcId){
        this.tappAnnexureGoodsService.getTappAnnexure5bData(pcId).subscribe((res) => {
            let grandTotal = res.filter(f => f.componentName === "Grand_Total")[0].tappAnnualPhasingCostTotal[0];
            this.projectCost.gobAmount = grandTotal.gobAmount.toFixed(2);
            this.projectCost.gobFeAmount = grandTotal.gobFeAmount.toFixed(2);
            this.projectCost.paAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2);
            this.projectCost.paRpaAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount).toFixed(2);
            this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount.toFixed(2);
            this.projectCost.ownFundAmount = grandTotal.ownFundAmount.toFixed(2);
            this.projectCost.othersAmount = grandTotal.otherAmount.toFixed(2);
            this.projectCost.otherFeAmount = grandTotal.otherFeAmount.toFixed(2);
            this.projectCost.totalAmount = grandTotal.totalAmount.toFixed(2);
        })
    }
    /*-----------/Get Grand total amount from annexure 1 --------*/

    /*----Go back to dashboard----*/
    goBackToHome()
    {
       window.history.back();
    }

    /*----For add new rows----*/
    addRow() {
        const row = this.fb.group({
            uuid:[''],
            packageName: ['', Validators.required],
            tappGoods: ['', Validators.required],
            unitId: ['', Validators.required],
            quantity: ['',
                [
                    Validators.required,
                    this.validation.NameSpecialChar('this'),
                    this.validation.checkString('this')
                ]
            ],
            procurementMethodId: ['', Validators.required],
            procurementTypeId: ['', Validators.required],
            contractApproveAuthoriity: ['', Validators.required],
            sourceOfFund: ['', Validators.required],
            estdCostAmount: ['',
                [
                    Validators.required,
                    this.validation.checkString('this')
                ]
            ],
            invitationForTender: ['', Validators.required],
            signingOfContract: ['', Validators.required],
            completionOfContract: ['', Validators.required],
        });
        this.list.push(row);
    }

    getUnitTypeList() {
        this.unitTypeList = [];
        this.unitTypeService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.unitTypeList.push(m);
            });
        });
    }

    getProcurementTypeList() {
        this.procTypeList = [];
        this.procTypeService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.procTypeList.push(m);
            });
        });
    }
    getProcMethods() {
        this.procMethodsList = [];
        this.procMethodService.getList().subscribe((res) => {
            res.forEach((m) => {
                this.procMethodsList.push(m);
            });
        });
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
        this.tappAnnexureGoodsService.save(this.frmGroup.value).subscribe((res: any) => {
            this.matSnackBar.openSuccessSnackBarWithMessage(res.message, "ok");
            if(res.status >0)
            {
                this.setFormFieldValue();
            }
            this.spinner = false;
        });
    }

    /*----Delete confirmation dialog box----*/
    confirmationDelete(rowIndex) {
            let row = this.frmGroup.controls['list'].value[rowIndex];
            if (this.list.length === 1) {
                this.matSnackBar.openSuccessSnackBarWithMessage(
                    'Minimum one row will be here',
                    'Ok'
                );
                return false;
            }
            else
            {
                if(row.uuid != "")
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
                                this.delete(row.uuid, rowIndex);
                            }
                            dialogRef.close(true);
                        });
                    }
                    else
                    {
                        this.list.removeAt(rowIndex);
                        this.calculateCostAndQty();
                        return true;

                    }
            }

        }

        /*----Delete Records from database table----*/
        delete(rowUuid, rowIndex) {
            this.spinner = true;
            this.tappAnnexureGoodsService.deleteRow(rowUuid).subscribe((res) => {
                if(res.status == 1)
                {
                    this.matSnackBar.openSuccessSnackBarWithMessage(
                        'Deleted Successfully',
                        'Ok'
                    );
                    this.spinner = false;
                    this.list.removeAt(rowIndex);
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

    /*----Set form fields value----*/
    setFormFieldValue() {
        this.tappAnnexureGoodsService.getDataList('get-list/Tapp-Goods/'+this.projectUuid).subscribe((response) => {

            if (response.status > 0) {

                let res = response.res;
                //this.frmGroup.controls['id'].patchValue(res.id);
                this.frmGroup.controls['uuid'].patchValue(res.uuid);
                this.frmGroup.controls['totalAmount'].patchValue(res.totalAmount);
                this.frmGroup.controls['tappObjectiveCostUuid'].patchValue(res.tappObjectiveCostUuid);
                this.frmGroup.controls['projectConceptUuid'].patchValue(this.projectUuid);
                // let amount = this.nof.numberWithComma(res.totalAmount);
                let amount = res.totalAmount;
                this.frmGroup.controls['totalAmountView'].setValue(this.isForeignAid ? amount.toFixed(2) : this.numberPipe.convertToBanglaNumber(amount.toFixed(2)));

                let root = this;
                let listVal = res.list;

                if(listVal.length > 0)
                {
                    root.list.clear();
                    listVal.forEach((val) => {
                        const row = root.fb.group({
                                    uuid:[val.uuid],
                                    packageName: [val.packageName, Validators.required],
                                    tappGoods: [val.tappGoods, Validators.required],
                                    unitId: [val.unitId, Validators.required],
                                    quantity: [val.quantity,
                                        [
                                            Validators.required,
                                            this.validation.checkString('this')
                                        ]
                                    ],
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
                                    invitationForTender: [val.invitationForTender, Validators.required],
                                    signingOfContract: [val.signingOfContract, Validators.required],
                                    completionOfContract: [val.completionOfContract, Validators.required],
                            });
                        root.list.push(row);

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
            // totalValue_of_Goods += Number(val.quantity) * Number(val.estdCostAmount);
            totalValue_of_Goods += Number(val.estdCostAmount);
        });
        // let viewAmount = this.nof.numberWithComma(totalValue_of_Goods);
        let viewAmount = totalValue_of_Goods;
        this.frmGroup.controls['totalAmountView'].patchValue(this.isForeignAid ? totalValue_of_Goods.toFixed(2) : this.numberPipe.convertToBanglaNumber(totalValue_of_Goods.toFixed(2)));
        this.frmGroup.controls['totalAmount'].patchValue(totalValue_of_Goods.toFixed(2));
    }
}
