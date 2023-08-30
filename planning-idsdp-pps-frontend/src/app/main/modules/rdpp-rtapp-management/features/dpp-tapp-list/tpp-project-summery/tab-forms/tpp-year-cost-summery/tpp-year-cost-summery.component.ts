import { Component, EventEmitter, OnInit, Output } from '@angular/core';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { TappYearCostSummeryModel } from '../../../../../models/tappYearCostSummery.model';
import { TappYearCostSummeryService } from '../../../../../services/tapp-year-cost-summery.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UnsubscribeAdapterComponent } from "../../../../../../../core/helper/unsubscribeAdapter";
import { ProjectSummaryService } from "../../../../../../project-concept-management/services/project-summary.service";
import { TappAnnualPhasingCostService } from '../../../../../services/tapp-annual-phasing-cost.service';
import { ITppPhasingCostTotal } from '../../../../../models/tpp-phasing-cost-total';
import { DppAnnualPhasingConstant } from '../../../../../constants/dpp-annual-phasing.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UtilsService } from 'app/main/core/services/utils.service';
import {RtappAnnualPhasingCostService} from "../../../../../services/rtapp-annual-phasing-cost.service";
import { EstimatedCostModel } from 'app/main/modules/rdpp-rtapp-management/models/estimated-cost.model';
import { TappObjectiveCostService } from 'app/main/modules/rdpp-rtapp-management/services/tapp-objective-cost.service';
import { IProjectConcept } from 'app/main/modules/project-concept-management/models/project-concept';
import {
    FAILED_UPDATE,
    SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN
} from "../../../../../../../core/constants/message";

