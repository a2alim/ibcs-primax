import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../../project-summary/tab-forms/object-and-cost/object-and-cost.component';
import {map, startWith} from 'rxjs/operators';
import {TappObjectiveCostModel} from '../../../../../models/tappObjectiveCost.model';
import {TappObjectiveCostService} from '../../../../../services/tapp-objective-cost.service';
import {GlobalValidationService} from 'app/global/validation/global-validation.service';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from "moment";
import {TappCurrencyRateModel} from 'app/main/modules/dpp-tapp-management/models/tappCurrencyRate.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UnsubscribeAdapterComponent} from 'app/main/core/helper/unsubscribeAdapter';
import {CurrencyService} from 'app/main/modules/configuration-management/services/currency.service';
import {ProjectSummaryService} from 'app/main/modules/project-concept-management/services/project-summary.service';
import {TappAnnexureGoodsService} from 'app/main/modules/dpp-tapp-management/services/tapp-annexure/tapp-annexure-goods.service';
import {SectorDivisionService} from 'app/main/modules/configuration-management/services/sector-division.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {DevelopmentPartnerService} from 'app/main/modules/configuration-management/services/developmentPartnerService.service';
import {ModeOfFinanceConfigService} from 'app/main/modules/configuration-management/services/mode-of-finance.service';
import {FileUploadCommonService} from 'app/main/core/services/file-upload-common.service';
import {environment} from 'environments/environment';
import {TappProjectSummeryHelperService} from '../../../../../services/tapp-project-summery-helper.service';
import { UtilsService } from 'app/main/core/services/utils.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";
import {
    FAILED_SAVE,
    FAILED_SAVE_BN,
    REQUIRED_FIELD_BN,
    REQUIRED_FIELD_EN,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN
} from "../../../../../../../core/constants/message";
import { Validators } from '@angular/forms';
import {SectorModel} from "../../../../../../configuration-management/models/sector.model";
import {SubSectorModel} from "../../../../../../configuration-management/models/sub-sector.model";
import {SectorService} from "../../../../../../configuration-management/services/sector.service";
import {SubSectorService} from "../../../../../../configuration-management/services/sub-sector.service";
import {AgencyService} from "../../../../../../configuration-management/services/agency.service";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {ModeOfFinanceModel} from "../../../../../../project-concept-management/models/mode-of-finance.model";
import {ModeOfFinanceService} from "../../../../../../project-concept-management/services/mode-of-finance.service";

/*----/Lng Translation----*/
@Component({
    selector: 'app-tpp-objectives-and-cost',
    templateUrl: './tpp-objectives-and-cost.component.html',
    styleUrls: ['./tpp-objectives-and-cost.component.scss']
})
export class TppObjectivesAndCostComponent extends UnsubscribeAdapterComponent implements OnInit {

    maxDateValue: Date;
    minDateValue: Date;
    data = [];
    update: boolean;

    @Output() nextStep = new EventEmitter<boolean>();
    frmGroup: FormGroup;
    model: TappObjectiveCostModel = new TappObjectiveCostModel();
    exchangeDataSource2 = new BehaviorSubject<AbstractControl[]>([]);
    currencyModel: TappCurrencyRateModel[] = new Array<TappCurrencyRateModel>();
    currencyModelStore: FormArray = this._formBuilder.array([]);

    displayColumns = ['sl', 'exchangeCurrency', 'exchangeRate', 'exchangeDate', 'action'];
    currencyList: Array<{ id: number, name: string, nameBn, country: string, uuid: string }> = [];
    rows: FormArray = this._formBuilder.array([]);
    form: FormGroup = this._formBuilder.group({
        scope: this.rows
    });
    formFieldHelpers: string[] = [''];
    /*----------  For autocomplete ------------*/
    myControl = new FormControl();
    options: User[] = [
        {name: 'Agriculture, Water Resource and Rural Institution Division'},
        {name: 'Industry and Energy Division'},
        {name: 'Physical Infrastructure Division'},
        {name: 'Socio Economic Infrastructure Division'}
    ];
    filteredOptions: Observable<User[]>;

    concernedDivisionList: Array<{
        id: number,
        sectorDivisionNameBn: string,
        sectorDivisionNameEn: string,
    }> = [];

    sectorList: SectorModel[] = [];
    subSectorList: SubSectorModel[] = [];

    /*----------  /For autocomplete ------------*/

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

    proConceptUuid = this.route.snapshot.params['id'];
    people = [];

    developmentPartnersList: Array<{ id: number, name: string, nameBn: string }> = [];
    modeFinanceTypeList: Array<{ id: number, name: string, isEdited: boolean, pa: number, rpa: number, devPartner: string }> = [];

    lockModeFinancingList: { modeId: number, pa: number, paRpa: number, paSources: string }[] = [];

