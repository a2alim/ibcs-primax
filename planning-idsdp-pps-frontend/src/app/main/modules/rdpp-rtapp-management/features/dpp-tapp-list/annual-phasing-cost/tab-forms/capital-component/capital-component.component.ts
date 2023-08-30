import {GlobalValidationService} from '../../../../../../../../global/validation/global-validation.service';
import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {DppAnnualPhasingCostService} from '../../../../../services/dpp-annual-phasing-cost.service';
import {map, switchMap} from 'rxjs/operators';
import {SubEconomicCodeModel} from "../../../../../../configuration-management/models/sub-economic-code-model";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {EconomicCodeService} from "../../../../../../configuration-management/services/economic-code-service.service";
import {SubEconomicCodeService} from "../../../../../../configuration-management/services/sub-economic-code.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IOption} from "../../../../../../../shared/model/option";
import {UnitTypeService} from "../../../../../../configuration-management/services/unit-type.service";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {IDppAnnualPhasingCostTabDetails} from "../../../../../models/dpp-annual-phasing-cost-tab-details";
import {IDppPhasingCostTotal} from "../../../../../models/dpp-phasing-cost-total";
import {IFiscalYearRequest} from "../../../../../models/fiscal-year-request";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ERROR, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../../../core/constants/message";
import {IDppAnnualPhasingCostWithChildDetailsResponse} from "../../../../../models/dpp-annual-phasing-cost-with-child-respone";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {IDppAnnualPhasingCostWithChildDetailsRequest} from "../../../../../models/dpp-annual-phasing-cost-with-child-request";
import {FileUploadService} from 'app/main/core/services/file-upload.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {RdppAnnualPhasingCostService} from "../../../../../services/rdpp-annual-phasing-cost.service";
import {RdppObjectiveCostService} from "../../../../../services/rdpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../../../models/dppObjectiveCost.model";


@Component({
    selector: 'app-capital-component',
    templateUrl: './capital-component.component.html',
    styleUrls: ['../style.component.scss']
})
export class CapitalComponentComponent extends UnsubscribeAdapterComponent implements OnInit {


    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @Input() financialYearsInfoJson: any = [];
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() fiscalYearOutput = new EventEmitter<{ fiscalYear: string }[]>();

    frmGroup: FormGroup;
    attachmentIndex: any;

    conceptId: number;
    capitalComponentInRdppFound: boolean = true;
    conceptUuid: string;
    rdppMasterId: number;
    economicCodes: IOption[] = [];
    subEconomicList: { index: number, codes: IOption[] }[] = [];
    subEconomicCodes: { index: number, codes: SubEconomicCodeModel[] }[] = [];
    unitTypeList: IOption[] = [];
    fiscalYearList: { fiscalYear: string }[] = [];
    capitalArray: { form: FormGroup, details: IDppAnnualPhasingCostTabDetails }[] = [];
    capitalTotal: IDppPhasingCostTotal;
    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse;
    show: boolean = true;
    file: File;
    isForeignAid: boolean;
    cumulativeDate: string;

    projectSummary: IProjectConcept;
    rdppMasterData : DppObjectiveCostModel;

    spinner: boolean;

    constructor(private formBuilder: FormBuilder,
                private globalValidation: GlobalValidationService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private rdppObjectiveCostService: RdppObjectiveCostService,
                private projectSummaryService: ProjectSummaryService,
                private snackBar: SnackbarHelper,
                private economicCodeService: EconomicCodeService,
                private subEconomicCodeService: SubEconomicCodeService,
                private route: ActivatedRoute,
                private router: Router,
                public numberPipe : NumberPipe,
                private fileUploadService: FileUploadService,
                private dialog: MatDialog,
                private unitTypeService: UnitTypeService,
                private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._fuseTranslationLoaderService.getActiveLang() === 'en' ? this.isForeignAid = true : this.isForeignAid = false;
        this.rdppAnnualPhasingCostService.fiscalYear.subscribe(res => {
            if (res) {
                this.addFiscalYear(res);
            }
        });
        rdppAnnualPhasingCostService.checkFiscalYear.subscribe(_ => {
            this.getCapitalComponentDataInRdpp();
        })

    }

