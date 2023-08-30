import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {VisitPlanModel} from '../../../../../models/visit-plan.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {ActivatedRoute, Router} from '@angular/router';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../../../core/constants/constant';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {VisitPlanService} from '../../../../../services/visit-plan.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {Subscription} from 'rxjs';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {FeasibilityStudyProposalSummaryService} from "../../../../../services/feasibility-study-proposal-summary.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {ERROR} from "../../../../../../../core/constants/message";

@Component({
    selector: 'app-visit-plan',
    templateUrl: './visit-plan.component.html',
    styleUrls: ['./visit-plan.component.scss']
})
export class VisitPlanComponent implements OnInit {
    @Output() backPrevious = new EventEmitter<boolean>();

    clickEventSubscription: Subscription;

    form: FormGroup;

    fspMasterId: number;

    visitPlanUpdated: boolean;

    dataSource: MatTableDataSource<VisitPlanModel>;
    displayColumns: string[] = ['sl', 'taskDetails', 'startDate', 'endDate', 'location', 'remarks', 'action'];

    // for pagination
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    startDateFs: Date;
    endDateFs: Date;
    endDate: Date;

    spinner: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: VisitPlanService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private snackbarHelper: SnackbarHelper) {
        this.clickEventSubscription = this.service.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        })
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.initForm();
        if(this.fspMasterId > 0) {
            this.getVisitPlanList();
        }
    }

    private initForm(): void {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            taskDetails: new FormControl(''),
            startDate: new FormControl(''),
            endDate: new FormControl(''),
            location: new FormControl(''),
            remarks: new FormControl(''),
            fspMasterId: new FormControl(this.fspMasterId)
        });
    }

    // load all api data
    loadData(): void {
        this.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;
        this.initForm();
        this.getFspSummaryById();
        if(this.fspMasterId > 0) {
            this.getVisitPlanList();
        }
    }

    private getFspSummaryById() {
        this.feasibilityStudyProposalSummaryService.getById(this.fspMasterId).subscribe(res => {
            this.startDateFs = new Date(res.dateOfCommencement);
            this.endDateFs = new Date(res.dateOfCompletion);
        });
    }

    onSubmit() {
        if(this.form.value.taskDetails && this.form.value.startDate && this.form.value.endDate && this.form.value.location) {
            if (this.fspMasterId > 0) {
                this.form.value.fspMasterId = this.fspMasterId;
                (this.form.value.uuid) ? this.update() : this.create();
            }
            // this.form.value.markAsUntouched();
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please give mandatory data", ERROR);
        }
        // else {
        //     this.form.markAllAsTouched();
        //     this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        // }

    }

    // for get VisitPlanList
    private getVisitPlanList() {
        this.service.getVisitPlanListByFsProposalSummary(this.fspMasterId, this.page, this.size).subscribe(res => {
            if(res.content.length > 0) {
                if(this.feasibilityProposalHelperService.feasibilityUpdate === true){
                    this.visitPlanUpdated = true;
                } else {
                    this.visitPlanUpdated = false;
                }
            } else {
                this.visitPlanUpdated = false;
            }
            this.dataSource = new MatTableDataSource(res.content);
            this.total = res.totalElements;
        });
    }

    // for create visit plan
    private create() {
        this.spinner = true;
        this.service.create(this.form.value).subscribe(res => {
            if (res.uuid) {
                this.snackbarHelper.openSuccessSnackBar();
                this.spinner = false;
                this.resetForm();
            }
        }, err => {
            this.spinner = false;
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    // for update visit plan
    private update() {
        this.spinner = true;
        this.service.update(this.form.value).subscribe(res => {
            if (res.uuid) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                this.spinner = false;
                this.resetForm();
            }
        }, err => {
            this.spinner = false;
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    // edit form data
    edit(row: VisitPlanModel) {
        this.form.patchValue({
            uuid: row.uuid,
            taskDetails: row.taskDetails,
            startDate: row.startDate,
            endDate: row.endDate,
            location: row.location,
            remarks: row.remarks,
            fspMasterId: row.fspMasterId
        });
        this.endDate = row.startDate;
    }

    // delete mode of finance
    delete(row: VisitPlanModel) {
        this.service.delete(row.uuid).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                this.getVisitPlanList();
            }
        });
    }

    // reset form data
    public resetForm() {
        this.form.reset();
        this.getVisitPlanList();
        this.initForm();
        this.form.value.markAsUntouched();
        this.endDate = this.startDateFs;
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
        this.getVisitPlanList();
    }


    private openDialog(row: VisitPlanModel) {
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

    startDateChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.endDate = value;
    }

    saveAndExit(): void {
        this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
    }

    back(): void {
        this.backPrevious.emit(true);
    }

}
