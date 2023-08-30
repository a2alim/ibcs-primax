import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModeOfFinanceModel} from '../../../../../models/mode-of-finance.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from '../../../../../../../core/constants/constant';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ModeOfFinanceService} from '../../../../../services/mode-of-finance.service';
import {ModeOfFinanceConfigService} from '../../../../../../configuration-management/services/mode-of-finance.service';
import {IModeOfFinance} from '../../../../../../configuration-management/models/mode-of-finance';
import {ProjectSummaryService} from '../../../../../services/project-summary.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ProjectConceptService} from "../../../../../services/project-concept.service";
import {Subscription} from 'rxjs'
import {IProjectConcept} from '../../../../../models/project-concept';
import {ERROR, OK} from '../../../../../../../core/constants/message';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-mode-of-finance',
    templateUrl: './mode-of-finance.component.html',
    styleUrls: ['./mode-of-finance.component.scss']
})

export class ModeOfFinanceComponent extends UnsubscribeAdapterComponent implements OnInit {


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() projectConceptMasterId: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    formGroup: FormGroup;
    canUpdate: any;

    // table column
    displayedColumns: string[] = ['sl', 'modeOfFinance', 'total', 'gob', 'pa', 'ownFund', 'other', 'action'];

    modelOfFinanceList: ModeOfFinanceModel[] = [];
    dataSource: MatTableDataSource<ModeOfFinanceModel>;
    totalModeOfFinance: ModeOfFinanceModel;
    configModeList: Array<IModeOfFinance> = new Array<IModeOfFinance>();
    projectSummary: IProjectConcept;
    clickEventSubscription: Subscription;

    // for pagination
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    modeOfFinanceTotal: number = 0;
    projectConceptUuid: any;
    disableSave: boolean;

