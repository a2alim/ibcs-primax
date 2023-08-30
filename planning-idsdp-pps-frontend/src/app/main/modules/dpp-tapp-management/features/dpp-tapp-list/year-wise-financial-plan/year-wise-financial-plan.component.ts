import {Component, OnInit} from '@angular/core';
import {DppAnnualPhasingCostService} from '../../../services/dpp-annual-phasing-cost.service';
import {ProjectSummaryService} from '../../../../project-concept-management/services/project-summary.service';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {map, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {
    FinancialYears,
    IYearWisePhysicalAndFinancialTarget
} from '../../../models/year-wise-physical-and-financial-target';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {TranslateService} from '@ngx-translate/core';
import {LayoutHelperService} from '../../../../../../layout/layouts/vertical/services/layout-helper.service';
import {DppAnnualPhasingConstant} from '../../../constants/dpp-annual-phasing.constant';
import {NumberPipe} from '../../../../../shared/pipes/number-pipe.pipe';
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import { IDppAnnexure5ACostTotal } from '../../../models/dpp-annexure5A-cost-total';
import { IDppPhasingCostTotal } from '../../../models/dpp-phasing-cost-total';
import {AgencyService} from "../../../../configuration-management/services/agency.service";

@Component({
    selector: 'app-year-wise-financial-plan',
    templateUrl: './year-wise-financial-plan.component.html',
    styleUrls: ['./year-wise-financial-plan.component.scss']
})
export class YearWiseFinancialPlanComponent extends UnsubscribeAdapterComponent implements OnInit {

    tblRows: [];
    balnkVal: any = 0;
    conceptUuid = this.route.snapshot.params['uuid'];
    fiscalYearsEn: string[] = [];
    fiscalYearsBn: string[] = [];
    data: IYearWisePhysicalAndFinancialTarget[] = [];
    revenue: IYearWisePhysicalAndFinancialTarget;
    capital: IYearWisePhysicalAndFinancialTarget;
    contingency: IYearWisePhysicalAndFinancialTarget;
    grand: IYearWisePhysicalAndFinancialTarget;
    colspan = 0;
    show: boolean = true;
    translate = 'en';
    titleEn: string;


    revenueLists: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    capitalLists: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];

    revenueTotalDa: IDppPhasingCostTotal;
    capitalTotalDa: IDppPhasingCostTotal;

    grantTotal: IDppAnnexure5ACostTotal;
    conceptId: number;
    projectSummary: IProjectConcept;
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    paripatraVersion: any;
    grandTotal: any;
    isParipatra2016: boolean;
    subTotalRevObj: IDppPhasingCostTotal;
    subTotalCapObj: IDppPhasingCostTotal;


    fisDataObj: any;
    fisRevDataObj: any;
    fisCapDataObj: any;

    fisCapDataObjFinTotal: any;
    fisCapDataObjItemTotal: any;
    fisCapDataObjProjTotal: any;
    fisRevDataObjProjTotal: any;
    fisRevDataObjItemTotal: any;
    fisRevDataObjFinTotal: any;
    fiscalYear: string;
    Year: string;
    yearList: any;

    totalRevenueWeight: any = 0;
    totalCapitalWeight: any = 0;
    agencyModel: any;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private translateService: TranslateService,
                private layoutHelperService: LayoutHelperService,
                public numberPipe: NumberPipe,
                private route: ActivatedRoute,
                private agencyService: AgencyService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.layoutHelperService.getLanguageEvent().subscribe(res => {
        //    this.translate = res;
        // });
    }

    ngOnInit(): void {
        // this.conceptUuid = this.route.snapshot.params['uuid'];
        this.getProjectSummary();
        this.getData();
        this.getGrandAll();
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.projectSummary = res;
            this.titleEn = res.titleEn;
            this.paripatraVersion = res.paripatraVersion.nameEn;
            this.isParipatra2016 = res.isParipatra2016;
            this.getAgency();
        });
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    private getGrandAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(pc => this.annualPhasingCostService.getGrandTotalByProjectConceptId(pc.id).pipe(
                    map(gt => ({pc: pc, gt: gt}))
                ))
            ).subscribe(res => {
                this.subTotalRevObj = res.gt[0].dppAnnualPhasingCostTotal[0];
                this.subTotalCapObj = res.gt[1].dppAnnualPhasingCostTotal[0];
                this.grandTotal = res.gt;
                this.revenueLists = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
                this.capitalLists = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
                    this.revenueTotalDa = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.dppAnnualPhasingCostTotal[0];
                    this.capitalTotalDa = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.dppAnnualPhasingCostTotal[0];
                this.show = false;
            })
        );
    }

    getData() {
        this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
            switchMap(pc => this.annualPhasingCostService.getYearWisePhysicalAndFinancialTargetByProjectConceptId(pc.id).pipe(
                map(gt => ({pc: pc, gt: gt}))
            ))
        ).subscribe(res => {
            if (!res.pc.isForeignAid) {
                this.translateService.use('bn');
                // this.layoutHelperService.setLanguageEvent('bn');
                this.translate = 'bn';
            }
            if (res.gt) {
                // this.fiscalYearsEn = res.gt[0].details[0].years.map(m => this.getEngMonth(m.month) + " " + m.fiscalYear.substr(0, 4) + "-" +
                //     this.getEngMonth(6) + " " + m.fiscalYear.substr(5, 4));
                // this.fiscalYearsBn = res.gt[0].details[0].years.map(m => this.getBnMonth(m.month) + " " + this.numberPipe.getBengaliNumber(m.fiscalYear.substr(0, 4)) + "-" +
                //     this.getBnMonth(6) + " " + this.numberPipe.getBengaliNumber(m.fiscalYear.substr(5, 4)));
                this.fiscalYearsEn = res.gt[0].details[0].years.map(m => m.fiscalYear);
                this.fiscalYearsEn?.forEach(fYr =>{
                    this.Year  = fYr;
                })

                this.fiscalYearsBn = res.gt[0].details[0].years.map(m => (this.numberPipe.getBanglaString(m.fiscalYear.substr(0, 4)) + "-"
                    + this.numberPipe.getBanglaString(m.fiscalYear.substr(5, 4))));
                this.colspan = (res.gt[0]?.details[0].years.length * 3) + 8;
                this.data = res.gt;
                this.revenue = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0];

                res.gt[1].details?.forEach( fWeit =>{
                    fWeit.years?.forEach(fiscalAmount =>{
                        this.fiscalYear  = fiscalAmount.fiscalYear;
                    })
                })

                this.revenue.details?.forEach( fWeit =>{
                    this.totalRevenueWeight = this.totalRevenueWeight + fWeit.weight;
                })

                this.capital = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0];
                this.capital.details?.forEach( fCaWeit =>{
                    this.totalCapitalWeight = this.totalCapitalWeight + fCaWeit.weight;
                    fCaWeit.years.forEach(fiscalAmount =>{
                        this.fisCapDataObj = fiscalAmount;
                    })
                })
                this.contingency = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0];
                this.grand = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0];
                this.show = false;
            } else {
                this.show = false;
            }
        });
    }

    goBackToHome() {
        window.history.back();
    }

    private convertToBanglaNumber(value) {
        const numbers = {
            0: '০',
            1: '১',
            2: '২',
            3: '৩',
            4: '৪',
            5: '৫',
            6: '৬',
            7: '৭',
            8: '৮',
            9: '৯'
        };

        let output = '';
        const input = value.toString();
        for (let i = 0; i < input.length; ++i) {
            if (numbers.hasOwnProperty(input.charAt(i))) {
                output = output + numbers[input[i]];
            }else{
                output = output + input.charAt(i);
            }
        }
        return output;
    }

}