    modeFinancingList: {
        modeId: number, modeSource: string, modeSourceVal: string, gob: number, gobFe: number, pa: number, paRpa: number,
        ownFund: number, ownFundFe: number, others: number, othersFe: number, paSources: string, isEdited: boolean
    }[] = [];

    modeNameList = [
        {nameEn: 'Investment', nameBn: 'বিনিয়োগ'},
        {nameEn: 'Loan/Credit', nameBn: 'ঋণ'},
        {nameEn: 'Grant', nameBn: 'অনুদান'},
        // {nameEn: 'Equity', nameBn: 'ইক্যুইটি'},
        {nameEn: 'Others(Specify)', nameBn: 'অন্যান্য'},
    ];

    grandGob: any;
    grandGobFe: any;
    grandPa: any;
    grandPaRpa: any;
    grandOwnFund: any;
    grandOwnFundFe: any;
    grandOthers: any;
    grandOthersFe: any;

    totalInvestment: any;
    totalInvestmentFe: any;
    totalLoan: any;
    totalLoanFe: any;
    totalGrant: any;
    totalGrantFe: any;
    totalOthers: any;
    totalOthersFe: any;

    file: File;
    canUpdate: boolean;

    spinner: boolean;
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    isForeignAid: boolean;
    @Output() sendTitleEn: EventEmitter<{ titleEn: string }> = new EventEmitter();
    paripatraVersion: string;
    isParipatra2016: boolean;
    agencyModel: any;
    agency_name: string;
    ministry_division: string;

    constructor(
        private _formBuilder: FormBuilder,
        private validation : GlobalValidationService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private  tappObjectiveCostService: TappObjectiveCostService,
        private route: ActivatedRoute,
        private matSnackBar: SnackbarHelper,
        private currencyService: CurrencyService,
        private snackbarHelper: SnackbarHelper,
        private projectSummaryService : ProjectSummaryService,
        private tappAnnexureGoodsService : TappAnnexureGoodsService,
        private sectorDivisionService: SectorDivisionService,
        private sectorService: SectorService,
        private subSectorService: SubSectorService,
        private tappProjectSummeryHelperService: TappProjectSummeryHelperService,
        private dialog: MatDialog,
        private developmentPartnerService: DevelopmentPartnerService,
        private modeFinanceConfigService: ModeOfFinanceConfigService,
        private fileUploadService: FileUploadCommonService,
        private utilsService: UtilsService,
        private router: Router,
        private agencyService: AgencyService,
        private numberPipe: NumberPipe,
        private modeOfFinanceService: ModeOfFinanceService,
        ) {
            super();
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.getConfigModeList();
    }

