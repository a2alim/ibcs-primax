import {GlobalValidationService} from '../../../../../../../../global/validation/global-validation.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

/*----Lng Translation----*/
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DppAnnualPhasingCostService} from '../../../../../services/dpp-annual-phasing-cost.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {EconomicCodeService} from "../../../../../../configuration-management/services/economic-code-service.service";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {SubEconomicCodeModel} from "../../../../../../configuration-management/models/sub-economic-code-model";
import {SubEconomicCodeService} from "../../../../../../configuration-management/services/sub-economic-code.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IOption} from "../../../../../../../shared/model/option";
import {UnitTypeService} from "../../../../../../configuration-management/services/unit-type.service";
import {DppAnnualPhasingConstant} from '../../../../../constants/dpp-annual-phasing.constant';

/*----/Lng Translation----*/

@Component({
    selector: 'app-revenue-component',
    templateUrl: './revenue-component.component.html',
    styleUrls: ['../style.component.scss']
})

export class RevenueComponentComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();

    // From Group
    revenueCostFrmGroup: FormGroup;
    revenueRowCostFrmGroup: FormGroup;
    revenueCostFrmArray: FormArray;

    fiscalYearFrmGroup: FormGroup;
    fiscalYearFormArray: FormArray;

    fiscalYearTotalFrmGroup: FormGroup;

    formFieldHelpers: string[] = [''];
    baseTblRows = [];
    tableWidthVal = 1700;

    // For Dropdown
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;

    // Button Color
    addRevenueBtn = 'accent';
    saveNextBtn = 'primary';
    backBtn = 'accent';

    // Get value from parent component
    clickEventSubscription: Subscription;
    @Input() FinancialYearsInfoJson: any = [];
    @Input() count: number;
    @Output() countChanged: EventEmitter<number> = new EventEmitter();

    // Fiscal Year List
    fiscalList: Array<any> = new Array<any>();
    fiscalYearFromList: Array<any> = new Array<any>();
    fiscalYearListByRevenue: Array<any> = new Array<any>();
    revenueCostList: Array<any> = new Array<any>();
    economicCodes: Array<any> = new Array<any>();
    subEconomicCodes: SubEconomicCodeModel[] = [];
    subEconomicCodeDescription: string;
    dppAnnualPhasingOfCostUuid: string

    requestBodyList: Array<any> = new Array<any>();
    tabDetailsList: Array<any> = new Array<any>();

    conceptId: string;
    subEconomicList: IOption[] = new Array<IOption>();
    unitTypeList: any[] = new Array<any>();

    //For Table Sum
    valueByFromNameMap = new Map();
    fiscaYearTabWiseValueArray = [];
    final = [];

    constructor(
        private formBuilder: FormBuilder,
        private globalValidation: GlobalValidationService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        private snackBar: SnackbarHelper,
        private economicCodeService: EconomicCodeService,
        private subEconomicCodeService: SubEconomicCodeService,
        private route: ActivatedRoute,
        private router: Router,
        private unitTypeService: UnitTypeService
    ) {
        super();
       // console.log(this.FinancialYearsInfoJson)
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.conceptId = this.route.snapshot.params['id'];

        this.revenueCostFrmGroup = this.formBuilder.group({
            // Total Calculation Part
            t_qtyText: [''],
            t_totalCostText: [''],
            t_gobText: [""],
            t_feText: [""],
            t_thruGobText: [""],
            t_spAcText: [""],
            t_thruPdText: [""],
            t_thruDpText: [""],
            t_ownFundFeText: [''],
            t_ownFeFundFeText: [""],
            t_otherFeText: [""],
            t_feOtherFeText: [""],


            t_totalFeText: [""],
            revenueCostArray: this.formBuilder.array([])
        });
        // set revenueCostList to the form control containing revenueCost
        this.revenueCostFrmArray = this.revenueCostFrmGroup.get("revenueCostArray") as FormArray;

        this.fiscalYearFrmGroup = this.formBuilder.group(
            {
                fiscalYearArray: this.formBuilder.array([]),
                dppAnnualPhasingCostTotal: this.fiscalYearTotalFromGroup()
            });

        this.fiscalYearFormArray = this.fiscalYearFrmGroup.get("fiscalYearArray") as FormArray


        this.fiscalYearFormArray = this.fiscalYearFrmGroup.get("fiscalYearArray") as FormArray

        this.revenueCostList.push({
            projectConceptId: this.conceptId,
            tabNo: 1,
            unitCostText: this.revenueCostFrmGroup.value.unitCostText,
            economicCodeText: this.revenueCostFrmGroup.value.economicCodeText,
            economicSubCodeText: this.revenueCostFrmGroup.value.economicSubCodeText,
            codeDescriptionText: this.revenueCostFrmGroup.value.codeDescriptionText,
            unitText: this.revenueCostFrmGroup.value.unitText,
            qtyText: this.revenueCostFrmGroup.value.qtyText,
            totalCostText: this.revenueCostFrmGroup.value.totalCostText,
            gobText: this.revenueCostFrmGroup.value.gobText,
            feText: this.revenueCostFrmGroup.value.feText,
            thruGobText: this.revenueCostFrmGroup.value.thruGobText,
            spAcText: this.revenueCostFrmGroup.value.spAcText,
            thruPdText: this.revenueCostFrmGroup.value.thruPdText,
            thruDpText: this.revenueCostFrmGroup.value.thruDpText,
            ownFundFeText: this.revenueCostFrmGroup.value.ownFundFeText,
            ownFeFundFeText: this.revenueCostFrmGroup.value.ownFeFundFeText,
            otherFeText: this.revenueCostFrmGroup.value.otherFeText,
            feOtherFeText: this.revenueCostFrmGroup.value.feOtherFeText,
            fiscalYears: this.fiscalList
        });

        //init Basic FS
      //  this.addInitialFinancialYear();

        // Add Economic Code
        this.getEconomicCodeService();

        // Get Unit
        this.getUnitTypeList();
    }

    get revenueCosts(): FormArray {
        return this.revenueCostFrmGroup.get("revenueCostArray") as FormArray
    }

    get fiscalYears(): FormArray {
        return this.fiscalYearFrmGroup.get("fiscalYearArray") as FormArray
    }

    fiscalYearTotalFromGroup(): FormGroup{
        return this.formBuilder.group(
            {
                // Project Total Variable
                f_t_gobText: [],
                f_t_feText: [],
                f_t_thruGobText: [],
                f_t_spAcText: [],
                f_t_thruPdText: [],
                f_t_thruDpText: [],
                f_t_ownFundFeText: [],
                f_t_ownFeFundFeText: [],
                f_t_totalFeText: [],
            });

    }
    newRevenueCost(): FormGroup {
        this.revenueRowCostFrmGroup = this.formBuilder.group({
            // Table Form Init
            economicCodeText: ['', Validators.required],
            economicSubCodeText: ['', Validators.required],
            codeDescriptionText: [''],
            unitText: ['', Validators.required],
            isMajor: ['', Validators.required],
            qtyText: ["", Validators.required],
            unitCostText: [""],
            totalCostText: ["", Validators.required],

            // Project Form Init
            gobText: ["", Validators.required],
            feText: ["", Validators.required],
            thruGobText: ["", Validators.required],
            spAcText: ["", Validators.required],
            thruPdText: ["", Validators.required],
            thruDpText: ["", Validators.required],
            ownFundFeText: ["", Validators.required],
            ownFeFundFeText: ["", Validators.required],
            otherFeText: ["", Validators.required],
            feOtherFeText: ["", Validators.required]
        });

        return this.revenueRowCostFrmGroup;
    }

    newFiscalYear(): any {
        return this.formBuilder.group({

            // Fiscal Form Init
            fiscalYear: ["", Validators.required],
            fgobText: ["", Validators.required],
            ffeText: ["", Validators.required],
            fthruGobText: ["", Validators.required],
            fspAcText: ["", Validators.required],
            fthruPdText: ["", Validators.required],
            fthruDpText: ["", Validators.required],
            fownFundFeText: ["", Validators.required],
            ffeownFundFeText: ["", Validators.required],
            fotherFeText: ["", Validators.required],
            ffeotherFeText: ["", Validators.required],
            fTotalText: ["", Validators.required],

        });

    }


    ngOnInit(): void {
        // this.loadFiscalYear();
        this.getAnnualPhasingCostByPCUuidAndComponentType();
       // this.addBasicInitRevenueRowWithValue();
        // For Auto Completed
        this.filteredOptions = this.revenueCostFrmGroup.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );

    }

    loadFiscalYear(): any {
        this.annualPhasingCostService.fiscalYearList.subscribe(res  => {
            console.log('Rifat');
            this.fiscalList = res;
            console.log(this.fiscalList = res);
            console.log('Rony');
        });

    }

    private _filter(value: string): string[] {

        //   const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(value));
    }


    onNextTab(): void {
        this.annualPhasingCostService.addAnnualPhasingCost(this.getRequestBody()).subscribe(res => {
            this.nextStep.emit(true);
        }, err => {

        });

    }

    getRequestBody(): any {
        // console.log(this.revenueCostFrmGroup.value)
        this.revenueCosts.value.map((res, index) => {
            // console.log(res)
            this.fiscalYearFromList.map(res => {
                this.fiscalYearListByRevenue.push(   {
                    "fiscalYear": res.fiscalYearArray[index].fiscalYear,
                    "gobFe": res.fiscalYearArray[index].fgobText,
                    "gobThru": res.fiscalYearArray[index].fthruGobText,
                    "spAc": res.fiscalYearArray[index].fspAcText,
                    "thruPd": res.fiscalYearArray[index].fthruPdText,
                    "thruDp": res.fiscalYearArray[index].fthruDpText,
                    "ownFundFe": res.fiscalYearArray[index].fownFundFeText,
                    "otherFe": res.fiscalYearArray[index].fotherFeText,
                    "totalCost": res.fiscalYearArray[index].fTotalText,

                    "dppTotalAnnualPhasingCost":{
                        "qty":'',
                        "totalCost":res.dppAnnualPhasingCostTotal.f_t_totalFeText ,
                        "gobFe":res.dppAnnualPhasingCostTotal.f_t_gobText,
                        "gobThru":res.dppAnnualPhasingCostTotal.f_t_thruGobText,
                        "spAc":res.dppAnnualPhasingCostTotal.f_t_spAcText,
                        "thruPd":res.dppAnnualPhasingCostTotal.f_t_thruPdText,
                        "thruDp":res.dppAnnualPhasingCostTotal.f_t_thruDpText,
                        "ownFundFe":res.dppAnnualPhasingCostTotal.f_t_ownFundFeText,
                        "otherFe":''
                    }

                })

            })
            this.tabDetailsList.push({
                "economicCodeId": res.economicCodeText,

                "subEconomicCodeId": res.economicSubCodeText,

                "description": res.codeDescriptionText,

                "unit": res.unitText,

                isBasis: res.isBasis,

                "isMajor": res.isMajor,

                "unitCost": res.unitCostText,

                "qty": res.qtyText,

                "totalCost": res.totalCostText,

                "gobFe": res.gobText,

                "gobFe2": res.feText,

                "gobThru": res.thruGobText,

                "spAc": res.spAcText,

                "thruPd": res.thruPdText,

                "thruDp": res.thruDpText,

                "ownFundFe": res.ownFundFeText,

                // "ownFeFundFe2": res.ownFeFundFeText,

                "otherFe": res.otherFeText,

                // "feOtherFe2": res.feOtherFeText,

                "fiscalYears": this.fiscalYearListByRevenue
            })
            // console.log(this.fiscalYearListByRevenue)
            this.fiscalYearListByRevenue = new Array<any>();
        });

        let body = {
            "uuid": this.dppAnnualPhasingOfCostUuid ? this.dppAnnualPhasingOfCostUuid : '',
            "projectConceptId": this.conceptId,
            "tabName": DppAnnualPhasingConstant.Revenue_Component,
            "dppTotalAnnualPhasingCost":{
                "qty": this.revenueCostFrmGroup.value.t_qtyText,
                "totalCost": this.revenueCostFrmGroup.value.t_totalCostText,
                "gobFe": this.revenueCostFrmGroup.value.t_gobText,
                //TODO: Need GOB FE
                "gobThru": this.revenueCostFrmGroup.value.t_thruGobText,
                "spAc": this.revenueCostFrmGroup.value.t_spAcText,
                "thruPd": this.revenueCostFrmGroup.value.t_thruPdText,
                "thruDp": this.revenueCostFrmGroup.value.t_thruDpText,
                "ownFundFe": this.revenueCostFrmGroup.value.t_ownFundFeText,
                //TODO: Need Own Fund  FE
                "otherFe": this.revenueCostFrmGroup.value.t_otherFeText,
                //TODO: Other Fund  FE
            },
            "tabDetails": this.tabDetailsList
        }
        console.log(body)
        return body;
    }


    saveAndExit(): void {

    }

    onSelectedEconomicCode(id: string) {
        this.getSubEconomicCode(id);
    }

    deleteRevenueCost(i: number) {
        this.revenueCostFrmArray.removeAt(i);
        this.fiscalYearFormArray.removeAt(i);
    }

    addBasicInitRevenueRowWithValue() {

        this.revenueCostFrmArray.push(this.newRevenueCost());
        this.fiscalYearFormArray.push(this.newFiscalYear());

    }

    addInitialFinancialYear(): void {
        this.fiscalList.push({
            fiscalYear: '2021-2022',
        });

        this.fiscalList.push({
            fiscalYear: '2022-2023',
        });

    }

    onChange(event, index) {
    }

    qtyTextChanged(event, index) {
        this.revenueCostList[index].totalCostText = this.revenueCostList[index].unitCostText * event.target.value;

    }

    unitCostTextChanged(event, index) {

        this.revenueCostList[index].totalCostText = this.revenueCostList[index].qtyText * event.target.value;

    }

    totalCostTextChanged(event, index) {
        // this.revenueCostList[index].unitCostText = event.target.value / this.revenueCostList[index].qtyText;
        // console.log(event.target.value)
    }


    private getEconomicCodeService(): void {

        this.economicCodeService.fetchActiveEconomicCodeList().subscribe(economicCodes => {
            economicCodes.forEach(economicCode => {
                if (economicCode.economicCodeFor === 1) {
                    this.economicCodes.push(economicCode);
                }
            })
        });
    }

    getSubEconomicCode(economicCodeId: any) {
        this.subEconomicList = [];
        this.subEconomicCodeService.getByEconomicCodeId(economicCodeId).subscribe(subEconomicCodes => {
            this.subEconomicCodes = subEconomicCodes;

        });
    }

    addNewFiscalYear() {

        console.log("Next Tab.")
        this.fiscalYearFromList.push(this.fiscalYearFrmGroup.value)
    }

    onSelectedSubEconomicCode(id: number, index) {
        this.subEconomicCodes.forEach(subEconomicCode => {
            if (id === subEconomicCode.id) {
                console.log('Tab Array');
                this.revenueCostFrmArray.controls[index].patchValue({
                        codeDescriptionText: subEconomicCode.description
                    }
                )
            }
        })

    }

    /*----For get unit type list----*/
    getUnitTypeList() {

        this.unitTypeService.getList().subscribe((res) => {
            res.forEach((unit) => {

                this.unitTypeList.push(unit);
            });
        });
    }
