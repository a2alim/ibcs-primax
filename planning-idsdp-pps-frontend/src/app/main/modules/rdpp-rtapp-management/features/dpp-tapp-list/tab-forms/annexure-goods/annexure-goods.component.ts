import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { UnitTypeService } from 'app/main/modules/configuration-management/services/unit-type.service';
import { ProcurementTypeService } from 'app/main/modules/configuration-management/services/procurement-type.service';
import { ProcurementMethodService } from 'app/main/modules/configuration-management/services/procurement-method.service';
import { DppAnnexureGoodsIiiAService } from 'app/main/modules/dpp-tapp-management/services/dpp-annexure-goods_iii_a.service';
import { BehaviorSubject } from 'rxjs';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { UtilityFunctionsService } from 'app/global/functions/utility-functions.service';
import {TranslateService, TranslateStore} from '@ngx-translate/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import {IProjectConcept} from "../../../../../project-concept-management/models/project-concept";
import {DppObjectiveCostModel} from "../../../../models/dppObjectiveCost.model";
import {DppObjectiveCostService} from "../../../../services/dpp-objective-cost.service";
import {NumberPipe} from "../../../../../../shared/pipes/number-pipe.pipe";
import {UserGroupService} from "../../../../../configuration-management/services/user-group.service";
import {RdppAnnexureGoodsService} from "../../../../../dpp-tapp-management/services/rdpp-annexure-goods.service";
import {RdppAnnualPhasingCostService} from "../../../../services/rdpp-annual-phasing-cost.service";
import {RdppObjectiveCostService} from "../../../../services/rdpp-objective-cost.service";
import {DppAnnualPhasingConstant} from "../../../../constants/dpp-annual-phasing.constant";

@Component({
    selector: 'app-annexure-goods',
    templateUrl: './annexure-goods.component.html',
    styleUrls: ['./annexure-goods.component.scss'],
})
export class AnnexureGoodsComponent implements OnInit {
    unitTypeList = [];
    procTypeList = [];
    procMethodsList = [];

    spinner: boolean;

    data = [];
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    projectSummary: IProjectConcept;
    titleEn: string;
    titleBn: string;
    id: number;
    objectiveAndCost: DppObjectiveCostModel = new DppObjectiveCostModel();

    /* ---- For table heading number----*/
    subHeader = [
        'num1', 'num2','num3', 'num4', 'num5', 'num6', 'num7', 'num8', 'num9',
        'num10', 'num11', 'num12', 'num13', 'num14',
    ];

