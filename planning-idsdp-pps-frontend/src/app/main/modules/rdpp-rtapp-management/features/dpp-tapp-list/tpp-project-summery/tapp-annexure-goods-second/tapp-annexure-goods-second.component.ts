import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from '../../tab-forms/annexure-goods/i18n/en';
import { locale as lngBangla } from '../../tab-forms/annexure-goods/i18n/bn';
import { UnitTypeService } from 'app/main/modules/configuration-management/services/unit-type.service';
import { ProcurementTypeService } from 'app/main/modules/configuration-management/services/procurement-type.service';
import { ProcurementMethodService } from 'app/main/modules/configuration-management/services/procurement-method.service';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UtilityFunctionsService } from 'app/global/functions/utility-functions.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {TappObjectiveCostModel} from "../../../../models/tappObjectiveCost.model";
import {IProjectConcept} from "../../../../../project-concept-management/models/project-concept";
import {TappAnnexureGoodsService} from "../../../../services/tapp-annexure/tapp-annexure-goods.service";
import {DppAnnualPhasingConstant} from "../../../../constants/dpp-annual-phasing.constant";

@Component({
    selector: 'app-tapp-annexure-goods-second',
    templateUrl: './tapp-annexure-goods-second.component.html',
    styleUrls: ['./tapp-annexure-goods-second.component.scss'],
})
export class TappAnnexureGoodsSecondComponent implements OnInit {
    unitTypeList = [];
    procTypeList = [];
    procMethodsList = [];
    objectiveAndCost: TappObjectiveCostModel = new TappObjectiveCostModel();
    titleEn: string;
    titleBn: string;
    projectSummary: IProjectConcept;

    frmGroup:FormGroup;
    rows:FormArray;
    projectUuid:any;
    tappObjectiveCostUuid = '';
    projectCode: any;

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

