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
import {
    ERROR,
    OK,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN
} from "../../../../../../../core/constants/message";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {IDppAnnualPhasingCostWithChildDetailsResponse} from "../../../../../models/dpp-annual-phasing-cost-with-child-respone";
import {IDppAnnualPhasingCostWithChildDetailsRequest} from "../../../../../models/dpp-annual-phasing-cost-with-child-request";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";

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
    conceptUuid: string;
    fiscalYearList: { fiscalYear: string }[] = [];
    contingencyArray: { details: IDppAnnualPhasingCostTabDetails }[] = [];
    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse;
    show: boolean = true;
    isForeignAid: boolean;

    projectSummary: IProjectConcept;

    spinner: boolean;

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
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._fuseTranslationLoaderService.getActiveLang() === 'en' ? this.isForeignAid = true : this.isForeignAid = false;
        this.annualPhasingCostService.fiscalYear.subscribe(res => {
            if (res) {
                this.addFiscalYear(res);
            }
        });
        this.annualPhasingCostService.checkFiscalYear.subscribe(_ => {
            this.getAllCall();
        });
    }

    ngOnInit(): void {
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getPcInfo();
    }

    emptyAllArray() {
        this.fiscalYearList = [];
        this.contingencyArray = [];
        this.fiscalYearWiseCost = [];
        this.contingencyArray = [];
    }

    getPcInfo(){
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) =>{
            this.projectSummary = res;
            this.getAllCall();
        })
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
                    this.dppAnnualPhasingCostWithChildDetails = c;
                    c.dppAnnualPhasingCostTabDetails.forEach(e => {
                        this.contingencyArray.push({details: e});
                    });
                    this.fiscalYearWiseCost = c.fiscalYearWiseCost;
                    this.fiscalYearList = c.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                    this.show = false;
                    this.fiscalYearOutput.emit(c.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
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
        this.annualPhasingCostService.fiscalYearList.subscribe(res => {
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
            case 'gobAmount':
                this.calculationExceptFe(value, field, parentIndex, childIndex);
                break;
            case 'gobFeAmount':
                if (this.fiscalYearWiseCost[parentIndex].values[childIndex].gobAmount >= value) {
                    this.calculationOfFe(value, field, parentIndex, childIndex);
                } else {
                    this.calculationOfFe(0, field, parentIndex, childIndex);
                    this.fiscalYearWiseCost[parentIndex].values[childIndex].gobFeAmount = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", OK);
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
                    this.fiscalYearWiseCost[parentIndex].values[childIndex].ownFundFeAmount = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", OK);
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
                    this.fiscalYearWiseCost[parentIndex].values[childIndex].otherFeAmount = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Other", OK);
                }
                break;
            default:
                break;
        }
    }

    private calculationExceptFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount
        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;

        // set fields total amount
        // this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal[field] =
        //     this.fiscalYearWiseCost[parentIndex].values.map(m => m[field]).reduce((sum, current) => (sum + (current ? current : 0)), 0);

        //set all fiscal years current index revenue field's  amount
        let totalDetailsAmount = 0;
        this.fiscalYearWiseCost.forEach(e => {
            totalDetailsAmount += e.values[childIndex][field];
        });
        this.contingencyArray[childIndex].details[field] = totalDetailsAmount;

        //set revenue fields total amount
        // this.revenueTotal[field] = this.revenueArray.map(m => m.details[field]).reduce((sum, current) => (sum + current), 0);

        // set current index project total amount
        this.fiscalYearWiseCost[parentIndex].values[childIndex].totalAmount =
            (this.fiscalYearWiseCost[parentIndex].values[childIndex].gobAmount +
                this.fiscalYearWiseCost[parentIndex].values[childIndex].gobThruAmount +
                this.fiscalYearWiseCost[parentIndex].values[childIndex].spAcAmount +
                this.fiscalYearWiseCost[parentIndex].values[childIndex].thruPdAmount +
                this.fiscalYearWiseCost[parentIndex].values[childIndex].thruDpAmount +
                this.fiscalYearWiseCost[parentIndex].values[childIndex].ownFundAmount +
                this.fiscalYearWiseCost[parentIndex].values[childIndex].otherAmount);

        // set total amount total
        // this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal.totalAmount =
        //     this.fiscalYearWiseCost[parentIndex].values.map(m => m.totalAmount).reduce((sum, current) => (sum + current), 0);

        //set all fiscal years total in revenue totalAmount
        let fiscalYearAmount = 0;
        this.fiscalYearWiseCost.forEach(e => {
            fiscalYearAmount += e.values[childIndex].totalAmount;
        });

        this.contingencyArray[childIndex].details.totalAmount = fiscalYearAmount;

        //set revenues total amounts total
        // this.revenueTotal.totalAmount = this.revenueArray.map(m => m.details.totalAmount).reduce((sum, current) => (sum + current), 0);

        //set unit cost
        this.contingencyArray[childIndex].details.unitCost = (this.contingencyArray[childIndex].details.totalAmount / this.contingencyArray[childIndex].details.qty);
    }

    private calculationOfFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount

        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;

        // set fields total amount
        // this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal[field] =
        //     this.fiscalYearWiseCost[parentIndex].values.map(m => m[field]).reduce((sum, current) => (sum + current), 0);

        //set all fiscal years current index revenue field's  amount
        this.contingencyArray[childIndex].details[field] = 0;
        this.fiscalYearWiseCost.forEach(e => {
            this.contingencyArray[childIndex].details[field] += e.values[childIndex][field];
        });

        //set revenue fields total amount
        // this.revenueTotal[field] = this.revenueArray.map(m => m.details[field]).reduce((sum, current) => (sum + current), 0);

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
                        subEconomicCodeDTO:null,
                    }
            }
        );
        this.show = false;
    }

    addFiscalYear(fy: string) {
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
            totalAmount: 0
        };
    }
    save(){
        this.arrangeData(false, false);
    }

    onNextTab(): void {
        this.arrangeData(true, false);
    }

    saveAndExit(): void {
        this.arrangeData(false, true);
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

    private arrangeData(next: boolean, exit: boolean) {
        let request: IDppAnnualPhasingCostWithChildDetailsRequest = {} as IDppAnnualPhasingCostWithChildDetailsRequest;
        request.projectConceptId = this.conceptId;
        request.projectConceptUuid = this.conceptUuid;
        request.componentName = DppAnnualPhasingConstant.Contingency;
        let list: IDppAnnualPhasingCostTabDetails[] = []
        let i = 0;
        this.contingencyArray.forEach(e => {
            let a: IDppAnnualPhasingCostTabDetails = e.details;
            a.fiscalYears = this.fiscalYearWiseCost.map(m => m.values[i]);
            list.push(a);
            i += 1;
            request.dppAnnualPhasingCostTabDetails = list;
            if (this.contingencyArray.length === i) {
                if (this.dppAnnualPhasingCostWithChildDetails) {
                    request.uuid = this.dppAnnualPhasingCostWithChildDetails.uuid;
                    request.id = this.dppAnnualPhasingCostWithChildDetails.id;
                    this.update(request, next, exit);
                } else {
                    this.create(request, next, exit);
                }
            }
        });
    }

    private create(request: IDppAnnualPhasingCostWithChildDetailsRequest, next: boolean, exit: boolean) {
        this.spinner = true;
        this.annualPhasingCostService.saveWithChild(request).subscribe(res => {
            if (res) {
                this.dppAnnualPhasingCostWithChildDetails = res;
                this.spinner = false;
                this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                this.reloadAll();
                if(next==true){
                    this.nextStep.emit(true);
                }else if(exit==true){
                    this.navigateToList();
                }
            }
        }, error => {
            this.snackBar.openErrorSnackBarWithMessage(error.statusText, error.status);
            this.spinner = false;
        });
    }

    private update(request: IDppAnnualPhasingCostWithChildDetailsRequest, next: boolean, exit: boolean) {
        this.spinner = true;
        this.annualPhasingCostService.updateWithChild(request).subscribe(res => {
            if (res) {
                this.dppAnnualPhasingCostWithChildDetails = res;
                this.spinner = false;
                this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                this.reloadAll();
                if(next==true){
                    this.nextStep.emit(true);
                }
                else if(exit==true){
                    this.navigateToList();
                }
            }
        }, error => {
            this.snackBar.openErrorSnackBarWithMessage(error.statusText, error.status);
            this.spinner = false;
        });
    }

    reloadAll() {
        this.emptyAllArray();
        this.annualPhasingCostService.setCheckFiscalYear();
    }

    navigateToList() {
        this.router.navigate([`dpp-tapp/dashboard/${this.conceptUuid}`]);
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
}
