import {GlobalValidationService} from '../../../../../../../../global/validation/global-validation.service';
import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {DppCurrencyRateModel} from '../../../../../models/dppCurrencyRate.model';
import {DppObjectiveCostModel} from '../../../../../models/dppObjectiveCost.model';
import {UserNewModal} from '../../../../../../../core/user/user_new.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectSummaryService} from '../../../../../../project-concept-management/services/project-summary.service';
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {ModeOfFinanceService} from '../../../../../../project-concept-management/services/mode-of-finance.service';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from '../../../../../../../core/constants/constant';
import {ModeOfFinanceConfigService} from '../../../../../../configuration-management/services/mode-of-finance.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {DppProjectSummeryHelperService} from "../../../../../services/dpp-project-summery-helper.service";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../../../../core/constants/message";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {
    DevelopmentPartnerService
} from "../../../../../../configuration-management/services/developmentPartnerService.service";
import {DppDevelopmentPartnerModel} from "../../../../../models/dppDevelopmentPartner.model";
import {FileUploadCommonService} from "../../../../../../../core/services/file-upload-common.service";
import {environment} from "../../../../../../../../../environments/environment";
import {AttachmentModalListModel} from "../../../../../models/attachmentModalList.model";
import {CurrencyService} from "../../../../../../configuration-management/services/currency.service";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from "moment";
import {SectorDivisionService} from 'app/main/modules/configuration-management/services/sector-division.service';
import {IProjectConcept} from '../../../../../../project-concept-management/models/project-concept';
import {ModeOfFinanceModel} from '../../../../../../project-concept-management/models/mode-of-finance.model';
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {UtilsService} from 'app/main/core/services/utils.service';
import {UserGroupService} from "../../../../../../configuration-management/services/user-group.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MatTableDataSource} from "@angular/material/table";
import {IModeOfFinance} from "../../../../../../configuration-management/models/mode-of-finance";
import {RdppObjectiveCostService} from "../../../../../services/rdpp-objective-cost.service";
import {DppObjectiveCostService} from "../../../../../../dpp-tapp-management/services/dpp-objective-cost.service";
import {EstimatedCostModel} from "../../../../../models/estimated-cost.model";
import { DppAnnexureGoodsIiiAService } from 'app/main/modules/rdpp-rtapp-management/services/dpp-annexure-goods_iii_a.service';
import { LayoutHelperService } from 'app/layout/layouts/vertical/services/layout-helper.service';
import { TranslateService } from '@ngx-translate/core';
import {DatePipe} from "@angular/common";

/*----/Lng Translation----*/


export interface User {
    name: string;
}


