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
import {DppAnnualPhasingCostService} from "../../../services/dpp-annual-phasing-cost.service";
import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {TranslateService} from "@ngx-translate/core";
import {
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from "../../../../../core/constants/message";
import { DppAnnualPhasingConstant } from '../../../constants/dpp-annual-phasing.constant';
import { log } from 'util';


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
    titleEn: string;
    model: DppAmortizationSchedule = new DppAmortizationSchedule();

    unitTypeList: DppAmortizationSchedule[] = new Array<DppAmortizationSchedule>();

    loanPeriods: Array<DppAmortizationScheduleDynamicRow> = new Array<DppAmortizationScheduleDynamicRow>();
    gracePeriods: Array<DppAmortizationScheduleDynamicRow> = new Array<DppAmortizationScheduleDynamicRow>();


    spinner: boolean;
    paripatraVersion: any;
    isParipatra2016: boolean;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private objectiveAndCostService : DppObjectiveCostService,
        private router: Router,

        public numberPipe : NumberPipe,
        private validation : GlobalValidationService,
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
        private _snackBar: MatSnackBar,
        private _translateService: TranslateService,
        private service: DppAmortizationScheduleService
    ) {
        super();
        // this.getProjectConceptById();
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

        this.conceptUuid = this.route.snapshot.params['id'];
        this.getProjectConceptById();
        this.getLoanCredit();
    }

    onSubmit() {
        if (this.uuid ==null) {
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


        this.service.createAmortizationSchedule(this.model).subscribe((res) =>{
            this.getAmortizationSchedule();
            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
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

        this.service.updateAmortization(this.model, this.conceptUuid).subscribe((res)=>{
            this.getAmortizationSchedule();
            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
            this.spinner = false;
        })
    }

    /*
   * Get Projct concept Data by  Project Id
   */
    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {


                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }



                if (res.isForeignAid) {
                    this._translateService.use('en');
                } else {
                    this._translateService.use('bn');
                }
                this.projectSummary = res;
                this.conceptUuid = res.uuid;

                this.projectConceptId = res.id;
                this.totalAmount = res.gobAmount;
                this.projectName = res.titleEn;
                this.totalInvestment = res.totalAmount;

                this.setDefalultValue(res);
                this.getAmortizationSchedule();

                this.getTotalCost(this.projectConceptId);

            })
        );
    }

    private getTotalCost(conceptId: number){
        this.subscribe$.add(
            this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res =>{

                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.frmGroup.patchValue({
                    totalInvestment: total[0].totalAmount,
                })
            })
        )
    }
    /*
     * Set for Default value
     */
    setDefalultValue(res){
        this.frmGroup.patchValue({
            totalInvestment: res.totalAmount,
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
                endingPrincipalBalance: i==res-1? '0' : (a - yfa).toFixed(2),
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
            this.titleEn = response.res.projectTitleEn;
            let res = response.res;
            if(res.modeFinanceList != null){
                res.modeFinanceList.forEach(re =>{
                        if(re.modeSource === "Loan/Credit" || re.modeSource === "ঋণ"){
                            this.loanPortion = re.gob;
                            if(re.gob || re.gobFe || re.others || re.othersFe || re.ownFund || re.ownFundFe || re.pa || re.paRpa)
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
