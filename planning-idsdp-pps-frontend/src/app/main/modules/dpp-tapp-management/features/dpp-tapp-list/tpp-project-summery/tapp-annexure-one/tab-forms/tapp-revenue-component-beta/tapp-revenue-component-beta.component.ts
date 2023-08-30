import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {map, switchMap} from "rxjs/operators";
import {MatCheckboxChange} from '@angular/material/checkbox';
import {IOption} from "../../../../../../../../shared/model/option";
import {ProjectSummaryService} from "../../../../../../../project-concept-management/services/project-summary.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ERROR, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../../../../core/constants/message";
import {EconomicCodeService} from "../../../../../../../configuration-management/services/economic-code-service.service";
import {ConfirmDialogConstant} from "../../../../../../../../shared/constant/confirm.dialog.constant";
import {SnackbarHelper} from "../../../../../../../../core/helper/snackbar.helper";
import {GlobalValidationService} from "../../../../../../../../../global/validation/global-validation.service";
import {FuseTranslationLoaderService} from "../../../../../../../../core/services/translation-loader.service";
import {IFiscalYearRequest} from "../../../../../../models/fiscal-year-request";
import {SubEconomicCodeService} from "../../../../../../../configuration-management/services/sub-economic-code.service";
import {UnsubscribeAdapterComponent} from "../../../../../../../../core/helper/unsubscribeAdapter";
import {SubEconomicCodeModel} from "../../../../../../../configuration-management/models/sub-economic-code-model";
import {SubmitConfirmationDialogComponent} from "../../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {FileUploadService} from "../../../../../../../../core/services/file-upload.service";
import {TranslateService} from "@ngx-translate/core";
import {UnitTypeService} from "../../../../../../../configuration-management/services/unit-type.service";
import {TappAnnualPhasingCostService} from "../../../../../../services/tapp-annual-phasing-cost.service";
import {DppAnnualPhasingConstant} from "../../../../../../constants/dpp-annual-phasing.constant";
import {ITppAnnualPhasingCostWithChildDetailsResponse} from '../../../../../../models/tpp-annual-phasing-cost-with-child-respone';
import {ITppPhasingCostTotal} from '../../../../../../models/tpp-phasing-cost-total';
import {ITppAnnualPhasingCostTabDetails} from '../../../../../../models/tpp-annual-phasing-cost-tab-details';
import {ITppAnnualPhasingCostWithChildDetailsRequest} from '../../../../../../models/tpp-annual-phasing-cost-with-child-request';
import {NumberPipe} from "../../../../../../../../shared/pipes/number-pipe.pipe";

