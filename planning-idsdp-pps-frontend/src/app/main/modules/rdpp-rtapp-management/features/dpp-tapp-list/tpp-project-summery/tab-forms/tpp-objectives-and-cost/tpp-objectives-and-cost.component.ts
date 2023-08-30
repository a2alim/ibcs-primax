import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {UtilsService} from 'app/main/core/services/utils.service';
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";
import {EstimatedCostModel} from "../../../../../models/estimated-cost.model";

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
    @Output() sendTitleEn: EventEmitter<{ titleEn: string }> = new EventEmitter();
    @Output() sendSubTitle: EventEmitter<{ subTitle: string }> = new EventEmitter();

    frmGroup: FormGroup;
    model: TappObjectiveCostModel = new TappObjectiveCostModel();
    exchangeDataSource2 = new BehaviorSubject<AbstractControl[]>([]);
    currencyModel: TappCurrencyRateModel[] = new Array<TappCurrencyRateModel>();
    currencyModelStore: FormArray = this._formBuilder.array([]);

    modeFinancingList: Array<{ modeSource: string, eaAmount: number, local: number, feAmount: number, totalAmount: number, sources: number }> = [];
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

    /*----------  /For autocomplete ------------*/

    projectCost = {
        gobAmount: 0,
        gobFeAmount: 0,
        paAmount: 0,
        paRpaAmount: 0,
        ownFeAmount: 0,
        ownFundAmount: 0,
        othersAmount: 0,
        otherFeAmount: 0,
        totalAmount: 0
    };

    // proConceptUuid = this.route.snapshot.params['id'];
    proConceptUuid: string;
    people = [];

    developmentPartnersList: Array<{ id: number, name: string, nameBn: string }> = [];
    modeFinanceTypeList: Array<{ id: number, name: string, isEdited: boolean, pa: number, rpa: number, devPartner: string }> = [];
    file: File;
    canUpdate: boolean;

    spinner: boolean;
    masterId: number;
    originalCommencementDate: any;
    originalCompletionDate: any;
    dateList: any;
    revisedVersion: string;
    estimatedCosts: EstimatedCostModel[];

    constructor(
        private _formBuilder: FormBuilder,
        private validation: GlobalValidationService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private  tappObjectiveCostService: TappObjectiveCostService,
        private route: ActivatedRoute,
        private matSnackBar: SnackbarHelper,
        private currencyService: CurrencyService,
        private snackbarHelper: SnackbarHelper,
        private projectSummaryService: ProjectSummaryService,
        private tappAnnexureGoodsService: TappAnnexureGoodsService,
        private sectorDivisionService: SectorDivisionService,
        private tappProjectSummeryHelperService: TappProjectSummeryHelperService,
        private dialog: MatDialog,
        private developmentPartnerService: DevelopmentPartnerService,
        private modeFinanceConfigService: ModeOfFinanceConfigService,
        private fileUploadService: FileUploadCommonService,
        private fileService: FileUploadService,
        private utilsService: UtilsService,
        private router: Router,
    ) {
        super();
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.route.queryParams.subscribe(params => {
            this.proConceptUuid = params['pcUuid'];
            this.masterId = params['id'];
        });
    }

    /**
     * When component initialize initially this method is called
     */
    ngOnInit(): void {

        this.initValues();
        // this.setGetValue();
        this.getCurrencyList();
        this.getSectorDivisionList();
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
        this.getConfigModeList();
        this.getProjectConceptByUuid();
        this.getEstimatedCosts(this.proConceptUuid);
    }

    /**
     * FormGroup Initialize
     */
    initValues() {
        this.frmGroup = this._formBuilder.group({
            id: '',
            uuid: '',
            ProjectTitle_1_value: 'ProjectTitle_1_value | translat',

            projectTitleBn: [''],
            projectTitleEn: ['',
                [this.validation.trimValidator("This field ")]
            ],
            ministryDivision: [''],
            implementingAgency: [''],
            concernedDivisionId: ['', [this.validation.trimValidator("This field ")]],
            developmentPartnerId: [''],

            dateCommencement: [''],
            dateCompletion: [''],

            revisedVersion: [''],
            referenceUuid: [''],
            referenceId: [''],
            timeExtension: [''],
            costExtension: [''],
            cumulativeDate: [''],

            // dateCommencement: ['', [this.validation.trimValidator("Field"),]],
            // dateCompletion: ['', [this.validation.trimValidator("Field"),]],

            objectivesTargets: [''],
            designationContactPerson: [''],
            responsiblePreparation: [''],
            developmentPartner: [''],


            gobEA: [''],
            gobLocal: [''],
            gobFe: [''],
            gobTotal: [''],
            gobSource: [''],
            developmentEA: [''],
            developmentLocal: [''],
            developmentFe: [''],
            developmentTotal: [''],
            developmentSource: [''],
            ownFundEA: [''],
            ownFundLocal: [''],
            ownFundFe: [''],
            ownFundTotal: [''],
            ownFundSource: [''],
            othersSpecifyEA: [''],
            othersSpecifyLocal: [''],
            othersSpecifyFe: [''],
            othersSpecifyTotal: [''],
            othersSpecifySource: [''],
            grandTotalEa: [],
            grandTotalLocal: [],
            grandTotalFe: [],
            grandTotalTotal: [],

            devPartnerlist: this._formBuilder.array([]),

        });
    }

    /* ------ Development Partners ------ */
    get devPartnerlist() {
        return this.frmGroup.controls['devPartnerlist'] as FormArray;
    }

    addDevPRow() {
        const row = this._formBuilder.group({
            id: [],
            uuid: [''],
            devPartnerId: [''],
            modeFinanceId: [''],
            paTotalAmount: [''],
            rpaAmount: [''],
            attachmentId: ['']
        });
        this.devPartnerlist.push(row);
    }

    setDevPartnerlistValue(data) {
        if (data.length > 0) {
            this.devPartnerlist.clear();
            data.forEach((val, index) => {
                const row = this._formBuilder.group({
                    id: val.id,
                    uuid: val.uuid,
                    devPartnerId: val.devPartnerId,
                    modeFinanceId: val.modeFinanceId,
                    paTotalAmount: val.paTotalAmount,
                    rpaAmount: val.rpaAmount,
                    attachmentId: val.attachmentId,
                });
                this.devPartnerlist.push(row);
            });
        } else {
            this.addDevPRow();
        }
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
        } else {
            if (row.uuid != "") {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = false;
                dialogConfig.autoFocus = false;
                dialogConfig.width = ConfirmDialogConstant.WIDTH;
                dialogConfig.height = ConfirmDialogConstant.HEIGHT;
                dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
                dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
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
            } else {
                this.devPartnerlist.removeAt(rowIndex);
                return true;

            }
        }

    }

    /*----Delete Records from database table----*/
    delete(rowId, rowIndex) {
        this.spinner = true;
        this.tappObjectiveCostService.deleteRow(rowId).subscribe((res: any) => {
            if (res.status == 1) {
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
            })
        );
    }

    /*----------  Download Attachment ------------*/
    download(attachmentId: any) {
        this.spinner = true;
        this.fileUploadService.getById(attachmentId, environment.ibcs.ppsDppBackendPoint).subscribe(res => {
            this.fileService.downloadAttachmentInDppService(res.pathUrl);
            this.spinner = false;
        });
    }

    /*----------  Upload Attachment ------------*/
    uploadFile(file: FileList, index): any {
        this.spinner = true;
        this.file = file.item(0);
        this.fileUploadService.upload(this.file, environment.ibcs.ppsDppBackendPoint).subscribe((res: any) => {
            if (res.id > 0) {
                this.frmGroup.controls['devPartnerlist'].value[index].attachmentId = res.id;
            }
            this.spinner = false;
        }, _ => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }

    /* ------ /Development Partners ------ */

    getSectorDivisionList() {
        this.sectorDivisionService.getActiveSectorDivision().subscribe(res => {
            this.concernedDivisionList = res;
        });
    }

    private getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.proConceptUuid).subscribe(res => {
            if (res.id > 0) {
                this.annexure5bData(res.id);
            }
        })
    }

    /*-----------Get Grand total amount from annexure 1 --------*/
    annexure5bData(pcId) {
        this.tappAnnexureGoodsService.getTappAnnexure5bData(pcId).subscribe((res) => {

            let grandTotal = res.filter(f => f.componentName === "Grand_Total")[0].tappAnnualPhasingCostTotal[0];

            this.projectCost.gobAmount = grandTotal.gobAmount;
            this.projectCost.gobFeAmount = grandTotal.gobFeAmount;
            this.projectCost.paAmount = grandTotal.spAcAmount;
            this.projectCost.paRpaAmount = 0;
            this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount;
            this.projectCost.ownFundAmount = grandTotal.ownFundAmount;
            this.projectCost.othersAmount = grandTotal.otherAmount;
            this.projectCost.otherFeAmount = grandTotal.otherFeAmount;
            this.projectCost.totalAmount = grandTotal.totalAmount;
        })
    }

    /*-----------/Get Grand total amount from annexure 1 --------*/


    /*----------  Get Project Concept By Id ------------*/
    private getProjectConceptByUuid() {
        this.subscribe$.add(
            this.tappObjectiveCostService.getProjectConceptByUuid(this.masterId).subscribe((response: any) => {

                let res = response.res;
                this.sendTitleEn.emit({
                    titleEn: response.res.projectTitleEn
                });
                this.sendSubTitle.emit({
                    subTitle: 'Home > RTAPP (' + response.res.revisedVersion + ')'
                });
                //If get data from tapp_master table
                if (response.status == 1) {
                    this.dateList = res.objCostDates;
                    this.update = true;
                    this.setValueFromObjectiveCost(res, 1);
                    this.setObjectiveCostIdAndUuid(res);
                    if (res.tappCurrencyRateDTOS) {
                        this.setCurrencyList(res.tappCurrencyRateDTOS);
                    } else {
                        this.addRow();
                    }
                    this.setDevPartnerlistValue(res.developmentPartnersList);
                } else if (response.status == 2) {
                    this.update = false;
                    this.setGetValue(response.res);
                } else {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(res.message, "Ok");
                }

                this.getTappMasterData();
            })
        );
    }

    setValueFromObjectiveCost(res: any, pro: any) {
        var modVal = res.tappModeFinanceDTO;
        this.revisedVersion = res.revisedVersion;
        this.frmGroup.patchValue({

            id: res.id,
            uuid: res.uuid,
            //projectTitleBn : res.titleBn,// res.projectTitleBn.concat(res.titleEn.toString()),
            projectTitleEn: res.projectTitleEn,
            projectTitleBn: res.projectTitleBn,

            ministryDivision: res.ministryDivision,
            implementingAgency: res.implementingAgency,
            concernedDivisionId: res.concernedDivisionId,
            developmentPartnerId: res.developmentPartnerId,

            dateCommencement: res.dateCommencement,
            dateCompletion: res.dateCompletion,

            objectivesTargets: res.objectivesTargets,
            designationContactPerson: res.designationContactPerson,
            responsiblePreparation: res.responsiblePreparation,
            developmentPartner: res.developmentPartner,
            revisedVersion: res.revisedVersion,
            referenceUuid: res.referenceUuid,
            referenceId: res.referenceId,
            timeExtension: res.timeExtension,
            costExtension: res.costExtension,
            cumulativeDate: res.cumulativeDate,


            gobEA: modVal.gobEA,
            gobLocal: modVal.gobLocal,
            gobFe: modVal.gobFe,
            gobTotal: modVal.gobTotal,
            gobSource: modVal.gobSource,
            developmentEA: modVal.developmentEA,
            developmentLocal: modVal.developmentLocal,
            developmentFe: modVal.developmentFe,
            developmentTotal: modVal.developmentTotal,
            developmentSource: modVal.developmentSource,
            ownFundEA: modVal.ownFundEA,
            ownFundLocal: modVal.ownFundLocal,
            ownFundFe: modVal.ownFundFe,
            ownFundTotal: modVal.ownFundTotal,
            ownFundSource: modVal.ownFundSource,
            othersSpecifyEA: modVal.othersSpecifyEA,
            othersSpecifyLocal: modVal.othersSpecifyLocal,
            othersSpecifyFe: modVal.othersSpecifyFe,
            othersSpecifyTotal: modVal.othersSpecifyTotal,
            othersSpecifySource: modVal.othersSpecifySource,
            grandTotalEa: modVal.grandTotalEa,
            grandTotalLocal: modVal.grandTotalLocal,
            grandTotalFe: modVal.grandTotalFe,
            grandTotalTotal: modVal.grandTotalTotal,

        });
        if (pro == 1) {
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

        let gobTotal = Number((row11 + row12 + row13).toFixed(2));
        let developmentTotal = Number((row21 + row22 + row23).toFixed(2));
        let ownFundTotal = Number((row31 + row32 + row33).toFixed(2));
        let othersSpecifyTotal = Number((row41 + row42 + row43).toFixed(2));

        this.frmGroup.patchValue({
            gobTotal: gobTotal,
            developmentTotal: developmentTotal,
            ownFundTotal: ownFundTotal,
            othersSpecifyTotal: othersSpecifyTotal,

            grandTotalEa: (row11 + row21 + row31 + row41).toFixed(2),
            grandTotalLocal: (row12 + row22 + row32 + row42).toFixed(2),
            grandTotalFe: (row13 + row23 + row33 + row43).toFixed(2),
            grandTotalTotal: (gobTotal + developmentTotal + ownFundTotal + othersSpecifyTotal).toFixed(2)
        });
    }

    /**
     * Set value
     */
    setGetValue(res) {
        this.frmGroup.patchValue({
            projectTitleEn: res.titleEn,
            projectTitleBn: res.titleBn,
            ministryDivision: res.sponsoringMinistryName,
            implementingAgency: res.implementingAgencyName,
            concernedDivisionId: res.sectorDivisionId
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

    getDateValue(dataVal) {
        if (dataVal != "" && dataVal != null && dataVal != "0000-00-00") {
            return moment(dataVal).format('YYYY-MM-DD');
        } else {
            return "0000-00-00";
        }

    }

    gotNextPage() {
        this.nextStep.emit(true);
    }

    navigateToList(nextVal) {

        if (nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if (nextVal == 'list') {
            this.router.navigate(['rdpp-rtapp/dashboard/' + this.proConceptUuid]);
        }
    }

    onSubmit(nextVal) {
        if (this.frmGroup.valid) {
            this.saveData(nextVal);
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fillup all required field", "Ok");
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

        this.model.currencyRateList = this.currencyModelStore.value;
        this.model.devPartnerlist = this.devPartnerlist.value;
        this.spinner = true;
        this.tappObjectiveCostService.createObjectiveCost(this.model, this.update).subscribe((res: any) => {
            if (res.status > 0) {
                this.spinner = false;
                this.setObjectiveCostIdAndUuid(res.res);
                //this.gotNextPage();
                this.navigateToList(nextVal);
                this.snackbarHelper.openSuccessSnackBarWithMessage(res.message, "Ok");

                this.getProjectConceptByUuid();
            } else {
                this.snackbarHelper.openErrorSnackBar();
            }
            this.spinner = false;
        });


    }

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


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }

    getTappMasterData() {
        this.tappObjectiveCostService.getObjCostProjectConceptByUuid(this.proConceptUuid).subscribe(res => {
            this.originalCommencementDate = res.res.dateCommencement;
            this.originalCompletionDate = res.res.dateCompletion;
        })
    }

    private getEstimatedCosts(conceptUuid: string) {
        this.tappObjectiveCostService.getEstimatedCosts(conceptUuid).subscribe(
            res => {
                this.estimatedCosts = res;

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
            },
            err => {
                this.estimatedCosts = [];
            }
        )
    }

    convertToNumber(number: any) {
        return Number(number);
    }

    navigateToAnnualPhasingCost(){
        this.router.navigate(['/rdpp-rtapp/tapp-annexure-one'],{ queryParams: {pcUuid: this.proConceptUuid, id: this.masterId}});
    }
}
