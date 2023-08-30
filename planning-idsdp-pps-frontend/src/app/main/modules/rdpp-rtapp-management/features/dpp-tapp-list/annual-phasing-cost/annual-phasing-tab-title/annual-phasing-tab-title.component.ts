import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {MatStepper} from '@angular/material/stepper';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {DppAnnualPhasingCostService} from "../../../../services/dpp-annual-phasing-cost.service";
import {ActivatedRoute} from '@angular/router';
import {UnsubscribeAdapterComponent} from '../../../../../../core/helper/unsubscribeAdapter';
import {DppObjectiveCostModel} from '../../../../models/dppObjectiveCost.model';
import {map, switchMap} from 'rxjs/operators';
import {ProjectSummaryService} from '../../../../../project-concept-management/services/project-summary.service';
import {TranslateService} from "@ngx-translate/core";
import {SnackbarHelper} from '../../../../../../core/helper/snackbar.helper';
import {OK} from '../../../../../../core/constants/message';
import {RdppAnnualPhasingCostService} from "../../../../services/rdpp-annual-phasing-cost.service";
import {RdppObjectiveCostService} from "../../../../services/rdpp-objective-cost.service";
import { FuseNavigationService } from '@fuse/components/navigation';


@Component({
    selector: 'app-annual-phasing-tab-title',
    templateUrl: './annual-phasing-tab-title.component.html',
    styleUrls: ['./annual-phasing-tab-title.component.scss'],
})
export class AnnualPhasingTabTitleComponent extends UnsubscribeAdapterComponent implements OnInit {

    horizontalStepperForm: FormGroup;
    conceptId: string;
    cumulative: string;
    rdppMasterId: number;
    objectiveCost: DppObjectiveCostModel;
    titleEn: string;
    financialYearsInfo: { fiscalYear: string }[] = [];
    show = false;

    enableCalculateContingencyBtn = false;
    
    toggleMenuBarPreviousValue: any;

    constructor(private _formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private _translateService: TranslateService,
                private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
                private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                // private dppObjectiveCostService: DppObjectiveCostService,
                private rdppObjectiveCostService: RdppObjectiveCostService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private snackBar: SnackbarHelper,
                private _fuseNavigationService: FuseNavigationService,
    ) {
        super();

        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.toggleMenuBar(false);

        this.activatedRoute.queryParams.subscribe(params => {
            this.conceptId = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this.getCumulativeDate();

        this.subscribe$.add(
            this.rdppObjectiveCostService.getByProjectConceptUuidAndId(this.conceptId ,this.rdppMasterId).pipe(
                switchMap(doc => this.projectSummaryService.getByUuid(this.conceptId).pipe(
                    switchMap(pc => this.rdppAnnualPhasingCostService.getByProjectConceptIdForGettingFiscalYear(this.rdppMasterId).pipe(
                        map(fy => ({pc: pc, doc: doc, fy: fy}))
                    ))
                ))
            ).subscribe(res => {
                console.log('get by project concept uuid and id');
                console.log(res);
                this.objectiveCost = res.doc.res;
                this.titleEn = res.doc.res.projectTitleEn;
                if (res.doc.res) {
                    if (res.fy.length > 0) {
                        this.financialYearsInfo = res.fy;
                        this.rdppAnnualPhasingCostService.setFiscalYearList(this.financialYearsInfo);
                        this.show = true;
                    } else {
                        this.getFiscalYearList();
                    }
                }
                // else {
                //     this.snackBar.openWarnSnackBarWithMessage('Require to save Part-A (Project Summary)', OK);
                // }
                this.setLanguageForForeignAid(res.pc.isForeignAid);
            })
        );
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({}),
            step5: this._formBuilder.group({}),
        });
    }

    private setLanguageForForeignAid(isForeignAid: boolean) {
        this._translateService.use(isForeignAid ? 'en' : 'bn');
        this.dppAnnualPhasingCostService.setIsForeignAid(isForeignAid);
    }

    getFiscalYearList() {
        const a = this.cumulative =='null' ? new Date(this.objectiveCost.dateCommencement) : new Date(this.cumulative);
        const b = new Date(this.objectiveCost.dateCompletion);

        let fYear = a.getFullYear();
        let lYear = b.getFullYear();

        if (a.getMonth() < 6) {
            fYear = a.getFullYear() - 1;
        }
        if (b.getMonth() > 5) {
            lYear = b.getFullYear() + 1;
        }

        let total = lYear - fYear;
        let startingYear = fYear;

        while (total > 0) {
            let nextYear = (startingYear + 1);
            this.financialYearsInfo.push({ fiscalYear: (startingYear + "-" + nextYear) });
            startingYear += 1;
            total -= 1;
        }

        this.rdppAnnualPhasingCostService.setFiscalYearList(this.financialYearsInfo);
        this.show = true;
    }

    addRowFinancialYear(): void {
        let lastFiscalYear = this.financialYearsInfo[this.financialYearsInfo.length - 1].fiscalYear.split("-").pop();
        const newFiscalYear = (lastFiscalYear + "-" + (Number(lastFiscalYear) + 1));
        this.rdppAnnualPhasingCostService.setNewFiscalYear(newFiscalYear);
        this.financialYearsInfo.push({ fiscalYear: newFiscalYear });
    }

    currentFiscalYears($event: { fiscalYear: string }[]) {
        this.financialYearsInfo = [];
        this.financialYearsInfo = $event;
    }

    /**
     * For Count Changed Handler
     * @param index
     */
    countChangedHandler(index: number): void {
        // this.tableWidth = this.tableWidth - 710;
        // if (index !== -1) {
        //     this.getFinancialYears.splice(index, 1);
        // }
        //
        // this.FinancialYearsInfo = {
        //     tableWidth: this.tableWidth,
        //     FinancialYearsNo: this.getFinancialYears,
        // };
        // localStorage.setItem(
        //     'FinancialYearsInfo',
        //     JSON.stringify(this.FinancialYearsInfo)
        // );
    }

    /**
     * Back Previous Tab
     * @param stepper
     */
    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    /**
     * Back Forward Tab
     * @param stepper
     */
    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    /**
     * Back Home
     * @param stepper
     */
    goBackToHome() {
        this.toggleMenuBar(this.toggleMenuBarPreviousValue);
        window.history.back();
    }

    selectionChanged($event: StepperSelectionEvent) {
        this.enableCalculateContingencyBtn = $event.selectedIndex === 2;
        // this.dppAnnualPhasingCostService.setProjectLocationEvent();
    }

    getCumulativeDate() {
        this.rdppObjectiveCostService.getCumulativeDate(this.rdppMasterId, this.conceptId).subscribe((response) =>{
            this.cumulative = response.res;
        })
    }

    // collapsed menue bar 
    toggleMenuBar(value: boolean){
        const navigation = this._fuseNavigationService.getComponent('mainNavigation');
        if (navigation) {
            this.toggleMenuBarPreviousValue = navigation.opened;
            navigation.opened = value;
        }
    }
}
