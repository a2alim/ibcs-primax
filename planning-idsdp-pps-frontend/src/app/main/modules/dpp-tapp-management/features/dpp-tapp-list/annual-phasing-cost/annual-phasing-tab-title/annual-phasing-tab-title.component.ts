import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {MatStepper} from '@angular/material/stepper';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {DppAnnualPhasingCostService} from "../../../../services/dpp-annual-phasing-cost.service";
import {DppObjectiveCostService} from '../../../../services/dpp-objective-cost.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UnsubscribeAdapterComponent} from '../../../../../../core/helper/unsubscribeAdapter';
import {DppObjectiveCostModel} from '../../../../models/dppObjectiveCost.model';
import {map, switchMap} from 'rxjs/operators';
import {ProjectSummaryService} from '../../../../../project-concept-management/services/project-summary.service';
import {TranslateService} from "@ngx-translate/core";
import {SnackbarHelper} from '../../../../../../core/helper/snackbar.helper';
import {OK} from '../../../../../../core/constants/message';
import { FuseNavigationService } from '@fuse/components/navigation';
import { IProjectConcept } from 'app/main/modules/project-concept-management/models/project-concept';
import {AgencyService} from "../../../../../configuration-management/services/agency.service";


@Component({
    selector: 'app-annual-phasing-tab-title',
    templateUrl: './annual-phasing-tab-title.component.html',
    styleUrls: ['./annual-phasing-tab-title.component.scss'],
})
export class AnnualPhasingTabTitleComponent extends UnsubscribeAdapterComponent implements OnInit {

    horizontalStepperForm: FormGroup;
    conceptId: string;
    objectiveCost: DppObjectiveCostModel;

    financialYearsInfo: { fiscalYear: string }[] = [];
    show = false;
    projectConceptUuid: any;

    enableCalculateContingencyBtn = false;
    isGrantTotalTab = false;
    titleEn: string;
    toggleMenuBarPreviousValue: any;
    projectSummary: IProjectConcept;
    isParipatra2016: boolean;
    agencyModel: any;

    constructor(private _formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private _translateService: TranslateService,
                private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                private dppObjectiveCostService: DppObjectiveCostService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private snackBar: SnackbarHelper,
                private route: ActivatedRoute,
                private _fuseNavigationService: FuseNavigationService,
                private agencyService: AgencyService
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
        this.activatedRoute.params.subscribe(res => {
            this.conceptId = res['id'];
        });
        this.subscribe$.add(
            this.dppObjectiveCostService.getByProjectConceptUuid(this.conceptId).pipe(
                switchMap(doc => this.projectSummaryService.getByUuid(this.conceptId).pipe(
                    switchMap(pc => this.dppAnnualPhasingCostService.getByProjectConceptIdForGettingFiscalYear(pc.id).pipe(
                        map(fy => ({pc: pc, doc: doc, fy: fy}))
                    ))
                ))
            ).subscribe(res => {
                this.titleEn = res.doc.res.projectTitleEn;
                this.objectiveCost = res.doc.res;
                if (res.doc.res) {
                    if (res.fy.length > 0) {
                        this.financialYearsInfo = res.fy;
                        this.dppAnnualPhasingCostService.setFiscalYearList(this.financialYearsInfo)
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
        this.toggleMenuBar(false);
        this.projectConceptUuid = this.route.snapshot.params['id'];
        this.getProjectConceptById();

    }

    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
                this.isParipatra2016 = res.isParipatra2016;
                this.projectSummary = res;
                this.titleEn = res.titleEn;
                this.getAgency();
            })
        );
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    private setLanguageForForeignAid(isForeignAid: boolean) {
        this._translateService.use(isForeignAid ? 'en' : 'bn');
        this.dppAnnualPhasingCostService.setIsForeignAid(isForeignAid);
    }

    getFiscalYearList() {
        const a = new Date(this.objectiveCost.dateCommencement);
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

        this.dppAnnualPhasingCostService.setFiscalYearList(this.financialYearsInfo);
        this.show = true;
    }

    addRowFinancialYear(): void {
        let lastFiscalYear = this.financialYearsInfo[this.financialYearsInfo.length - 1].fiscalYear.split("-").pop();
        const newFiscalYear = (lastFiscalYear + "-" + (Number(lastFiscalYear) + 1));
        this.dppAnnualPhasingCostService.setNewFiscalYear(newFiscalYear);
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
        this.isGrantTotalTab = $event.selectedIndex === 3;
        // this.dppAnnualPhasingCostService.setProjectLocationEvent();
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
