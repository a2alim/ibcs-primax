import {Component, OnInit} from '@angular/core';
import {DppAnnualPhasingCostService} from '../../../services/dpp-annual-phasing-cost.service';
import {ProjectSummaryService} from '../../../../project-concept-management/services/project-summary.service';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {map, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {IYearWisePhysicalAndFinancialTarget} from '../../../models/year-wise-physical-and-financial-target';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {TranslateService} from '@ngx-translate/core';
import {LayoutHelperService} from '../../../../../../layout/layouts/vertical/services/layout-helper.service';
import {DppAnnualPhasingConstant} from '../../../constants/dpp-annual-phasing.constant';
import {NumberPipe} from '../../../../../shared/pipes/number-pipe.pipe';
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {RdppAnnualPhasingCostService} from "../../../services/rdpp-annual-phasing-cost.service";

@Component({
    selector: 'app-year-wise-financial-plan',
    templateUrl: './year-wise-financial-plan.component.html',
    styleUrls: ['./year-wise-financial-plan.component.scss']
})
export class YearWiseFinancialPlanComponent extends UnsubscribeAdapterComponent implements OnInit {

    tblRows: [];
    balnkVal: any = 0;
    conceptUuid : string;
    rdppMasterId: number;
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

    projectSummary: IProjectConcept;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
                private translateService: TranslateService,
                private layoutHelperService: LayoutHelperService,
                public numberPipe: NumberPipe,
                private route: ActivatedRoute) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.layoutHelperService.getLanguageEvent().subscribe(res => {
        //    this.translate = res;
        // });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this.getProjectSummary();
        this.getYearWiseFinancialData();
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.projectSummary = res;
            this.titleEn = res.titleEn;
        });
    }


    private getYearWiseFinancialData(): any {
       this.rdppAnnualPhasingCostService.getYearWisePhysicalAndFinancialTargetByProjectConceptId(this.rdppMasterId).subscribe(
           res => {
               console.log('getYearWisePhysicalAndFinancialTargetByProjectConceptId');
               console.log(res);
               if (res) {
                   this.fiscalYearsEn = res[0].details[0].years.map(m => m.fiscalYear);
                   this.fiscalYearsBn = res[0].details[0].years.map(m => (this.numberPipe.getBanglaString(m.fiscalYear.substr(0, 4)) + "-"
                       + this.numberPipe.getBanglaString(m.fiscalYear.substr(5, 4))));
                   this.colspan = (res[0]?.details[0].years.length * 3) + 8;
                   this.data = res;
                   this.revenue = res.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0];
                   this.capital = res.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0];
                   this.contingency = res.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0];
                   this.grand = res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0];
                   this.show = false;
               } else {
                   this.show = false;
               }
           }
       )
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
                this.fiscalYearsBn = res.gt[0].details[0].years.map(m => (this.numberPipe.getBanglaString(m.fiscalYear.substr(0, 4)) + "-"
                    + this.numberPipe.getBanglaString(m.fiscalYear.substr(5, 4))));
                this.colspan = (res.gt[0]?.details[0].years.length * 3) + 8;
                this.data = res.gt;
                this.revenue = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0];
                this.capital = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0];
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