    /**
     * When component initialize initially this method is called
     */
    ngOnInit(): void {
        this.initValues();
        this.getProjectConceptByUuid();
        // this.setGetValue();
        this.getCurrencyList();
        this.getProjectConceptById();
        /*----------  For autocomplete ------------*/
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.options.slice())
            );
        /*----------  /For autocomplete ------------*/

        this.addDevPRow();
        this.getDevelopmentPartnersList();
    }

    /**
     * FormGroup Initialize
     */
     initValues() {
        this.frmGroup = this._formBuilder.group({
            id:'',
            uuid:'',
            projectTitleBn: ['',   [this.validation.trimValidator("This field ")]
            ],
            projectTitleEn: ['',
                [this.validation.trimValidator("This field ")]
            ],
            ministryDivision: [''],
            implementingAgency: [''],
            concernedDivisionId: ['', [this.validation.trimValidator("This field ")]],
            sectorId: ['', [this.validation.trimValidator("This field")]],
            subSectorId: ['', [this.validation.trimValidator("This field")]],
            developmentPartnerId: ['' ],
            // developmentPartnerId: ['', this.validation.checkString],

            dateCommencement: [''],
            dateCompletion: [''],

            // dateCommencement: ['', [this.validation.trimValidator("Field"),]],
            // dateCompletion: ['', [this.validation.trimValidator("Field"),]],

            objectivesTargets: ['', [Validators.required ]],
            designationContactPerson: ['', [this.validation.trimValidator("This field ")]],
            responsiblePreparation: [''],
            developmentPartner: [''],

            gobEA: ['' ],
            gobLocal: ['' ],
            gobFe: ['' ],
            gobTotal: ['' ],
            gobSource: ['' ],
            developmentEA: ['' ],
            developmentLocal: ['' ],
            developmentFe: ['' ],
            developmentTotal: ['' ],
            developmentSource: ['' ],
            ownFundEA: ['' ],
            ownFundLocal: ['' ],
            ownFundFe: ['' ],
            ownFundTotal: ['' ],
            ownFundSource: ['' ],
            othersSpecifyEA: ['' ],
            othersSpecifyLocal: ['' ],
            othersSpecifyFe: ['' ],
            othersSpecifyTotal: ['' ],
            othersSpecifySource: ['' ],
            grandTotalEa:[],
            grandTotalLocal:[],
            grandTotalFe:[],
            grandTotalTotal:[],

            devPartnerlist: this._formBuilder.array([]),

        });
    }

   /* ------ Development Partners ------ */
    get devPartnerlist() {
        return this.frmGroup.controls['devPartnerlist'] as FormArray;
    }

    addDevPRow() {
        const row = this._formBuilder.group({
            id:[],
            uuid:[''],
            devPartnerId:['' ],
            modeFinanceId:['' ],
            paTotalAmount:['' ],
            rpaAmount:['' ],
            attachmentId:['']
        });
        this.devPartnerlist.push(row);
    }

    setDevPartnerlistValue(data)
    {
        if(data.length > 0)
        {
            this.devPartnerlist.clear();
            data.forEach((val,index) => {
                // console.log('val ', val , " index=",index);
                //this.frmGroup.controls['devPartnerlist'].value[index] = val;
                const row = this._formBuilder.group({
                    id:val.id,
                    uuid:val.uuid,
                    devPartnerId: val.devPartnerId,
                    modeFinanceId: val.modeFinanceId,
                    paTotalAmount: val.paTotalAmount,
                    rpaAmount: val.rpaAmount,
                    attachmentId: val.attachmentId,
                });
                this.devPartnerlist.push(row);
            });
        }
        else
        {
           this.addDevPRow();
        }
        // console.log(" this.devPartnerlist.value ",  this.devPartnerlist.value);

    }


    /*----Delete confirmation dialog box----*/
    deleteDevPRow(rowIndex) {
        let row = this.frmGroup.controls['devPartnerlist'].value[rowIndex];
        if (this.devPartnerlist.length === 1) {
            this.matSnackBar.openSuccessSnackBarWithMessage(
                'Minimum one row will be here',
                'Ok'
            );
            return false;
        }
        else
        {
            if(row.uuid != "")
                {
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.disableClose = false;
                    dialogConfig.autoFocus = false;
                    dialogConfig.width = ConfirmDialogConstant.WIDTH;
                    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
                    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
                    dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
                    const dialogRef = this.dialog.open(
                        SubmitConfirmationDialogComponent,
                        dialogConfig
                    );
                    dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
                        if (res) {
                            this.delete(row.uuid, rowIndex);
                        }
                        dialogRef.close(true);
                    });
                }
                else
                {
                    this.devPartnerlist.removeAt(rowIndex);
                    return true;

                }
        }

    }

    /*----Delete Records from database table----*/
    delete(rowId, rowIndex) {
        this.spinner = true;
        this.tappObjectiveCostService.deleteRow(rowId).subscribe((res:any) => {
            if(res.status == 1)
            {
                this.spinner = false;
                this.matSnackBar.openSuccessSnackBarWithMessage(
                    res.message,
                    'Ok'
                );
                this.devPartnerlist.removeAt(rowIndex);
            }
            this.spinner = false;
        });
    }

    getDevelopmentPartnersList(): any {
        this.subscribe$.add(
            this.developmentPartnerService.fetchActiveDevelopmentList().subscribe(res => {
                this.developmentPartnersList = [];
                for (let i = 0; i < res.length; i++) {
                    this.developmentPartnersList.push({
                        id: res[i].id,
                        name: res[i].developmentPartnerName,
                        nameBn: res[i].developmentPartnerNameBng
                    });
                }
            })
        );
    }

    // Get mode finance type from config
    private getConfigModeList() {
        this.subscribe$.add(
            this.modeFinanceConfigService.getActiveModOfFin("onlyActiveMoveFinData").subscribe(res => {
                this.modeFinanceTypeList = [];
                for (let i = 0; i < res.length; i++) {
                    if (res[i].nameEn != 'Equity') {
                        this.modeFinanceTypeList.push(
                        {
                            id: res[i].id,
                            name: res[i].nameEn,
                            isEdited: res[i].editable,
                            devPartner: '',
                            pa: 0,
                            rpa: 0
                        });
                    }
                }
            })
        );
    }



    private getPcModeOfFinanceList(pcId: number) {
        this.modeOfFinanceService.getModeOfFinanceListByProjectSummaryId(pcId).subscribe(res => {
            this.modeFinancingList = [];
            this.lockModeFinancingList = [];
            if (res.length > 0) {
                this.setModeFinanceListFromPcModeOfFinance(res);
                this.calculateModeFinanceTotal();
            } else {
                this.setEmptyModeFinanceList();
                this.calculateModeFinanceTotal();
            }
        });
    }

    private setModeFinanceListFromPcModeOfFinance(res: ModeOfFinanceModel[]) {
        this.modeNameList.forEach(e => {
            const modeType = this.modeFinanceTypeList.find(f => f.name === e.nameEn);
            if (modeType) {
                this.modeFinancingList.push({
                    modeId: modeType.id,
                    modeSource: this.isForeignAid ? e.nameEn : e.nameBn,
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
            }
        });
    }

    private setEmptyModeFinanceList() {
        this.modeNameList.forEach(e => {
            const modeType = this.modeFinanceTypeList.find(f => f.name === e.nameEn);
            this.modeFinancingList.push({
                modeId: modeType.id,
                modeSource: this.isForeignAid ? e.nameEn : e.nameBn,
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

    setModeFinanceDataFromObjectiveCost(res: any) {
        this.modeFinancingList = [];
        this.lockModeFinancingList = [];

        this.modeNameList.forEach(e => {
            const modeType = this.modeFinanceTypeList.find(f => f.name === e.nameEn);
            if (modeType) {
                const data = res.find(f => f.modeId === modeType.id);
                if (data) {
                    this.modeFinancingList.push({
                        modeId: modeType.id,
                        modeSource: this.isForeignAid  ? e.nameEn : e.nameBn,
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
                } else {
                    this.modeFinancingList.push({
                        modeId: modeType.id,
                        modeSource: this.isForeignAid  ? e.nameEn : e.nameBn,
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
                }
            }
        });

        this.calculateModeFinanceTotal();
    }

    calculateModeFinanceTotal() {
        let grandGob = 0;
        let grandGobFe = 0;
        let grandPa = 0;
        let grandPaRpa = 0;
        let grandOwnFund = 0;
        let grandOwnFundFe = 0;
        let grandOthers = 0;
        let grandOthersFe = 0;

        let totalInvestment = 0;
        let totalInvestmentFe = 0;
        let totalLoan = 0;
        let totalLoanFe = 0;
        let totalGrant = 0;
        let totalGrantFe = 0;
        let totalOthers = 0;
        let totalOthersFe = 0;

        for (let i = 0; i < this.modeFinancingList.length; i++) {
            grandGob += this.modeFinancingList[i].gob;
            grandGobFe += this.modeFinancingList[i].gobFe;
            grandPa += this.modeFinancingList[i].pa;
            grandPaRpa += this.modeFinancingList[i].paRpa;
            grandOwnFund += this.modeFinancingList[i].ownFund;
            grandOwnFundFe += this.modeFinancingList[i].ownFundFe;
            grandOthers += this.modeFinancingList[i].others;
            grandOthersFe += this.modeFinancingList[i].othersFe;
        }

        if (this.modeFinancingList.length > 0) {
            totalInvestment = this.modeFinancingList[0].gob + this.modeFinancingList[0].ownFund + this.modeFinancingList[0].others;
            totalInvestmentFe = this.modeFinancingList[0].gobFe + this.modeFinancingList[0].ownFundFe + this.modeFinancingList[0].othersFe;
            totalLoan = this.modeFinancingList[1].gob + this.modeFinancingList[1].ownFund + this.modeFinancingList[1].others;
            totalLoanFe = this.modeFinancingList[1].gobFe + this.modeFinancingList[1].ownFundFe + this.modeFinancingList[1].othersFe;
            totalGrant = this.modeFinancingList[2].gob + this.modeFinancingList[2].ownFund + this.modeFinancingList[2].others;
            totalGrantFe = this.modeFinancingList[2].gobFe + this.modeFinancingList[2].ownFundFe + this.modeFinancingList[2].othersFe;
            totalOthers = this.modeFinancingList[3].gob + this.modeFinancingList[3].ownFund + this.modeFinancingList[3].others;
            totalOthersFe = this.modeFinancingList[3].gobFe + this.modeFinancingList[3].ownFundFe + this.modeFinancingList[3].othersFe;
        }

        if (this.isForeignAid) {
            this.grandGob = grandGob;
            this.grandGobFe = grandGobFe;
            this.grandPa = grandPa;
            this.grandPaRpa = grandPaRpa;
            this.grandOwnFund = grandOwnFund;
            this.grandOwnFundFe = grandOwnFundFe;
            this.grandOthers = grandOthers;
            this.grandOthersFe = grandOthersFe;
        } else {
            this.grandGob = this.numberPipe.convertToBanglaNumber(grandGob.toFixed(2));
            this.grandGobFe = this.numberPipe.convertToBanglaNumber(grandGobFe.toFixed(2));
            this.grandPa = this.numberPipe.convertToBanglaNumber(grandPa.toFixed(2));
            this.grandPaRpa = this.numberPipe.convertToBanglaNumber(grandPaRpa.toFixed(2));
            this.grandOwnFund = this.numberPipe.convertToBanglaNumber(grandOwnFund.toFixed(2));
            this.grandOwnFundFe = this.numberPipe.convertToBanglaNumber(grandOwnFundFe.toFixed(2));
            this.grandOthers = this.numberPipe.convertToBanglaNumber(grandOthers.toFixed(2));
            this.grandOthersFe = this.numberPipe.convertToBanglaNumber(grandOthersFe.toFixed(2));

            this.totalInvestment = this.numberPipe.convertToBanglaNumber(totalInvestment.toFixed(2));
            this.totalInvestmentFe = this.numberPipe.convertToBanglaNumber(totalInvestmentFe.toFixed(2));
            this.totalLoan = this.numberPipe.convertToBanglaNumber(totalLoan.toFixed(2));
            this.totalLoanFe = this.numberPipe.convertToBanglaNumber(totalLoanFe.toFixed(2));
            this.totalGrant = this.numberPipe.convertToBanglaNumber(totalGrant.toFixed(2));
            this.totalGrantFe = this.numberPipe.convertToBanglaNumber(totalGrantFe.toFixed(2));
            this.totalOthers = this.numberPipe.convertToBanglaNumber(totalOthers.toFixed(2));
            this.totalOthersFe = this.numberPipe.convertToBanglaNumber(totalOthersFe.toFixed(2));
        }
    }

    setGobData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].gob = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set GobFe Data
    setGobFeData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].gobFe = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set PA Data
    setPaData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].pa = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set paRpa Data
    setRpaData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].paRpa = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set ownFund Data
    setOwnFundData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].ownFund = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set ownFundFe Data
    setOwnFundFeData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].ownFundFe = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set others Data
    setOthersData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].others = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set othersFe Data
    setOthersFeData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].othersFe = Number(event.target.value);
        }
        this.calculateModeFinanceTotal();
    }

    // Set paSources Data
    setPaSourcesData(event: any, indx: number) {
        if (!isNaN(Number(event.target.value))) {
            this.modeFinancingList[indx].paSources = event.target.value;
        }
        this.calculateModeFinanceTotal();
    }

    // Set modeSourceVal Data
    setModeSourceValData(event: any, indx: number) {
        this.modeFinancingList[indx].modeSourceVal = event.target.value;
    }


    /*----------  Download Attachment ------------*/
    download(attachmentId: any) {
        this.spinner = true;
        this.fileUploadService.getById(attachmentId, environment.ibcs.ppsDppBackendPoint).subscribe(res => {
            this.fileUploadService.download(res.pathUrl, environment.ibcs.ppsDppBackendPoint);
            this.spinner = false;
        });
    }

    /*----------  Upload Attachment ------------*/
    uploadFile(file: FileList, index): any {
        this.spinner = true;
        this.file = file.item(0);
        this.fileUploadService.upload(this.file, environment.ibcs.ppsDppBackendPoint).subscribe((res:any) => {
            if(res.id > 0)
            {
                this.frmGroup.controls['devPartnerlist'].value[index].attachmentId = res.id;
            }
            this.spinner = false;
        }, _ => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });

        //console.log("this.devPartnerlist 2= ", this.devPartnerlist.value);
    }
   /* ------ /Development Partners ------ */

    getSectorDivisionList(res) {
        this.sectorDivisionService.getActiveSectorDivision().subscribe(res => {
           this.concernedDivisionList = res;
        });
        this.setSectorDivision(res);
    }

    setSectorDivision(res) {
        this.frmGroup.patchValue({
            concernedDivisionId: res.sectorDivisionId,
            sectorId: res.sectorId,
            subSectorId: res.subSectorId
        });
        this.setSectorSubSector(res.sectorDivisionId, res.sectorId);
    }

    setSectorSubSector(sectorDivisionId: number, sectorId: number) {
        this.subscribe$.add(
            this.sectorService.getBySectorDivisionId(sectorDivisionId).subscribe(res => {
                this.sectorList = res;
            })
        );
        this.subscribe$.add(
            this.subSectorService.getBySectorId(sectorId).subscribe(res => {
                this.subSectorList = res;
            })
        );
    }

    onchangeSectorDivision(id: number) {
        this.subscribe$.add(
            this.sectorService.getBySectorDivisionId(id).subscribe(res => {
                this.sectorList = res;
            })
        );
        this.frmGroup.patchValue({
            sectorId: '',
            subSectorId: ''
        });
    }

    onchangeSector(id: number) {
        this.subscribe$.add(
            this.subSectorService.getBySectorId(id).subscribe(res => {
                this.subSectorList = res;
            })
        );
        this.frmGroup.patchValue({
            subSectorId: ''
        });
    }

     getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.proConceptUuid).subscribe(res => {
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            console.log('tapp project info ============>', res);
            this.isForeignAid = res.isForeignAid;
            this.getAgency(res.agencyId);
            this.getSectorDivisionList(res);
            if(res.id>0)
            {
                this.annexure5bData(res.id);
            }
        })
    }
    /*-----------Get Grand total amount from annexure 1 --------*/
    annexure5bData(pcId){
        this.tappAnnexureGoodsService.getTappAnnexure5bData(pcId).subscribe((res) => {

            let grandTotal = res.filter(f => f.componentName === "Grand_Total")[0].tappAnnualPhasingCostTotal[0];
            if (this.isForeignAid) {
                this.projectCost.gobAmount = grandTotal.gobAmount.toFixed(2);
                this.projectCost.gobFeAmount = grandTotal.gobFeAmount.toFixed(2);
                this.projectCost.paAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2);
                this.projectCost.paRpaAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount).toFixed(2);
                this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount.toFixed(2);
                this.projectCost.ownFundAmount = grandTotal.ownFundAmount.toFixed(2);
                this.projectCost.othersAmount = grandTotal.otherAmount.toFixed(2);
                this.projectCost.otherFeAmount = grandTotal.otherFeAmount.toFixed(2);
                this.projectCost.totalAmount = grandTotal.totalAmount.toFixed(2);
            } else {
                this.projectCost.gobAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobAmount.toFixed(2));
                this.projectCost.gobFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobFeAmount.toFixed(2));
                this.projectCost.paAmount = this.numberPipe.convertToBanglaNumber((grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2));
                this.projectCost.paRpaAmount = this.numberPipe.convertToBanglaNumber((grandTotal.gobThruAmount + grandTotal.spAcAmount).toFixed(2));
                this.projectCost.ownFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.ownFundFeAmount.toFixed(2));
                this.projectCost.ownFundAmount = this.numberPipe.convertToBanglaNumber(grandTotal.ownFundAmount.toFixed(2));
                this.projectCost.othersAmount = this.numberPipe.convertToBanglaNumber(grandTotal.otherAmount.toFixed(2));
                this.projectCost.otherFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.otherFeAmount.toFixed(2));
                this.projectCost.totalAmount = this.numberPipe.convertToBanglaNumber(grandTotal.totalAmount.toFixed(2));
            }
        })
    }
    /*-----------/Get Grand total amount from annexure 1 --------*/


    /*----------  Get Project Concept By Id ------------*/
    private getProjectConceptByUuid() {

        this.subscribe$.add(
            this.tappObjectiveCostService.getProjectConceptByUuid(this.proConceptUuid).subscribe((response : any) => {
                let res = response.res;
                this.sendTitleEn.emit({
                    titleEn: response.res.projectTitleEn
                });

                //If get data from tapp_master table
                if (response.status == 1) {

                    this.update = true;
                    this.setValueFromObjectiveCost(res, 1);
                    this.setObjectiveCostIdAndUuid(res);
                    if (res.tappCurrencyRateDTOS){
                        this.setCurrencyList(res.tappCurrencyRateDTOS);
                    } else {
                        this.addRow();
                    }
                    this.setDevPartnerlistValue(res.developmentPartnersList);

                    if (res.modeFinanceList.length < 1) {
                        this.getPcModeOfFinanceList(res.id);
                    } else {
                        this.setModeFinanceDataFromObjectiveCost(res.modeFinanceList);
                    }

                } else if(response.status == 2) {
                    this.addRow();
                    this.update = false;
                    this.setGetValue(response.res);
                } else {
                    this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                }
            })
        );
    }

    private getAgency(agencyId) {
        this.agencyService.getById(agencyId).subscribe(res => {
            this.agencyModel = res;
            this.agency_name = this.isForeignAid ? res.nameEn : res.nameBn;
            this.ministry_division = this.isForeignAid ? this.agencyModel.ministryDivisionDTO.nameEn : this.agencyModel.ministryDivisionDTO.nameBn;
            this.frmGroup.patchValue({
                implementingAgency: this.agency_name,
                ministryDivision: this.ministry_division
            });
        })
    }

    setValueFromObjectiveCost(res: any, pro:any) {
        // console.log("res res setValueFromObjectiveCost =", res)

        var modVal = res.tappModeFinanceDTO;

        this.frmGroup.patchValue({

            id : res.id,
            uuid : res.uuid,
            projectTitleEn : res.projectTitleEn,
            projectTitleBn : res.projectTitleBn,

            ministryDivision : res.ministryDivision,
            implementingAgency : res.implementingAgency,
            developmentPartnerId : res.developmentPartnerId,

            dateCommencement : res.dateCommencement,
            dateCompletion : res.dateCompletion,

            objectivesTargets : res.objectivesTargets,
            designationContactPerson : res.designationContactPerson,
            responsiblePreparation : res.responsiblePreparation,
            developmentPartner : res.developmentPartner,


            gobEA : modVal.gobEA,
            gobLocal : modVal.gobLocal,
            gobFe : modVal.gobFe,
            gobTotal : modVal.gobTotal,
            gobSource : modVal.gobSource,
            developmentEA : modVal.developmentEA,
            developmentLocal : modVal.developmentLocal,
            developmentFe : modVal.developmentFe,
            developmentTotal : modVal.developmentTotal,
            developmentSource : modVal.developmentSource,
            ownFundEA : modVal.ownFundEA,
            ownFundLocal : modVal.ownFundLocal,
            ownFundFe : modVal.ownFundFe,
            ownFundTotal : modVal.ownFundTotal,
            ownFundSource : modVal.ownFundSource,
            othersSpecifyEA : modVal.othersSpecifyEA,
            othersSpecifyLocal : modVal.othersSpecifyLocal,
            othersSpecifyFe : modVal.othersSpecifyFe,
            othersSpecifyTotal : modVal.othersSpecifyTotal,
            othersSpecifySource : modVal.othersSpecifySource,
            grandTotalEa : modVal.grandTotalEa,
            grandTotalLocal : modVal.grandTotalLocal,
            grandTotalFe : modVal.grandTotalFe,
            grandTotalTotal : modVal.grandTotalTotal,

        });
        if(pro == 1){
            this.setMaxAndMinDateLimation(res.dateCommencement, res.dateCompletion);
        }

    }


    calculateAmount() {
       let formVal = this.frmGroup.value;

        let row11 = !isNaN(formVal.gobEA) ? parseFloat(formVal.gobEA || 0) : 0;
        let row12 = !isNaN(formVal.gobLocal) ? parseFloat(formVal.gobLocal || 0) : 0;
        let row13 = !isNaN(formVal.gobFe) ? parseFloat(formVal.gobFe || 0) : 0;
        let row21 = !isNaN(formVal.developmentEA) ? parseFloat(formVal.developmentEA || 0) : 0;
        let row22 = !isNaN(formVal.developmentLocal) ? parseFloat(formVal.developmentLocal || 0) : 0;
        let row23 = !isNaN(formVal.developmentFe) ? parseFloat(formVal.developmentFe || 0) : 0;
        let row31 = !isNaN(formVal.ownFundEA) ? parseFloat(formVal.ownFundEA || 0) : 0;
        let row32 = !isNaN(formVal.ownFundLocal) ? parseFloat(formVal.ownFundLocal || 0) : 0;
        let row33 = !isNaN(formVal.ownFundFe) ? parseFloat(formVal.ownFundFe || 0) : 0;
        let row41 = !isNaN(formVal.othersSpecifyEA) ? parseFloat(formVal.othersSpecifyEA || 0) : 0;
        let row42 = !isNaN(formVal.othersSpecifyLocal) ? parseFloat(formVal.othersSpecifyLocal || 0) : 0;
        let row43 = !isNaN(formVal.othersSpecifyFe) ? parseFloat(formVal.othersSpecifyFe || 0) : 0;

        let gobTotal = row11 + row12 + row13;
        let developmentTotal = row21 + row22 + row23;
        let ownFundTotal = row31 + row32 + row33;
        let othersSpecifyTotal = row41 + row42 + row43;

        this.frmGroup.patchValue({
            gobTotal : gobTotal,
            developmentTotal: developmentTotal,
            ownFundTotal:ownFundTotal,
            othersSpecifyTotal:othersSpecifyTotal,

            grandTotalEa : row11 + row21 + row31 + row41,
            grandTotalLocal : row12 + row22 + row32 + row42,
            grandTotalFe : row13 + row23 + row33 + row43,
            grandTotalTotal : gobTotal + developmentTotal + ownFundTotal + othersSpecifyTotal,
        });
    }

    /**
     * Set value
     */
    setGetValue(res) {
        // console.log("setGetValue --", res);
        this.frmGroup.patchValue({
            projectTitleEn: res.titleEn,
            projectTitleBn: res.titleBn,
            ministryDivision: this.ministry_division,
            implementingAgency: this.agency_name,
            dateCommencement: res.expCommencementDate,
            dateCompletion: res.expCompletionDate
        });
    }

    /**
     * Set data in currency array for ready to save
     */
    setDataInCurrencyModal() {
        this.currencyModel = [];
        this.rows.getRawValue().forEach(e => {
            this.currencyModel.push(e);
        });
    }

    /*----------  Set Currency List From Objective And Cost DB------------*/
    setCurrencyList(res: any) {
        this.rows.clear();
        if (res.length > 0) {
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


        /*----------  Get Currency List for Drop Down ------------*/
        getCurrencyList(): any {
            this.subscribe$.add(
                this.currencyService.getList().subscribe(res => {
                    this.currencyList = [];
                    for (let i = 0; i < res.length; i++) {
                        this.currencyList.push({
                            id: res[i].id,
                            name: res[i].nameEn,
                            nameBn: res[i].nameBn,
                            country: res[i].country,
                            uuid: res[i].uuid
                        });
                    }
                })
            );
        }

    /**
     * Ready Mode Finance List for save data
     */
    validateModeFinancing() {
        this.model.gobEA = isNaN(this.model.gobEA) ? 0 : Number(this.model.gobEA);
        this.model.gobLocal = isNaN(this.model.gobLocal) ? 0 : Number(this.model.gobLocal);
        this.model.gobFe = isNaN(this.model.gobFe) ? 0 : Number(this.model.gobFe);

        this.model.developmentEA = isNaN(this.model.developmentEA) ? 0 : Number(this.model.developmentEA);
        this.model.developmentLocal = isNaN(this.model.developmentLocal) ? 0 : Number(this.model.developmentLocal);
        this.model.developmentFe = isNaN(this.model.developmentFe) ? 0 : Number(this.model.developmentFe);

        this.model.ownFundEA = isNaN(this.model.ownFundEA) ? 0 : Number(this.model.ownFundEA);
        this.model.ownFundLocal = isNaN(this.model.ownFundLocal) ? 0 : Number(this.model.ownFundLocal);
        this.model.ownFundFe = isNaN(this.model.ownFundFe) ? 0 : Number(this.model.ownFundFe);

        this.model.othersSpecifyEA = isNaN(this.model.othersSpecifyEA) ? 0 : Number(this.model.othersSpecifyEA);
        this.model.othersSpecifyLocal = isNaN(this.model.othersSpecifyLocal) ? 0 : Number(this.model.othersSpecifyLocal);
        this.model.othersSpecifyFe = isNaN(this.model.othersSpecifyFe) ? 0 : Number(this.model.othersSpecifyFe);
    }

    getDateValue(dataVal)
    {
        if(dataVal != "" && dataVal !=  null && dataVal != "0000-00-00") {
            return moment(dataVal).format('YYYY-MM-DD');
        } else {
            return "0000-00-00";
        }

    }

    gotNextPage(){
        this.nextStep.emit(true);
    }

    navigateToList(nextVal) {

        if(nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if(nextVal == 'list') {
            this.router.navigate(['dpp-tapp/dashboard/' + this.proConceptUuid]);
        }
    }

    onSubmit(nextVal) {
        if (this.frmGroup.valid) {
            this.saveData(nextVal);
        } else {
            this.frmGroup.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessageEnBn(REQUIRED_FIELD_EN, REQUIRED_FIELD_BN);
        }
    }

    /**
     * Save data in DB
     */
     saveData(nextVal) {
        this.setDataInCurrencyModal();
        this.spinner = true;
        this.model = this.frmGroup.value;
        this.validateModeFinancing();
        this.model.dateCommencement = this.getDateValue(this.frmGroup.value.dateCommencement);
        this.model.dateCompletion = this.getDateValue(this.frmGroup.value.dateCompletion);
        this.model.projectConceptUuid = this.proConceptUuid;
        this.model.concernedDivisionId = this.frmGroup.value.concernedDivisionId;
        this.model.sectorId = this.frmGroup.value.sectorId;
        this.model.subSectorId = this.frmGroup.value.subSectorId;
        this.currencyModelStore.clear();

        this.currencyModel.forEach(re => {
            if(re.exchangeCurrency > 0 && re.exchangeRate > 0 && re.exchangeDate != "0000-00-00")
            {
                const row = this._formBuilder.group({
                    exchangeRate: re.exchangeRate,
                    exchangeCurrency: Number(re.exchangeCurrency),
                    exchangeDate: this.getDateValue(re.exchangeDate),
                });
                this.currencyModelStore.push(row);
            }
        });

        this.model.currencyRateList = this.currencyModelStore.value;
        this.model.devPartnerlist = this.devPartnerlist.value;
        this.model.modeFinanceList = [];
        if (!this.isForeignAid) {
            this.model.modeFinanceList = this.modeFinancingList;
        }
        this.spinner = true;
        this.tappObjectiveCostService.createObjectiveCost(this.model, this.update).subscribe((res:any) => {
            if (res.status > 0) {
                this.spinner = false;
                this.setObjectiveCostIdAndUuid(res.res);
                //this.gotNextPage();
                this.navigateToList(nextVal);
                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE,SUCCESSFULLY_SAVE_BN);

                this.getProjectConceptByUuid();
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessageEnBn(FAILED_SAVE,FAILED_SAVE_BN);
            }
            this.spinner = false;
        });



    }

    private setObjectiveCostIdAndUuid(res: any) {
        this.tappProjectSummeryHelperService.objectiveCostCreateId = res.id;
        this.tappProjectSummeryHelperService.objectiveCostUuid = res.uuid;
    }

    /*----------  For autocomplete ------------*/
    // displayFn(user: User): string {
    //     return user && user.name ? user.name : '';
    // }

    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    /*----------  /For autocomplete ------------*/

    /*----------  For Exchange addRow ------------*/
    addRow(): any {
    const row = this._formBuilder.group({
        exchangeRate: '',
        exchangeCurrency: '',
        exchangeDate: '',
    });
    this.rows.push(row);
    this.data.forEach(() => this.addRow());
    this.updateView();
}

    /*----------  For Exchange updateRow ------------*/
    updateView(): any {
        this.exchangeDataSource2.next(this.rows.controls);
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

    setMaxAndMinDateLimation(dateCommencement, dateCompletion){
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


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }
}