    ngOnInit(): void {
        this.loadFormGroup();
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this.getRdppMasterData();
        this.getPcInfo();
        this.getCumulativeDate();
    }

    getRdppMasterData(){
        this.subscribe$.add(
            this.rdppObjectiveCostService.getByProjectConceptUuidAndId(this.conceptUuid, this.rdppMasterId).subscribe(res =>{
                if(res){
                    this.rdppMasterData = res.res;
                    this.getCapitalComponentDataInRdpp();
                }
            })
        )
    }

    private getCapitalComponentDataInRdpp(): any {
        this.show = true;
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(ps => this.rdppAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        rdppMasterId: this.rdppMasterId,
                        componentName: DppAnnualPhasingConstant.Capital_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                console.log(res);
                this.conceptId = res.ps.id;
                if (res.dapc == null) {
                    if(this.rdppMasterData.revisedVersion == '1st Revised'){
                        this.capitalComponentInRdppFound = false;
                        this.getAllCall();
                    }else{
                        this.capitalComponentInRdppFound = false;
                        this.getReferenceValue(this.rdppMasterData.referenceId);
                    }
                } else {
                    this.capitalComponentInRdppFound = true;
                    this.dppAnnualPhasingCostWithChildDetails = res.dapc;
                    this.getAllSubEconomicCodeByEconomicCodes(res.dapc.dppAnnualPhasingCostTabDetails);
                    this.capitalTotal = res.dapc.dppAnnualPhasingCostTotal;
                    this.fiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                    this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                    this.fiscalYearOutput.emit(res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
                    this.show = false;
                }
            })
        );
    }


    private getAllCall() {
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(ps => this.annualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        projectConceptId: ps.id,
                        componentName: DppAnnualPhasingConstant.Capital_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.conceptId = res.ps.id;
                if (res.dapc) {
                  //  this.dppAnnualPhasingCostWithChildDetails = res.dapc;
                  //  this.getAllSubEconomicCodeByEconomicCodes(res.dapc.dppAnnualPhasingCostTabDetails);
                  //  this.capitalTotal = res.dapc.dppAnnualPhasingCostTotal;
                  //  this.fiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                  //  this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                  //  this.fiscalYearOutput.emit(res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
                    this.loadFiscalYear();
                    this.loadCapital(res.dapc);
                    // for (let i = 0; i < res.dapc.dppAnnualPhasingCostTabDetails.length; i++) {
                    //     this.initCapital();
                    // }
                    for (let i = 0; i < res.dapc.dppAnnualPhasingCostTabDetails.length - 1; i++) {
                        this.initFiscalYear();
                    }
                    this.getAll(false);
                    this.show = false;
                } else {
                    this.getAll(true);
                }
            })
        );
    }

    private getReferenceValue(refId) {
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(ps => this.rdppAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        rdppMasterId: refId,
                        componentName: DppAnnualPhasingConstant.Capital_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.conceptId = res.ps.id;
                if (res.dapc) {
                    this.loadFiscalYear();
                    this.loadCapital(res.dapc);
                    for (let i = 0; i < res.dapc.dppAnnualPhasingCostTabDetails.length - 1; i++) {
                        this.initFiscalYear();
                    }
                    this.getAll(false);
                    this.show = false;
                } else {
                    this.getAll(true);
                }
            })
        );
    }

    private getAllSubEconomicCodeByEconomicCodes(dppAnnualPhasingCostTabDetails: IDppAnnualPhasingCostTabDetails[]) {
        this.subscribe$.add(
            this.subEconomicCodeService.getByEconomicCodes(dppAnnualPhasingCostTabDetails.map(m => m.economicCodeId)).subscribe(res => {
                console.log('capitalArray',res);
                dppAnnualPhasingCostTabDetails.forEach((e, index) => {
                    this.subEconomicCodes.push(({index: index,codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes}));
                    this.subEconomicList.push(({
                        index: index,
                        codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes.map(m => ({
                            name:(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
                                this.numberPipe.convertToBanglaNumber(m.subEconomicCode) + " [" + m.subEconomicCodeNameBng + "]" :
                                m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
                            nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            value: m.id,
                        }))
                    }));
                    // this.getSubEconomicCode(e.economicCodeId, index);
                    this.capitalArray.push({
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
                this.economicCodes = res.economicCodes.filter(f => f.economicCodeFor === 2)
                    .map(m => ({
                        name:(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
                            this.numberPipe.convertToBanglaNumber(m.economicCode) + " [" + m.economicCodeNameBng + "]" :
                            m.economicCode + " [" + m.economicCodeName + "]",
                        nameBn: m.economicCodeBng + " [" + m.economicCodeNameBng + "]",
                        nameEn: m.economicCode + " [" + m.economicCodeName + "]",
                        value: m.id,
                    }));
                this.unitTypeList = res.units.map(m => ({
                    name:(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
                        m.unitTypeNameBng:
                        m.unitTypeNameEng,
                    nameBn: m.unitTypeNameEng + " [" + m.description + "]",
                    nameEn: m.unitTypeNameBng + " [" + m.description + "]",
                    value: m.id,
                }));
                if (initialize) {
                    this.loadFiscalYear();
                    this.initCapital();
                } else {
                    this.show = false;
                }

            })
        );
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
                        name: (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
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
        this.rdppAnnualPhasingCostService.fiscalYearList.subscribe(res => {
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


    loadCapital(dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse) {
        this.subscribe$.add(
            this.subEconomicCodeService.getByEconomicCodes(dppAnnualPhasingCostWithChildDetails.dppAnnualPhasingCostTabDetails.map(m => m.economicCodeId)).subscribe(res => {
                dppAnnualPhasingCostWithChildDetails.dppAnnualPhasingCostTabDetails.forEach((e, index) => {
                    this.subEconomicCodes.push(({index: index,codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes}));
                    this.subEconomicList.push(({
                        index: index,
                        codes: res.find(f => f.economicCodeId === e.economicCodeId).subEconomicCodes.map(m => ({
                            name:(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
                                this.numberPipe.convertToBanglaNumber(m.subEconomicCode) + " [" + m.subEconomicCodeNameBng + "]" :
                                m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
                            nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
                            value: m.id,
                        }))
                    }));
                    this.capitalArray.push({
                        form: this.updateForm(e.economicCodeId, e.subEconomicCodeId, e.unitId),
                        details: {
                            attachmentId: e.attachmentId,
                            id: e.id,
                            uuid: e.uuid,
                            isBasis: e.isBasis,
                            isMajor: e.isMajor,
                            description: e.description,
                            economicCodeId: e.economicCodeId,
                            subEconomicCodeId: e.subEconomicCodeId,
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
                            unitId: e.unitId,
                            isFromOriginal: true,
                        }
                    });
                    if (index === (dppAnnualPhasingCostWithChildDetails.dppAnnualPhasingCostTabDetails.length - 1)) {
                        this.getAll(false);
                    }
                });
            })
        );

        this.capitalTotal = this.getData(null);
        this.show = false;
    }


    initFiscalYear() {
        this.fiscalYearWiseCost.forEach(e => e.values.push(this.getData(e.fiscalYear)));
    }

    initCapital() {
        this.capitalArray.push(
            {
                form: this.createForm(),
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
        this.sumOfCapitalTotal();
        this.show = false;
    }

    private initFiscalYearWiseData(fiscalYear: string) {
        const values = [];
        values.push(this.getData(fiscalYear));
        this.fiscalYearWiseCost.push(
            {
                fiscalYear: fiscalYear,
                values: values,
                dppAnnualPhasingCostTotal: this.getData(fiscalYear)
            }
        );
    }

    private getData(fiscalYear: string) {
        return {
            id: null,
            uuid: null,
            fiscalYear: fiscalYear,
            quantity: 0,
            qty:0,
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
        this.initCapital();
        this.fiscalYearWiseCost.forEach(e => e.values.push(this.getData(e.fiscalYear)));

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

    onCheckedChangeForBasis($event: MatCheckboxChange, i: number) {
        this.capitalArray[i].details.isBasis = $event.checked;
    }
    onCheckedChangeForMajor($event: MatCheckboxChange, i: number) {
        this.capitalArray[i].details.isMajor = $event.checked;
    }

    onSelectedSubEconomicCode(id: number, index) {
        this.capitalArray[index].details.description = this.subEconomicCodes[index].codes.find(f => f.id === id).description;
    }

    onChangeDescription($event: KeyboardEvent, index) {
        this.capitalArray[index].details.description = $event.target['value'];
    }


    onChangeCapitalTotalAmount($event: KeyboardEvent, field: string, index: number) {

        let value = 0;
        if (!isNaN(Number($event.target['value']))) {
            value = Number($event.target['value']);
        }

        switch (field) {
            case 'gobFeAmount':
                if (this.capitalArray[index]?.details?.gobAmount < value) {
                    this.capitalArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
                }
                break;
            case 'ownFundFeAmount':
                if (this.capitalArray[index]?.details?.ownFundAmount < value) {
                    this.capitalArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
                }
                break;
            case 'otherFeAmount':
                if (this.capitalArray[index]?.details?.otherAmount < value) {
                    this.capitalArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
                }
                break;
            default:
                // set all fiscal years current index revenue field's  amount
                this.capitalArray[index].details[field] = value;
                break;
        }

        // set revenue fields total amount
        this.capitalTotal[field] = this.capitalArray.map(m => Number(m.details[field])).reduce((sum, current) => (sum + current), 0);

       // set revenue fields total amount
        this.capitalArray[index].details.totalAmount =
            this.capitalArray[index].details.gobThruAmount +
            this.capitalArray[index].details.gobAmount +
            this.capitalArray[index].details.ownFundAmount +
            this.capitalArray[index].details.spAcAmount +
            this.capitalArray[index].details.otherAmount +
            this.capitalArray[index].details.thruPdAmount +
            this.capitalArray[index].details.thruDpAmount;

        // set revenues total amounts total
        this.capitalTotal.totalAmount = this.capitalArray.map(m => m.details.totalAmount).reduce((sum, current) => (sum + current), 0);

    }

    onchangeAmount($event: KeyboardEvent, field: string, parentIndex: number, childIndex: number) {
        let value = 0;
        if (!isNaN(Number($event.target['value']))) {
            value = Number($event.target['value']);
        }
        switch (field) {
            case 'quantity':
                this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;
                this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal.qty = this.fiscalYearWiseCost[parentIndex].values.reduce((sum, current) => sum + current.quantity, 0);
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
            case 'qty':
                this.capitalArray[childIndex].details.qty = value;
                if (this.capitalArray[childIndex].details.totalAmount > 0) {
                    this.capitalArray[childIndex].details.unitCost = (this.capitalArray[childIndex].details.totalAmount / this.capitalArray[childIndex].details.qty);
                }
                this.capitalTotal.qty = this.capitalArray
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
        this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal[field] =
            this.fiscalYearWiseCost[parentIndex].values.map(m => m[field]).reduce((sum, current) => (sum + current), 0);

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
        this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal.totalAmount =
            this.fiscalYearWiseCost[parentIndex].values.map(m => m.totalAmount).reduce((sum, current) => (sum + current), 0);

        //set unit cost
        this.capitalArray[childIndex].details.unitCost = (this.capitalArray[childIndex].details.totalAmount / this.capitalArray[childIndex].details.qty)?(this.capitalArray[childIndex].details.totalAmount / this.capitalArray[childIndex].details.qty):0;
    }

    private calculationOfFe(value: number, field: string, parentIndex: number, childIndex: number) {
        //set current index field amount

        this.fiscalYearWiseCost[parentIndex].values[childIndex][field] = value;

        // set fields total amount
        this.fiscalYearWiseCost[parentIndex].dppAnnualPhasingCostTotal[field] =
            this.fiscalYearWiseCost[parentIndex].values.map(m => m[field]).reduce((sum, current) => (sum + current), 0);

    }

    /**
     * delete Revenue with fiscal year value
     * @param i
     */
    deleteCapital(i: number) {

        if(!this.capitalArray[i].details.isFromOriginal){
            this.capitalArray.splice(i, 1);
            this.subtractFromFiscalYearCostArray(i);
            this.sumOfCapitalTotal();
        }

    }


    private sumOfCapitalTotal() {
        const capitalDetails = this.capitalArray.map(m => m.details);
        this.capitalTotal.qty = capitalDetails.reduce((sum, current) => sum + Number(current.qty), 0);
        this.capitalTotal.totalAmount = capitalDetails.reduce((sum, current) => sum + Number(current.totalAmount), 0)
        this.capitalTotal.gobAmount = capitalDetails.reduce((sum, current) => sum + Number(current.gobAmount), 0);
        this.capitalTotal.gobFeAmount = capitalDetails.reduce((sum, current) => sum + Number(current.gobFeAmount), 0);
        this.capitalTotal.gobThruAmount = capitalDetails.reduce((sum, current) => sum + Number(current.gobThruAmount), 0);
        this.capitalTotal.spAcAmount = capitalDetails.reduce((sum, current) => sum + Number(current.spAcAmount), 0);
        this.capitalTotal.thruPdAmount = capitalDetails.reduce((sum, current) => sum + Number(current.thruPdAmount), 0);
        this.capitalTotal.thruDpAmount = capitalDetails.reduce((sum, current) => sum + Number(current.thruDpAmount), 0);
        this.capitalTotal.ownFundAmount = capitalDetails.reduce((sum, current) => sum + Number(current.ownFundAmount), 0);
        this.capitalTotal.ownFundFeAmount = capitalDetails.reduce((sum, current) => sum + Number(current.ownFundFeAmount), 0);
        this.capitalTotal.otherAmount = capitalDetails.reduce((sum, current) => sum + Number(current.otherAmount), 0);
        this.capitalTotal.otherFeAmount = capitalDetails.reduce((sum, current) => sum + Number(current.otherFeAmount), 0);
    }

    private subtractFromFiscalYearCostArray(i: number) {
        this.fiscalYearWiseCost.forEach(e => {
            const yearWiseRevenue = e.dppAnnualPhasingCostTotal;
            e.dppAnnualPhasingCostTotal.totalAmount = yearWiseRevenue.totalAmount - e.values[i].totalAmount;
            e.dppAnnualPhasingCostTotal.gobAmount = yearWiseRevenue.gobAmount - e.values[i].gobAmount;
            e.dppAnnualPhasingCostTotal.gobFeAmount = yearWiseRevenue.gobFeAmount - e.values[i].gobFeAmount;
            e.dppAnnualPhasingCostTotal.gobThruAmount = yearWiseRevenue.gobThruAmount - e.values[i].gobThruAmount;
            e.dppAnnualPhasingCostTotal.spAcAmount = yearWiseRevenue.spAcAmount - e.values[i].spAcAmount;
            e.dppAnnualPhasingCostTotal.thruPdAmount = yearWiseRevenue.thruPdAmount - e.values[i].thruPdAmount;
            e.dppAnnualPhasingCostTotal.thruDpAmount = yearWiseRevenue.thruDpAmount - e.values[i].thruDpAmount;
            e.dppAnnualPhasingCostTotal.ownFundAmount = yearWiseRevenue.ownFundAmount - e.values[i].ownFundAmount;
            e.dppAnnualPhasingCostTotal.ownFundFeAmount = yearWiseRevenue.ownFundFeAmount - e.values[i].ownFundFeAmount;
            e.dppAnnualPhasingCostTotal.otherAmount = yearWiseRevenue.otherAmount - e.values[i].otherAmount;
            e.dppAnnualPhasingCostTotal.otherFeAmount = yearWiseRevenue.otherFeAmount - e.values[i].otherFeAmount;
            e.dppAnnualPhasingCostTotal.qty = yearWiseRevenue.qty - e.values[i].quantity;
            e.values.splice(i, 1);
        });
    }

    /**
     * delete iscal year value
     * @param i
     */
    deleteYear(i: number) {
        this.subtractFromCapitalArray(i);
        this.sumOfCapitalTotal();
        this.fiscalYearList.splice(i, 1);
        this.fiscalYearOutput.emit(this.fiscalYearList);
    }

    private subtractFromCapitalArray(i: number) {
        this.capitalArray.forEach((e, index) => {
            const capitalDetails = e.details;
            e.details.totalAmount = capitalDetails.totalAmount - this.fiscalYearWiseCost[i].values[index].totalAmount;
            e.details.gobAmount = capitalDetails.gobAmount - this.fiscalYearWiseCost[i].values[index].gobAmount;
            e.details.gobFeAmount = capitalDetails.gobFeAmount - this.fiscalYearWiseCost[i].values[index].gobFeAmount;
            e.details.gobThruAmount = capitalDetails.gobThruAmount - this.fiscalYearWiseCost[i].values[index].gobThruAmount;
            e.details.spAcAmount = capitalDetails.spAcAmount - this.fiscalYearWiseCost[i].values[index].spAcAmount;
            e.details.thruPdAmount = capitalDetails.thruPdAmount - this.fiscalYearWiseCost[i].values[index].thruPdAmount;
            e.details.thruDpAmount = capitalDetails.thruDpAmount - this.fiscalYearWiseCost[i].values[index].thruDpAmount;
            e.details.ownFundAmount = capitalDetails.ownFundAmount - this.fiscalYearWiseCost[i].values[index].ownFundAmount;
            e.details.ownFundFeAmount = capitalDetails.ownFundFeAmount - this.fiscalYearWiseCost[i].values[index].ownFundFeAmount;
            e.details.otherAmount = capitalDetails.otherAmount - this.fiscalYearWiseCost[i].values[index].otherAmount;
            e.details.otherFeAmount = capitalDetails.otherFeAmount - this.fiscalYearWiseCost[i].values[index].otherFeAmount;
            e.details.unitCost = e.details.totalAmount / e.details.qty;
        });
        this.fiscalYearWiseCost.splice(i, 1);
    }

    onNextTab(): void {
        this.arrangeData(true);
    }

    saveAndExit(): void {
        this.arrangeData(false);
    }

    private arrangeData(next: boolean) {
        if (this.capitalArray.some(s => !s.form.value.economicCodeId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all economic code", ERROR);
        } else if (this.capitalArray.some(s => !s.form.value.subEconomicCodeId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all sub economic code", ERROR);
        } else if (this.capitalArray.some(s => !s.form.value.unitId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all unit", ERROR);
        } else if (this.capitalArray.some(s => s.details.qty < 0)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all quantity", ERROR);
        }  else {
            let request: IDppAnnualPhasingCostWithChildDetailsRequest = {} as IDppAnnualPhasingCostWithChildDetailsRequest;
            request.projectConceptId = this.conceptId;
            request.projectConceptUuid = this.conceptUuid;
            request.rdppMasterId = this.rdppMasterId;
            request.componentName = DppAnnualPhasingConstant.Capital_Component;
            request.dppAnnualPhasingCostTotal = this.capitalTotal;
            request.fiscalYearsWiseTotal = this.fiscalYearWiseCost.map(m => m.dppAnnualPhasingCostTotal);
            let list: IDppAnnualPhasingCostTabDetails[] = [];
            let i = 0;
            this.capitalArray.forEach(e => {
                if (e.details.isBasis == null) {
                    e.details.isBasis = false;
                }
                if(e.details.isMajor == null){
                    e.details.isMajor = true;
                }
                let a: IDppAnnualPhasingCostTabDetails = e.details;
                a.economicCodeId = e.form.value.economicCodeId;
                a.subEconomicCodeId = e.form.value.subEconomicCodeId;
                a.unitId = e.form.value.unitId;
                a.fiscalYears = this.fiscalYearWiseCost.map(m => m.values[i]);
                list.push(a);
                i += 1;
                request.dppAnnualPhasingCostTabDetails = list;
                if (this.capitalArray.length === i) {
                    if (this.capitalComponentInRdppFound) {
                        request.uuid = this.dppAnnualPhasingCostWithChildDetails.uuid;
                        request.id = this.dppAnnualPhasingCostWithChildDetails.id;
                        this.update(request, next);
                    } else {
                        this.create(request, next);
                    }
                }
            });
        }
    }

    private create(request: IDppAnnualPhasingCostWithChildDetailsRequest, next: boolean) {
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

    private emptyAllArray() {
        // this.fiscalYearList = [];
        this.capitalArray = [];
        this.fiscalYearWiseCost = [];
        this.capitalTotal = null;
    }

    navigateToList() {
        this.router.navigate([`rdpp-rtapp/dashboard/${this.conceptUuid}`]);
    }

    uploadFile(files: FileList) {
        this.file = files.item(0);
    }

    saveFile(): any {
        this.spinner = true;
        this.fileUploadService.upload(this.file).subscribe(res => {
            this.snackBar.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
            this.frmGroup.reset();
            this.dialog.closeAll();
            if (this.capitalArray[this.attachmentIndex].details.attachmentId) {
                this.fileUploadService.deleteById(this.capitalArray[this.attachmentIndex].details.attachmentId).subscribe();
            }
            this.capitalArray[this.attachmentIndex].details.attachmentId = res.id;
            this.spinner = false;
        }, err => {
            console.log(err);
            this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }


    /* download Attachment */

    download(index: any) {
        this.spinner = true;
        this.fileUploadService.getAttachmentByIdInDppService(this.capitalArray[index].details.attachmentId).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    openDialog(index: any) {
        this.attachmentIndex = index;
        const dialogRef = this.dialog.open(this.callAPIDialog, {
            height: '300px',
            width: '500px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            this.frmGroup.reset();
            this.dialog.closeAll();
        });
    }

    cancelAttachmentUpload() {
        this.frmGroup.reset();
        this.dialog.closeAll();
    }

    loadFormGroup() {
        this.frmGroup = this.formBuilder.group({
            attachmentId: [''],
        });
    }

    deleteAttachment(index: any) {
        this.spinner = true;
        this.fileUploadService.deleteById(this.capitalArray[index].details.attachmentId).subscribe(res => {
            this.snackBar.openSuccessSnackBarWithMessage('Attachment Successfully Delete', 'Ok');
            this.capitalArray[index].details.attachmentId = null;
            this.spinner = false;
        });
    }

    private openDeleteDialog(index: number, deleteItem: 'y' | 'c' | 'a') {
        if(this.capitalArray[index].details.isFromOriginal)
            return;
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
                (deleteItem === 'y') ? this.deleteYear(index) : (deleteItem === 'c') ? this.deleteCapital(index) : this.deleteAttachment(index);
            }
            dialogRef.close(true);
        });
    }

    getPcInfo(){
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) =>{
            this.projectSummary = res;
        })
    }

    getCumulativeDate() {
        console.log('cumulative date');
        this.rdppObjectiveCostService.getCumulativeDate(this.rdppMasterId, this.conceptUuid).subscribe((res) =>{
            this.cumulativeDate = res.res;
        })
    }

    findEconomicDetails(economicCodeId): string {
        let economicCode = this.economicCodes.find(e=>e.value==economicCodeId);
        return economicCode ? economicCode.name : '';
    }

    findSubEconomicDetails(index, subEconomicCodeId): string {
        let subEconomicCode = this.subEconomicList[index].codes.find(e=>e.value==subEconomicCodeId);
        return subEconomicCode ? subEconomicCode.name : '';
    }

    findUnitTypeDetails(unitId): string {
        let unit = this.unitTypeList.find(e=>e.value==unitId);
        return unit ? unit.name : '';
    }

}