@Component({
    selector: 'app-object-and-cost',
    templateUrl: './object-and-cost.component.html',
    styleUrls: ['./object-and-cost.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ObjectAndCostComponent extends UnsubscribeAdapterComponent implements OnInit {

    maxDateValue: Date;
    minDateValue: Date;

    @Output() nextStep = new EventEmitter<boolean>();
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    modalRef: BsModalRef;
    modelOfFinanceList: ModeOfFinanceModel[] = [];
    dataSource: MatTableDataSource<ModeOfFinanceModel>;
    totalModeOfFinance: ModeOfFinanceModel;
    configModeList: Array<IModeOfFinance> = new Array<IModeOfFinance>();
    modeOfFinanceBlankValue: number = 0;
    dateList: any;
    originalCommencementDate: any;
    originalCompletionDate: any;
    data = [];
    conceptUuid: string;
    rdppMasterId: number;
    uuid: string;
    update: boolean;
    pcId: number;

    gob: number;
    feGob: number;
    pa: number;
    rpa: number;
    ownFund: number;
    feOwnFund: number;
    other: number;
    feOther: number;
    total: number;

    isShowObjectivesAndTargets: boolean = false;
    show: any;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    model: DppObjectiveCostModel = new DppObjectiveCostModel();
    currencyModel: DppCurrencyRateModel[] = new Array<DppCurrencyRateModel>();
    currencyModelStore: FormArray = this._formBuilder.array([]);
    developmentPartnerModelList: DppDevelopmentPartnerModel[] = new Array<DppDevelopmentPartnerModel>();
    attachmentModalListModel: AttachmentModalListModel[] = new Array<AttachmentModalListModel>();
    exchangeDataSource = new BehaviorSubject<AbstractControl[]>([]);
    developmentPartnerDataSource = new BehaviorSubject<AbstractControl[]>([]);
    modeFinanceList: {
        modeId: number, modeSource: string, modeSourceVal: string, gob: number, gobFe: number, pa: number, paRpa: number,
        ownFund: number, ownFundFe: number, others: number, othersFe: number, paSources: string, isEdited: boolean
    }[] = [];
    displayedColumns: string[] = ['sl', 'modeOfFinance', 'total', 'gob', 'pa', 'ownFund', 'other'];
    lockModeFinancingList: { modeId: number, pa: number, paRpa: number, paSources: string }[] = [];
    modeFinanceTypeList: Array<{ id: number, name: string, isEdited: boolean, pa: number, rpa: number, devPartner: string }> = [];
    developmentPartnersList: Array<{ id: number, name: string, nameBn: string }> = [];
    currencyList: Array<{ id: number, name: string, nameBn, country: string, uuid: string }> = [];
    displayColumns = ['sl', 'exchangeCurrency', 'exchangeRate', 'exchangeDate', 'action'];
    displayColumnsForDev = ['sl', 'devPartner', 'modeFinance', 'gobThruAmount', 'spAcAmount', 'thruPdAmount', 'thruDpAmount', 'attachment', 'action'];
    rows: FormArray = this._formBuilder.array([]);
    rowsForDev: FormArray = this._formBuilder.array([]);
    form: FormGroup = this._formBuilder.group({
        scope: this.rows
    });
    formDev: FormGroup = this._formBuilder.group({
        devPartner: this.rowsForDev
    });
    file: File;
    canUpdate: boolean;
    frmGroup: FormGroup;
    formFieldHelpers: string[] = [''];
    state = 'Right';
    visible = false;
    grandGob: number;
    grandGobFe: number;
    grandPa: number;
    grandPaRpa: number;
    grandOwnFund: number;
    grandOwnFundFe: number;
    grandOthers: number;
    grandOthersFe: number;

    fiscalYearsList: Array<{
        fiscalYear: string, revisedVersion: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
        ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
    }> = [];

    @Output() sendTitleEn: EventEmitter<{ titleEn: string }> = new EventEmitter();
    @Output() sendSubTitle: EventEmitter<{ subTitle: string }> = new EventEmitter();

    // versionProjectCost: Array<{
    //     fiscalYear: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
    //     ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
    // }> = [];

    projectCost = {
        gobAmount: '0',
        gobFeAmount: '0',
        paAmount: '0',
        paRpaAmount: '0',
        ownFeAmount: '0',
        ownFundAmount: '0',
        othersAmount: '0',
        otherFeAmount: '0',
        totalAmount: '0'
    };

    isEnLabel: boolean;
    referenceId: number;
    referenceUuid: string;
    currentRevisedVersion: string;

    concernedDivisionList: Array<{
        id: number,
        sectorDivisionNameBn: string,
        sectorDivisionNameEn: string,
    }> = [];

    /*----------  For autocomplete ------------*/
    myControl = new FormControl();
    options: UserNewModal[] = [
        {name: 'Agriculture, Water Resource and Rural Institution Division'},
        {name: 'Industry and Energy Division'},
        {name: 'Physical Infrastructure Division'},
        {name: 'Socio Economic Infrastructure Division'}
    ];
    filteredOptions: Observable<User[]>;

    proConceptUuid: string;

    /*----------  /For autocomplete ------------*/

    empList: [];
    // modeNameList = ['Loan/Credit', 'Grant', 'Equity', 'Others'];

    modeNameList = [
        {nameEn: 'Loan/Credit', nameBn: 'ঋণ'},
        {nameEn: 'Grant', nameBn: 'অনুদান'},
        {nameEn: 'Equity', nameBn: 'ইকুইটি'},
        {nameEn: 'Others(Specify)', nameBn: 'অন্যান্য'},
    ]

    projectSummary: IProjectConcept;
    isForeignAid: boolean = false;

    userId: any;
    ministry_name: string;
    agency_name: string;
    spinner: boolean;
    estimatedCosts: EstimatedCostModel[];
    estimatiedCostTotal: EstimatedCostModel[] = [];
    response: any;
    grndestimate: any;
    grndEstimate: any;

    constructor(
        private _formBuilder: FormBuilder,
        private globalValidation: GlobalValidationService,
        private dppObjectiveCostService: RdppObjectiveCostService,
        private dppMasterService: DppObjectiveCostService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private layoutHelperService: LayoutHelperService,
        private projectSummaryService: ProjectSummaryService,
        private modeFinanceService: ModeOfFinanceService,
        private modeFinanceConfigService: ModeOfFinanceConfigService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private snackbarHelper: SnackbarHelper,
        private fileUploadService: FileUploadCommonService,
        private developmentPartnerService: DevelopmentPartnerService,
        private currencyService: CurrencyService,
        private dppHelperService: DppProjectSummeryHelperService,
        private annxGoodService: DppAnnexureGoodsIiiAService,
        private sectorDivisionService: SectorDivisionService,
        private modeOfFinanceService: ModeOfFinanceService,
        private router: Router,
        private numberPipe: NumberPipe,
        private utilsService: UtilsService,
        private modalService: BsModalService,
        private userGroupService: UserGroupService,
        private dialog: MatDialog,
        private datePipeService: DatePipe,
    ) {
        super();
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    /*---------- When Component initialize this method called first ------------*/
    ngOnInit(): void {

        this.show = true;

        // Get Project Concept ID from parameter
        this.route.queryParams.subscribe(param => {
            this.conceptUuid = param['pcUuid'];
            this.proConceptUuid = param['pcUuid'];
            this.rdppMasterId = param['id'];
            this.isEnLabel = this._translateService.currentLang === 'en';
        });

        this.getProjectSummary();
        this.initValues();

        this.data.forEach(() => this.addRow());
        this.updateView();
        this.getEstimatedCosts(this.conceptUuid);

        /*----------  For autocomplete ------------*/
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.options.slice())
            );
        /*----------  /For autocomplete ------------*/
        // this.getPcModeOfFinanceList(this.pcId);
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userId = res.res.userId;
            this.getUserInfoByUserId(this.userId);
        })
    }

    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = (this.projectSummary?.isForeignAid == false && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ?
                res.agency.nameBn : res.agency.nameEn;
            this.ministry_name = (this.projectSummary?.isForeignAid == false && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ?
                res.agency.ministryDivision.nameBn : res.agency.ministryDivision.nameEn;
        })
    }

    private getAll() {
        this.subscribe$.add(
            this.developmentPartnerService.fetchActiveDevelopmentList().pipe(
                switchMap(dp => this.currencyService.getList().pipe(
                    switchMap(cl => this.modeFinanceConfigService.getActiveModOfFin("onlyActiveMoveFinData").pipe(
                        switchMap(mof => this.sectorDivisionService.getActiveSectorDivision().pipe(
                            map(sd => ({dp: dp, cl: cl, mof: mof, sd: sd}))
                        ))
                    ))
                ))
            ).subscribe(res => {
                this.developmentPartnersList = [];
                for (let i = 0; i < res.dp.length; i++) {
                    this.developmentPartnersList.push({
                        id: res.dp[i].id,
                        name: res.dp[i].developmentPartnerName,
                        nameBn: res.dp[i].developmentPartnerNameBng
                    });
                }
                for (let i = 0; i < res.cl.length; i++) {
                    this.currencyList.push({
                        id: res.cl[i].id,
                        name: res.cl[i].nameEn,
                        nameBn: res.cl[i].nameBn,
                        country: res.cl[i].country,
                        uuid: res.cl[i].uuid
                    });
                }
                for (let i = 0; i < res.mof.length; i++) {
                    this.modeFinanceTypeList.push(
                        {
                            id: res.mof[i].id,
                            name: res.mof[i].nameEn,
                            isEdited: res.mof[i].editable,
                            devPartner: '',
                            pa: 0,
                            rpa: 0
                        });
                }
                this.concernedDivisionList = res.sd;
                this.getObjectiveAndCostByProjectConceptId();
                this.getDppMasterData();
            })
        );
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }

    getDppMasterData() {
        this.dppMasterService.getByProjectConceptUuid(this.conceptUuid).subscribe(res => {
            this.originalCommencementDate = res.res.dateCommencement;
            this.originalCompletionDate = res.res.dateCompletion;
        })
    }

    /*----------  Get Project Concept By Id ------------*/
    private getObjectiveAndCostByProjectConceptId() {
        this.rows.clear();
        this.rowsForDev.clear();
        this.subscribe$.add(
            this.dppObjectiveCostService.getByProjectConceptUuidAndId(this.conceptUuid, this.rdppMasterId).subscribe((response: any) => {
                let res = response.res;
                this.currentRevisedVersion = this.isEnLabel ? res.revisedVersion : res.revisedVersionBn;

                this.sendTitleEn.emit({
                    titleEn: res.projectTitleEn
                });
                this.sendSubTitle.emit({
                    subTitle: (this.isEnLabel ? "Home > RDPP (": "হোম > আরডিপিপি (") + this.currentRevisedVersion + ")"
                });
                if (response.status > 0) {
                    this.show = false;
                    this.update = true;
                    this.model = res;
                    this.uuid = res.uuid;
                    this.dateList = res.objCostDates;
                    this.setCurrencyList(res.currencyRateList);
                    this.setValuePcIdAndPcUuid(res.id, res.uuid);
                    this.setDevelopmentPartnerList(res.developmentPartnersList);
                    this.setValueFromObjectiveCost(res);
                    this.getEstimateCostFromPCByUuid();
                    this.setValueForObjIdAndObjUuid(res.id, res.uuid);

                    if (res.modeFinanceList.length < 1) {
                        // this.projectSummaryService.getByUuid(this.proConceptUuid).subscribe(res => {
                        this.pcId = this.projectSummary.id;
                        // this.getModeFinanceByPcid(this.pcId);
                        this.getPcModeOfFinanceList(this.pcId);
                        // })
                    } else {
                        this.setModeFinanceDataFromObjectiveCost(res.modeFinanceList);
                    }

                } else {
                    this.update = false;
                    this.setProjectConceptData();
                    this.addRow();
                    this.addRowForDev();
                    this.show = false;
                }
            })
        );
    }

    private getPcModeOfFinanceList(pcId: number) {
        this.modeOfFinanceService.getModeOfFinanceListByProjectSummaryId(pcId).subscribe(res => {
            this.modeFinanceList = [];
            this.lockModeFinancingList = [];
            if (res.length > 0) {
                this.setModeFinanceListFromPcModeOfFinance(res);
                this.calculateModeFinanceTotal();
                this.show = false;
            } else {
                this.setEmptyModeFinanceList();
                this.calculateModeFinanceTotal();
                this.show = false;
            }

        });
    }

    private setModeFinanceListFromPcModeOfFinance(res: ModeOfFinanceModel[]) {
        this.modeNameList.forEach(e => {
            const modeType = this.modeFinanceTypeList.find(f => f?.name?.toLowerCase() === e?.nameEn?.toLowerCase());
            this.modeFinanceList.push({
                modeId: modeType.id,
                modeSource: (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? e.nameBn : e.nameEn,
                modeSourceVal: '',
                gob: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                gobFe: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                pa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                paRpa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                ownFund: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                ownFundFe: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                others: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                othersFe: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                paSources: '',
                isEdited: modeType.isEdited
            });
            this.lockModeFinancingList.push({
                modeId: modeType.id,
                pa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                paRpa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
                paSources: ''
            });
        });
    }

    private setEmptyModeFinanceList() {
        this.modeNameList.forEach(e => {
            const modeType = this.modeFinanceTypeList.find(f => f?.name?.toLowerCase() === e?.nameEn?.toLowerCase());
            this.modeFinanceList.push({
                modeId: modeType.id,
                modeSource: (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? e.nameBn : e.nameEn,
                modeSourceVal: '',
                gob: 0,
                gobFe: 0,
                pa: 0,
                paRpa: 0,
                ownFund: 0,
                ownFundFe: 0,
                others: 0,
                othersFe: 0,
                paSources: '',
                isEdited: modeType.isEdited
            });
            this.lockModeFinancingList.push({
                modeId: modeType.id,
                pa: 0,
                paRpa: 0,
                paSources: ''
            });
        });
    }

    /*----------  Set Mode Finance Data From Objective And Cost DB------------*/
    setModeFinanceDataFromObjectiveCost(res: any) {

        this.modeFinanceList = [];
        this.lockModeFinancingList = [];
        let editable = false;

        this.modeNameList.forEach(e => {
            const modeType = this.modeFinanceTypeList.find(f => f?.name?.toLowerCase() === e?.nameEn?.toLowerCase());
            const data = res.find(f => f.modeId === modeType.id);
            this.modeFinanceList.push({
                modeId: modeType.id,
                modeSource: (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? e.nameBn : e.nameEn,
                modeSourceVal: data.modeSourceVal ? data.modeSourceVal : '',
                gob: data.gob,
                gobFe: data.gobFe,
                pa: data.pa,
                paRpa: data.paRpa,
                ownFund: data.ownFund,
                ownFundFe: data.ownFundFe,
                others: data.others,
                othersFe: data.othersFe,
                paSources: data.paSources,
                isEdited: modeType.isEdited
            });
            this.lockModeFinancingList.push({
                modeId: modeType.id,
                pa: data.pa,
                paRpa: data.paRpa,
                paSources: data.paSources
            });
        });

        this.calculateModeFinanceTotal();
        this.show = false;
    }

    // getSectorDivisionList() {
    //     this.sectorDivisionService.getActiveSectorDivision().subscribe(res => {
    //         this.concernedDivisionList = res;
    //     });
    // }

    /*-----------Get Grand total amount from annexure 5B --------*/
    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.proConceptUuid).subscribe(res => {
            this.projectSummary = res;
            this.isForeignAid = res.isForeignAid;
            if(this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP'){
                this._translateService.use('bn');
                this.layoutHelperService.changeNavLanguage('bn');
            }else{
                this._translateService.use('en');
                this.layoutHelperService.changeNavLanguage('en');
            }

            this.getAll();
            this.getYearWiseEstimatiedCost();
            this.getUserGroup()
        })
    }

    private getYearWiseEstimatiedCost(){
        this.dppObjectiveCostService.getYearWiseEstimatedCosts(this.conceptUuid).subscribe(
            res =>{
                this.estimatiedCostTotal = res;
                let fiscalYears: any[] = [];
                let fiscalStart = parseInt(this.datePipeService.transform(res.find(f => f.revisedVersion == 'Original').dateCommencement, 'yyyy'));
                let fiscalEnd = parseInt(this.datePipeService.transform(res[res.length-1].dateCompletion, 'yyyy'));

                for (let i = fiscalStart; i <= fiscalEnd + 1; i++) {
                    let j = i;
                    let fy = j + '-' + (j + 1);
                    fiscalYears.push(fy);
                }

                /*if(res[0].grandTotal.length){
                    res[0].grandTotal.forEach(element => {
                        fiscalYears.push(element.fiscalYear);
                    });
                }else{
                    res[1].grandTotal.forEach(element => {
                        fiscalYears.push(element.fiscalYear);
                    });
                }*/

                fiscalYears.forEach(fYear =>{
                    res.forEach((yearTotal)=>{
                        if(yearTotal?.grandTotal.length>0){
                            let result = yearTotal.grandTotal.find(data => data.fiscalYear == fYear);
                            if(!result)
                                yearTotal.grandTotal.push({fiscalYear:fYear});
                        }
                    });
                });


                if (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {

                    if (fiscalYears.length > 0) {
                        this.fiscalYearsList = [];

                        fiscalYears.forEach(fYear =>{

                            res.forEach((yearTotal, index)=>{
                                if(yearTotal?.grandTotal.length>0){

                                    yearTotal?.grandTotal.forEach(totalData => {
                                        if(fYear==totalData.fiscalYear){
                                            let obj: any = this.setBanglaValue(totalData?.dppAnnualPhasingCostTotal);
                                            obj.fiscalYear = this.numberPipe.convertToBanglaNumber(fYear);
                                            obj.revisedVersion = this.convertRevisedVersion(yearTotal?.revisedVersion);
                                            this.fiscalYearsList.push(obj);
                                        }
                                    });
                                }else{

                                    let obj: any  = this.setBanglaValue(null);
                                    obj.fiscalYear = this.numberPipe.convertToBanglaNumber(fYear);
                                    obj.revisedVersion = this.convertRevisedVersion(yearTotal?.revisedVersion);
                                    this.fiscalYearsList.push(obj)
                                }

                                this.estimatiedCostTotal[index].costTotal = this.setBanglaValue(yearTotal?.dppAnnualPhasingCostTotal[0]);
                                this.estimatiedCostTotal[index].costTotal.revisedVersion = this.convertRevisedVersion(yearTotal?.revisedVersion);
                            })
                        })
                    }
                } else {

                    if (fiscalYears.length > 0) {
                        this.fiscalYearsList = [];

                        fiscalYears.forEach(fYear =>{

                            res.forEach((yearTotal, index)=>{
                                if(yearTotal?.grandTotal.length>0){
                                    yearTotal?.grandTotal.forEach(totalData => {
                                        if(fYear==totalData.fiscalYear){

                                            let obj: any = this.setValue(totalData?.dppAnnualPhasingCostTotal);
                                            obj.fiscalYear = fYear;
                                            obj.revisedVersion = yearTotal?.revisedVersion;
                                            this.fiscalYearsList.push(obj);
                                        }
                                    });
                                }else{

                                    let obj: any  = this.setValue(null);
                                    obj.fiscalYear = fYear;
                                    obj.revisedVersion = yearTotal?.revisedVersion;
                                    this.fiscalYearsList.push(obj)
                                }

                                this.estimatiedCostTotal[index].costTotal = this.setValue(yearTotal?.dppAnnualPhasingCostTotal[0]);
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

    private convertRevisedVersion(version: string): string{
        let bnVersion = '';
        switch(version) {
            case 'Original':
                bnVersion ='মূল';
                break;
            case '1st Revised':
                bnVersion ='১ম সংশোধিত';
                break;
            case '2nd Revised':
                bnVersion ='২য় সংশোধিত';
                break;
            case '3rd Revised':
                bnVersion ='৩য় সংশোধিত';
                break;
            case '4th Revised':
                bnVersion = '৪র্থ  সংশোধিত';
                break;
            case '5th Revised':
                bnVersion = '৫ম সংশোধিত';
                break;
            case '6th Revised':
                bnVersion = '৬ষ্ঠ সংশোধিত';
                break;
            case '7th Revised':
                bnVersion = '৭ম সংশোধিত';
                break;
            case '8th Revised':
                bnVersion = '৮ম সংশোধিত';
                break;
            case '9th Revised':
                bnVersion = '৯ম সংশোধিত';
                break;
            case '10th Revised':
                bnVersion = '১০ম সংশোধিত';
                break;
            default:
                bnVersion = version;
                break;
        }
        return bnVersion;
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

    private setBanglaValue(data){
        return {
            gobAmount: this.numberPipe.convertToBanglaNumber(data? data.gobAmount.toFixed(2):'0.00'),
            gobFeAmount: this.numberPipe.convertToBanglaNumber(data? data.gobFeAmount.toFixed(2):'0.00'),
            rpaAmount: this.numberPipe.convertToBanglaNumber(data? (data.gobThruAmount + data.spAcAmount).toFixed(2):'0.00'),
            dpaAmount: this.numberPipe.convertToBanglaNumber(data? (data.thruPdAmount + data.thruDpAmount).toFixed(2):'0.00'),
            ownFundAmount: this.numberPipe.convertToBanglaNumber(data? data.ownFundAmount.toFixed(2):'0.00'),
            ownFundFeAmount: this.numberPipe.convertToBanglaNumber(data? data.ownFundFeAmount.toFixed(2):'0.00'),
            otherAmount: this.numberPipe.convertToBanglaNumber(data? data.otherAmount.toFixed(2):'0.00'),
            otherFeAmount: this.numberPipe.convertToBanglaNumber(data? data.otherFeAmount.toFixed(2):'0.00'),
            totalAmount: this.numberPipe.convertToBanglaNumber(data? data.totalAmount.toFixed(2):'0.00'),
        }
    }

    /*----------  Set value from Objective and Cost DB ------------*/
    setValueFromObjectiveCost(res: any) {
        this.frmGroup.patchValue({
            projectTitleEn: res.projectTitleEn,
            projectTitleBn: res.projectTitleBn,
            ministryDivision: res.ministryDivision,
            implementingAgency: res.implementingAgency,
            dateCommencement: res.revisedVersion ? res.cumulativeDate : res.dateCommencement,
            dateCompletion: res.dateCompletion,
            objectivesTargets: res.objectivesTargets,
            concernedDivisionId: res.concernedDivisionId,
            revisedVersion: res.revisedVersion,
        });
        this.setMaxAndMinDateLimation(res.dateCommencement, res.dateCompletion);
    }

    /*----------  Download Attachment ------------*/
    download(index: any) {
        this.spinner = true;
        this.fileUploadService.getById(this.developmentPartnerModelList[index].attachmentId, environment.ibcs.ppsDppBackendPoint).subscribe(res => {
            this.fileUploadService.download(res.pathUrl, environment.ibcs.ppsDppBackendPoint);
            this.spinner = false;
        });
    }

    /*----------  Upload Attachment ------------*/
    uploadFile(file: FileList, index): any {
        this.file = file.item(0);
        this.spinner = true;
        this.fileUploadService.upload(this.file, environment.ibcs.ppsDppBackendPoint).subscribe(res => {
            if (this.canUpdate) {
                // this.modelList[index] = this.form.value.justification[index];
                // this.modelList[index].attachmentId = res.id;
                // this.updateAttachment = true;
            } else {
                this.attachmentModalListModel.push({
                    indx: index,
                    isDelete: false,
                    attachmentId: res.id,
                });
                // this.attachmentEnable = true;
            }
            this.spinner = false;

        }, err => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }

    /*----------  Set Value From Project Concept ------------*/
    setValueFromProjectConcept(res: any) {
        this.pcId = res.id;
        this.frmGroup.patchValue({
            projectTitleEn: res.projectTitleEn,
            projectTitleBn: res.projectTitleBn,
            ministryDivision: res.ministryDivision,
            implementingAgency: res.implementingAgency,
            dateCommencement: res.expCommencementDate,
            dateCompletion: res.expCompletionDate,
            // concernedDivisionId: res.
        });

        this.setMaxAndMinDateLimation(res.expCommencementDate, res.expCompletionDate);

        this.setEstimateCostData(res);
    }

    /*----------  Set Estimate Cost From Project Concept ------------*/
    setEstimateCostData(res: any) {
        this.gob = res.gobAmount;
        this.feGob = res.feGobAmount;
        this.rpa = res.rpaAmount;
        this.pa = res.paAmount;
        this.feOwnFund = res.feOwnFundAmount;
        this.ownFund = res.ownFundAmount;
        this.other = res.otherAmount;
        this.feOther = res.feOtherAmount;
        this.total = res.totalAmount;
    }

    /*----------  Set Development Partner List From Objective And Cost DB------------*/
    setDevelopmentPartnerList(res: any) {
        let i = 0;
        if (res.length > 0) {
            this.developmentPartnerModelList = [];

            res.forEach(re => {

                const row = this._formBuilder.group({
                    uuid: re.uuid,
                    devPartnerId: re.devPartnerId,
                    modeFinance: re.modeFinanceId,
                    gobThruAmount: re.gobThruAmount,
                    spAcAmount: re.spAcAmount,
                    thruPdAmount: re.thruPdAmount,
                    thruDpAmount: re.thruDpAmount,
                    attachmentId: re.attachmentId,
                });

                this.rowsForDev.push(row);
                this.updateViewForDev();
                this.developmentPartnerModelList.push(re);

                if (re.attachmentId) {
                    this.attachmentModalListModel.push({
                        indx: i,
                        isDelete: false,
                        attachmentId: re.attachmentId,
                    });
                }
                i++;
            });
        } else {
            this.addRowForDev();
        }
    }

    /*----------  Set Currency List From Objective And Cost DB------------*/
    setCurrencyList(res: any) {
        if (res.length > 0) {
            this.currencyModel = [];
            res.forEach(re => {
                const row = this._formBuilder.group({
                    exchangeRate: re.exchangeRate,
                    exchangeCurrency: Number(re.exchangeCurrency),
                    exchangeDate: this.getDateValue(re.exchangeDate),
                });
                this.rows.push(row);
                this.updateView();
                this.currencyModel.push(re);
            });
        } else {
            this.addRow();
        }
    }

    /*----------  Set Mode Finance, Loan Credit Data From Objective And Cost DB------------*/
    setLoanCreditFromObjCost(res: any) {
        this.frmGroup.patchValue({
            modeSource: res.modeSource,
            modeSourceVal: res.modeSourceVal,
            loanGob: res.gob,
            loanGobFe: res.gobFe,
            loanPa: res.pa,
            loanPaRpa: res.rpa,
            loanOwnFund: res.ownFund,
            loanOwnFundFe: res.ownFundFe,
            loanOthers: res.others,
            loanOthersFe: res.othersFe,
            loanPaSources: res.paSources
        });
    }

    /*----------  Set Mode Finance, Grant Data From Objective And Cost DB------------*/
    setGrantFromObjCost(res: any) {
        this.frmGroup.patchValue({
            modeSource: res.modeSource,
            modeSourceVal: res.modeSourceVal,
            grantGob: res.gob,
            grantGobFe: res.gobFe,
            grantPa: res.pa,
            grantPaRpa: res.rpa,
            grantOwnFund: res.ownFund,
            grantOwnFundFe: res.ownFundFe,
            grantOthers: res.others,
            grantOthersFe: res.othersFe,
            grantPaSources: res.paSources
        });
    }

    /*----------  Set Mode Finance, Equity Data From Objective And Cost DB------------*/
    setEquityFromObjCost(res: any) {
        this.frmGroup.patchValue({
            modeSource: res.modeSource,
            modeSourceVal: res.modeSourceVal,
            equityGob: res.gob,
            equityGobFe: res.gobFe,
            equityPa: res.pa,
            equityPaRpa: res.rpa,
            equityOwnFund: res.ownFund,
            equityOwnFundFe: res.ownFundFe,
            equityOthers: res.others,
            equityOthersFe: res.othersFe,
            equityPaSources: res.paSources
        });
    }

    /*----------  Set Mode Finance, Others Specify Data From Objective And Cost DB------------*/
    setOthersSpecifyFromObjCost(res: any) {
        this.frmGroup.patchValue({
            modeSource: res.modeSource,
            modeSourceVal: res.modeSourceVal,
            specifyGob: res.gob,
            specifyGobFe: res.gobFe,
            specifyPa: res.pa,
            specifyPaRpa: res.rpa,
            specifyOwnFund: res.ownFund,
            specifyOwnFundFe: res.ownFundFe,
            specifyOthers: res.others,
            specifyOthersFe: res.othersFe,
            specifyPaSources: res.paSources
        });
    }

    /*----------  Set Always updated data for further use or another tab ------------*/
    setValuePcIdAndPcUuid(id: number, uuid: string) {
        this.dppHelperService.projectSummaryCreateId = id;
        this.dppHelperService.projectSummaryUuid = uuid;
    }

    /*----------  Get Project Concept by UUID ------------*/
    private setProjectConceptData() {
        // this.subscribe$.add(
        //     this.projectSummaryService.getByUuid(this.proConceptUuid).subscribe(res => {
        this.pcId = this.projectSummary.id;
        this.frmGroup.patchValue({
            projectTitleEn: this.projectSummary.titleEn,
            projectTitleBn: this.projectSummary.titleBn,
            ministryDivision: this.ministry_name,
            implementingAgency: this.agency_name,
            dateCommencement: this.projectSummary.expCommencementDate,
            dateCompletion: this.projectSummary.expCompletionDate,
            concernedDivisionId: this.projectSummary.sectorDivisionId,
        });

        this.setMaxAndMinDateLimation(this.projectSummary.expCommencementDate, this.projectSummary.expCompletionDate);

        this.setEstimateCostData(this.projectSummary);
        // this.getModeFinanceByPcid(this.projectSummary.id);
        this.getPcModeOfFinanceList(this.pcId);
        this.setValuePcIdAndPcUuid(this.projectSummary.id, this.projectSummary.uuid);
        //     })
        // );
    }

    /*----------  Get Project Concept by UUID ------------*/
    private getEstimateCostFromPCByUuid() {
        // this.subscribe$.add(
        // this.projectSummaryService.getByUuid(this.proConceptUuid).subscribe(res => {
        this.setEstimateCostData(this.projectSummary);
        this.setValuePcIdAndPcUuid(this.projectSummary.id, this.projectSummary.uuid);
        // })
        // );
    }

    // Get mode finance type from config
    // private getConfigModeList() {
    //     this.subscribe$.add(
    //         this.modeFinanceConfigService.getActiveModOfFin("onlyActiveMoveFinData").subscribe(res => {
    //             this.modeFinanceTypeList = [];
    //             for (let i = 0; i < res.length; i++) {
    //                 this.modeFinanceTypeList.push(
    //                     {
    //                         id: res[i].id,
    //                         name: res[i].nameEn,
    //                         isEdited: res[i].editable,
    //                         devPartner: '',
    //                         pa: 0,
    //                         rpa: 0
    //                     });
    //             }
    //         })
    //     );
    // }

    // Set Gob Data
    setGobData(event: any, indx: number) {
        this.modeFinanceList[indx].gob = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set GobFe Data
    setGobFeData(event: any, indx: number) {
        this.modeFinanceList[indx].gobFe = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set PA Data
    setPaData(event: any, indx: number) {
        this.modeFinanceList[indx].pa = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set paRpa Data
    setRpaData(event: any, indx: number) {
        this.modeFinanceList[indx].paRpa = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set ownFund Data
    setOwnFundData(event: any, indx: number) {
        this.modeFinanceList[indx].ownFund = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set ownFundFe Data
    setOwnFundFeData(event: any, indx: number) {
        this.modeFinanceList[indx].ownFundFe = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set others Data
    setOthersData(event: any, indx: number) {
        this.modeFinanceList[indx].others = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set othersFe Data
    setOthersFeData(event: any, indx: number) {
        this.modeFinanceList[indx].othersFe = Number(event.target.value);
        this.calculateModeFinanceTotal();
    }

    // Set paSources Data
    setPaSourcesData(event: any, indx: number) {
        this.modeFinanceList[indx].paSources = event.target.value;
        this.calculateModeFinanceTotal();
    }

    // Set modeSourceVal Data
    setModeSourceValData(event: any, indx: number) {
        this.modeFinanceList[indx].modeSourceVal = event.target.value;
    }

    // Get mode finance data from Project Concept
    /*private getModeFinanceByPcid(id) {

        this.subscribe$.add(
            this.modeFinanceService.getModeOfFinanceListByProjectSummary(id, this.page, this.size).subscribe(res => {
                this.modeFinancingList = [];


                for (let i = 0; i < res.content.length; i++) {

                    let modeName = '';
                    let isEdit = false;

                    for (let j = 0; j < this.modeFinanceTypeList.length; j++) {
                        if (res.content[i].modeId == this.modeFinanceTypeList[j].id) {
                            modeName = this.modeFinanceTypeList[j].name;
                            isEdit = this.modeFinanceTypeList[j].isEdited;
                            break;
                        }
                    }

                    this.modeFinancingList.push({
                        modeSource: modeName,
                        modeSourceVal: 0,
                        gob: res.content[i].gobAmount,
                        gobFe: res.content[i].feGobAmount,
                        pa: res.content[i].paAmount,
                        paRpa: res.content[i].rpaAmount,
                        ownFund: res.content[i].ownFundAmount,
                        ownFundFe: res.content[i].feOwnFundAmount,
                        others: res.content[i].otherAmount,
                        othersFe: res.content[i].feOtherAmount,
                        paSources: '',
                        isEdited: isEdit
                    });
                }

                this.calculateModeFinanceTotal();
                this.show = false;
            })
        );
    }*/

    /**
     *---------- Mode Finance Calculation ------------
     */
    calculateModeFinanceTotal() {
        let grandGob = 0;
        let grandGobFe = 0;
        let grandPa = 0;
        let grandPaRpa = 0;
        let grandOwnFund = 0;
        let grandOwnFundFe = 0;
        let grandOthers = 0;
        let grandOthersFe = 0;
        for (let i = 0; i < this.modeFinanceList.length; i++) {
            grandGob += this.modeFinanceList[i].gob;
            grandGobFe += this.modeFinanceList[i].gobFe;
            grandPa += this.modeFinanceList[i].pa;
            grandPaRpa += this.modeFinanceList[i].paRpa;
            grandOwnFund += this.modeFinanceList[i].ownFund;
            grandOwnFundFe += this.modeFinanceList[i].ownFundFe;
            grandOthers += this.modeFinanceList[i].others;
            grandOthersFe += this.modeFinanceList[i].othersFe;
        }
        this.grandGob = grandGob;
        this.grandGobFe = grandGobFe;
        this.grandPa = grandPa;
        this.grandPaRpa = grandPaRpa;
        this.grandOwnFund = grandOwnFund;
        this.grandOwnFundFe = grandOwnFundFe;
        this.grandOthers = grandOthers;
        this.grandOthersFe = grandOthersFe;
    }

    /*---------- Initial FormGroup ------------*/
    initValues() {
        this.frmGroup = this._formBuilder.group({

            ProjectTitle_1_value: 'ProjectTitle_1_value | translat',

            projectTitleBn: [''],
            projectTitleEn: ['',
                [
                    this.globalValidation.trimValidator("This ")
                ]
            ],
            ministryDivision: [this.ministry_name],
            implementingAgency: [this.agency_name],
            concernedDivisionId: ['', [this.globalValidation.trimValidator("This field")]],
            developmentPartnerId: [''],
            dateCommencement: ['', [this.globalValidation.trimValidator("This field")]],
            dateCompletion: ['', [this.globalValidation.trimValidator("This field")]],
            objectivesTargets: [''],
            // employeeName: ['',
            //     [
            //         Validators.required,
            //         Validators.minLength(11),
            //         Validators.maxLength(11)
            //     ]
            // ],
            loanGob: [''],
            loanGobFe: [''],
            loanPa: [''],
            loanPaRpa: [''],
            loanOwnFund: [''],
            loanOwnFundFe: [''],
            loanOthers: [''],
            loanOthersFe: [''],
            loanPaSources: [''],
            grantGob: [''],
            grantGobFe: [''],
            grantPa: [''],
            grantPaRpa: [''],
            grantOwnFund: [''],
            grantOwnFundFe: [''],
            grantOthers: [''],
            grantOthersFe: [''],
            grantPaSources: [''],
            equityGob: [''],
            equityGobFe: [''],
            equityPa: [''],
            equityPaRpa: [''],
            equityOwnFund: [''],
            equityOwnFundFe: [''],
            equityOthers: [''],
            equityOthersFe: [''],
            equityPaSources: [''],
            specifyModeSourceVal: [''],
            specifyGob: [''],
            specifyGobFe: [''],
            specifyPa: [''],
            specifyPaRpa: [''],
            specifyOwnFund: [''],
            specifyOwnFundFe: [''],
            specifyOthers: [''],
            specifyOthersFe: [''],
            specifyPaSources: [''],
            grandGob: [''],
            grandGobFe: [''],
            grandPa: [''],
            grandPaRpa: [''],
            grandOwnFund: [''],
            grandOwnFundFe: [''],
            grandOthers: [''],
            grandOthersFe: [''],
            grandPaSources: [''],
            revisedVersion: ['']

        });
        // this.show = false;
    }

    /*----------  For Exchange addRow ------------*/
    addRow(): any {
        const row = this._formBuilder.group({
            exchangeRate: [''],
            exchangeCurrency: '',
            exchangeDate: '',
        });
        this.rows.push(row);
        this.updateView();
    }

    /*---------- Delete Row for Development Partner Table ------------*/
    emptyTable(index): any {
        if (this.attachmentModalListModel.length > 0) {
            for (let j = 0; j < this.attachmentModalListModel.length; j++) {
                if (this.attachmentModalListModel[j].indx === index) {
                    this.attachmentModalListModel[j].isDelete = true;
                }
            }
        }
        if (this.rowsForDev.length === 1) {
            this.developmentPartnerModelList.splice(index);
            this.rowsForDev.reset();
            return false;
        } else {
            this.rowsForDev.removeAt(index);
            this.updateViewForDev();
            this.developmentPartnerModelList.splice(index);
            return true;
        }
    }

    /*----Delete confirmation dialog box----*/
    deleteDevelopmentPartners(rowIndex) {

        let rowId = this.rowsForDev.value[rowIndex];

        /*----Delete record from the database table----*/
        if (rowId.uuid != null) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = false;
            dialogConfig.autoFocus = false;
            dialogConfig.width = ConfirmDialogConstant.WIDTH;
            dialogConfig.height = ConfirmDialogConstant.HEIGHT;
            dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
            dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
            const dialogRef = this.matDialog.open(
                SubmitConfirmationDialogComponent,
                dialogConfig
            );
            dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
                if (res) {
                    this.delete(rowId.uuid, rowIndex);
                }
                dialogRef.close(true);
            });
        } else {
            this.rowsForDev.removeAt(rowIndex);
            this.updateViewForDev();
            this.developmentPartnerModelList.splice(rowIndex);
            return true;
        }
    }

    delete(rowUuid, rowIndex) {
        this.spinner = true;
        this.dppObjectiveCostService.deleteDevelopmentPartnersRow(rowUuid).subscribe((res: any) => {
            if (res.status == 1) {
                this.snackbarHelper.openSuccessSnackBarWithMessage(
                    res.message,
                    'Ok'
                );
                this.emptyTable(rowIndex);
                //this.developmentPartnerModelList.splice(rowIndex, 1);
                return true;
            }
            this.spinner = false;
        });
    }

    /*---------- Add Row For Development Partner ------------*/
    addRowForDev(): any {
        const row = this._formBuilder.group({
            uuid: [],
            devPartnerId: ['', Validators.required],
            modeFinance: ['', Validators.required],
            gobThruAmount: '',
            spAcAmount: '',
            thruPdAmount: '',
            thruDpAmount: '',
            attachmentId: '',
        });
        this.rowsForDev.push(row);
        this.updateViewForDev();
    }

    /*----------  For Exchange updateRow ------------*/
    updateView(): any {
        this.exchangeDataSource.next(this.rows.controls);
    }

    /*----------  For Development Partner updateRow ------------*/
    updateViewForDev(): any {
        this.developmentPartnerDataSource.next(this.rowsForDev.controls);
    }

    /*----------  For Exchange deleteRow ------------*/
    deleteRow(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            return true;
        }
    }

    /*----------  For autocomplete ------------*/
    displayFn(user: User): string {
        return user && user.name ? user.name : '';
    }

    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    setExchangeDate($event, index, fieldName) {

    }

    /*----------  /For autocomplete ------------*/

    getDateValue(dataVal) {
        if (dataVal != "" && dataVal != null && dataVal != "0000-00-00") {
            return moment(dataVal).format('YYYY-MM-DD');
        } else {
            return "0000-00-00";
        }

    }

    navigateToList(nextVal) {
        if (nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if (nextVal == 'list') {
            this.router.navigate(['rdpp-rtapp']);
        }
        // if(next == 'back')
        // {
        //     this.backPrevious.emit(true);
        // }
    }

    /*---------- For DB Save ------------*/
    onSubmit(nextVal) {
        if (this.frmGroup.valid) {
            this.saveData(nextVal);
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fillup all required field", "Ok");
        }
    }

    saveData(next) {
        this.spinner = true;
        this.setDataInCurrencyModal();
        this.model.projectTitleEn = this.frmGroup.value.projectTitleEn;
        this.model.projectTitleBn = this.frmGroup.value.projectTitleBn;

        this.model.ministryDivision = this.frmGroup.value.ministryDivision;
        this.model.implementingAgency = this.frmGroup.value.implementingAgency;
        this.model.concernedDivisionId = this.frmGroup.value.concernedDivisionId;
        this.model.developmentPartnerId = this.frmGroup.value.developmentPartnerId;
        this.model.objectivesTargets = this.frmGroup.value.objectivesTargets;
        this.model.dateCommencement = this.getDateValue(this.frmGroup.value.dateCommencement);
        this.model.dateCompletion = this.getDateValue(this.frmGroup.value.dateCompletion);

        this.model.projectConceptUuid = this.conceptUuid;
        this.model.projectConceptMasterId = this.dppHelperService.projectSummaryCreateId;
        this.model.uuid = this.uuid;
        this.model.revisedVersion = this.frmGroup.value.revisedVersion;
        this.currencyModelStore.clear();
        this.currencyModel.forEach(re => {
            if (re.exchangeCurrency > 0 && re.exchangeRate > 0 && re.exchangeDate != "0000-00-00") {
                const row = this._formBuilder.group({
                    exchangeRate: re.exchangeRate,
                    exchangeCurrency: Number(re.exchangeCurrency),
                    exchangeDate: this.getDateValue(re.exchangeDate),
                });
                this.currencyModelStore.push(row);
            }
        });

        if (this.update) {
            this.spinner = true;
            this.dppObjectiveCostService.updateObjectiveCost(this.model, this.modeFinanceList, this.currencyModelStore.value, this.developmentPartnerModelList).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.setValueForObjIdAndObjUuid(res.id, res.uuid);
                    this.getObjectiveAndCostByProjectConceptId();
                    this.navigateToList(next);
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            });
        } else {
            this.spinner = true;
            this.dppObjectiveCostService.createObjectiveCost(this.model, this.modeFinanceList, this.currencyModel, this.developmentPartnerModelList).subscribe(res => {
                if (res.uuid) {
                    this.setValueForObjIdAndObjUuid(res.id, res.uuid);
                    this.snackbarHelper.openSuccessSnackBar();
                    this.navigateToList(next);
                    this.getObjectiveAndCostByProjectConceptId();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            });
        }
    }

    /*---------- After Save update the id for using this id in another tab ------------*/
    setValueForObjIdAndObjUuid(id: number, uuid: string) {
        this.dppHelperService.objectiveCostCreateId = id;
        this.dppHelperService.objectiveCostUuid = uuid;
    }

    /*---------- Set Data In Currency Model for ready to save ------------*/
    setDataInCurrencyModal() {
        this.currencyModel = [];
        this.rows.getRawValue().forEach(e => {
            this.currencyModel.push(e);
        });
    }

    /*---------- Set Data In Development Partner for ready to save ------------*/
    setDataInDevelopmentPartnerModal(calculate: boolean) {
        this.developmentPartnerModelList = [];
        for (let i = 0; i < this.rowsForDev.getRawValue().length; i++) {
            let attachmentId;
            if (this.attachmentModalListModel.length > 0) {
                for (let j = 0; j < this.attachmentModalListModel.length; j++) {
                    if (this.attachmentModalListModel[j].indx === i && this.attachmentModalListModel[j].isDelete === false) {
                        attachmentId = this.attachmentModalListModel[j].attachmentId;
                        break;
                    } else {
                        attachmentId = '';
                    }
                }
            }
            this.developmentPartnerModelList.push({
                devPartnerId: this.formDev.value.devPartner[i].devPartnerId,
                modeFinanceId: this.formDev.value.devPartner[i].modeFinance,
                gobThruAmount: Number(this.formDev.value.devPartner[i].gobThruAmount),
                spAcAmount: Number(this.formDev.value.devPartner[i].spAcAmount),
                thruPdAmount: Number(this.formDev.value.devPartner[i].thruPdAmount),
                thruDpAmount: Number(this.formDev.value.devPartner[i].thruDpAmount),
                uuid: '',
                attachmentId: attachmentId
            });
            if ((i === (this.rowsForDev.getRawValue().length - 1)) && calculate) {
                this.calculateDevPartner();
            }
        }

        // this.calculateDevPartner();
    }


    // calculateDevPartner(row: any, indx: number) {
    calculateDevPartner() {

        for (let i = 0; i < this.modeFinanceList.length; i++) {
            const devPartner = this.developmentPartnerModelList.filter(f => f.modeFinanceId === this.modeFinanceList[i].modeId);
            if (devPartner.length > 0) {
                this.modeFinanceList[i].pa = 0;
                this.modeFinanceList[i].paRpa = 0;
                const gobThruAmount = devPartner.reduce((sum, current) => sum + Number(current.gobThruAmount), 0);
                const spAcAmount = devPartner.reduce((sum, current) => sum + Number(current.spAcAmount), 0);
                const thruPdAmount = devPartner.reduce((sum, current) => sum + Number(current.thruPdAmount), 0);
                const thruDpAmount = devPartner.reduce((sum, current) => sum + Number(current.thruDpAmount), 0);
                this.modeFinanceList[i].pa = this.lockModeFinancingList[i].pa + gobThruAmount + spAcAmount + thruPdAmount + thruDpAmount;
                this.modeFinanceList[i].paRpa = this.lockModeFinancingList[i].paRpa + gobThruAmount + spAcAmount;
                this.modeFinanceList[i].paSources = (this.lockModeFinancingList[i].paSources ? this.lockModeFinancingList[i].paSources : '') +
                    devPartner.map(m => this.developmentPartnersList.find(f => f.id === m.devPartnerId).name + ', ');
            }

            if (i === (this.modeFinanceList.length - 1)) {
                this.calculateModeFinanceTotal();
            }
        }
    }


    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    /**
     * CK Editor expand Collapse
     */
    expand() {
        this.isShowObjectivesAndTargets = true;
    }

    collapse() {
        this.isShowObjectivesAndTargets = false;
    }

    setMaxAndMinDateLimation(dateCommencement, dateCompletion) {
        const fromDateVal = new Date(dateCommencement);
        const toDateVal = new Date(dateCompletion);

        this.maxDateValue = new Date(toDateVal.getFullYear(), toDateVal.getMonth(), toDateVal.getDate())
        this.minDateValue = new Date(fromDateVal.getFullYear(), fromDateVal.getMonth(), fromDateVal.getDate())
    }

    // set Completion Min Date
    setMinDateValue($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.minDateValue = new Date(value.getFullYear(), value.getMonth(), value.getDate())
    }

    // set Commencement Max Date
    setMaxDateValue($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.maxDateValue = new Date(value.getFullYear(), value.getMonth(), value.getDate())
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    private getEstimatedCosts(conceptUuid: string) {
        this.dppObjectiveCostService.getEstimatedCosts(conceptUuid).subscribe(
            res => {
                this.estimatedCosts = res;
                this.grndEstimate = res[res.length-1];
                let arrSize: number = this.estimatedCosts.length;

                let differenceEstimatedCostInTaka: EstimatedCostModel = new EstimatedCostModel();
                let differenceEstimatedPercentage: EstimatedCostModel = new EstimatedCostModel();

                let keys: string[] = ['paAmount', 'otherFeAmount', 'otherAmount', 'ownFundFeAmount', 'ownFundAmount',
                    'thruDpAmount', 'thruPdAmount', 'spAcAmount', 'gobThruAmount', 'gobFeAmount',
                    'gobAmount', 'totalAmount'];

                keys.map(key => {
                    differenceEstimatedCostInTaka[key] = Math.abs(this.estimatedCosts[arrSize - 1][key] - this.estimatedCosts[arrSize - 2][key]).toFixed(2);
                    differenceEstimatedPercentage[key] = (((differenceEstimatedCostInTaka [key] /
                        this.estimatedCosts[0][key]) * 100).toFixed(2));

                    differenceEstimatedPercentage[key] = differenceEstimatedPercentage[key] === 'NaN' ||
                    differenceEstimatedPercentage[key] === 'Infinity' ? '0.00' : differenceEstimatedPercentage[key];
                })
                differenceEstimatedCostInTaka.revisedVersion = "Difference (" +
                    this.estimatedCosts[arrSize - 1].revisedVersion + " - "
                    + this.estimatedCosts[arrSize - 2].revisedVersion + ")";

                this.estimatedCosts.push(differenceEstimatedCostInTaka, differenceEstimatedPercentage);
                console.log('estimatedCosts',this.estimatedCosts);
            },
            err => {
                this.estimatedCosts = [];
            }
        )
    }

    convertToNumber(number: any) {
        return Number(number);
    }

    reduceElements(estimatedCosts: EstimatedCostModel[]): EstimatedCostModel[] {
        return estimatedCosts?.splice(estimatedCosts.length - 2, 2);
    }

    private navigateToAnnualPhasingCost(){
        this.router.navigate(['/rdpp-rtapp/add-new-annual-phasing-cost'],{ queryParams: {pcUuid: this.proConceptUuid, id: this.rdppMasterId}});
    }

}