/*
*  Calculate Total for each row
* */
    totalCalculation(element: any, event: any, i: number): void {

        this.valueByFromNameMap.set(
            element.getAttribute('formControlName')+i,
            (+event.target.value)
        )

        this.fiscaYearTabWiseValueArray.push({
                key: element.getAttribute('formControlName') + i,
                value: (+event.target.value)
            }
        )

        let prepareArrayForSum= []
        this.fiscaYearTabWiseValueArray.map(res=>{
            if(element.getAttribute('formControlName')+i === res.key)
            {
                prepareArrayForSum.push(res.value)

            }
        })

        switch (element.getAttribute('formControlName')) {
            //Base From For Revenue
            case 'qtyText':
                this.revenueCostFrmGroup.patchValue({
                    t_qtyText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'totalCostText':
                this.revenueCostFrmGroup.patchValue({
                    t_totalCostText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'gobText':
                this.revenueCostFrmGroup.patchValue({
                    t_gobText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'feText':
                this.revenueCostFrmGroup.patchValue({

                    t_feText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'thruGobText':
                this.revenueCostFrmGroup.patchValue({
                    t_thruGobText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'spAcText':
                this.revenueCostFrmGroup.patchValue({
                    t_spAcText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'thruPdText':
                this.revenueCostFrmGroup.patchValue({
                    t_thruPdText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'thruDpText':
                this.revenueCostFrmGroup.patchValue({
                    t_thruDpText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'ownFundFeText':
                this.revenueCostFrmGroup.patchValue({
                    t_ownFundFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;
            case 'ownFeFundFeText':
                this.revenueCostFrmGroup.patchValue({
                    t_ownFeFundFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))

                });
                break;
            case 'otherFeText':
                this.revenueCostFrmGroup.patchValue({

                    t_otherFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))

                });
                break;
            case 'feOtherFeText':
                this.revenueCostFrmGroup.patchValue({
                    t_feOtherFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                break;

                // FIscal Year Total
            case 'fgobText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_gobText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'gobText','+')
                console.log(prepareArrayForSum)
                break;
            case 'ffeText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_feText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'feText','+')
                break;
            case 'fthruGobText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_thruGobText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'thruGobText','+')
                break;
            case 'fspAcText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_spAcText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'spAcText','+')
                break;
            case 'fthruPdText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_thruPdText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'thruPdText','+')
                break;
            case 'fthruDpText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_thruDpText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'thruDpText','+')
                break;
            case 'fownFundFeText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_ownFundFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'ownFundFeText','+')
                break;
           case 'ffeownFundFeText':
                this.aromaticCalculation(prepareArrayForSum,i,'ownFeFundFeText','+')
                break;
            case 'fotherFeText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_ownFeFundFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'otherFeText','+')
                break;
            case 'ffeotherFeText':
                this.aromaticCalculation(prepareArrayForSum,i,'feOtherFeText','+')
                break;
            case 'fTotalText':
                this.fiscalYearFrmGroup.controls.dppAnnualPhasingCostTotal.patchValue({
                    f_t_totalFeText: this.sumValueByArrayKey(element.getAttribute('formControlName'))
                });
                this.aromaticCalculation(prepareArrayForSum,i,'feOtherFeText','+')
                break;
        }



    }

    sumValueByArrayKey(attribute: string): any {
        let sumValue = 0;


        this.valueByFromNameMap.forEach((value: number, key: string)=>{
            if (key.includes(attribute)) {
                sumValue = sumValue+ value;
            }

        });

        return sumValue;
    }

    setTabRowData(res: any) {
        console.log('Set Tab Data');
        console.log(res);
        for(let i = 0; i < res.length; i++) {
            const row = this.formBuilder.group({
                // Table Form Init
                economicCodeText: res[i].economicCodeId,
                economicSubCodeText: res[i].subEconomicCodeId,
                codeDescriptionText: res[i].description,
                unitText: res[i].unit ? res[i].unit : 0,
                qtyText: res[i].qty ? res[i].qty : 0,
                unitCostText: res[i].unitCost ? res[i].unitCost : 0,
                totalCostText: res[i].totalCost,

                // Project Form Init
                gobText: res[i].gobFe,
                // feText: res[i].gobFe2,
                feText: res[i].gobFe2 ? res[i].gobFe2 : 0,
                thruGobText: res[i].gobThru,
                spAcText: res[i].spAc,
                thruPdText: res[i].thruPd,
                thruDpText: res[i].thruDp,
                ownFundFeText: res[i].ownFundFe ? res[i].ownFundFe : 0,
                ownFeFundFeText: res[i].ownFeFundFe2 ? res[i].ownFeFundFe2 : 0,
                otherFeText: res[i].otherFe ? res[i].otherFe : 0,
                feOtherFeText: res[i].feOtherFe2 ? res[i].feOtherFe2 : 0,
            });
            this.revenueCostFrmArray.push(row);


            for( let j = 0; j < res[i].fiscalYears.length; j++) {
                const fiscalYear = this.formBuilder.group({
                    fiscalYear: res[i].fiscalYears[j].fiscalYear,
                    fgobText: res[i].fiscalYears[j].gobFe,
                    ffeText: 0,
                    fthruGobText: res[i].fiscalYears[j].gobThru,
                    fspAcText: res[i].fiscalYears[j].spAc,
                    fthruPdText: res[i].fiscalYears[j].thruPd,
                    fthruDpText: res[i].fiscalYears[j].thruDp,
                    fownFundFeText: res[i].fiscalYears[j].ownFundFe,
                    ffeownFundFeText: 0,
                    fotherFeText: res[i].fiscalYears[j].otherFe,
                    ffeotherFeText: 0,
                    fTotalText: res[i].fiscalYears[j].totalCost,
                    feotherFeText: 0,
                });
                this.fiscalYearFormArray.push(
                    fiscalYear
                );
            }
        }
    }
    /**
     * GET Annual Phasing Cost By Project Concept Uuid and Component Type
     */
    private getAnnualPhasingCostByPCUuidAndComponentType(): any {
        const type = DppAnnualPhasingConstant.Revenue_Component;
        // this.subscribe$.add(
        //     this.annualPhasingCostService.getAnnualPhasingCostByPCUuidAndComponentType(this.conceptId, type).subscribe(res => {
        //         if(res === null) {
        //             this.addBasicInitRevenueRowWithValue();
        //         }
        //         this.dppAnnualPhasingOfCostUuid = res.uuid;
        //         this.setTabRowData(res.dppAnnualPhasingCostTabDetails);
        //     }, error => {
        //         console.log(error)
        //     })
        // );
    }

    /**
     * aromatic operation method
     * @param valueOneEvent it's value one
     * @param valueTwo it's value two
     * @param index it's index of array
     * @param target where place aromatic operation result
     * @param symbol aromatic symbol(Ex. +,-,/)
     */
    aromaticCalculation(values: number[], index,target,symbol) {
        let calculatedValue;

        switch (symbol)
        {
            case "+":
                calculatedValue = values.reduce((a, b) => (+a) + (+b), 0)
                break;
            case "-":
                calculatedValue = (+values[0])-(+values[1])
                break;
            case "/":
                calculatedValue = (+values[0])/(+values[1])
                break;
            case "*":
                calculatedValue = (+values[0])*(+values[1])
                break;
            default:
                console.log("Symbol Not Match");
                break;
        }


        this.revenueCostFrmArray.controls[index].patchValue({
            [target]: calculatedValue
        });

    }



}