/*----/Lng Translation----*/
@Component({
    selector: 'app-tpp-year-cost-summery',
    templateUrl: './tpp-year-cost-summery.component.html',
    styleUrls: ['./tpp-year-cost-summery.component.scss']
})
export class TppYearCostSummeryComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();
    val: any = '0.00';
    content = '';
    indicateIssues: any;
    indicateIssuesNotWork: any;
    mainFeaturesOfRevision: string;
    yearCostUuid: string;
    isJustification: boolean = true;
    conceptUuid: string;
    masterId: number;
    pcId: number;
    model: TappYearCostSummeryModel = new TappYearCostSummeryModel();
    grandList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal, rpa: number, dpa: number }[] = [];
    spinner: boolean;

    isForeignAid: boolean = false;
    estimatedCosts: EstimatedCostModel[];
    estimatiedCostTotal: EstimatedCostModel[] = [];
    projectSummary: IProjectConcept;

    fiscalYearsList: Array<{
        fiscalYear: string, revisedVersion: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
        ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
    }> = [];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private tappYearCostSummeryService: TappYearCostSummeryService,
        private projectSummaryService: ProjectSummaryService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private rtappAnnualPhasingCostService: RtappAnnualPhasingCostService,
        private route: ActivatedRoute,
        private router: Router,
        private utilsService: UtilsService,
        private snackbarHelper: SnackbarHelper,
        private rtappObjectiveCostService:TappObjectiveCostService,
    ) {
        super();

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.masterId = params['id'];
        });
    }

    ngOnInit(): void {
        this.getProjectConceptByUuid();
        this.getDataByRtappMasterId();
    }

    /**
     * Get Project Concept By Uuid
     */
    private getProjectConceptByUuid() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.projectSummary = res;
                this.isForeignAid = res.isForeignAid;
                if (res.id) {
                    this.pcId = res.id;
                    this.getGrandTotal();
                    this.getYearCostSummery();
                    this.getYearWiseEstimatiedCost();
                }
            })
        );

    }

    private getGrandTotal() {
        this.rtappAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.masterId).subscribe(res => {
            this.grandList = res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal
                    .map(m => ({
                        ...m,
                        rpa: Number(m.tappAnnualPhasingCostTotal.gobThruAmount) + Number(m.tappAnnualPhasingCostTotal.spAcAmount),
                        dpa: Number(m.tappAnnualPhasingCostTotal.thruDpAmount) + Number(m.tappAnnualPhasingCostTotal.thruPdAmount)
                    })) : [];
        });
    }

    /**
     * Get Year Cost Summery
     */
    private getYearCostSummery() {
        this.subscribe$.add(
            this.tappYearCostSummeryService.getYearCostSummeryByProjectSummaryUuid(this.pcId).subscribe(res => {
                if (res.status > 0) {
                    this.indicateIssues = res.res.indicateIssues;
                    this.indicateIssuesNotWork = res.res.indicateIssuesNotWork;
                    this.yearCostUuid = res.res.uuid;
                }
            })
        );
    }


    gotNextPage() {
        this.nextStep.emit(true);
    }

    navigateToList(nextVal) {

        if (nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if (nextVal == 'list') {
            this.router.navigate(['rdpp-rtapp']);
        }
    }


    exit(nextVal) {
        this.navigateToList(nextVal);
    }

    /**
     * Save Data in DB
     */
    saveAndNext(nextVal) {
        this.model.indicateIssues = this.indicateIssues;
        this.model.indicateIssuesNotWork = this.indicateIssuesNotWork;
        this.model.projectSummeryMasterId = this.pcId;
        this.model.uuid = this.yearCostUuid;

        if (this.yearCostUuid) {
            this.spinner = true;
            this.tappYearCostSummeryService.update(this.model).subscribe(res => {
                this.indicateIssues = '';
                this.indicateIssuesNotWork = '';
                this.spinner = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage("Data updated successfully", "Ok");
                this.navigateToList(nextVal);
            });
        } else {
            this.spinner = true;
            this.tappYearCostSummeryService.create(this.model).subscribe(res => {
                this.indicateIssues = '';
                this.indicateIssuesNotWork = '';
                this.spinner = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage("Data created successfully", "Ok");
                this.navigateToList(nextVal);
            });
        }
    }

    expandOrCollapse() {
        this.isJustification = !this.isJustification;
    }

    uploadImageAsBase64(files: any, propertyName: string) {

        if (files.length === 0)
            return;
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            let upFileBase64ImgUrl = reader.result;
            this[propertyName] = this[propertyName] ? this[propertyName] : '';
            this[propertyName] += '<br><img src="' + upFileBase64ImgUrl + '">';
        }
    }


    private getYearWiseEstimatiedCost(){
        this.tappAnnualPhasingCostService.getYearWiseEstimatedCosts(this.conceptUuid).subscribe(
            res =>{
                this.estimatiedCostTotal = res;
                let fiscalYears: any[] = [];

                if(res[0].grandTotal.length){
                    res[0].grandTotal.forEach(element => {
                        fiscalYears.push(element.fiscalYear);
                    });
                }else{
                    res[1].grandTotal.forEach(element => {
                        fiscalYears.push(element.fiscalYear);
                    });
                }
                if (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'TAPP'){

                    if (fiscalYears.length > 0) {
                        this.fiscalYearsList = [];

                        fiscalYears.forEach(fYear =>{

                            res.forEach((yearTotal, index)=>{
                                if(yearTotal?.grandTotal.length>0){
                                    yearTotal?.grandTotal.forEach(totalData => {
                                        if(fYear==totalData.fiscalYear){

                                            let obj: any = this.setValue(totalData?.tappAnnualPhasingCostTotal);
                                            obj.fiscalYear = fYear,
                                            obj.revisedVersion = yearTotal?.revisedVersion,
                                            this.fiscalYearsList.push(obj);
                                        }
                                    });
                                }else{

                                    let obj: any  = this.setValue(null);
                                    obj.fiscalYear = fYear,
                                    obj.revisedVersion = yearTotal?.revisedVersion,
                                    this.fiscalYearsList.push(obj)
                                }

                                this.estimatiedCostTotal[index].costTotal = this.setValue(yearTotal?.tappAnnualPhasingCostTotal[0]);
                                this.estimatiedCostTotal[index].costTotal.revisedVersion = yearTotal?.revisedVersion;
                            })
                        })
                    }
                }
            },
            err =>{
                console.log('getEstimatedCosts error : ', err);
            }
        );
    }

    private setValue(data){
        return {
            gobAmount: data? data.gobAmount.toFixed(2):'0.00',
            gobFeAmount: data? data.gobFeAmount.toFixed(2):'0.00',
            rpaAmount: data? (data.gobThruAmount + data.spAcAmount).toFixed(2):'0.00',
            dpaAmount: data? (data.thruPdAmount + data.thruDpAmount).toFixed(2):'0.00',
            ownFundAmount: data? data.ownFundAmount.toFixed(2):'0.00',
            ownFundFeAmount: data? data.ownFundFeAmount.toFixed(2):'0.00',
            otherAmount: data? data.otherAmount.toFixed(2):'0.00',
            otherFeAmount: data? data.otherFeAmount.toFixed(2):'0.00',
            totalAmount: data? data.totalAmount.toFixed(2):'0.00',
        }
    }

    getDataByRtappMasterId() {
        this.rtappObjectiveCostService.getObjectiveCostByRtappMasterId(this.masterId).subscribe(res => {
            if (res) {
                this.mainFeaturesOfRevision = res.mainFeaturesOfRevision;
            }
        });
    }

    onSubmit(nextVal) {
        this.rtappObjectiveCostService.updateMainFeaturesRevision(this.masterId, this.mainFeaturesOfRevision).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED);
                this.navigateToDashboard(nextVal);
            }
        }, error=>{
            this.snackbarHelper.openErrorSnackBarWithMessageEnBn(FAILED_UPDATE, FAILED_UPDATE);
        });
    }

    navigateToDashboard(nextVal) {
        if (nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if (nextVal == 'dashboard') {
            this.router.navigate(['/rdpp-rtapp/view-dashboard'], { queryParams: {pcUuid: this.conceptUuid, id: this.masterId}});
        }
    }
}
