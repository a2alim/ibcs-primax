import { Component, OnInit } from '@angular/core';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { DppAmortizationScheduleDynamicRow } from '../../../models/dpp-amortization-schedule-dynamic-row.model';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UnsubscribeAdapterComponent } from 'app/main/core/helper/unsubscribeAdapter';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { DppAmortizationScheduleService } from '../../../services/dpp-amortization-schedule.service';
import { DppAmortizationSchedule } from '../../../models/DppAmortizationSchedule.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { ActivatedRoute, Router } from '@angular/router';

import {GlobalValidationService} from "../../../../../../global/validation/global-validation.service";

import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {DppAnnualPhasingConstant} from "../../../constants/dpp-annual-phasing.constant";
import {RdppAnnualPhasingCostService} from "../../../services/rdpp-annual-phasing-cost.service";


/*----/Lng Translation----*/
@Component({
    selector: 'app-amortization-schedule',
    templateUrl: './amortization-schedule.component.html',
    styleUrls: ['./amortization-schedule.component.scss']
})
export class AmortizationScheduleComponent extends UnsubscribeAdapterComponent implements OnInit {
    frmGroup: FormGroup;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    conceptUuid: any;
    rdppMasterId: number;
    projectName: any;
    id: any;
    uuid: any;
    projectId: any;
    totalInvestment: any;
    loanPortion: any;
    rateOfInterest: any;
    loanPeriod: any;
    totalAmount: any;
    gracePeriod: any;
    gobAmount: boolean;
    projectConceptId: number;
    projectSummary: IProjectConcept;

    model: DppAmortizationSchedule = new DppAmortizationSchedule();

    unitTypeList: DppAmortizationSchedule[] = new Array<DppAmortizationSchedule>();

    loanPeriods: Array<DppAmortizationScheduleDynamicRow> = new Array<DppAmortizationScheduleDynamicRow>();
    gracePeriods: Array<DppAmortizationScheduleDynamicRow> = new Array<DppAmortizationScheduleDynamicRow>();