    spinner: boolean;
    masterId: number;

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
        private projectSummaryService:ProjectSummaryService,
        private tappObjectiveCostService:TappObjectiveCostService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.route.queryParams.subscribe(params => {
            this.projectUuid = params['pcUuid'];
            this.masterId = params['id'];
            this.getObjectiveCostByPcUuid( params['id']);
        });


    }

    ngOnInit(): void {
        // this.projectUuid = this.route.snapshot.params['id'];
        this.getUnitTypeList();
        this.getProcMethods();
        this.getProcurementTypeList();
        this.getProjectConceptById();
        this.initForm();
        this.annexure5bData(this.masterId);
    }

    initForm(){
        this.frmGroup = this.fb.group({
            uuid:[''],
            totalAmount: ['', Validators.required],
            status: '',
            formType: 'Tapp-Service',
            totalAmountView:['0.00'],
            rtappMasterId: [this.masterId],
            tappObjectiveCostUuid: [this.projectUuid],
            projectConceptUuid: [this.projectUuid],
            list: this.fb.array([]),
        });
    }
    private getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.projectUuid).subscribe(res => {
            if(res.id>0)
            {
                this.projectSummary = res;
                this.projectCode = res.projectCode;
                // this.annexure5bData(res.id);
                // this.getObjectiveCostByPcUuid();
            }
        })
    }


    private getObjectiveCostByPcUuid(rtappMasterId) {
        this.tappObjectiveCostService.getProjectConceptByUuid(rtappMasterId).subscribe(res => {
                this.objectiveAndCost = res.res;
                if (this.objectiveAndCost) {
                    this.titleEn = this.objectiveAndCost.projectTitleEn ? this.objectiveAndCost.projectTitleEn : this.projectSummary.titleEn;
                    this.titleBn = this.objectiveAndCost.projectTitleBn ? this.objectiveAndCost.projectTitleBn : this.projectSummary.titleBn;
                }
                this.getRtappServiceData(rtappMasterId);
            }
        );

    }

    getRtappServiceData(masterId) {
        this.tappAnnexureGoodsService.getDataList('get-list/Tapp-Service/'+masterId).subscribe((response) => {
            if(response.status == 0){
                if(this.objectiveAndCost.revisedVersion == '1st Revised'){
                    this.getTappServiceData();
                }else{
                    this.getRevisedData(this.objectiveAndCost.referenceId);
                }
            }else{
                this.setFormControlData(response, 'masterData');
            }

        });
    }

    getTappServiceData(){
        this.tappAnnexureGoodsService.getTappMasterData('get-list/Tapp-Service/' + this.projectUuid).subscribe(res =>{
            this.setFormControlData(res, '');
        })
    }

    getRevisedData(refId){
        this.tappAnnexureGoodsService.getDataList('get-list/Tapp-Service/' + refId).subscribe((response) => {
            this.setFormControlData(response, '');
        });
    }

    /*-----------Get Grand total amount from annexure 1 --------*/
    annexure5bData(pcId){
        this.tappAnnexureGoodsService.getTappAnnexure5bData(pcId).subscribe((res) => {
            let grandTotal = res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total).map(e => e.allGrandTotal)[0];

            this.projectCost.gobAmount = grandTotal.gobAmount;
            this.projectCost.gobFeAmount = grandTotal.gobFeAmount;
            this.projectCost.paAmount = grandTotal.spAcAmount;
            this.projectCost.paRpaAmount = 0;
            this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount;
            this.projectCost.ownFundAmount = grandTotal.ownFundAmount;
            this.projectCost.othersAmount = grandTotal.otherAmount;
            this.projectCost.otherFeAmount = grandTotal.otherFeAmount;
            this.projectCost.totalAmount = grandTotal.totalAmount;
        })
    }
    /*-----------/Get Grand total amount from annexure 1 --------*/

    goBackToHome()
    {
       window.history.back();
    }

    addRow() {
        const row = this.fb.group({
            uuid:[''],
            packageName: ['', Validators.required],
            packageDppTppService: ['', Validators.required],
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
            invitationForEoi: ['', Validators.required],
            issueOfRfp: ['', Validators.required],
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

    onSubmit() {

        if (this.frmGroup.valid) {
            this.saveData();
        } else {
            this.matSnackBar.openErrorSnackBar();
        }
    }

    saveData() {
        this.spinner = true;
        this.tappAnnexureGoodsService.save(this.frmGroup.value).subscribe((res:any) => {
            if(res.status >0)
            {
                this.getRtappServiceData(this.masterId);
                this.matSnackBar.openSuccessSnackBarWithMessage(res.message, "ok");
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

    get list() {
        return this.frmGroup.controls['list'] as FormArray;
    }

    setFormControlData(response: any, returnType: string){
        if (response.status > 0) {

            let res = response.res;
            if(returnType == 'masterData'){
                this.frmGroup.controls['uuid'].patchValue(res.uuid);
            }else{
                this.frmGroup.controls['uuid'].patchValue('');
            }
            this.frmGroup.controls['totalAmount'].patchValue(res.totalAmount);
            this.frmGroup.controls['tappObjectiveCostUuid'].patchValue(res.tappObjectiveCostUuid);
            let amount = this.nof.numberWithComma(res.totalAmount);
            this.frmGroup.controls['totalAmountView'].setValue(amount);
            this.frmGroup.controls['projectConceptUuid'].patchValue(this.projectUuid);

            //this.frmGroup.controls['status'].setValue(res.status);
            //this.frmGroup.controls['formType'].setValue(res.formType);

            let root = this;
            let listVal = res.list;

            if(listVal.length > 0)
            {
                root.list.clear();
                listVal.forEach((val) => {
                    const row = root.fb.group({
                        uuid:[val.uuid],
                        packageName: [val.packageName, Validators.required],
                        packageDppTppService: [val.packageDppTppService, Validators.required],
                        unitId: [val.unitId, Validators.required],
                        quantity: [val.quantity,
                            [
                                Validators.required,
                                this.validation.NameSpecialChar('this'),
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
                                this.validation.checkString('this')
                            ]
                        ],
                        invitationForEoi: [val.invitationForEoi, Validators.required],
                        issueOfRfp: [val.issueOfRfp, Validators.required],
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
    }


    calculateCostAndQty(){
        const listVal = this.frmGroup.controls['list'].value;
        let totalValue_of_Goods = 0;

        listVal.forEach(val => {
            // totalValue_of_Goods += Number(val.quantity) * Number(val.estdCostAmount);
            totalValue_of_Goods += Number(val.estdCostAmount);
        });
        this.frmGroup.controls['totalAmount'].patchValue(totalValue_of_Goods);

        let viewAmount = this.nof.numberWithComma(totalValue_of_Goods);
        this.frmGroup.controls['totalAmountView'].patchValue(viewAmount);

    }
}
