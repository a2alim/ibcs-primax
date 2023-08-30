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
import {MEDIUM_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";

/*----/Lng Translation----*/
@Component({
    selector: 'app-tpp-year-cost-summery',
    templateUrl: './tpp-year-cost-summery.component.html',
    styleUrls: ['./tpp-year-cost-summery.component.scss']
})
export class TppYearCostSummeryComponent extends UnsubscribeAdapterComponent implements OnInit {
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();
    val: any = '0.00';
    content = '';
    indicateIssues: any;
    indicateIssuesNotWork: any;
    yearCostUuid: string;
    isShowIndicateIssues: boolean = true;
    isShowIndicateIssuesNotWork: boolean = true;
    conceptUuid: string;
    pcId: number;
    model: TappYearCostSummeryModel = new TappYearCostSummeryModel();
    grandList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal, rpa: number, dpa: number }[] = [];
    spinner: boolean;
    paripatraVersion: string;
    isParipatra2016: boolean;
    isForeignAid: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private tappYearCostSummeryService: TappYearCostSummeryService,
        private projectSummaryService: ProjectSummaryService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private route: ActivatedRoute,
        private router: Router,
        private utilsService: UtilsService,
        private snackbarHelper: SnackbarHelper,
        public numberPipe: NumberPipe) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.conceptUuid = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getProjectConceptByUuid();
    }

    /**
     * Get Project Concept By Uuid
     */
    private getProjectConceptByUuid() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }
                this.isForeignAid = res.isForeignAid;
                if (res.id) {
                    this.pcId = res.id;
                    this.getGrandTotal();
                    this.getYearCostSummery();
                }
            })
        );

    }

    private getGrandTotal() {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.pcId).subscribe(res => {
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
                console.log('Result');
                console.log(res);
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
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        }
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
                this.yearCostUuid = res.uuid;
                this.indicateIssues = res.indicateIssues;
                this.indicateIssuesNotWork = res.indicateIssuesNotWork;
                this.spinner = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage("Data updated successfully", "Ok");
                this.navigateToList(nextVal);
            });
        } else {
            this.spinner = true;
            this.tappYearCostSummeryService.create(this.model).subscribe(res => {
                this.yearCostUuid = res.uuid;
                this.indicateIssues = res.indicateIssues;
                this.indicateIssuesNotWork = res.indicateIssuesNotWork;
                this.spinner = false;
                this.snackbarHelper.openSuccessSnackBarWithMessage("Data created successfully", "Ok");
                this.navigateToList(nextVal);
            });
        }

    }

    /**
     * CK Editor expand Collapse
     */
    expand(i: number) {
        if (i === 1) {
            this.isShowIndicateIssues = true;
        } else if (i === 2) {
            this.isShowIndicateIssuesNotWork = true;
        }
    }

    collapse(i: number) {
        if (i === 1) {
            this.isShowIndicateIssues = false;
        } else if (i === 2) {
            this.isShowIndicateIssuesNotWork = false;
        }
    }

    uploadImageAsBase64(files: any, propertyName: string) {

        console.log('files === >>>> ', files);

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


}
