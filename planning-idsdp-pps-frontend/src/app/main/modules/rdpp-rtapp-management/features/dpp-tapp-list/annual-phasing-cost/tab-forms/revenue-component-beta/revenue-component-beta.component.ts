import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {SubEconomicCodeModel} from "../../../../../../configuration-management/models/sub-economic-code-model";
import {IOption} from "../../../../../../../shared/model/option";
import {GlobalValidationService} from "../../../../../../../../global/validation/global-validation.service";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {DppAnnualPhasingCostService} from "../../../../../services/dpp-annual-phasing-cost.service";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {EconomicCodeService} from "../../../../../../configuration-management/services/economic-code-service.service";
import {SubEconomicCodeService} from "../../../../../../configuration-management/services/sub-economic-code.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UnitTypeService} from "../../../../../../configuration-management/services/unit-type.service";
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {map, switchMap} from "rxjs/operators";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {IDppAnnualPhasingCostTabDetails} from '../../../../../models/dpp-annual-phasing-cost-tab-details';
import {IFiscalYearRequest} from '../../../../../models/fiscal-year-request';
import {IDppPhasingCostTotal} from '../../../../../models/dpp-phasing-cost-total';
import {ERROR, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from '../../../../../../../core/constants/message';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ProjectSummaryService} from '../../../../../../project-concept-management/services/project-summary.service';
import {IDppAnnualPhasingCostWithChildDetailsRequest} from '../../../../../models/dpp-annual-phasing-cost-with-child-request';
import {IDppAnnualPhasingCostWithChildDetailsResponse} from '../../../../../models/dpp-annual-phasing-cost-with-child-respone';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FileUploadService} from 'app/main/core/services/file-upload.service';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {TranslateService} from "@ngx-translate/core";
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {RdppAnnualPhasingCostService} from "../../../../../services/rdpp-annual-phasing-cost.service";
import {RdppObjectiveCostService} from "../../../../../services/rdpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../../../models/dppObjectiveCost.model";

