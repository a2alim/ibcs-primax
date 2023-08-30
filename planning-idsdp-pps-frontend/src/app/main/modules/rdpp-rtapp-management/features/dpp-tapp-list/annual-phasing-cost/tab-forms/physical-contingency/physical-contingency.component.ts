import {GlobalValidationService} from '../../../../../../../../global/validation/global-validation.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';

/*----Lng Translation----*/
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {DppAnnualPhasingCostService} from '../../../../../services/dpp-annual-phasing-cost.service';
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {EconomicCodeService} from "../../../../../../configuration-management/services/economic-code-service.service";
import {SubEconomicCodeService} from "../../../../../../configuration-management/services/sub-economic-code.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {IDppAnnualPhasingCostTabDetails} from "../../../../../models/dpp-annual-phasing-cost-tab-details";
import {IDppPhasingCostTotal} from "../../../../../models/dpp-phasing-cost-total";
import {IFiscalYearRequest} from "../../../../../models/fiscal-year-request";
import {ERROR, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../../../core/constants/message";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {IDppAnnualPhasingCostWithChildDetailsResponse} from "../../../../../models/dpp-annual-phasing-cost-with-child-respone";
import {IDppAnnualPhasingCostWithChildDetailsRequest} from "../../../../../models/dpp-annual-phasing-cost-with-child-request";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {map, switchMap} from "rxjs/operators";
import {RdppAnnualPhasingCostService} from "../../../../../services/rdpp-annual-phasing-cost.service";
import { RdppObjectiveCostService } from 'app/main/modules/rdpp-rtapp-management/services/rdpp-objective-cost.service';

/*----/Lng Translation----*/

@Component({
    selector: 'app-physical-contingency',
    templateUrl: './physical-contingency.component.html',
    styleUrls: ['../style.component.scss'],
})
export class PhysicalContingencyComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Input() financialYearsInfoJson: any = [];
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() fiscalYearOutput = new EventEmitter<{ fiscalYear: string }[]>();

    conceptId: number;
    rdppMasterId: number;
    conceptUuid: string;
    contingencyComponentInRdppFound: boolean = true;
    fiscalYearList: { fiscalYear: string }[] = [];
    contingencyArray: { details: IDppAnnualPhasingCostTabDetails }[] = [];
    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse;
    show: boolean = true;
    isForeignAid: boolean;

    projectSummary: IProjectConcept;

    spinner: boolean;
    cumulativeDate: string;

    constructor(private formBuilder: FormBuilder,
                private globalValidation: GlobalValidationService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private snackBar: SnackbarHelper,
                private projectSummaryService: ProjectSummaryService,
                private economicCodeService: EconomicCodeService,
                private subEconomicCodeService: SubEconomicCodeService,
                private route: ActivatedRoute,
                public numberPipe : NumberPipe,
                private router: Router,
                private dialog: MatDialog,
                private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
                private rdppObjectiveCostService: RdppObjectiveCostService,
    ) {
        super();
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._fuseTranslationLoaderService.getActiveLang() === 'en' ? this.isForeignAid = true : this.isForeignAid = false;
        this.rdppAnnualPhasingCostService.fiscalYear.subscribe(res => {
            if (res) {
                this.addFiscalYear(res);
            }
        });
        rdppAnnualPhasingCostService.checkFiscalYear.subscribe(_ => {
            this.getContingencyDataInRdpp();
        });
    }

    ngOnInit(): void {
        this.getPcInfo();
        this.getCumulativeDate();
    }

    getPcInfo(){
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) =>{
            this.projectSummary = res;
            this.getContingencyDataInRdpp();
        })
    }

    private getContingencyDataInRdpp(): any {
        this.show = true;
        this.emptyAllArray();
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(projectRes => {
            this.conceptUuid = projectRes.uuid;
            this.conceptId = projectRes.id;
            this.rdppAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
                rdppMasterId: this.rdppMasterId,
                componentName: DppAnnualPhasingConstant.Contingency
            }).subscribe(c => {
                if (c) {
                    this.contingencyComponentInRdppFound = true;
                    this.dppAnnualPhasingCostWithChildDetails = c;
                    c.dppAnnualPhasingCostTabDetails.forEach(e => {
                        this.contingencyArray.push({details: e});
                    });
                    this.fiscalYearWiseCost = c.fiscalYearWiseCost;
                    this.fiscalYearList = c.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                    this.show = false;
                    this.fiscalYearOutput.emit(c.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
                } else {
                    this.contingencyComponentInRdppFound = false;
                    this.getAllCall();
                }
            })
        });
    }

    emptyAllArray() {
        this.fiscalYearList = [];
        this.contingencyArray = [];
        this.fiscalYearWiseCost = [];
        this.contingencyArray = [];
    }

    private getAllCall() {
        this.emptyAllArray();
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(projectRes => {
            this.conceptUuid = projectRes.uuid;
            this.conceptId = projectRes.id;
            this.annualPhasingCostService.getByProjectConceptIdAndComponentName({
                projectConceptId: projectRes.id,
                componentName: DppAnnualPhasingConstant.Contingency
            }).subscribe(c => {
                if (c) {
                    // this.dppAnnualPhasingCostWithChildDetails = c;
                    // c.dppAnnualPhasingCostTabDetails.forEach(e => {
                    //     this.contingencyArray.push({details: e});
                    // });
                   // this.fiscalYearWiseCost = c.fiscalYearWiseCost;
                   // this.fiscalYearList = c.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                   // this.fiscalYearOutput.emit(c.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
                    this.initTab();
                    this.show = false;
                } else {
                    this.initTab();
                }
            })
        });
    }

    private initTab(): void {
        this.initFiscalYearWithCost();
        this.initContingency();
        this.initContingency();
    }

    initFiscalYearWithCost(): any {
        this.rdppAnnualPhasingCostService.fiscalYearList.subscribe(res => {
            this.fiscalYearList = res;
            this.fiscalYearList.forEach(e => {
                this.initFiscalYearWiseData(e.fiscalYear);
            });
        });
    }

    onchangeAmount($event: KeyboardEvent, field: string, parentIndex: number, childIndex: number) {
        let value = 0;
        if (!isNaN(Number($event.target['value']))) {
            value = Number($event.target['value']);
        }
        switch (field) {
            case 'quantity':
                this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;
                break;
            case 'gobAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'gobFeAmount':
                if (this.fiscalYearWiseCost[parentIndex].values[childIndex].gobAmount >= value) {
                    this.calculationOfFe(value, field, parentIndex, childIndex);
                } else {
                    this.calculationOfFe(0, field, parentIndex, childIndex);
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
                }
                break;
            case 'gobThruAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'spAcAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'thruPdAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'thruDpAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'ownFundAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'ownFundFeAmount':
                if (this.fiscalYearWiseCost[parentIndex].values[childIndex].ownFundAmount >= value) {
                    this.calculationOfFe(value, field, parentIndex, childIndex);
                } else {
                    this.calculationOfFe(0, field, parentIndex, childIndex);
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
                }
                break;
            case 'otherAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'otherFeAmount':
                if (this.fiscalYearWiseCost[parentIndex].values[childIndex].otherAmount >= value) {
                    this.calculationOfFe(value, field, parentIndex, childIndex);
                } else {
                    this.calculationOfFe(0, field, parentIndex, childIndex);
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
                }
                break;
            default:
                console.log("Not Match");
                break;
        }
    }

    onChangeContingencyAmount($event: KeyboardEvent, field: string, index: number) {
        let value = 0;
        if (!isNaN(Number($event.target['value']))) {
            value = Number($event.target['value']);
        }
        switch (field) {
            case 'gobFeAmount':
                if (this.contingencyArray[index].details['gobAmount'] < value){
                    this.contingencyArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
                }
                break;
            case 'ownFundFeAmount':
                if (this.contingencyArray[index].details['ownFundAmount'] < value){
                    this.contingencyArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
                }
                break;
            case 'otherFeAmount':
                if (this.contingencyArray[index].details['otherAmount'] < value){
                    this.contingencyArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
                }
                break;
            default:
                this.contingencyArray[index].details[field] = value;
                break;
        }

        // set capital fields total amount
        this.contingencyArray[index].details.totalAmount =
            (this.contingencyArray[index].details.gobThruAmount +
            this.contingencyArray[index].details.gobAmount +
            this.contingencyArray[index].details.ownFundAmount +
            this.contingencyArray[index].details.spAcAmount +
            this.contingencyArray[index].details.otherAmount +
            this.contingencyArray[index].details.thruPdAmount +
            this.contingencyArray[index].details.thruDpAmount);
    }

    private calculationExceptFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount
        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;

        // set current index project total amount
        this.fiscalYearWiseCost[parentIndex].values[childIndex].totalAmount =
            (this.fiscalYearWiseCost[parentIndex].values[childIndex].gobAmount +
            this.fiscalYearWiseCost[parentIndex].values[childIndex].gobThruAmount +
            this.fiscalYearWiseCost[parentIndex].values[childIndex].spAcAmount +
            this.fiscalYearWiseCost[parentIndex].values[childIndex].thruPdAmount +
            this.fiscalYearWiseCost[parentIndex].values[childIndex].thruDpAmount +
            this.fiscalYearWiseCost[parentIndex].values[childIndex].ownFundAmount +
            this.fiscalYearWiseCost[parentIndex].values[childIndex].otherAmount);
    }

    private calculationOfFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount

        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;
    }

    private initFiscalYearWiseData(fiscalYear: string) {
        const values = [];
        values.push(this.getData(fiscalYear));
        values.push(this.getData(fiscalYear));
        this.fiscalYearWiseCost.push(
            {
                fiscalYear: fiscalYear,
                values: values,
                dppAnnualPhasingCostTotal: this.getData(fiscalYear)
            }
        );
    }

    initContingency() {
        this.contingencyArray.push(
            {
                details:
                    {
                        attachmentId: 0,
                        id: null,
                        uuid: null,
                        isBasis: false,
                        isMajor: false,
                        description: '',
                        economicCodeId: null,
                        subEconomicCodeId: null,
                        qty: 0,
                        gobAmount: 0,
                        gobFeAmount: 0,
                        gobThruAmount: 0,
                        thruDpAmount: 0,
                        thruPdAmount: 0,
                        spAcAmount: 0,
                        otherFe: 0,
                        unitCost: 0,
                        totalAmount: 0,
                        ownFundAmount: 0,
                        ownFundFeAmount: 0,
                        otherAmount: 0,
                        otherFeAmount: 0,
                        unitId: null,
                        isFromOriginal: false,
                    }
            }
        );
        this.show = false;
    }

    addFiscalYear(fy: string) {
        if (this.fiscalYearWiseCost[0]) {
            let values = [];
            this.fiscalYearWiseCost[0].values.forEach(e => {
                values.push(this.getData(fy));
            });
            this.fiscalYearWiseCost.push(
                {
                    fiscalYear: fy,
                    values: values,
                    dppAnnualPhasingCostTotal: this.getData(fy)
                });
        }
    }

    private getData(fiscalYear: string) {
        return {
            id: null,
            uuid: null,
            fiscalYear: fiscalYear,
            gobAmount: 0,
            gobFeAmount: 0,
            gobThruAmount: 0,
            spAcAmount: 0,
            thruPdAmount: 0,
            thruDpAmount: 0,
            ownFundAmount: 0,
            ownFundFeAmount: 0,
            otherAmount: 0,
            otherFeAmount: 0,
            totalAmount: 0,
            quantity:0,
            isFromOriginal:0,
        };
    }

    onNextTab(): void {
        this.arrangeData(true);
    }

    saveAndExit(): void {
        this.arrangeData(false);
    }

    /**
     * delete iscal year value
     * @param i
     */
    deleteYear(i: number) {
        this.subtractFromContingencyArray(i);
        // this.fiscalYearWiseCost.splice(i, 1);
        this.fiscalYearList.splice(i, 1);
        this.fiscalYearOutput.emit(this.fiscalYearList);
    }

    private subtractFromContingencyArray(i: number) {
        this.contingencyArray.forEach((e, index) => {
            e.details.totalAmount = e.details.totalAmount - this.fiscalYearWiseCost[i].values[index].totalAmount;
            e.details.gobAmount = e.details.gobAmount - this.fiscalYearWiseCost[i].values[index].gobAmount;
            e.details.gobFeAmount = e.details.gobFeAmount - this.fiscalYearWiseCost[i].values[index].gobFeAmount;
            e.details.gobThruAmount = e.details.gobThruAmount - this.fiscalYearWiseCost[i].values[index].gobThruAmount;
            e.details.spAcAmount = e.details.spAcAmount - this.fiscalYearWiseCost[i].values[index].spAcAmount;
            e.details.thruPdAmount = e.details.thruPdAmount - this.fiscalYearWiseCost[i].values[index].thruPdAmount;
            e.details.thruDpAmount = e.details.thruDpAmount - this.fiscalYearWiseCost[i].values[index].thruDpAmount;
            e.details.ownFundAmount = e.details.ownFundAmount - this.fiscalYearWiseCost[i].values[index].ownFundAmount;
            e.details.ownFundFeAmount = e.details.ownFundFeAmount - this.fiscalYearWiseCost[i].values[index].ownFundFeAmount;
            e.details.otherAmount = e.details.otherAmount - this.fiscalYearWiseCost[i].values[index].otherAmount;
            e.details.otherFeAmount = e.details.otherFeAmount - this.fiscalYearWiseCost[i].values[index].otherFeAmount;
            // e.details.unitCost = e.details.totalAmount / e.details.qty;
        });
        this.fiscalYearWiseCost.splice(i, 1);
    }

    private arrangeData(next: boolean) {
        let request: IDppAnnualPhasingCostWithChildDetailsRequest = {} as IDppAnnualPhasingCostWithChildDetailsRequest;
        request.projectConceptId = this.conceptId;
        request.projectConceptUuid = this.conceptUuid;
        request.rdppMasterId = this.rdppMasterId;
        request.componentName = DppAnnualPhasingConstant.Contingency;
        let list: IDppAnnualPhasingCostTabDetails[] = []
        let i = 0;
        this.contingencyArray.forEach(e => {
            let a: IDppAnnualPhasingCostTabDetails = e.details;
            a.fiscalYears = this.fiscalYearWiseCost.map(m => m.values[i]);
            console.log(a.fiscalYears);
            list.push(a);
            i += 1;
            request.dppAnnualPhasingCostTabDetails = list;
            if (this.contingencyArray.length === i) {
                if (this.contingencyComponentInRdppFound) {
                    request.uuid = this.dppAnnualPhasingCostWithChildDetails.uuid;
                    request.id = this.dppAnnualPhasingCostWithChildDetails.id;
                    this.update(request, next);
                } else {
                    this.create(request, next);
                }
            }
        });
    }

    private create(request: IDppAnnualPhasingCostWithChildDetailsRequest, next: boolean) {

        if(request.dppAnnualPhasingCostTabDetails[0].totalAmount == 0) {
            this.snackBar.openWarnSnackBarWithMessage("Require to Input Physical Contingency", OK);
            return;
        }

        this.spinner = true;
        this.rdppAnnualPhasingCostService.saveWithChild(request).subscribe(res => {
            if (res) {
                this.dppAnnualPhasingCostWithChildDetails = res;
                this.dppAnnualPhasingCostWithChildDetails.rdppMasterId = this.rdppMasterId;
                this.spinner = false;
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                this.reloadAll();
                next ? this.nextStep.emit(true) : this.navigateToList();
            }
        }, error => {
            this.snackBar.openErrorSnackBarWithMessage(error.statusText, error.status);
            this.spinner = false;
        });
    }

    private update(request: IDppAnnualPhasingCostWithChildDetailsRequest, next: boolean) {
        this.spinner = true;
        this.rdppAnnualPhasingCostService.updateWithChild(request).subscribe(res => {
            if (res) {
                this.dppAnnualPhasingCostWithChildDetails = res;
                this.spinner = false;
                this.rdppAnnualPhasingCostService.setFiscalYearList(res.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                this.reloadAll();
                next ? this.nextStep.emit(true) : this.navigateToList();
            }
        }, error => {
            this.snackBar.openErrorSnackBarWithMessage(error.statusText, error.status);
            this.spinner = false;
        });
    }

    reloadAll() {
        this.emptyAllArray();
        this.rdppAnnualPhasingCostService.setCheckFiscalYear();
    }

    navigateToList() {
        this.router.navigate([`rdpp-rtapp/dashboard/${this.conceptUuid}`]);
    }

    private openDeleteDialog(index: number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.DELETE_CONFIRMATION};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteYear(index);
            }
            dialogRef.close(true);
        });
    }

    getCumulativeDate() {
        this.rdppObjectiveCostService.getCumulativeDate(this.rdppMasterId, this.conceptUuid).subscribe((res) =>{
            this.cumulativeDate = res.res;
        })
    }

}
