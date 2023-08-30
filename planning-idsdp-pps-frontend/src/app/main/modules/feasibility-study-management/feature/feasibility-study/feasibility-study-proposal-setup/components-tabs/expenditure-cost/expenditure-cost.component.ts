import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {EconomicCodeService} from '../../../../../../configuration-management/services/economic-code-service.service';
import {SubEconomicCodeModel} from '../../../../../../configuration-management/models/sub-economic-code-model';
import {Observable, Subscription} from 'rxjs';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {SubEconomicCodeService} from '../../../../../../configuration-management/services/sub-economic-code.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectSummaryService} from '../../../../../../project-concept-management/services/project-summary.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ExpenditureCostService} from '../../../../../services/expenditure-cost.service';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {ExpenditureCostModel} from '../../../../../models/expenditure-cost.model';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../../../core/constants/constant';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {IOption} from '../../../../../../../shared/model/option';
import {EconomicTypeModel} from '../../../../../../configuration-management/models/economic-code-model';
import {IFeasibilityModel} from "../../../../../models/feasibility-study-proposal.model";
import {FeasibilityStudyProposalSummaryService} from "../../../../../services/feasibility-study-proposal-summary.service";
import {ERROR} from "../../../../../../../core/constants/message";

@Component({
  selector: 'app-expenditure-cost',
  templateUrl: './expenditure-cost.component.html',
  styleUrls: ['./expenditure-cost.component.scss']
})
export class ExpenditureCostComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    clickEventSubscription: Subscription;

    projectConceptId: string;

    form: FormGroup;
    formFinancialInfo: FormGroup;

    economicList: IOption[] = new Array<IOption>();
    subEconomicList: IOption[] = new Array<IOption>();
    economicListAll: EconomicTypeModel[] = [];
    subEconomicCodes: SubEconomicCodeModel[] = [];
    subEconomicAllList: SubEconomicCodeModel[] = new Array<SubEconomicCodeModel>();

    expenditureCostList: ExpenditureCostModel[] = new Array<ExpenditureCostModel>();

    economicCodeId: number;

    subEconomicCodeId: number;

    fspMasterId: number;

    fspSummary: IFeasibilityModel;
    expenditureCostTotal: number = 0;
    existingExpenditureCostTotal: number = 0;

    model: ExpenditureCostModel = new ExpenditureCostModel();

    // table column
    displayedColumns: string[] = ['economicCode', 'economicSubCode', 'economicSubCodeDescription', 'gobFe', 'gob', 'specialAccount', 'throughPd', 'throughDp', 'ownFund', 'others', 'total', 'action'];

    // for pagination
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    isSelfFund: boolean;
    isForeignAid: boolean;

    expenditureCostUpdate: boolean;

    spinner: boolean;

    constructor(private fb: FormBuilder, private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private economicCodeService: EconomicCodeService,
                private router: Router,
                private subEconomicCodeService: SubEconomicCodeService,
                private projectSummaryService: ProjectSummaryService,
                private snackBar: SnackbarHelper,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private expenditureCostService: ExpenditureCostService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
                private route: ActivatedRoute) {
        this.projectConceptId = this.route.snapshot.params['uuid'];
        this.clickEventSubscription = this.expenditureCostService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.populateForm();
        this.getActiveEconomicCode();
        this.getSubEconomicCodeAll();
        // this.getExpenditureCostList();
        this.getPCByUuid();
        this.subEconomicList = [];
    }

    // load all api data
    loadData(): void {
        this.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;
        this.populateForm();
        this.getExpenditureCostList();
        this.getActiveEconomicCode();
        this.getFspSummaryById();
        this.getPCByUuid();
        this.getSubEconomicCodeAll();
        this.subEconomicList = [];
    }

    // init form data
    private populateForm() {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            economicCode: new FormControl('', Validators.required),
            subEconomicCode: new FormControl('', Validators.required),
            subEconomicDescription: new FormControl('')
        });
        this.formFinancialInfo = new FormGroup({
            total: new FormControl(0, [Validators.required, Validators.min(0)]),
            gob: new FormControl(0, [Validators.required, Validators.min(0)]),
            feGob: new FormControl(0, [Validators.required, Validators.min(0)]),
            pa: new FormControl(0, [Validators.required, Validators.min(0)]),
            rpa: new FormControl(0, [Validators.required, Validators.min(0)]),
            rpaGob: new FormControl(0, [Validators.required, Validators.min(0)]),
            rpaSpecialAccount: new FormControl(0, [Validators.required, Validators.min(0)]),
            dpa: new FormControl(0, [Validators.required, Validators.min(0)]),
            dpaThroughPd: new FormControl(0, [Validators.required, Validators.min(0)]),
            dpaThroughDp: new FormControl(0, [Validators.required, Validators.min(0)]),
            ownFund: new FormControl(0, [Validators.required, Validators.min(0)]),
            feOwnFund: new FormControl(0, [Validators.required, Validators.min(0)]),
            others: new FormControl(0, [Validators.required, Validators.min(0)]),
            othersFe: new FormControl(0, [Validators.required, Validators.min(0)])
        });
    }

    private getPCByUuid() {
        this.projectSummaryService.getByUuid(this.projectConceptId).subscribe(res => {
            this.isSelfFund = res.isSelfFund;
            this.isForeignAid = res.isForeignAid;
        });
    }

    private getFspSummaryById() {
        this.feasibilityStudyProposalSummaryService.getById(this.fspMasterId).subscribe(res => {
            this.fspSummary = res;
        })
    }

    getActiveEconomicCode() {
        this.economicList = [];
        this.economicCodeService.fetchActiveEconomicCodeList().subscribe(res => {
            this.economicListAll = res;
            this.economicList = res.map(m => ({name: m.economicCode + '['+ m.economicCodeName +']', nameBn: m.economicCodeNameBng, nameEn: m.economicCodeName, value: m.id}));
            // res.forEach(m => {
            //     this.economicListAll.push(m);
            // });
        });
    }

    findSubEconomicCode(event): any {
        this.economicCodeId = event;
        this.getSubEconomicCode(this.economicCodeId);
    }

    findSubEconomicCodeDescription(event): any {
        this.subEconomicCodeId = event;
        this.subEconomicCodeService.getById(this.subEconomicCodeId).subscribe(res => {
            this.form.patchValue({
                subEconomicDescription: res.description
            });
        });

    }

    getSubEconomicCode(economicCodeId: any) {
        this.subEconomicList = [];
        this.subEconomicCodeService.getByEconomicCodeId(economicCodeId).subscribe(res => {
            // res.forEach(m => {
            //     this.subEconomicList.push(m);
            // });
            this.subEconomicCodes = res;
            this.subEconomicList = res.map(m => ({name: m.subEconomicCode + '['+ m.subEconomicCodeName +']', nameBn: m.subEconomicCodeBng, nameEn: m.subEconomicCodeName, value: m.id}));
        });
    }

    getSubEconomicCodeAll() {
        this.subEconomicAllList = [];
        this.subEconomicCodeService.getActiveSubEconomicCodeList().subscribe(res => {
            res.forEach(m => {
                this.subEconomicAllList.push(m);
            });
        });
    }

    create() {
        this.model.economicCodeId = this.form.value.economicCode;
        this.model.economicSubCodeId = this.form.value.subEconomicCode;
        this.model.description = this.form.value.subEconomicDescription;
        this.model.totalAmount = this.formFinancialInfo.value.total;
        this.model.gobAmount = this.formFinancialInfo.value.gob;
        this.model.feGobAmount = this.formFinancialInfo.value.feGob;
        this.model.paAmount = this.formFinancialInfo.value.pa;
        this.model.rpaAmount = this.formFinancialInfo.value.rpa;
        this.model.rpaGobAmount = this.formFinancialInfo.value.rpaGob;
        this.model.rpaSpecialAccountAmount = this.formFinancialInfo.value.rpaSpecialAccount;
        this.model.dpaAmount = this.formFinancialInfo.value.dpa;
        this.model.dpaThroughPdAmount = this.formFinancialInfo.value.dpaThroughPd;
        this.model.dpaDpAmount = Number(this.formFinancialInfo.value.dpaThroughDp);
        this.model.ownFundAmount = this.formFinancialInfo.value.ownFund;
        this.model.feOwnFundAmount = this.formFinancialInfo.value.feOwnFund;
        this.model.othersAmount = this.formFinancialInfo.value.others;
        this.model.othersFeAmount = this.formFinancialInfo.value.othersFe;
        this.model.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;

        if(this.form.valid && this.formFinancialInfo.valid) {
            if((this.fspSummary.totalAmount - this.expenditureCostTotal) >= Number(this.formFinancialInfo.value.total)) {
                this.spinner = true;
                this.expenditureCostService.create(this.model).subscribe(res => {
                    if (res.uuid) {
                        this.form.reset();
                        this.formFinancialInfo.reset();
                        this.populateForm();
                        this.subEconomicList = [];
                        this.spinner = false;
                        this.getExpenditureCostList();
                        this.snackBar.openSuccessSnackBar();
                    }
                }, err => {
                    this.spinner = false;
                    this.snackBar.openErrorSnackBar();
                });
            } else this.snackbarHelper.openErrorSnackBarWithMessage("Can not take more than balance", ERROR);
        } else{
            this.form.markAllAsTouched();
            this.formFinancialInfo.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }

    }

    // for get ExpenditureCost List
    private getExpenditureCostList() {
        this.expenditureCostList = [];
        this.expenditureCostService.getExpenditureCostListByFspMasterId(this.feasibilityProposalHelperService.feasibilityProposalCreateId, this.page, this.size).subscribe(res => {
            if(res.content.length > 0) {
                if(this.feasibilityProposalHelperService.feasibilityUpdate === true){
                    this.expenditureCostUpdate = true;
                } else {
                    this.expenditureCostUpdate = false;
                }
            } else {
                this.expenditureCostUpdate = false;
            }
            res.content.forEach(m => {
                this.expenditureCostList.push(m);
                // this.getSubEconomicCode(m.economicCodeId);
            });
            this.total = res.totalElements;
            this.expenditureCostTotal = res.content?.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
        });
    }

    // edit form data
    edit(row: ExpenditureCostModel) {
        this.form.patchValue({
            uuid: row.uuid,
            economicCode: row.economicCodeId,
            subEconomicCode: row.economicSubCodeId,
            subEconomicDescription: row.description
        });

        this.formFinancialInfo.patchValue({
            total: row.totalAmount,
            gob: row.gobAmount,
            feGob: row.feGobAmount,
            pa: row.paAmount,
            rpa: row.rpaAmount,
            rpaGob: row.rpaGobAmount,
            rpaSpecialAccount: row.rpaSpecialAccountAmount,
            dpa: row.dpaAmount,
            dpaThroughPd: row.dpaThroughPdAmount,
            dpaThroughDp: row.dpaDpAmount,
            ownFund: row.ownFundAmount,
            feOwnFund: row.feOwnFundAmount,
            others: row.othersAmount,
            othersFe: row.othersFeAmount
        });
        this.getSubEconomicCode(row.economicCodeId);
        this.existingExpenditureCostTotal = row.totalAmount;
    }

    update() {
        this.model.uuid = this.form.value.uuid;
        this.model.economicCodeId = this.form.value.economicCode;
        this.model.economicSubCodeId = this.form.value.subEconomicCode;
        this.model.description = this.form.value.subEconomicDescription;
        this.model.totalAmount = this.formFinancialInfo.value.total;
        this.model.gobAmount = this.formFinancialInfo.value.gob;
        this.model.feGobAmount = this.formFinancialInfo.value.feGob;
        this.model.paAmount = this.formFinancialInfo.value.pa;
        this.model.rpaAmount = this.formFinancialInfo.value.rpa;
        this.model.rpaGobAmount = this.formFinancialInfo.value.rpaGob;
        this.model.rpaSpecialAccountAmount = this.formFinancialInfo.value.rpaSpecialAccount;
        this.model.dpaAmount = this.formFinancialInfo.value.dpa;
        this.model.dpaThroughPdAmount = this.formFinancialInfo.value.dpaThroughPd;
        this.model.dpaDpAmount = Number(this.formFinancialInfo.value.dpaThroughDp);
        this.model.ownFundAmount = this.formFinancialInfo.value.ownFund;
        this.model.feOwnFundAmount = this.formFinancialInfo.value.feOwnFund;
        this.model.othersAmount = this.formFinancialInfo.value.others;
        this.model.othersFeAmount = this.formFinancialInfo.value.othersFe;
        this.model.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;

        if((this.fspSummary.totalAmount - this.expenditureCostTotal) >= Number(this.formFinancialInfo.value.total - this.existingExpenditureCostTotal)) {
            this.spinner = true;
            this.expenditureCostService.update(this.model).subscribe(res => {
                if (res.uuid) {
                    this.form.reset();
                    this.formFinancialInfo.reset();
                    this.populateForm();
                    this.spinner = false;
                    this.getExpenditureCostList();
                    this.subEconomicList = [];
                    this.snackBar.openSuccessSnackBar();
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            });
        } else this.snackbarHelper.openErrorSnackBarWithMessage("Can not take more than balance", ERROR);
    }

    reset() {
        this.form.reset();
        this.formFinancialInfo.reset();
        // this.getExpenditureCostList();
        this.populateForm();
        this.subEconomicList = [];
        // this.populateForm();
    }

    // delete Expenditure Cost
    delete(row: ExpenditureCostModel) {
        this.expenditureCostService.delete(row.uuid).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                this.getExpenditureCostList();
                this.subEconomicList = [];
            }
        });
    }

    private openDialog(row: ExpenditureCostModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(row);
                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }

        });
    }

    // set total value on changing gob
    onGobChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                total: Number($event.target['value']) +
                    (this.formFinancialInfo.value.pa ? this.formFinancialInfo.value.pa : 0) +
                    (this.formFinancialInfo.value.ownFund ? this.formFinancialInfo.value.ownFund : 0) +
                    (this.formFinancialInfo.value.others ? this.formFinancialInfo.value.others : 0)
            });
        }
    }

    // set rpa value on changing rpaGob
    onRpaGobChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                rpa: Number($event.target['value']) + (this.formFinancialInfo.value.rpaSpecialAccount ? this.formFinancialInfo.value.rpaSpecialAccount : 0),
            });
            this.onPaChange();
            this.onRpaChange();
            this.onDpaChange();
        }
    }

    // set rpa value on changing special account
    onSpecialAccountChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                rpa: Number($event.target['value']) + (this.formFinancialInfo.value.rpaGob ? this.formFinancialInfo.value.rpaGob : 0),
            });
            this.onPaChange();
            this.onRpaChange();
            this.onDpaChange();
        }
    }

    feGoBChange($event: Event) {
        const feValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const gobValue = this.formFinancialInfo.value.gob ? this.formFinancialInfo.value.gob : 0;
        if (feValue > gobValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.formFinancialInfo.patchValue({feGob: 0});
        }
    }

    otherFeChange($event: Event) {
        const feValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const otherValue = this.formFinancialInfo.value.others ? this.formFinancialInfo.value.others : 0;
        if (feValue > otherValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.formFinancialInfo.patchValue({othersFe: 0});
        }
    }

    feOwnFundBChange($event: KeyboardEvent) {
        const feOwnFundValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const ownFundValue = this.formFinancialInfo.value.ownFund ? this.formFinancialInfo.value.ownFund : 0;
        if (feOwnFundValue > ownFundValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.formFinancialInfo.patchValue({feOwnFund: 0});
        }
    }

    // set dpa value on changing dpa through pd
    onDpaThroughPdChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                dpa: Number($event.target['value']) + (this.formFinancialInfo.value.dpaThroughDp ? this.formFinancialInfo.value.dpaThroughDp : 0),
            });
            this.onPaChange();
            this.onRpaChange();
            this.onDpaChange();
        }
    }

    // set dpa value on changing dpa through dp
    onDpaThroughDpChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                dpa: Number($event.target['value']) + (this.formFinancialInfo.value.dpaThroughPd ? this.formFinancialInfo.value.dpaThroughPd : 0),
            });
            this.onPaChange();
            this.onRpaChange();
            this.onDpaChange();
        }
    }

    // set total value on changing pa
    onPaChange() {
        this.formFinancialInfo.patchValue({
            total: (this.formFinancialInfo.value.rpa ? this.formFinancialInfo.value.rpa : 0) +
                (this.formFinancialInfo.value.dpa ? this.formFinancialInfo.value.dpa : 0) +
                (this.formFinancialInfo.value.gob ? this.formFinancialInfo.value.gob : 0) +
                (this.formFinancialInfo.value.ownFund ? this.formFinancialInfo.value.ownFund : 0) +
                (this.formFinancialInfo.value.other ? this.formFinancialInfo.value.other : 0)
        });
    }

    // set pa value on changing rpa
    onRpaChange() {
        this.formFinancialInfo.patchValue({
            pa: (this.formFinancialInfo.value.rpa ? this.formFinancialInfo.value.rpa : 0) +
                (this.formFinancialInfo.value.dpa ? this.formFinancialInfo.value.dpa : 0)
        });
        this.onPaChange();
    }

    // set pa value on changing dpa
    onDpaChange() {
        this.formFinancialInfo.patchValue({
            pa: (this.formFinancialInfo.value.rpa ? this.formFinancialInfo.value.rpa : 0) +
                (this.formFinancialInfo.value.dpa ? this.formFinancialInfo.value.dpa : 0)
        });
        this.onPaChange();
    }

    // set total value on changing own fund
    onOwnFundChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                total: Number($event.target['value']) +
                    (this.formFinancialInfo.value.pa ? this.formFinancialInfo.value.pa : 0) +
                    (this.formFinancialInfo.value.gob ? this.formFinancialInfo.value.gob : 0) +
                    (this.formFinancialInfo.value.other ? this.formFinancialInfo.value.other : 0)
            });
        }
    }

    // set total value on changing other
    onOtherChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formFinancialInfo.patchValue({
                total: Number($event.target['value']) +
                    (this.formFinancialInfo.value.pa ? this.formFinancialInfo.value.pa : 0) +
                    (this.formFinancialInfo.value.ownFund ? this.formFinancialInfo.value.ownFund : 0) +
                    (this.formFinancialInfo.value.gob ? this.formFinancialInfo.value.gob : 0)
            });
        }
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getExpenditureCostList();
    }

    saveAndNext(): void {
        this.nextStep.emit(true);
    }

    saveAndExit(): void {
        this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
    }

    back(): void {
        this.backPrevious.emit(true);
    }


}
