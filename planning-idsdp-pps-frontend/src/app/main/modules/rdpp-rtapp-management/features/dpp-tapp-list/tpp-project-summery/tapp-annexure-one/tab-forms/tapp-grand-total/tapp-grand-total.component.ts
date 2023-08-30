import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute} from '@angular/router';
import {UnsubscribeAdapterComponent} from "../../../../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../../../../core/services/translation-loader.service";
import {TappAnnualPhasingCostService} from "../../../../../../services/tapp-annual-phasing-cost.service";
import {ProjectSummaryService} from "../../../../../../../project-concept-management/services/project-summary.service";
import {DppAnnualPhasingConstant} from "../../../../../../constants/dpp-annual-phasing.constant";
import {ITppPhasingCostTotal} from '../../../../../../models/tpp-phasing-cost-total';
import {RtappAnnualPhasingCostService} from "../../../../../../services/rtapp-annual-phasing-cost.service";


@Component({
    selector: 'app-tapp-grand-total',
    templateUrl: './tapp-grand-total.component.html',
    styleUrls: ['./tapp-grand-total.component.scss'],
})
export class TappGrandTotalComponent extends UnsubscribeAdapterComponent implements OnInit {


    @Input() financialYearsInfoJson: any = [];
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() fiscalYearOutput = new EventEmitter<{ fiscalYear: string }[]>();

    conceptId: number;
    rtappMasterId: number;
    conceptUuid: string;
    fiscalYearList: { fiscalYear: string }[] = [];
    revenueTotal: ITppPhasingCostTotal;
    capitalTotal: ITppPhasingCostTotal;
    contingencyTotal: ITppPhasingCostTotal[];
    grantTotal: ITppPhasingCostTotal;
    revenueList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    capitalList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    contingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    physicalContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    priceContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    grandList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    grandTotal: { componentName: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal[], grandTotal: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] }[] = [];
    show: boolean = true;
    isForeignAid: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private annualPhasingCostService: TappAnnualPhasingCostService,
                private rtppAnnualPhasingCostService: RtappAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                private route: ActivatedRoute
    ) {
        super();
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rtappMasterId = params['id'];
        });
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._fuseTranslationLoaderService.getActiveLang() === 'en' ? this.isForeignAid = true : this.isForeignAid = false;
        rtppAnnualPhasingCostService.checkFiscalYear.subscribe(_ => {
            this.emptyAll();
        });
    }

    ngOnInit(): void {
        this.getGrandTotal();
    }

    private emptyAll() {
        this.show = true;
        this.grandTotal = null;
        this.fiscalYearList = [];
        this.revenueTotal = null;
        this.capitalTotal = null;
        this.contingencyTotal = [];
        this.grantTotal = null;
        this.revenueList = [];
        this.capitalList = [];
        this.contingencyList = [];
        this.grandList = [];
        this.physicalContingencyList = [];
        this.priceContingencyList = [];
        this.getGrandTotal();
    }

    private getGrandTotal() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(pc => this.rtppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rtappMasterId).pipe(
                    map(gt => ({pc: pc, gt: gt}))
                ))
            ).subscribe(res => {
                console.log('grand total');
                console.log(res);
                if (res.gt[0].grandTotal.length > 0) {
                    this.conceptId = res.pc.id;
                    this.grandTotal = res.gt;
                    this.fiscalYearList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                    this.revenueTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.tappAnnualPhasingCostTotal[0];
                    this.capitalTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0]?.tappAnnualPhasingCostTotal[0];
                    this.contingencyTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0] ?
                        res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.tappAnnualPhasingCostTotal : [];
                    this.grantTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.tappAnnualPhasingCostTotal[0];
                    this.revenueList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                        res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
                    this.capitalList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                        res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
                    this.contingencyList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency).length > 0 ?
                        res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
                    this.grandList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                        res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                    this.grantTotal.totalAmount = (this.revenueTotal ? this.revenueTotal.totalAmount : 0) +
                        (this.capitalTotal ? this.capitalTotal.totalAmount : 0) +
                        (this.contingencyTotal[0] ? this.contingencyTotal[0].totalAmount : 0) +
                        (this.contingencyTotal[1] ? this.contingencyTotal[1].totalAmount : 0);
                    const length = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.length;
                    if (length > 0) {
                        res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.forEach((e, i) => {
                            if (i < (length / 2)) {
                                this.physicalContingencyList.push(e);
                            } else {
                                this.priceContingencyList.push(e);
                            }
                        });
                    }
                    this.show = false;
                } else {
                    this.emptyArray();
                }
            }));
    }



    private getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(pc => this.annualPhasingCostService.getGrandTotalByProjectConceptId(pc.id).pipe(
                    map(gt => ({pc: pc, gt: gt}))
                ))
            ).subscribe(res => {
                this.conceptId = res.pc.id;
                this.grandTotal = res.gt;
                this.fiscalYearList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                this.revenueTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.tappAnnualPhasingCostTotal[0];
                this.capitalTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0]?.tappAnnualPhasingCostTotal[0];
                this.contingencyTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0] ?
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.tappAnnualPhasingCostTotal : [];
                this.grantTotal = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.tappAnnualPhasingCostTotal[0];
                this.revenueList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
                this.capitalList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
                this.contingencyList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency).length > 0 ?
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
                this.grandList = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.grantTotal.totalAmount = (this.revenueTotal ? this.revenueTotal.totalAmount : 0) +
                    (this.capitalTotal ? this.capitalTotal.totalAmount : 0) +
                    (this.contingencyTotal[0] ? this.contingencyTotal[0].totalAmount : 0) +
                    (this.contingencyTotal[1] ? this.contingencyTotal[1].totalAmount : 0);
                const length = res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.length;
                if (length > 0) {
                    res.gt.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.forEach((e, i) => {
                        if (i < (length / 2)) {
                            this.physicalContingencyList.push(e);
                        } else {
                            this.priceContingencyList.push(e);
                        }
                    });
                }
                this.show = false;
            })
        );
    }

    emptyArray() {
        this.grandTotal = null;
        this.fiscalYearList = [];
        this.revenueTotal = null;
        this.capitalTotal = null;
        this.contingencyTotal = [];
        this.grantTotal = null;
        this.revenueList = [];
        this.capitalList = [];
        this.contingencyList = [];
        this.grandList = [];
        this.physicalContingencyList = [];
        this.priceContingencyList = [];
        this.show = false;
    }
}