    spinner: boolean;
    private rdppUuid: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog,
                private objectiveAndCostService : DppObjectiveCostService,
                private router: Router,
                public numberPipe : NumberPipe,
                private validation : GlobalValidationService,
                private route: ActivatedRoute,
                private projectSummaryService: ProjectSummaryService,
                private _snackBar: MatSnackBar,
                private service: DppAmortizationScheduleService,
                private rdppAnnualPhasingCostService : RdppAnnualPhasingCostService,) {
        super();
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });

    }

    ngOnInit(): void {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.frmGroup = this.formBuilder.group({
            totalInvestment: [],
            loanPeriod: ['',
                [
                    Validators.required,

                    this.validation.checkString('this')
                ]
            ],
            rateOfInterest: ['',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            gracePeriod: [''

            ],
        });
        this.getRdppUuid();
        this.getLoanCredit();
        // this.getRdppAmortizationSchedule();
    }

    onSubmit() {
        if (this.rdppUuid ==null) {
            this.create();
        }
        else
        {
            this.updateAmortization();
        }
    }

    /*
     * History bach method
     */
    goBackToHome()
    {
        window.history.back();
    }


         /*
         * Get AmortizationSchedule Schedule Data
         */
    getAmortizationSchedule(){
        this.service.getAmortizationSchedule(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.setAmortization(res);
            this.uuid = res.uuid;
            this.loanPeriod = res.loanPeriod;
            this.gracePeriod = res.gracePeriod;

            this.dynamicRow();
        })
    }

    getRdppUuid(){
        this.service.getRdppAmortizationSchedule(this.rdppMasterId).subscribe((response)=>{
            let res = response.res;
            this.rdppUuid = res.uuid;
        })
    }

    getRdppAmortizationSchedule(){
        this.service.getRdppAmortizationSchedule(this.rdppMasterId).subscribe((response)=>{

                let res = response.res;
                this.setAmortization(res);
                this.loanPeriod = res.loanPeriod;
                this.gracePeriod = res.gracePeriod;

                this.dynamicRow();

        })
    }

    dynamicRow(){
        this.addGracePeriod(this.gracePeriod);
        this.addMultipleRow(this.loanPeriod, Number(this.gracePeriod));
    }

    /*
     * Create for AmortizationSchedule
     */
    create() {
        this.spinner = true;
        this.addGracePeriod(this.frmGroup.value.gracePeriod);
        this.addMultipleRow(this.frmGroup.value.loanPeriod, Number(this.frmGroup.value.gracePeriod));
        this.model.projectName = this.projectName;
        this.model.totalInvestment = this.totalInvestment;
        this.model.loanPortion = this.loanPortion;
        this.model.loanPeriod = this.frmGroup.value.loanPeriod;
        this.model.rateOfInterest = this.frmGroup.value.rateOfInterest;
        this.model.gracePeriod = this.frmGroup.value.gracePeriod;
        this.model.projectConceptUuid = this.conceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.loanPeriods = this.loanPeriods;
        this.model.gracePeriods = this.gracePeriods;
        this.model.rdppMasterId = this.rdppMasterId;


        this.service.createAmortizationSchedule(this.model).subscribe((res) =>{
            this.getRdppAmortizationSchedule();
            this.snackbarHelper.openSuccessSnackBar();
            this.spinner = false;
        })


    }

    /*
     * Update for AmortizationSchedule
     */
    updateAmortization(){
        this.spinner = true;
        this.addGracePeriod(this.frmGroup.value.gracePeriod);
        this.addMultipleRow(this.frmGroup.value.loanPeriod, Number(this.frmGroup.value.gracePeriod));
        this.model.projectName = this.projectName;
        this.model.totalInvestment = this.totalInvestment;
        this.model.loanPortion = this.loanPortion;
        this.model.loanPeriod = this.frmGroup.value.loanPeriod;
        this.model.rateOfInterest = this.frmGroup.value.rateOfInterest;
        this.model.gracePeriod = this.frmGroup.value.gracePeriod;
        this.model.projectConceptUuid = this.conceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.loanPeriods = this.loanPeriods;
        this.model.gracePeriods = this.gracePeriods;
        this.model.rdppMasterId = this.rdppMasterId;

        this.service.updateAmortization(this.model, this.rdppMasterId).subscribe((res)=>{
            this.getRdppAmortizationSchedule();
            this.snackbarHelper.openSuccessSnackBarWithMessage("Data Update Successfull", "Ok");
            this.spinner = false;
        })
    }

    /*
   * Get Projct concept Data by  Project Id
   */
    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.projectSummary = res;
                this.conceptUuid = res.uuid;

                this.projectConceptId = res.id;
                this.totalAmount = res.gobAmount;
                this.projectName = res.titleEn;

                this.setTotalInvestment();
                if(this.rdppUuid == null){
                    this.getAmortizationSchedule();
                }
                this.getRdppAmortizationSchedule();

            })
        );
    }

    setTotalInvestment(){
        this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rdppMasterId).subscribe((res) => {
            let grandTotal = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.allGrandTotal)[0];
            this.totalInvestment = grandTotal.gobAmount;
            this.frmGroup.patchValue({
                totalInvestment: grandTotal.gobAmount
            })
        })
    }

    /*
     * Set  AmortizationSchedule Data for form
     */
    setAmortization(res: any) {
        this.frmGroup.patchValue({
            loanPeriod: res.loanPeriod,
            rateOfInterest: res.rateOfInterest,
            gracePeriod: res.gracePeriod
        });
    }



    /*
   * Add Dynamic Load Period
   */
    addMultipleRow(res: any, length: number) {
        this.loanPeriods = [];
        let a = this.loanPortion;
        for (let i = 0; i < res; i++) {
            let yfa = (this.loanPortion / this.frmGroup.value.loanPeriod);
            let yip = (this.frmGroup.value.rateOfInterest)/100;
            this.loanPeriods.push({
                year: i + length + 1,
                beginingPrincipalAmount: (i===0) ? this.loanPortion.toFixed(2) : a,
                yearlyFixedAmount: yfa.toFixed(2),
                yearlyInterestPaid: (a*yip).toFixed(2),
                totalPayment: (yfa +(a*yip)).toFixed(2),
                endingPrincipalBalance: (a - yfa).toFixed(2),
                projectConceptMasterId: this.projectConceptId
            })
            a = this.loanPeriods[i].endingPrincipalBalance;
        }
    }

    /*
     * Add Dynamic Greace Period
     */
    addGracePeriod(res: any) {
        this.gracePeriods = [];
        for (let i = 0; i < res; i++) {
            this.gracePeriods.push({
                year: i + 1,
                beginingPrincipalAmount: this.loanPortion.toFixed(2),
                yearlyFixedAmount: "0.00",
                yearlyInterestPaid: ((this.loanPortion * this.frmGroup.value.rateOfInterest)/100).toFixed(2),
                totalPayment: ((this.loanPortion * this.frmGroup.value.rateOfInterest)/100).toFixed(2),
                endingPrincipalBalance: (this.loanPortion).toFixed(2),
                projectConceptMasterId: this.projectConceptId
            })
        }
    }

    /*
    * Get Objective and cost Table data
    */
    getLoanCredit(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            if(res.modeFinanceList != null){
                res.modeFinanceList.forEach(re =>{
                        if(re.modeSource === "Loan/Credit" || re.modeSource === "ঋণ"){
                            this.loanPortion = re.gob;
                            this.gobAmount = true;
                            this.getProjectConceptById();
                        }
                })
            }else{
                this.gobAmount = false;
            }
        })
    }

}
