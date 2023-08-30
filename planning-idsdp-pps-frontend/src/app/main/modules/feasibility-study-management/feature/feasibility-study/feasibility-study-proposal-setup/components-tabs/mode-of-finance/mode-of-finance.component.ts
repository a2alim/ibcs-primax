import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ModeOfFinanceModel} from '../../../../../models/mode-of-finance.model';
import {IModeOfFinance} from '../../../../../../configuration-management/models/mode-of-finance';
import {Subscription} from 'rxjs';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from '../../../../../../../core/constants/constant';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ModeOfFinanceService} from '../../../../../services/mode-of-finance.service';
import {ModeOfFinanceConfigService} from '../../../../../../configuration-management/services/mode-of-finance.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {ProjectSummaryService} from '../../../../../../project-concept-management/services/project-summary.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {IFeasibilityModel} from "../../../../../models/feasibility-study-proposal.model";
import {FeasibilityStudyProposalSummaryService} from "../../../../../services/feasibility-study-proposal-summary.service";
import {IPaSourceModel} from "../../../../../../configuration-management/models/pa-source.model";
import {PaSourceService} from "../../../../../../configuration-management/services/pa-source.service";
import {OK} from "../../../../../../../core/constants/message";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";

@Component({
  selector: 'app-mode-of-finance',
  templateUrl: './mode-of-finance.component.html',
  styleUrls: ['./mode-of-finance.component.scss']
})
export class ModeOfFinanceComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    formGroup: FormGroup;

    fspMasterId: number;

    projectConceptId: string;

    isSelfFund: boolean;
    isForeignAid: boolean;

    fspSummary: IFeasibilityModel;
    modeOfFinanceTotal: number = 0;

    existingModeOfFinance: number = 0;

    modelOfFinanceList: ModeOfFinanceModel[] = [];
    totalModeOfFinance: ModeOfFinanceModel;

    // table column
    displayedColumns: string[] = ['modeOfFinance', 'total', 'gob', 'pa', 'ownFund', 'other', 'action'];

    dataSource: MatTableDataSource<ModeOfFinanceModel>;
    configModeList: Array<IModeOfFinance> = new Array<IModeOfFinance>();
    paSourceList: Array<IPaSourceModel> = new Array<IPaSourceModel>();
    clickEventSubscription: Subscription;

    // for pagination
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    modeUpdate: boolean;

    projectSummary: IProjectConcept;

    spinner: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ModeOfFinanceService, private configService: ModeOfFinanceConfigService,
                private dialog: MatDialog,
                private router: Router,
                private formBuilder: FormBuilder,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private projectSummaryService: ProjectSummaryService,
                private paSourceService: PaSourceService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private route: ActivatedRoute,
                private snackbarHelper: SnackbarHelper
    ) {
        this.projectConceptId = this.route.snapshot.params['uuid'];
        this.fspMasterId = feasibilityProposalHelperService.feasibilityProposalCreateId;
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.clickEventSubscription = this.service.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        })
    }

    ngOnInit(): void {
        if (this.fspMasterId) {
            this.getModeOfFinanceList();
        }
        this.getPCByUuid();
        this.populateForm();
        this.getConfigModeList();
        this.getConfigPaSourceList();
    }

    private getPCByUuid() {
        this.projectSummaryService.getByUuid(this.projectConceptId).subscribe(res => {
            this.projectSummary = res;
            this.isSelfFund = res.isSelfFund;
            this.isForeignAid = res.isForeignAid;
        });
    }

    // load all api data
    loadData(): void {
        this.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;
        this.populateForm();
        this.getPCByUuid();
        this.getFspSummaryById();
        this.getConfigModeList();
        this.getModeOfFinanceList();
        this.getConfigPaSourceList();
    }

    private getFspSummaryById() {
        this.feasibilityStudyProposalSummaryService.getById(this.fspMasterId).subscribe(res => {
            this.fspSummary = res;
        })
    }

    // init form data
    private populateForm() {
        this.formGroup = new FormGroup({
            uuid: new FormControl(''),
            modeFinId: new FormControl(''),
            totalAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            gobAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            feGobAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            ownFundAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            feOwnFundAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            paAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            rpaAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            dpaAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            otherAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            feOtherAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
            paSourceId: new FormControl(''),
            fspMasterId: new FormControl(this.fspMasterId)
        });
    }

    onSubmit() {
        if (this.fspMasterId > 0 && this.formGroup.valid && this.formGroup.value.modeFinId) {
                this.formGroup.value.fspMasterId = this.fspMasterId;
                (this.formGroup.value.uuid) ? this.update() : this.create();
            // this.formGroup.value.markAsUntouched();
        } else if (this.formGroup.valid && !this.formGroup.value.modeFinId && !this.formGroup.value.paSourceId) {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please select mode and pa source", OK);
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please give mandatory data", OK);
        }


        // else{
        //     this.formGroup.markAllAsTouched();
        //     this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        // }
    }

    // for get ConfigModeList
    private getConfigModeList() {
        this.configService.getActiveModeOfFinance(this.page, MAX_PAGE_SIZE).subscribe(res => {
            this.configModeList = res.content;
            this.configModeList.forEach(e => {
                e.isActive = this.modelOfFinanceList.some(s => s.modeFinId === e.id);
            })
        });
    }

    // for get ConfigPaSourceList
    private getConfigPaSourceList() {
        this.paSourceService.getActivePaSource().subscribe(res => {
            this.paSourceList = res;
        });
    }

    // for get ModeOfFinanceList
    private getModeOfFinanceList() {
        this.service.getModeOfFinanceListByFsProposalSummary(this.fspMasterId, this.page, this.size).subscribe(res => {
            if(res.content.length > 0) {
                if(this.feasibilityProposalHelperService.feasibilityUpdate === true){
                    this.modeUpdate = true;
                } else {
                    this.modeUpdate = false;
                }
            } else {
                this.modeUpdate = false;
            }
            this.dataSource = new MatTableDataSource(res.content);
            this.total = res.totalElements;
            this.modelOfFinanceList = res.content;
            this.modeOfFinanceTotal = res.content?.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
            if (this.modelOfFinanceList.length > 0) {
                this.getTotalModeData();
            }
            this.getConfigModeList();
        });
    }

    getTotalModeData() {
        this.totalModeOfFinance = {} as ModeOfFinanceModel;
        this.totalModeOfFinance.dpaAmount = this.modelOfFinanceList.map(m => m.dpaAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.feGobAmount = this.modelOfFinanceList.map(m => m.feGobAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.feOtherAmount = this.modelOfFinanceList.map(m => m.feOtherAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.feOwnFundAmount = this.modelOfFinanceList.map(m => m.feOwnFundAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.gobAmount = this.modelOfFinanceList.map(m => m.gobAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.otherAmount = this.modelOfFinanceList.map(m => m.otherAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.ownFundAmount = this.modelOfFinanceList.map(m => m.ownFundAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.paAmount = this.modelOfFinanceList.map(m => m.paAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.rpaAmount = this.modelOfFinanceList.map(m => m.rpaAmount).reduce((sum, current) => sum + current, 0);
        this.totalModeOfFinance.totalAmount = this.modelOfFinanceList.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
    }

    // for create mode of finance
    private create() {
        if((this.fspSummary.totalAmount - this.modeOfFinanceTotal) >= Number(this.formGroup.value.totalAmount)) {
            if (this.modelOfFinanceList.some(s => s.modeFinId === this.formGroup.value.modeFinId)) {
                this.snackbarHelper.openWarnSnackBarWithMessage("This mode is already added", OK);
            }else{
                this.spinner = true;
                this.service.create(this.formGroup.value).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBar();
                        this.formGroup.reset();
                        this.spinner = false;
                        this.getModeOfFinanceList();
                        this.populateForm();
                    }
                }, err => {
                    this.spinner = false;
                    this.snackbarHelper.openErrorSnackBar();
                });
            }

            this.formGroup.value.markAsUntouched();
        } else this.snackbarHelper.openErrorSnackBarWithMessage("Can not take more than balance", OK);
    }

    // for update mode of finance
    private update() {
        if((this.fspSummary.totalAmount - this.modeOfFinanceTotal) >= Number(this.formGroup.value.totalAmount - this.existingModeOfFinance)) {
            this.spinner = true;
            this.service.update(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                    this.formGroup.reset();
                    this.populateForm();
                    this.spinner = false;
                    this.getModeOfFinanceList();
                }
            }, err => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBar();
            });
            this.formGroup.value.markAsUntouched();
        }  else this.snackbarHelper.openErrorSnackBarWithMessage("Can not take more than balance", OK);
    }

    // edit form data
    edit(row: ModeOfFinanceModel) {
        this.formGroup.patchValue({
            uuid: row.uuid,
            modeFinId: row.modeFinId,
            totalAmount: row.totalAmount,
            gobAmount: row.gobAmount,
            feGobAmount: row.feGobAmount,
            ownFundAmount: row.ownFundAmount,
            feOwnFundAmount: row.feOwnFundAmount,
            paAmount: row.paAmount,
            rpaAmount: row.rpaAmount,
            dpaAmount: row.dpaAmount,
            otherAmount: row.otherAmount,
            feOtherAmount: row.feOtherAmount,
            paSourceId: row.paSourceId,
            fspMasterId: row.fspMasterId
        });
        this.existingModeOfFinance = row.totalAmount;
    }

    // delete mode of finance
    delete(row: ModeOfFinanceModel) {
        this.service.delete(row.uuid).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                this.getModeOfFinanceList();
            }
        });
    }

    // reset form data
    public resetForm() {
        this.formGroup.reset();
        this.getModeOfFinanceList();
        this.populateForm();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getModeOfFinanceList();
    }

    // set total value on changing own fund
    onOwnFundChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formGroup.patchValue({
                totalAmount: Number($event.target['value']) +
                    (this.formGroup.value.paAmount ? this.formGroup.value.paAmount : 0) +
                    (this.formGroup.value.gobAmount ? this.formGroup.value.gobAmount : 0) +
                    (this.formGroup.value.otherAmount ? this.formGroup.value.otherAmount : 0)
            });
        }
    }

    // set pa value on changing rpa
    onRpaChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formGroup.patchValue({
                paAmount: Number($event.target['value']) + (this.formGroup.value.dpaAmount ? this.formGroup.value.dpaAmount : 0),
            });
            this.onPaChange();
        }
    }

    // set pa value on changing rpa
    onDpaChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formGroup.patchValue({
                paAmount: Number($event.target['value']) + (this.formGroup.value.rpaAmount ? this.formGroup.value.rpaAmount : 0),
            });
            this.onPaChange();
        }
    }

    // set total value on changing pa
    onPaChange() {
        this.formGroup.patchValue({
            totalAmount: (this.formGroup.value.rpaAmount ? this.formGroup.value.rpaAmount : 0) +
                (this.formGroup.value.dpaAmount ? this.formGroup.value.dpaAmount : 0) +
                (this.formGroup.value.gobAmount ? this.formGroup.value.gobAmount : 0) +
                (this.formGroup.value.ownFundAmount ? this.formGroup.value.ownFundAmount : 0) +
                (this.formGroup.value.otherAmount ? this.formGroup.value.otherAmount : 0)
        });
    }

    // set total value on changing gob
    onGobChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formGroup.patchValue({
                totalAmount: Number($event.target['value']) +
                    (this.formGroup.value.paAmount ? this.formGroup.value.paAmount : 0) +
                    (this.formGroup.value.ownFundAmount ? this.formGroup.value.ownFundAmount : 0) +
                    (this.formGroup.value.otherAmount ? this.formGroup.value.otherAmount : 0)
            });
        }
    }

    feGoBChange($event: Event) {
        const feValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const gobValue = this.formGroup.value.gobAmount ? this.formGroup.value.gobAmount : 0;
        if (feValue > gobValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", OK);
            this.formGroup.patchValue({feGobAmount: 0});
        }
    }

    feOwnFundBChange($event: KeyboardEvent) {
        const feOwnFundValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const ownFundValue = this.formGroup.value.ownFundAmount ? this.formGroup.value.ownFundAmount : 0;
        if (feOwnFundValue > ownFundValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", OK);
            this.formGroup.patchValue({feOwnFundAmount: 0});
        }
    }

    feOtherChange($event: KeyboardEvent) {
        const feOtherValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const otherValue = this.formGroup.value.otherAmount ? this.formGroup.value.otherAmount : 0;
        if (feOtherValue > otherValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Other", OK);
            this.formGroup.patchValue({feOtherAmount: 0});
        }
    }

    // set total value on changing other
    onOtherChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formGroup.patchValue({
                totalAmount: Number($event.target['value']) +
                    (this.formGroup.value.paAmount ? this.formGroup.value.paAmount : 0) +
                    (this.formGroup.value.ownFundAmount ? this.formGroup.value.ownFundAmount : 0) +
                    (this.formGroup.value.gobAmount ? this.formGroup.value.gobAmount : 0)
            });
        }
    }

    private openDialog(row: ModeOfFinanceModel) {
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