@Component({
    selector: 'app-revenue-component-beta',
    templateUrl: './revenue-component-beta.component.html',
    styleUrls: ['./revenue-component-beta.component.scss']
})
export class RevenueComponentBetaComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('callAttachmentDialog') callAttachmentDialog: TemplateRef<any>;

    formGroup: FormGroup;
    attachmentIndex: any;

    @Input() financialYearsInfoJson: any = [];
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() fiscalYearOutput = new EventEmitter<{ fiscalYear: string }[]>();

    conceptId: number;
    revenueComponentInRdppFound: boolean = true;
    conceptUuid: string;
    cumulativeDate: string;
    rdppMasterId: number;
    economicCodes: IOption[] = [];
    subEconomicList: { index: number, codes: IOption[] }[] = [];
    subEconomicCodes: { index: number, codes: SubEconomicCodeModel[] }[] = [];
    unitTypeList: IOption[] = [];
    fiscalYearList: { fiscalYear: string }[] = [];
    rdppFiscalYearList: { fiscalYear: string }[] = [];
    revenueArray: { form: FormGroup, details: IDppAnnualPhasingCostTabDetails }[] = [];
    revenueTotal: IDppPhasingCostTotal;
    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse;
    show: boolean = true;
    file: File;
    isForeignAid: boolean;
    spinner: boolean;

    projectSummary: IProjectConcept;
    rdppMasterData : DppObjectiveCostModel;

    constructor(
        private formBuilder: FormBuilder,
        private globalValidation: GlobalValidationService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
        private projectSummaryService: ProjectSummaryService,
        private rdppObjectiveCostService: RdppObjectiveCostService,
        private snackBar: SnackbarHelper,
        private economicCodeService: EconomicCodeService,
        private subEconomicCodeService: SubEconomicCodeService,
        private route: ActivatedRoute,
        private router: Router,
        public numberPipe : NumberPipe,
        private dialog: MatDialog,
        private fileUploadService: FileUploadService,
        private _translateService: TranslateService,
        private unitTypeService: UnitTypeService
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
            this.getRevenueComponentDataInRdpp();
        });
    }

    ngOnInit(): void {
        this.loadFormGroup();
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        // this.getRevenueComponentDataInRdpp();
        this.getRdppMasterData();
        this.getPcInfo();
        this.getCumulativeDate();
        this.rdpLloadFiscalYear();

    }

    getRdppMasterData(){
        this.subscribe$.add(
            this.rdppObjectiveCostService.getByProjectConceptUuidAndId(this.conceptUuid, this.rdppMasterId).subscribe(res =>{
                if(res){
                    this.rdppMasterData = res.res;
                    this.getRevenueComponentDataInRdpp();
                }
            })
        )
    }

    private getRevenueComponentDataInRdpp(): any {
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(ps => this.rdppAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        rdppMasterId: this.rdppMasterId,
                        componentName: DppAnnualPhasingConstant.Revenue_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                console.log(res);
                this.conceptId = res.ps.id;
                if (res.dapc == null) {
                    if(this.rdppMasterData.revisedVersion == '1st Revised'){
                        this.revenueComponentInRdppFound = false;
                        this.getAllCall();
                    }else{
                        this.revenueComponentInRdppFound = false;
                        this.getReferenceValue(this.rdppMasterData.referenceId);
                    }
                } else {
                    this.revenueComponentInRdppFound = true;
                    this.dppAnnualPhasingCostWithChildDetails = res.dapc;
                    this.getAllSubEconomicCodeByEconomicCodes(res.dapc.dppAnnualPhasingCostTabDetails);
                    this.revenueTotal = res.dapc.dppAnnualPhasingCostTotal;
                    this.fiscalYearWiseCost = res.dapc.fiscalYearWiseCost;
                    this.fiscalYearList = res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                    this.fiscalYearOutput.emit(res.dapc.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear})));
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
                        componentName: DppAnnualPhasingConstant.Revenue_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.conceptId = res.ps.id;
                if (res.dapc) {
                    this.loadFiscalYear();
                    this.loadRevenue(res.dapc);
                    for (let i = 0; i < res.dapc.dppAnnualPhasingCostTabDetails.length - 1; i++) {
                        this.initFiscalYear();
                    }
                    this.getAll(false);
                } else {
                    this.getAll(true);
                }
            })
        );
    }

    getReferenceValue(refId){
        this.emptyAllArray();
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).pipe(
                switchMap(ps => this.rdppAnnualPhasingCostService
                    .getByProjectConceptIdAndComponentName({
                        // projectConceptId: ps.id,
                        rdppMasterId: refId,
                        componentName: DppAnnualPhasingConstant.Revenue_Component
                    }).pipe(
                        map(dapc => ({ps: ps, dapc: dapc}))
                    ))
            ).subscribe(res => {
                this.conceptId = res.ps.id;
                console.log(res)
                if (res.dapc) {
                    this.loadFiscalYear();
                    this.loadRevenue(res.dapc);
                    for (let i = 0; i < res.dapc.dppAnnualPhasingCostTabDetails.length - 1; i++) {
                        this.initFiscalYear();
                    }
                    this.getAll(false);
                } else {
                    this.getAll(true);
                }
            })
        );
    }

    private getAllSubEconomicCodeByEconomicCodes(dppAnnualPhasingCostTabDetails: IDppAnnualPhasingCostTabDetails[]) {
        this.subscribe$.add(
            this.subEconomicCodeService.getByEconomicCodes(dppAnnualPhasingCostTabDetails.map(m => m.economicCodeId)).subscribe(res => {
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
                    this.revenueArray.push({
                        form: this.updateForm(e.economicCodeId, e.subEconomicCodeId, e.unitId),
                        details: e
                    });
                    if (index === (dppAnnualPhasingCostTabDetails.length - 1)) {
                        this.sumOfRevenueTotal();
                        this.getAll(false);
                    }
                });
            },
            err =>{
                console.log('getByEconomicCodes', err);
                this.show = false;
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
                        name:(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
                            this.numberPipe.convertToBanglaNumber(m.economicCode) + " [" + m.economicCodeNameBng + "]" :
                            m.economicCode + " [" + m.economicCodeName + "]",
                        nameBn: m.economicCodeBng + " [" + m.economicCodeNameBng + "]",
                        nameEn: m.economicCode + " [" + m.economicCodeName + "]",
                        value: m.id,
                    }));
                this.unitTypeList = res.units.map(m => ({
                    name:(this.projectSummary.projectTypeDTO.nameEn.toUpperCase() =='DPP' && this.projectSummary.isForeignAid== false) ?
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
            console.log('fiscal year list');
            console.log(res);
            this.fiscalYearList = res;
            this.fiscalYearList.forEach(e => {
                this.initFiscalYearWiseData(e.fiscalYear);
            });
        });
    }

    rdpLloadFiscalYear(): any {
        this.rdppAnnualPhasingCostService.fiscalYearList.subscribe(res => {
            console.log('rdpLloadFiscalYearfiscal year CCCREVlist');
            console.log(res);
            this.rdppFiscalYearList = res;
            this.rdppFiscalYearList.forEach(e => {
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

    loadRevenue(dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse) {
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
                    this.revenueArray.push({
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
            },
            err =>{
                console.log('getByEconomicCodes', err);
                this.show = false;
            })
        );

        this.revenueTotal = this.getData(null);
        this.show = false;
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

    initFiscalYear() {
        this.fiscalYearWiseCost.forEach(e => e.values.push(this.getData(e.fiscalYear)));
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
                    dppAnnualPhasingCostTotal: this.getData(fy)
                });
        }
    }

    onCheckedChangeForBasis($event: MatCheckboxChange, i: number) {
        this.revenueArray[i].details.isBasis = $event.checked;
    }
    onCheckedChangeForMajor($event: MatCheckboxChange, i: number) {
        this.revenueArray[i].details.isMajor = $event.checked;
    }

    onSelectedSubEconomicCode(id: number, index) {
        this.revenueArray[index].details.description = this.subEconomicCodes[index].codes.find(f => f.id === id).description;
    }

    onChangeDescription($event: KeyboardEvent, index) {
        this.revenueArray[index].details.description = $event.target['value'];
    }

    onChangeRevenueTotalAmount($event: KeyboardEvent, field: string, index: number) {
        let value = 0;
        if (!isNaN(Number($event.target['value']))) {
            value = Number($event.target['value']);
        }

        switch (field) {
            case 'gobFeAmount':
                if (this.revenueArray[index]?.details?.gobAmount < value) {
                    this.revenueArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
                }
                break;
            case 'ownFundFeAmount':
                if (this.revenueArray[index]?.details?.ownFundAmount < value) {
                    this.revenueArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
                }
                break;
            case 'otherFeAmount':
                if (this.revenueArray[index]?.details?.otherAmount < value) {
                    this.revenueArray[index].details[field] = 0;
                    this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
                }
                break;
            default:
                // set all fiscal years current index revenue field's  amount
                this.revenueArray[index].details[field] = value;
                break;
        }

        // set revenue fields total amount
        this.revenueTotal[field] = this.revenueArray.map(m => Number(m.details[field])).reduce((sum, current) => (sum + current), 0);

       // set revenue fields total amount
        this.revenueArray[index].details.totalAmount =
            this.revenueArray[index].details.gobThruAmount +
            this.revenueArray[index].details.gobAmount +
            this.revenueArray[index].details.ownFundAmount +
            this.revenueArray[index].details.spAcAmount +
            this.revenueArray[index].details.otherAmount +
            this.revenueArray[index].details.thruPdAmount +
            this.revenueArray[index].details.thruDpAmount;

        // set revenues total amounts total
        this.revenueTotal.totalAmount = this.revenueArray.map(m => m.details.totalAmount).reduce((sum, current) => (sum + current), 0);
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
                this.revenueArray[childIndex].details.qty = value;
                if (this.revenueArray[childIndex].details.totalAmount > 0) {
                    this.revenueArray[childIndex].details.unitCost = (this.revenueArray[childIndex].details.totalAmount / this.revenueArray[childIndex].details.qty);
                }
                this.revenueTotal.qty = this.revenueArray.reduce((sum, current) => (sum + current.details.qty), 0);
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
        this.revenueArray[childIndex].details.unitCost = (this.revenueArray[childIndex].details.totalAmount / this.revenueArray[childIndex].details.qty) ? (this.revenueArray[childIndex].details.totalAmount / this.revenueArray[childIndex].details.qty):0;
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
    deleteRevenue(i: number) {
        if(!this.revenueArray[i].details.isFromOriginal){
            this.revenueArray.splice(i, 1);
            this.subtractFromFiscalYearCostArray(i);
            this.sumOfRevenueTotal();
        }
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

    onNextTab(): void {
        this.arrangeData(true);
    }

    saveAndExit(): void {
        this.arrangeData(false);
    }

    private arrangeData(next: boolean) {
        if (this.revenueArray.some(s => !s.form.value.economicCodeId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all economic code", ERROR);
        } else if (this.revenueArray.some(s => !s.form.value.subEconomicCodeId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all sub economic code", ERROR);
        } else if (this.revenueArray.some(s => !s.form.value.unitId)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all unit", ERROR);
        } else if (this.revenueArray.some(s => s.details.qty < 0)) {
            this.snackBar.openWarnSnackBarWithMessage("Please give all quantity", ERROR);
        } else {
            let request: IDppAnnualPhasingCostWithChildDetailsRequest = {} as IDppAnnualPhasingCostWithChildDetailsRequest;
            request.projectConceptId = this.conceptId;
            request.projectConceptUuid = this.conceptUuid;
            request.componentName = DppAnnualPhasingConstant.Revenue_Component;
            request.dppAnnualPhasingCostTotal = this.revenueTotal;
            request.rdppMasterId = this.rdppMasterId;
            request.fiscalYearsWiseTotal = this.fiscalYearWiseCost.map(m => m.dppAnnualPhasingCostTotal);
            let list: IDppAnnualPhasingCostTabDetails[] = []
            let i = 0;
            this.revenueArray.forEach(e => {
                let a: IDppAnnualPhasingCostTabDetails = e.details;
                a.economicCodeId = e.form.value.economicCodeId;
                a.subEconomicCodeId = e.form.value.subEconomicCodeId;
                a.unitId = e.form.value.unitId;
                a.fiscalYears = this.fiscalYearWiseCost.map(m => m.values[i]);
                list.push(a);
                i += 1;
                request.dppAnnualPhasingCostTabDetails = list;
                if (this.revenueArray.length === i) {
                    if (this.revenueComponentInRdppFound) {
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
                this.spinner = false;
                this.dppAnnualPhasingCostWithChildDetails = res;
                this.dppAnnualPhasingCostWithChildDetails.rdppMasterId = this.rdppMasterId;
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
                this.spinner = false;
                this.dppAnnualPhasingCostWithChildDetails = res;
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
        this.revenueArray = [];
        this.fiscalYearWiseCost = [];
        this.revenueTotal = null;
    }

    navigateToList() {
        this.router.navigate([`rdpp-rtapp/dashboard/${this.conceptUuid}`]);
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
        this.fileUploadService.getAttachmentByIdInDppService(this.revenueArray[index].details.attachmentId).subscribe(res => {
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
            this.spinner = false;
            this.revenueArray[index].details.attachmentId = null;
        });
    }


    private openDeleteDialog(index: number, deleteItem: 'y' | 'r' | 'a') {
        if(this.revenueArray[index].details.isFromOriginal)
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
            dialogRef.close(true);
            if (res) {
                (deleteItem === 'y') ? this.deleteYear(index) : (deleteItem === 'r') ? this.deleteRevenue(index) : this.deleteAttachment(index);
            }
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