@Component({
    selector: 'app-tapp-revenue-component-beta',
    templateUrl: './tapp-revenue-component-beta.component.html',
    styleUrls: ['./tapp-revenue-component-beta.component.scss']
})
export class TappRevenueComponentBetaComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('callAttachmentDialog') callAttachmentDialog: TemplateRef<any>;

    formGroup: FormGroup;
    attachmentIndex: any;

    spinner: boolean;

    @Input() financialYearsInfoJson: any = [];
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() fiscalYearOutput = new EventEmitter<{ fiscalYear: string }[]>();
    @Output() sendTitleEn: EventEmitter<{ titleEn: string }> = new EventEmitter();

    conceptId: number;
    conceptUuid: string;
    economicCodes: IOption[] = [];
    subEconomicList: { index: number, codes: IOption[] }[] = [];
    subEconomicCodes: { index: number, codes: SubEconomicCodeModel[] }[] = [];
    unitTypeList: IOption[] = [];
    fiscalYearList: { fiscalYear: string }[] = [];
    revenueArray: { form: FormGroup, details: ITppAnnualPhasingCostTabDetails }[] = [];
    revenueTotal: ITppPhasingCostTotal;
    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], tappAnnualPhasingCostTotal?: ITppPhasingCostTotal }[] = [];
    tppAnnualPhasingCostWithChildDetails: ITppAnnualPhasingCostWithChildDetailsResponse;
    show: boolean = true;
    file: File;
    isForeignAid: boolean;

    constructor(private formBuilder: FormBuilder,
                private globalValidation: GlobalValidationService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private annualPhasingCostService: TappAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                private snackBar: SnackbarHelper,
                private economicCodeService: EconomicCodeService,
                private subEconomicCodeService: SubEconomicCodeService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog,
                private fileUploadService: FileUploadService,
                private _translateService: TranslateService,
                private unitTypeService: UnitTypeService,
                private numberPipe: NumberPipe
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._fuseTranslationLoaderService.getActiveLang() === 'en' ? this.isForeignAid = true : this.isForeignAid = false;
        this.annualPhasingCostService.fiscalYear.subscribe(res => {
            if (res) {
                this.addFiscalYear(res);
            }
        });
        annualPhasingCostService.checkFiscalYear.subscribe(_ => {
            this.getAllCall();
        });
    }

    ngOnInit(): void {
        this.loadFormGroup();
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getAllCall();
    }

    private getAllCall() {
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(ps => this.annualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        projectConceptId: ps.id,
                        componentName: DppAnnualPhasingConstant.Revenue_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.conceptId = res.ps.id;
                this.sendTitleEn.emit({
                    titleEn: this.isForeignAid ? res.ps.titleEn : res.ps.titleBn
                });
                if (res.dapc) {
                    this.tppAnnualPhasingCostWithChildDetails = res.dapc;
                    this.getAllSubEconomicCodeByEconomicCodes(res.dapc.tappAnnualPhasingCostTabDetails);
                    // res.dapc.tappAnnualPhasingCostTabDetails.forEach((e, index) => {
                    //     this.getSubEconomicCode(e.economicCodeId, index);
                    //     this.revenueArray.push({
                    //         form: this.updateForm(e.economicCodeId, e.subEconomicCodeId, e.unitId),
                    //         details: e
                    //     });
                    //     if (index === (res.dapc.tappAnnualPhasingCostTabDetails.length - 1)) {
                    //         this.getAll(false);
                    //     }
                    // });
                    this.revenueTotal = res.dapc.tappAnnualPhasingCostTotal;
                    this.fiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                    this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                    this.fiscalYearOutput.emit(res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
                } else {
                    this.getAll(true);
                }
            })
        );
    }



    private getAllSubEconomicCodeByEconomicCodes(dppAnnualPhasingCostTabDetails: ITppAnnualPhasingCostTabDetails[]) {
        this.subscribe$.add(
            this.subEconomicCodeService.getByEconomicCodes(dppAnnualPhasingCostTabDetails.map(m => m.economicCodeId)).subscribe(res => {
                dppAnnualPhasingCostTabDetails.forEach((e, index) => {
                    this.subEconomicCodes.push(({index: index,codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes}));
                    this.subEconomicList.push(({
                        index: index,
                        codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes.map(m => ({
                            name:(this.isForeignAid== false) ?
                                this.numberPipe.convertToBanglaNumber(m.subEconomicCode) + " [" + m.subEconomicCodeNameBng + "]" :
                                m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
                            nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            value: m.id,
                        }))
                    }));
                    // this.getSubEconomicCode(e.economicCodeId, index);
                    this.revenueArray.push({
                        form: this.updateForm(e.economicCodeId, e.subEconomicCodeId, e.unitId),
                        details: e
                    });
                    if (index === (dppAnnualPhasingCostTabDetails.length - 1)) {
                        this.getAll(false);
                    }
                });
            })
        )
    }

    private getAll(initialize: boolean): void {
        this.subscribe$.add(
            this.economicCodeService.fetchActiveEconomicCodeList().pipe(
                switchMap(economicCodes => this.unitTypeService.getList().pipe(
                    map(units => ({economicCodes: economicCodes, units: units}))
                    )
                )
            ).subscribe(res => {
                this.economicCodes = res.economicCodes.filter(f => f.economicCodeFor === 1)
                    .map(m => ({
                        name:(this.isForeignAid== false) ?
                            this.numberPipe.convertToBanglaNumber(m.economicCode) + " [" + m.economicCodeNameBng + "]" :
                            m.economicCode + " [" + m.economicCodeName + "]",
                        nameBn: m.economicCodeBng + " [" + m.economicCodeNameBng + "]",
                        nameEn: m.economicCode + " [" + m.economicCodeName + "]",
                        value: m.id,
                    }));
                this.unitTypeList = res.units.map(m => ({
                    name:(this.isForeignAid== false) ?
                        m.unitTypeNameBng :
                        m.unitTypeNameEng,
                    nameBn: m.unitTypeNameEng + " [" + m.description + "]",
                    nameEn: m.unitTypeNameBng + " [" + m.description + "]",
                    value: m.id,
                }));
                if (initialize) {
                    this.loadFiscalYear();
                    this.initRevenue();
                } else {
                    this.show = false;
                }

            })
        );
    }

    getIndex(index: number):number {
        return this.subEconomicList.findIndex(f => f.index == index);
    }

    getSubEconomicCode(economicCodeId: number, index: number) {
        const sec = this.subEconomicCodes.find(f => f.index === index);
        if (sec) {
            this.subEconomicCodes.splice(this.subEconomicCodes.findIndex(f => f.index === index), 1);
            this.subEconomicList.splice(this.subEconomicList.findIndex(f => f.index === index), 1);
            this.getSubEconomicCodeList(economicCodeId, index);
        } else this.getSubEconomicCodeList(economicCodeId, index);

    }

    private getSubEconomicCodeList(economicCodeId: number, index: number) {
        this.subscribe$.add(
            this.subEconomicCodeService.getByEconomicCodeId(economicCodeId).subscribe(subEconomicCodes => {
                this.subEconomicCodes.push({index: index, codes: subEconomicCodes});
                this.subEconomicList.push({
                    index: index, codes: subEconomicCodes.map(m => ({
                        name: (this.isForeignAid== false) ?
                            this.numberPipe.convertToBanglaNumber(m.subEconomicCode) + " [" + m.subEconomicCodeNameBng + "]" :
                            m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                        nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
                        nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                        value: m.id,
                    }))
                });
            })
        )
    }

    // initialize fiscal tear
    loadFiscalYear(): any {
        this.annualPhasingCostService.fiscalYearList.subscribe(res => {
            this.fiscalYearList = res;
            this.fiscalYearList.forEach(e => {
                this.initFiscalYearWiseData(e.fiscalYear);
            });
        });
    }

    createForm() {
        return new FormGroup({
            economicCodeId: new FormControl(''),
            subEconomicCodeId: new FormControl(''),
            unitId: new FormControl(''),
        });
    }

    updateForm(economicCodeId: number, subEconomicCodeId, unitId) {
        return new FormGroup({
            economicCodeId: new FormControl(economicCodeId),
            subEconomicCodeId: new FormControl(subEconomicCodeId),
            unitId: new FormControl(unitId),
        });
    }

    initRevenue() {
        this.revenueArray.push(
            {
                form: this.createForm(),
                details:
                    {
                        attachmentId: 0,
                        id: null,
                        uuid: null,
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
                    }
            }
        );
        this.revenueTotal = this.getData(null);
        this.show = false;
    }

    private initFiscalYearWiseData(fiscalYear: string) {
        const values = [];
        values.push(this.getData(fiscalYear));
        this.fiscalYearWiseCost.push(
            {
                fiscalYear: fiscalYear,
                values: values,
                tappAnnualPhasingCostTotal: this.getData(fiscalYear)
            }
        );
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

    addRevenueWithFiscalYear() {
        this.initRevenue();
        this.fiscalYearWiseCost.forEach(e => e.values.push(this.getData(e.fiscalYear)));
        this.sumOfRevenueTotal();
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
                    tappAnnualPhasingCostTotal: this.getData(fy)
                });
        }
    }

    onCheckedChange($event: MatCheckboxChange, i: number) {
        // this.revenueArray[i].details.isMajor = $event.checked;
    }

    onSelectedSubEconomicCode(id: number, index) {
        if(this.isForeignAid){
            this.revenueArray[index].details.description = this.subEconomicCodes[index].codes.find(f => f.id === id).description;
        }else{
            this.revenueArray[index].details.description = this.subEconomicCodes[index].codes.find(f => f.id === id).descriptionBn;
        }
    }

    onChangeDescription($event: KeyboardEvent, index) {
        this.revenueArray[index].details.description = $event.target['value'];
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
            case 'qty':
                this.revenueArray[childIndex].details.qty = value;
                if (this.revenueArray[childIndex].details.totalAmount > 0) {
                    this.revenueArray[childIndex].details.unitCost = (this.revenueArray[childIndex].details.totalAmount / this.revenueArray[childIndex].details.qty);
                }
                this.revenueTotal.qty = this.revenueArray
                    .reduce((sum, current) => (sum + current.details.qty), 0);
                break;
            default:
                console.log("Not Match");
                break;
        }
    }

    private calculationExceptFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount
        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;

        // set fields total amount
        this.fiscalYearWiseCost[parentIndex].tappAnnualPhasingCostTotal[field] =
            this.fiscalYearWiseCost[parentIndex].values.map(m => m[field]).reduce((sum, current) => (sum + current), 0);

        //set all fiscal years current index revenue field's  amount
        this.revenueArray[childIndex].details[field] = 0;
        this.fiscalYearWiseCost.forEach(e => {
            this.revenueArray[childIndex].details[field] += e.values[childIndex][field];
        });

        //set revenue fields total amount
        this.revenueTotal[field] = this.revenueArray.map(m => m.details[field]).reduce((sum, current) => (sum + current), 0);

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
        this.fiscalYearWiseCost[parentIndex].tappAnnualPhasingCostTotal.totalAmount =
            this.fiscalYearWiseCost[parentIndex].values.map(m => m.totalAmount).reduce((sum, current) => (sum + current), 0);

        //set all fiscal years total in revenue totalAmount
        this.revenueArray[childIndex].details.totalAmount = 0;
        this.fiscalYearWiseCost.forEach(e => {
            this.revenueArray[childIndex].details.totalAmount += e.values[childIndex].totalAmount;
        });

        //set revenues total amounts total
        this.revenueTotal.totalAmount = this.revenueArray.map(m => m.details.totalAmount).reduce((sum, current) => (sum + current), 0);

        //set unit cost
        this.revenueArray[childIndex].details.unitCost = (this.revenueArray[childIndex].details.totalAmount / this.revenueArray[childIndex].details.qty);
    }

    private calculationOfFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount

        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;

        // set fields total amount
        this.fiscalYearWiseCost[parentIndex].tappAnnualPhasingCostTotal[field] =
            this.fiscalYearWiseCost[parentIndex].values.map(m => m[field]).reduce((sum, current) => (sum + current), 0);

        //set all fiscal years current index revenue field's  amount
        this.revenueArray[childIndex].details[field] = 0;
        this.fiscalYearWiseCost.forEach(e => {
            this.revenueArray[childIndex].details[field] += e.values[childIndex][field];
        });

        //set revenue fields total amount
        this.revenueTotal[field] = this.revenueArray.map(m => m.details[field]).reduce((sum, current) => (sum + current), 0);

    }

    /**
     * delete Revenue with fiscal year value
     * @param i
     */
    deleteRevenue(i: number) {
        this.revenueArray.splice(i, 1);
        this.subtractFromFiscalYearCostArray(i);
        this.sumOfRevenueTotal();
    }

    private sumOfRevenueTotal() {
        const revenueDetails = this.revenueArray.map(m => m.details);
        this.revenueTotal.qty = revenueDetails.reduce((sum, current) => sum + current.qty, 0);
        this.revenueTotal.totalAmount = revenueDetails.reduce((sum, current) => sum + current.totalAmount, 0)
        this.revenueTotal.gobAmount = revenueDetails.reduce((sum, current) => sum + current.gobAmount, 0);
        this.revenueTotal.gobFeAmount = revenueDetails.reduce((sum, current) => sum + current.gobFeAmount, 0);
        this.revenueTotal.gobThruAmount = revenueDetails.reduce((sum, current) => sum + current.gobThruAmount, 0);
        this.revenueTotal.spAcAmount = revenueDetails.reduce((sum, current) => sum + current.spAcAmount, 0);
        this.revenueTotal.thruPdAmount = revenueDetails.reduce((sum, current) => sum + current.thruPdAmount, 0);
        this.revenueTotal.thruDpAmount = revenueDetails.reduce((sum, current) => sum + current.thruDpAmount, 0);
        this.revenueTotal.ownFundAmount = revenueDetails.reduce((sum, current) => sum + current.ownFundAmount, 0);
        this.revenueTotal.ownFundFeAmount = revenueDetails.reduce((sum, current) => sum + current.ownFundFeAmount, 0);
        this.revenueTotal.otherAmount = revenueDetails.reduce((sum, current) => sum + current.otherAmount, 0);
        this.revenueTotal.otherFeAmount = revenueDetails.reduce((sum, current) => sum + current.otherFeAmount, 0);
    }

    private subtractFromFiscalYearCostArray(i: number) {
        this.fiscalYearWiseCost.forEach(e => {
            const yearWiseRevenue = e.tappAnnualPhasingCostTotal;
            e.tappAnnualPhasingCostTotal.totalAmount = yearWiseRevenue.totalAmount - e.values[i].totalAmount;
            e.tappAnnualPhasingCostTotal.gobAmount = yearWiseRevenue.gobAmount - e.values[i].gobAmount;
            e.tappAnnualPhasingCostTotal.gobFeAmount = yearWiseRevenue.gobFeAmount - e.values[i].gobFeAmount;
            e.tappAnnualPhasingCostTotal.gobThruAmount = yearWiseRevenue.gobThruAmount - e.values[i].gobThruAmount;
            e.tappAnnualPhasingCostTotal.spAcAmount = yearWiseRevenue.spAcAmount - e.values[i].spAcAmount;
            e.tappAnnualPhasingCostTotal.thruPdAmount = yearWiseRevenue.thruPdAmount - e.values[i].thruPdAmount;
            e.tappAnnualPhasingCostTotal.thruDpAmount = yearWiseRevenue.thruDpAmount - e.values[i].thruDpAmount;
            e.tappAnnualPhasingCostTotal.ownFundAmount = yearWiseRevenue.ownFundAmount - e.values[i].ownFundAmount;
            e.tappAnnualPhasingCostTotal.ownFundFeAmount = yearWiseRevenue.ownFundFeAmount - e.values[i].ownFundFeAmount;
            e.tappAnnualPhasingCostTotal.otherAmount = yearWiseRevenue.otherAmount - e.values[i].otherAmount;
            e.tappAnnualPhasingCostTotal.otherFeAmount = yearWiseRevenue.otherFeAmount - e.values[i].otherFeAmount;
            e.values.splice(i, 1);
        });
    }

    /**
     * delete iscal year value
     * @param i
     */
    deleteYear(i: number) {
        this.subtractFromRevenueArray(i);
        this.sumOfRevenueTotal();
        this.fiscalYearList.splice(i, 1);
        this.fiscalYearOutput.emit(this.fiscalYearList);
    }

    private subtractFromRevenueArray(i: number) {
        this.revenueArray.forEach((e, index) => {
            const revenueDetails = e.details;
            e.details.totalAmount = revenueDetails.totalAmount - this.fiscalYearWiseCost[i].values[index].totalAmount;
            e.details.gobAmount = revenueDetails.gobAmount - this.fiscalYearWiseCost[i].values[index].gobAmount;
            e.details.gobFeAmount = revenueDetails.gobFeAmount - this.fiscalYearWiseCost[i].values[index].gobFeAmount;
            e.details.gobThruAmount = revenueDetails.gobThruAmount - this.fiscalYearWiseCost[i].values[index].gobThruAmount;
            e.details.spAcAmount = revenueDetails.spAcAmount - this.fiscalYearWiseCost[i].values[index].spAcAmount;
            e.details.thruPdAmount = revenueDetails.thruPdAmount - this.fiscalYearWiseCost[i].values[index].thruPdAmount;
            e.details.thruDpAmount = revenueDetails.thruDpAmount - this.fiscalYearWiseCost[i].values[index].thruDpAmount;
            e.details.ownFundAmount = revenueDetails.ownFundAmount - this.fiscalYearWiseCost[i].values[index].ownFundAmount;
            e.details.ownFundFeAmount = revenueDetails.ownFundFeAmount - this.fiscalYearWiseCost[i].values[index].ownFundFeAmount;
            e.details.otherAmount = revenueDetails.otherAmount - this.fiscalYearWiseCost[i].values[index].otherAmount;
            e.details.otherFeAmount = revenueDetails.otherFeAmount - this.fiscalYearWiseCost[i].values[index].otherFeAmount;
            e.details.unitCost = e.details.totalAmount / e.details.qty;
        });
        this.fiscalYearWiseCost.splice(i, 1);
    }

    save(): void {
        this.arrangeData(false, false);
    }
    onNextTab(): void {
        this.arrangeData(true, false);
    }

    saveAndExit(): void {
        this.arrangeData(false, true);
    }

    private arrangeData(next: boolean, exit: boolean) {
        if (this.revenueArray.some(s => !s.form.value.economicCodeId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all economic code", ERROR);
        } else if (this.revenueArray.some(s => !s.form.value.subEconomicCodeId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all sub economic code", ERROR);
        } else if (this.revenueArray.some(s => !s.form.value.unitId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all unit", ERROR);
        } else if (this.revenueArray.some(s => s.details.qty < 1)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all quantity", ERROR);
        } else {
            let request: ITppAnnualPhasingCostWithChildDetailsRequest = {} as ITppAnnualPhasingCostWithChildDetailsRequest;
            request.projectConceptId = this.conceptId;
            request.projectConceptUuid = this.conceptUuid;
            request.componentName = DppAnnualPhasingConstant.Revenue_Component;
            request.tappAnnualPhasingCostTotal = this.revenueTotal;
            request.fiscalYearsWiseTotal = this.fiscalYearWiseCost.map(m => m.tappAnnualPhasingCostTotal);
            let list: ITppAnnualPhasingCostTabDetails[] = []
            let i = 0;
            this.revenueArray.forEach(e => {
                let a: ITppAnnualPhasingCostTabDetails = e.details;
                a.economicCodeId = e.form.value.economicCodeId;
                a.subEconomicCodeId = e.form.value.subEconomicCodeId;
                a.unitId = e.form.value.unitId;
                a.fiscalYears = this.fiscalYearWiseCost.map(m => m.values[i]);
                list.push(a);
                i += 1;
                request.tappAnnualPhasingCostTabDetails = list;
                if (this.revenueArray.length === i) {
                    if (this.tppAnnualPhasingCostWithChildDetails) {
                        request.uuid = this.tppAnnualPhasingCostWithChildDetails.uuid;
                        request.id = this.tppAnnualPhasingCostWithChildDetails.id;
                        this.update(request, next, exit);
                    } else {
                        this.create(request, next, exit);
                    }
                }
            });
        }
    }

    private create(request: ITppAnnualPhasingCostWithChildDetailsRequest, next: boolean, exit: boolean) {
        this.spinner = true;
        this.annualPhasingCostService.saveWithChild(request).subscribe(res => {
            if (res) {
                this.tppAnnualPhasingCostWithChildDetails = res;
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                this.reloadAll();
                if(next==true){
                    this.nextStep.emit(true);
                }else if(exit==true){
                    this.navigateToList();
                }
            }
            this.spinner = false;
        }, error => {
            this.snackBar.openErrorSnackBarWithMessage(error.statusText, error.status);
            this.spinner = false;
        });
    }

    private update(request: ITppAnnualPhasingCostWithChildDetailsRequest, next: boolean, exit: boolean) {
        this.spinner = true;
        this.annualPhasingCostService.updateWithChild(request).subscribe(res => {
            if (res) {
                this.tppAnnualPhasingCostWithChildDetails = res;
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                this.reloadAll();
                if(next==true){
                    this.nextStep.emit(true);
                }else if(exit==true){
                    this.navigateToList();
                }
            }
            this.spinner = false;
        }, error => {
            this.snackBar.openErrorSnackBarWithMessage(error.statusText, error.status);
            this.spinner = false;
        });
    }

    reloadAll() {
        this.emptyAllArray();
        this.annualPhasingCostService.setCheckFiscalYear();
    }

    private emptyAllArray() {
        // this.fiscalYearList = [];
        this.revenueArray = [];
        this.fiscalYearWiseCost = [];
        this.revenueTotal = null;
    }

    navigateToList() {
        this.router.navigate([`dpp-tapp/dashboard/${this.conceptUuid}`]);
    }

    /*
  Upload Attachment File
   */


    uploadFile(files: FileList) {
        this.file = files.item(0);
    }

    saveFile(): any {
        this.spinner = true;
        this.fileUploadService.upload(this.file).subscribe(res => {
            this.formGroup.reset();
            this.dialog.closeAll();
            this.snackBar.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
            if (this.revenueArray[this.attachmentIndex].details.attachmentId) {
                this.fileUploadService.deleteById(this.revenueArray[this.attachmentIndex].details.attachmentId).subscribe();
            }
            this.revenueArray[this.attachmentIndex].details.attachmentId = res.id;
            this.spinner = false;
        }, err => {
            this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }


    /* download Attachment */

    download(index: any) {
        this.spinner = true;
        this.fileUploadService.getById(this.revenueArray[index].details.attachmentId).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    openDialog(index: any) {
        this.attachmentIndex = index;
        const dialogRef = this.dialog.open(this.callAttachmentDialog, {
            height: '300px',
            width: '500px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.formGroup.reset();
            this.dialog.closeAll();
        });
    }

    cancelAttachmentUpload() {
        this.formGroup.reset();
        this.dialog.closeAll();
    }

    loadFormGroup() {
        this.formGroup = this.formBuilder.group({
            attachmentId: [''],
        });
    }

    deleteAttachment(index: any) {
        this.spinner = true;
        this.fileUploadService.deleteById(this.revenueArray[index].details.attachmentId).subscribe(res => {
            this.snackBar.openSuccessSnackBarWithMessage('Attachment Successfully Delete', 'Ok');
            this.revenueArray[index].details.attachmentId = null;
            this.spinner = false;
        });
    }


    private openDeleteDialog(index: number, deleteItem: 'y' | 'r' | 'a') {
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
                (deleteItem === 'y') ? this.deleteYear(index) : (deleteItem === 'r') ? this.deleteRevenue(index) : this.deleteAttachment(index);
            }
            dialogRef.close(true);
        });
    }
}