    gob ='color: red';
    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ModeOfFinanceService, private configService: ModeOfFinanceConfigService,
                private projectSummaryService: ProjectSummaryService,
                private dialog: MatDialog, private snackbarHelper: SnackbarHelper,
                private projectConceptService: ProjectConceptService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.clickEventSubscription = this.service.getProjectSummarySaveEvent().subscribe(() => {
            this.loadData();
        })
    }

    ngOnInit(): void {
        this.projectConceptUuid = this.activatedRoute.snapshot.paramMap.get('uuid');
        if (this.projectConceptUuid) {
            this.canUpdate = true;
        }

        if (this.projectConceptMasterId) {
            this.getProjectSummary();
            this.getModeOfFinanceList();
        }
        this.populateForm();
        this.getConfigModeList();
    }

    // load all api data
    loadData(): void {
        this.projectConceptMasterId = this.projectConceptService.projectSummaryCreateId;
        this.getProjectSummary();
        this.populateForm();
        this.getModeOfFinanceList();
        this.getConfigModeList();
    }

    // init form data
    private populateForm() {
        this.formGroup = new FormGroup({
            uuid: new FormControl(''),
            modeId: new FormControl(''),
            totalAmount: new FormControl(0, [Validators.required]),
            gobAmount: new FormControl(0, [Validators.required]),
            feGobAmount: new FormControl(0),
            ownFundAmount: new FormControl(0),
            feOwnFundAmount: new FormControl(0),
            paAmount: new FormControl(0),
            rpaAmount: new FormControl(0),
            dpaAmount: new FormControl(0),
            otherAmount: new FormControl(0),
            feOtherAmount: new FormControl(0),
            projectConceptMasterId: new FormControl(this.projectConceptMasterId)
        });
    }

    onSubmit() {
        this.disableSave = true;
        if (this.projectConceptMasterId > 0) {
            if ((this.projectSummary.totalAmount - this.modeOfFinanceTotal) >= Number(this.formGroup.value.totalAmount)) {
                this.formGroup.value.projectConceptMasterId = this.projectConceptMasterId;
                if (this.formGroup.valid && this.formGroup.value.modeId) {
                        this.disableSave = false;
                        (this.formGroup.value.uuid) ? this.update() : this.create();
                    this.getConfigModeList();
                } else if (this.formGroup.valid && !this.formGroup.value.modeId) {
                    this.disableSave = false;
                    this.snackbarHelper.openWarnSnackBarWithMessage("Please select mode", OK);
                } else {
                    this.disableSave = false;
                    this.snackbarHelper.openWarnSnackBarWithMessage("Please give mandatory data", OK);
                }
            } else {
                this.disableSave = false;
                this.snackbarHelper.openWarnSnackBarWithMessage("Can not take more than balance", OK)
            }
        } else {
            this.disableSave = false;
            this.snackbarHelper.openWarnSnackBarWithMessage("Please create Project Summary", "WARNING")
        }
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.subscribe$.add(
            this.projectSummaryService.getById(this.projectConceptMasterId).subscribe(res => {
                this.projectSummary = res;
            })
        );
    }

    // for get ConfigModeList
    private getConfigModeList() {
        this.configModeList=[];
        this.spinner = true;
        this.subscribe$.add(
            this.configService.getActiveModeOfFinance(this.page, MAX_PAGE_SIZE).subscribe(res => {
                this.configModeList = res.content;
                this.configModeList.forEach(e => {
                    e.isActive = this.modelOfFinanceList.some(s => s.modeId === e.id);
                })
                this.spinner = false;
            })
        );
    }

    // for get ModeOfFinanceList
    private getModeOfFinanceList() {
        this.spinner= true;
        this.subscribe$.add(
            this.service.getModeOfFinanceListByProjectSummaryId(this.projectConceptMasterId).subscribe(res => {
                this.modelOfFinanceList = res;
                this.dataSource = new MatTableDataSource(this.modelOfFinanceList);
                this.dataSource.paginator = this.paginator;
                this.total = res.length;
                this.modeOfFinanceTotal = res?.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0);
                if (this.modelOfFinanceList.length > 0) {
                    this.getTotalModeData();
                }
                this.getConfigModeList();
                this.spinner = false;
            })
            /*this.service.getModeOfFinanceListByProjectSummary(this.projectConceptMasterId, this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content);
                this.total = res.totalElements;
                this.modeOfFinanceTotal = res.content?.map(m => m.totalAmount).reduce((sum, current) => sum + current, 0)
            })*/
        );
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
        // this.setFractionForTwoDigit();
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.disableSave = false;
                    this.resetForm();
                }
                this.spinner = false;
            })
        );
    }

    // private setFractionForTwoDigit() {
    //     this.formGroup.value.gobAmount = Number(this.formGroup.value.gobAmount.toFixed(2));
    //     this.formGroup.value.otherAmount = Number(this.formGroup.value.otherAmount.toFixed(2));
    //     this.formGroup.value.ownFundAmount = Number(this.formGroup.value.ownFundAmount.toFixed(2));
    //     this.formGroup.value.paAmount = Number(this.formGroup.value.paAmount.toFixed(2));
    //     this.formGroup.value.dpaAmount = Number(this.formGroup.value.dpaAmount.toFixed(2));
    //     this.formGroup.value.rpaAmount = Number(this.formGroup.value.rpaAmount.toFixed(2));
    //     this.formGroup.value.totalAmount = Number(this.formGroup.value.totalAmount.toFixed(2));
    //     this.formGroup.value.feGobAmount = Number(this.formGroup.value.feGobAmount.toFixed(2));
    //     this.formGroup.value.feOtherAmount = Number(this.formGroup.value.feOtherAmount.toFixed(2));
    //     this.formGroup.value.feOwnFundAmount = Number(this.formGroup.value.feOwnFundAmount.toFixed(2));
    // }

    // for update mode of finance
    private update() {
        // this.setFractionForTwoDigit();
        this.spinner = true;
        this.subscribe$.add(
            this.service.update(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                    this.disableSave = false;
                    this.resetForm();
                }
                this.spinner = false;
            })
        );
    }

    // edit form data
    edit(row: ModeOfFinanceModel) {
        this.formGroup.patchValue({
            uuid: row.uuid,
            modeId: row.modeId,
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
            projectConceptMasterId: row.projectConceptMasterId
        });
        this.modeOfFinanceTotal -= Number(row.totalAmount);
    }

    // delete mode of finance
    delete(row: ModeOfFinanceModel) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                    this.getModeOfFinanceList();
                }
                this.spinner = false;
            })
        );
    }

    // reset form data
    resetForm() {
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

    // set totalAmount value on changing own fund
    onOwnFundChange($event: Event) {
        const of = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.formGroup.value.feOwnFundAmount > of) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.formGroup.patchValue({feOwnFundAmount: 0});
        }
        this.formGroup.patchValue({
            totalAmount: of +
                (this.formGroup.value.paAmount ? Number(this.formGroup.value.paAmount) : 0) +
                (this.formGroup.value.gobAmount ? Number(this.formGroup.value.gobAmount) : 0) +
                (this.formGroup.value.otherAmount ? Number(this.formGroup.value.otherAmount) : 0)
        });
        this.formGroup.patchValue({
            totalAmount: Number(this.formGroup.value.totalAmount.toFixed(2))
        });
    }

    // set pa value on changing rpa
    onRpaChange($event: Event) {
        const rpa = ($event.target['value']) ? Number($event.target['value']) : 0;
        this.formGroup.patchValue({
            paAmount: rpa + (this.formGroup.value.dpaAmount ? Number(this.formGroup.value.dpaAmount) : 0),
        });
        this.onPaChange();
    }

    // set pa value on changing rpa
    onDpaChange($event: Event) {
        const dpa = ($event.target['value']) ? Number($event.target['value']) : 0;
        this.formGroup.patchValue({
            paAmount: dpa + (this.formGroup.value.rpaAmount ? Number(this.formGroup.value.rpaAmount) : 0),
        });
        this.onPaChange();
    }

    // set totalAmount value on changing pa
    onPaChange() {
        this.formGroup.patchValue({
            totalAmount: (this.formGroup.value.rpaAmount ? Number(this.formGroup.value.rpaAmount) : 0) +
                (this.formGroup.value.dpaAmount ? Number(this.formGroup.value.dpaAmount) : 0) +
                (this.formGroup.value.gobAmount ? Number(this.formGroup.value.gobAmount) : 0) +
                (this.formGroup.value.ownFundAmount ? Number(this.formGroup.value.ownFundAmount) : 0) +
                (this.formGroup.value.otherAmount ? Number(this.formGroup.value.otherAmount) : 0)
        });
        this.formGroup.patchValue({
            totalAmount: Number(this.formGroup.value.totalAmount.toFixed(2))
        });
    }

    // set totalAmount value on changing gobAmount
    onGobChange($event: Event) {
        const gob = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.formGroup.value.feGobAmount > gob) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.formGroup.patchValue({feGobAmount: 0});
        }
        this.formGroup.patchValue({
            totalAmount: gob +
                (this.formGroup.value.paAmount ? Number(this.formGroup.value.paAmount) : 0) +
                (this.formGroup.value.ownFundAmount ? Number(this.formGroup.value.ownFundAmount) : 0) +
                (this.formGroup.value.otherAmount ? Number(this.formGroup.value.otherAmount) : 0)
        });
        this.formGroup.patchValue({
            totalAmount: Number(this.formGroup.value.totalAmount.toFixed(2))
        });
    }

    // set totalAmount value on changing other
    onOtherChange($event: Event) {
        const other = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.formGroup.value.feOtherAmount > other) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
            this.formGroup.patchValue({feOtherAmount: 0});
        }
        this.formGroup.patchValue({
            totalAmount: other +
                (this.formGroup.value.paAmount ? Number(this.formGroup.value.paAmount) : 0) +
                (this.formGroup.value.ownFundAmount ? Number(this.formGroup.value.ownFundAmount) : 0) +
                (this.formGroup.value.gobAmount ? Number(this.formGroup.value.gobAmount) : 0)
        });
        this.formGroup.patchValue({
            totalAmount: Number(this.formGroup.value.totalAmount.toFixed(2))
        });
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


    feGoBChange($event: Event) {
        const feValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const gobValue = this.formGroup.value.gobAmount ? this.formGroup.value.gobAmount : 0;
        if (feValue > gobValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.formGroup.patchValue({feGobAmount: 0});
        }
    }

    feOtherChange($event: Event) {
        const feOtherValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const otherValue = this.formGroup.value.otherAmount ? this.formGroup.value.otherAmount : 0;
        if (feOtherValue > otherValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
            this.formGroup.patchValue({feOtherAmount: 0});
        }
    }

    feOwnFundBChange($event: Event) {
        const feOwnFundValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const ownFundValue = this.formGroup.value.ownFundAmount ? this.formGroup.value.ownFundAmount : 0;
        if (feOwnFundValue > ownFundValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.formGroup.patchValue({feOwnFundAmount: 0});
        }
    }

    /*
Back previous page
 */

    backPreviousPage() {
        this.backPrevious.emit(true);
    }

    saveAndNext() {
        this.nextStep.emit();
    }

    updateAndNext() {
        this.nextStep.emit();
    }

    saveAndExit() {
        this.router.navigate([`project-concept`]);
    }

    updateAndExit() {
        this.router.navigate([`project-concept`]);
    }

    nextTab(): void {
        this.nextStep.emit(true);
    }
}
