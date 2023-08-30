import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/*----Lng Translation----*/
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {DppAnnualPhasingCostService} from '../../../../../services/dpp-annual-phasing-cost.service';
import {map, switchMap} from "rxjs/operators";
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {IDppPhasingCostTotal} from '../../../../../models/dpp-phasing-cost-total';
import {ProjectSummaryService} from '../../../../../../project-concept-management/services/project-summary.service';
import {ActivatedRoute} from '@angular/router';
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {RdppAnnualPhasingCostService} from "../../../../../services/rdpp-annual-phasing-cost.service";
import { RdppObjectiveCostService } from 'app/main/modules/rdpp-rtapp-management/services/rdpp-objective-cost.service';


@Component({
    selector: 'app-grand-total',
    templateUrl: './grand-total.component.html',
    styleUrls: ['./grand-total.component.scss'],
})
export class GrandTotalComponent extends UnsubscribeAdapterComponent implements OnInit {


    @Input() financialYearsInfoJson: any = [];
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() fiscalYearOutput = new EventEmitter<{ fiscalYear: string }[]>();

    conceptId: number;
    conceptUuid: string;
    rdppMasterId: number;
    fiscalYearList: { fiscalYear: string }[] = [];
    revenueTotal: IDppPhasingCostTotal;
    capitalTotal: IDppPhasingCostTotal;
    contingencyTotal: IDppPhasingCostTotal[];
    grantTotal: IDppPhasingCostTotal;
    revenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    capitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    contingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    physicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    priceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    grandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    grandTotal: { dppAnnualPhasing: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal[], grandTotal: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] }[] = [];
    show: boolean = true;
    isForeignAid: boolean;

    projectSummary: IProjectConcept;
    cumulativeDate: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                private numberPipe : NumberPipe,
                private route: ActivatedRoute,
                private rdppObjectiveCostService: RdppObjectiveCostService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._fuseTranslationLoaderService.getActiveLang() === 'en' ? this.isForeignAid = true : this.isForeignAid = false;
        rdppAnnualPhasingCostService.checkFiscalYear.subscribe(_ => {
            this.emptyAll();
        });
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

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this.getPcInfo();
        this.getGrandTotal();
        this.getCumulativeDate();
    }


    private getGrandTotal() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(pc => this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rdppMasterId).pipe(
                    map(gt => ({pc: pc, gt: gt}))
                ))
            ).subscribe(res => {
                console.log('grand total');
                console.log(res);
                if(res.gt[0].grandTotal.length > 0) {
                    this.conceptId = res.pc.id;
                    this.grandTotal = res.gt;
                    this.fiscalYearList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                    this.revenueTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.dppAnnualPhasingCostTotal[0];
                    this.capitalTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.dppAnnualPhasingCostTotal[0];
                    this.contingencyTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0] ?
                        res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal : [];
                    this.grantTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.dppAnnualPhasingCostTotal[0];
                    this.revenueList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                        res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
                    this.capitalList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                        res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
                    this.contingencyList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0 ?
                        res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
                    this.grandList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                        res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                    this.grantTotal.totalAmount = (this.revenueTotal ? this.revenueTotal.totalAmount : 0) +
                        (this.capitalTotal ? this.capitalTotal.totalAmount : 0) +
                        (this.contingencyTotal[0] ? this.contingencyTotal[0].totalAmount : 0) +
                        (this.contingencyTotal[1] ? this.contingencyTotal[1].totalAmount : 0);
                    const length = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.length;
                    if (length > 0) {
                        res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.forEach((e, i) => {
                            if (i < (length / 2)) {
                                this.physicalContingencyList.push(e);
                            } else {
                                this.priceContingencyList.push(e);
                            }
                        });
                    }
                    this.show = false;
                }
                else {
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
                this.fiscalYearList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                this.revenueTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.dppAnnualPhasingCostTotal[0];
                this.capitalTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.dppAnnualPhasingCostTotal[0];
                this.contingencyTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0] ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal : [];
                this.grantTotal = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.dppAnnualPhasingCostTotal[0];
                this.revenueList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
                this.capitalList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
                this.contingencyList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0 ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
                this.grandList = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.grantTotal.totalAmount = (this.revenueTotal ? this.revenueTotal.totalAmount : 0) +
                    (this.capitalTotal ? this.capitalTotal.totalAmount : 0) +
                    (this.contingencyTotal[0] ? this.contingencyTotal[0].totalAmount : 0) +
                    (this.contingencyTotal[1] ? this.contingencyTotal[1].totalAmount : 0);
                const length = res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.length;
                if (length > 0) {
                    res.gt.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal.forEach((e, i) => {
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

    getPcInfo(){
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) =>{
            this.projectSummary = res;
        })
    }

    getCumulativeDate() {
        this.rdppObjectiveCostService.getCumulativeDate(this.rdppMasterId, this.conceptUuid).subscribe((res) =>{
            this.cumulativeDate = res.res;
        })
    }

}
