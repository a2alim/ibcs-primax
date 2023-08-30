import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {MatStepper} from '@angular/material/stepper';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {TappAnnualPhasingCostService} from "../../../../../services/tapp-annual-phasing-cost.service";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {DppObjectiveCostModel} from "../../../../../models/dppObjectiveCost.model";
import {TappObjectiveCostService} from '../../../../../services/tapp-objective-cost.service';
import {ERROR} from '../../../../../../../core/constants/message';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {AgencyService} from "../../../../../../configuration-management/services/agency.service";
import {FuseNavigationService} from "../../../../../../../../../@fuse/components/navigation";


@Component({
    selector: 'app-annual-phasing-tab-title',
    templateUrl: './tapp-annual-phasing-tab-title.component.html',
    styleUrls: ['./tapp-annual-phasing-tab-title.component.scss'],
})
export class TappAnnualPhasingTabTitleComponent extends UnsubscribeAdapterComponent implements OnInit {

    horizontalStepperForm: FormGroup;
    conceptId: string;
    titleEn: string;
    objectiveCost: DppObjectiveCostModel;

    financialYearsInfo: { fiscalYear: string }[] = [];
    show = false;

    enableCalculateContingencyBtn = false;
    isAddFiscalYear: boolean = true;
    isParipatra2016: boolean;
    isForeignAid: boolean;
    agencyModel: any;
    toggleMenuBarPreviousValue: any;

    constructor(private _formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private _translateService: TranslateService,
                private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                private tappAnnexreObjectiveCostService: TappObjectiveCostService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private snackBar: SnackbarHelper,
                private agencyService: AgencyService,
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
        this.activatedRoute.params.subscribe(res => {
            this.conceptId = res['id'];
        });
        this.subscribe$.add(
            this.tappAnnexreObjectiveCostService.getProjectConceptByUuid(this.conceptId).pipe(
                switchMap(doc => this.projectSummaryService.getByUuid(this.conceptId).pipe(
                    switchMap(pc => this.tappAnnualPhasingCostService.getByProjectConceptIdForGettingFiscalYear(pc.id).pipe(
                        map(fy => ({pc: pc, doc: doc, fy: fy}))
                    ))
                ))
            ).subscribe(res => {
                this.objectiveCost = res.doc.res;
                if (res.doc.res) {
                    if (res.fy.length > 0) {
                        this.financialYearsInfo = res.fy;
                        this.tappAnnualPhasingCostService.setFiscalYearList(this.financialYearsInfo)
                        this.show = true;
                    } else {
                        this.getFiscalYearList();
                    }
                } else {
                    this.snackBar.openErrorSnackBarWithMessage('TAPP (Project Part-A is not created)', ERROR);
                }

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
        this.getProjectConceptById();
    }

    getTitleEn($event: { titleEn: string }) {
        this.titleEn = $event.titleEn;
    }

    private setLanguageForForeignAid(isForeignAid: boolean) {
        this._translateService.use(isForeignAid ? 'en' : 'bn');
        this.tappAnnualPhasingCostService.setIsForeignAid(isForeignAid);
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
            this.financialYearsInfo.push({fiscalYear: (startingYear + "-" + nextYear)});
            startingYear += 1;
            total -= 1;
        }

        this.tappAnnualPhasingCostService.setFiscalYearList(this.financialYearsInfo);
        this.show = true;
    }

    addRowFinancialYear(): void {
        let lastFiscalYear = this.financialYearsInfo[this.financialYearsInfo.length - 1].fiscalYear.split("-").pop();
        const newFiscalYear = (lastFiscalYear + "-" + (Number(lastFiscalYear) + 1));
        this.tappAnnualPhasingCostService.setNewFiscalYear(newFiscalYear);
        this.financialYearsInfo.push({fiscalYear: newFiscalYear});
    }

    currentFiscalYears($event: { fiscalYear: string }[]) {
        this.financialYearsInfo = [];
        this.financialYearsInfo = $event;
    }

    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptId).subscribe(res => {
                this.isParipatra2016 = res.isParipatra2016;
                this.isForeignAid = res.isForeignAid;
                this.getAgency(res.agencyId);
            })
        );
    }

    private getAgency(agencyId) {
        this.agencyService.getById(agencyId).subscribe(res => {
            this.agencyModel = res;
        })
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
        this.isAddFiscalYear = $event.selectedIndex != 3;
        // this.dppAnnualPhasingCostService.setProjectLocationEvent();
    }

    toggleMenuBar(value: boolean){
        const navigation = this._fuseNavigationService.getComponent('mainNavigation');
        if (navigation) {
            this.toggleMenuBarPreviousValue = navigation.opened;
            navigation.opened = value;
        }
    }
}