    /* ---- Input field name----*/
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
        'estdCostAmountCol',
        'invitationForTenderCol',
        'signingOfContractCol',
        'completionOfContractCol',
        'action',
    ];

    frmGroup:FormGroup;
    rows:FormArray;

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

    totalAmount : any;
    projectConceptUuid: string;
    rdppMasterId: number;
    userGroup : string;
    userId : any;
    ministry_name: string;
    agency_name : string;
    rdppMasterData : DppObjectiveCostModel;
    constructor(
        private fb: FormBuilder,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private unitTypeService: UnitTypeService,
        private procTypeService: ProcurementTypeService,
        private procMethodService: ProcurementMethodService,
        private annxGoodService: DppAnnexureGoodsIiiAService,
        private matSnackBar: SnackbarHelper,
        private validation : GlobalValidationService,
        private utility : UtilityFunctionsService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        public numberPipe : NumberPipe,
        private _translateService: TranslateService,
        private objectiveAndCostService: DppObjectiveCostService,
        private projectSummaryService: ProjectSummaryService,
        private userGroupService: UserGroupService,
        private rdppAnnexureGoodsService: RdppAnnexureGoodsService,
        private rdppAnnualPhasingCostService : RdppAnnualPhasingCostService,
        private rdppMasterService : RdppObjectiveCostService,
    ) {

        this.route.queryParams.subscribe(params => {
            this.projectConceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
            this.getRdppMasterData(params['id']);
        });

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
            status: [''],
            formType: ['Goods'],
            totalAmountView:[''],
            projectConceptUuid: this.projectConceptUuid,
            list: this.rows,
            rdppMasterId: this.rdppMasterId,
        });
        this.getRdppAnnexureServiceData();
    }

    ngOnInit(): void {
        this.getUnitTypeList();
        this.getProcMethods();
        this.getProcurementTypeList();
        this.annexure5bData(this.rdppMasterId);


    }
    getRdppMasterData(masterId){
        this.rdppMasterService.getObjectiveCostByRdppMasterId(masterId).subscribe(res =>{
            this.rdppMasterData = res;
            this.titleEn = res.projectTitleEn;
            this.getProjectSummary(res.projectConceptUuid);
        })
    }


    public getRdppAnnexureServiceData(): any {
        this.rdppAnnexureGoodsService.getDataList('get-list/Goods/'+this.rdppMasterId).subscribe( res => {
            if(res.status == 0){
                if(this.rdppMasterData.revisedVersion == '1st Revised'){
                    this.setFormFieldValue();
                }else{
                    this.getRevisedData(this.rdppMasterData.referenceId);
                }
            }else{
                this.setFormControlData(res, 'rdpp');
            }
        });

    }

    getRevisedData(refId){
        this.rdppAnnexureGoodsService.getDataList('get-list/Goods/'+ refId).subscribe( res => {
            this.setFormControlData(res, '');
        });
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


    private getProjectSummary(pcUuid) {
        this.projectSummaryService.getByUuid(pcUuid).subscribe(res => {
            this.projectSummary = res;
            this._translateService.use(res.isForeignAid ? 'en' : 'bn');
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



    private getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
            this.projectSummary = res;
            if(res.id>0)
            {
                this.annexure5bData(res.id);
            }
            this.setFormFieldValue();
        })
    }

    /*-----------Get Grand total amount from annexure 5B --------*/
    annexure5bData(pcId){
        this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcId).subscribe((res) => {
            let grandTotal = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.allGrandTotal)[0];

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

    /*----For add  new rows----*/
    addRow(): any {
        const row = this.fb.group({
            id:[''],
            uuid:[''],
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

            invitationForTender: ['', Validators.required],
            signingOfContract: ['', Validators.required],
            completionOfContract: ['', Validators.required],
        });
        this.rows.push(row);
        this.updateView();
        this.frmGroup.markAsUntouched();
    }

    /*----For load new row in array of dataSource  ----*/
    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }

    /*----Form submit----*/
    onSubmit() {
        //console.log(this.frmGroup);
        if (this.frmGroup.valid) {
            this.saveData();
        } else {
            this.matSnackBar.openErrorSnackBar();
        }
    }

    /*----If validation is true then form will be submit----*/
    saveData() {
        console.log('this.frmGroup.value');
        console.log(this.frmGroup.value);
        this.spinner = true;
        this.rdppAnnexureGoodsService.save(this.frmGroup.value).subscribe((res:any) => {
            if(res.status == 0){
                this.matSnackBar.openWarnSnackBarWithMessage(res.message, "ok");
            }
            if(res.status >0){
                this.matSnackBar.openSuccessSnackBarWithMessage(res.message, "ok");
                this.getRdppAnnexureServiceData();
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
               /*----Delete record from the database table----*/
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
                     /*----Delete row from the array----*/
                    this.rows.removeAt(rowIndex);
                    this.calculateCostAndQty();
                    this.updateView();
                    return true;

                }
        }

    }

    /*----Delete Records from database table----*/
    delete(rowId, rowIndex) {
        this.spinner = true;
        this.rdppAnnexureGoodsService.deleteRow(rowId).subscribe((res:any) => {
            if(res.status == 1)
            {
                this.calculateCostAndQty();
                this.matSnackBar.openSuccessSnackBarWithMessage(
                    res.message,
                    'Ok'
                );
                this.spinner = false;
                this.rows.removeAt(rowIndex);
                this.updateView();
                this.calculateCostAndQty();
                return true;
            }
            this.spinner = false;
        });
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

    /*----For get list value from list of frmGroup object----*/
    get list() {
        return this.frmGroup.controls['list'] as FormArray;
    }

    /*----Set form field value----*/
    setFormFieldValue() {
        this.annxGoodService.getDataList('get-list/Goods/'+this.projectConceptUuid).subscribe((response) => {
            this.setFormControlData(response, 'dpp');
        });
    }


    setFormControlData(response, type: string): any {
        if (response.status > 0) {
            let res = response.res;
            if(type == 'rdpp') {
                this.frmGroup.controls['id'].patchValue(res.id);
                this.frmGroup.controls['uuid'].patchValue(res.uuid);
            }
            this.frmGroup.controls['totalAmount'].patchValue(res.totalAmount);
            let amount = (res.totalAmount > 0) ? res.totalAmount.toFixed(2) : 0.00;
            this.frmGroup.controls['totalAmountView'].setValue((amount));
            this.frmGroup.controls['projectConceptUuid'].patchValue(this.projectConceptUuid);
            let root = this;
            let listVal = res.list;
            if(listVal.length > 0) {
                this.rows.clear();
                if(type == 'rdpp') {
                    listVal.forEach((val) => {
                        const row = root.fb.group({
                            id:[val.id],
                            uuid:[val.uuid],
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
                            invitationForTender: [val.invitationForTender, Validators.required],
                            signingOfContract: [val.signingOfContract, Validators.required],
                            completionOfContract: [val.completionOfContract, Validators.required],
                        });
                        root.rows.push(row);
                        root.updateView();

                    });
                } else {
                    listVal.forEach((val) => {
                        const row = root.fb.group({
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
                            invitationForTender: [val.invitationForTender, Validators.required],
                            signingOfContract: [val.signingOfContract, Validators.required],
                            completionOfContract: [val.completionOfContract, Validators.required],
                        });
                        root.rows.push(row);
                        root.updateView();
                    });
                }
            }
        } else {
            this.addRow();
        }
    }

    /*---- Calculate the total cost by quantity and estimated cost wise ----*/
    calculateCostAndQty(){
        const listVal = this.frmGroup.controls['list'].value;
        let totalValue_of_Goods = 0;

        listVal.forEach(val => {
            totalValue_of_Goods += Number(val.estdCostAmount);
        });
        let viewAmount = this.utility.numberWithComma(totalValue_of_Goods);
        // this.frmGroup.controls['totalAmountView'].patchValue(viewAmount);
        this.frmGroup.controls['totalAmountView'].patchValue((this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(totalValue_of_Goods.toFixed(2)) : totalValue_of_Goods.toFixed(2));
        this.frmGroup.controls['totalAmount'].patchValue(totalValue_of_Goods.toFixed(2));
    }
}
