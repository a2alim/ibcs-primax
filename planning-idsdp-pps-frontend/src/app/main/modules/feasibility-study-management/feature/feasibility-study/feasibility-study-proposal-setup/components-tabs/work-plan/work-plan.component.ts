import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {WorkPlanModel} from '../../../../../models/work-plan.model';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {WorkPlanService} from '../../../../../services/work-plan.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ERROR, FAILED_DELETE, OK, SUCCESSFULLY_DELETED} from '../../../../../../../core/constants/message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {VendorManagementService} from '../../../../../services/vendor-management.service';
import {CommitteeService} from '../../../../../services/committee.service';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {FeasibilityStudyProposalSummaryService} from "../../../../../services/feasibility-study-proposal-summary.service";

@Component({
  selector: 'app-work-plan',
  templateUrl: './work-plan.component.html',
  styleUrls: ['./work-plan.component.scss']
})
export class WorkPlanComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();

    clickEventSubscription: Subscription;
    canUpdate: boolean;
    fspMasterId: number;

     startDateFs: Date;
     endDateFs: Date;

     workPlanUpdated: boolean;

     startWork: Date[] = [];

    data = [ ];
    vendorList = [];
    committeeList = [];
    modelList: WorkPlanModel[] = new Array<WorkPlanModel>();
    workPlanDataSource = new BehaviorSubject<AbstractControl[]>([]);
    displayColumns = ['sl', 'taskDetails', 'committee', 'vendor', 'startDate', 'endDate', 'status', 'action'];
    rows: FormArray = this.fb.array([]);
    form: FormGroup = this.fb.group({
        workPlan: this.rows
    });

    startDate: Date[] = [];
    endDate: Date[] = [];

    spinner: boolean;

    constructor(private fb: FormBuilder, private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private service: WorkPlanService,
                private vendorManagementService: VendorManagementService,
                private committeeService: CommitteeService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private matDialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private snackbarHelper: SnackbarHelper) {
        this.clickEventSubscription = this.service.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        const row = this.fb.group({
            taskDetails   : ['', Validators.required],
            committeeId   : ['', Validators.required],
            vendorId      : ['', Validators.required],
            startDate     : ['', Validators.required],
            endDate     : ['', Validators.required],
            status     : ['', Validators.required],
            uuid: ''
        });
        this.rows.push(row);
        this.data.forEach(() => this.addRow());
        this.updateView();
        this.getVendorList();
        this.getCommitteeList();
        if(this.fspMasterId > 0) {
            this.getWorkPlanListByFspMasterId();
        }
    }

    // load all api data
    loadData(): void {
        this.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;
        const row = this.fb.group({
            taskDetails   : ['', Validators.required],
            committeeId   : ['', Validators.required],
            vendorId      : ['', Validators.required],
            startDate     : ['', Validators.required],
            endDate     : ['', Validators.required],
            status     : ['', Validators.required],
            uuid: ''
        });
        this.rows.push(row);
        this.data.forEach(() => this.addRow());
        this.updateView();
        this.getVendorList();
        this.getFspSummaryById();
        this.getCommitteeList();
        if(this.fspMasterId > 0) {
            this.getWorkPlanListByFspMasterId();
        }
    }

    private getFspSummaryById() {
        this.feasibilityStudyProposalSummaryService.getById(this.fspMasterId).subscribe(res => {
            this.startDateFs = new Date(res.dateOfCommencement);
            this.endDateFs = new Date(res.dateOfCompletion);
        });
    }

    /*
     * delete current row by index
     * @param index
     */
    deleteRow(index): any {
        if (this.rows.length === 1) {
            this.modelList.splice(index);
            this.rows.reset();
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            this.modelList.splice(index, 1);
            // if(this.canUpdate){
            //     this.modelList = [];
            //     this.rows.value.forEach(e => {
            //         this.modelList.push(e);
            //     });
            // }
            return true;
        }
    }

    addRow(): any {
        const row = this.fb.group({
            taskDetails   : ['', Validators.required],
            committeeId   : ['', Validators.required],
            vendorId      : ['', Validators.required],
            startDate     : ['', Validators.required],
            endDate     : ['', Validators.required],
            status     : ['', Validators.required],
            uuid: '',
        });
        this.rows.push(row);
        this.updateView();
        this.form.value.workPlan.markAsUntouched();
    }

    updateView(): any {
        this.workPlanDataSource.next(this.rows.controls);
    }

    saveAndNext() {
        this.modelList = [];
        this.rows.getRawValue().forEach(e => {
            this.modelList.push(e);
        });
        if (this.form.valid) {
            this.spinner = true;
            this.service.createWorkPlan(this.modelList, this.fspMasterId).subscribe(res => {
                this.form.reset();
                this.spinner = false;
                this.getWorkPlanListByFspMasterId();
                this.snackbarHelper.openSuccessSnackBar();
                this.nextStep.emit(true);
            }, error => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBar();
            } );
        } else {
            this.form.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    saveAndExit() {
        this.modelList = [];
        this.rows.getRawValue().forEach(e => {
            this.modelList.push(e);
        });
        if (this.form.valid) {
            this.spinner = true;
            this.service.createWorkPlan(this.modelList, this.fspMasterId).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.spinner = false;
                this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
            }, error => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBar();
            } );
        } else {
            this.form.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    /*
    Get Vendor List
     */

    getVendorList(): any {
        this.vendorList = [];
        this.vendorManagementService.getVendorManagementListByFsProposalSummary(this.fspMasterId, 0, 50).subscribe(res => {
            res.content.forEach(m => {
                this.vendorList.push(m);
            });
        });
    }

    /*
    Get Committee List
     */

    getCommitteeList(): any {
        this.committeeList = [];
        this.committeeService.getCommitteeListByFspMasterId(this.fspMasterId, 0, 50).subscribe(res => {
            res.content.forEach(m => {
                this.committeeList.push(m);
            });
        });
    }

    backPrevious() {
        this.backPreviousPage.emit(true);
    }

    getWorkPlanListByFspMasterId(): any {
        this.service.getWorkPlanByFspMasterId(this.fspMasterId).subscribe(res => {
            this.rows.clear();
            if (res.length > 0) {
                res.forEach(re => {
                    this.endDate.push(re.startDate);
                    const row = this.fb.group({
                        taskDetails: re.taskDetails,
                        committeeId: re.committeeId,
                        vendorId: re.vendorId,
                        startDate: re.startDate,
                        endDate: re.endDate,
                        status: re.status,
                        uuid: re.uuid
                    });
                    this.modelList.push(re);
                    this.rows.push(row);
                    this.updateView();
                });
                this.canUpdate = true;
            } else {
                this.canUpdate = false;
                const row = this.fb.group({
                    taskDetails   : ['', Validators.required],
                    committeeId   : ['', Validators.required],
                    vendorId      : ['', Validators.required],
                    startDate     : ['', Validators.required],
                    endDate     : ['', Validators.required],
                    status     : ['', Validators.required],
                    uuid: '',
                });
                this.rows.push(row);
                this.data.forEach(() => this.addRow());
                this.updateView();
            }
        });
    }

    updateAndNext() {
        this.modelList = [];
        this.rows.getRawValue().forEach(e => {
            this.modelList.push(e);
        });
        if (this.form.valid) {
            this.spinner = true;
            this.service.updateWorkPlan(this.modelList, this.fspMasterId).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.nextStep.emit(true);
            }, error => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            });
        } else {
            this.form.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    updateAndExit() {
        this.modelList = [];
        this.rows.getRawValue().forEach(e => {
            this.modelList.push(e);
        });
        if (this.form.valid) {
            this.spinner = true;
            this.service.updateWorkPlan(this.modelList, this.fspMasterId).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
            }, error => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            });
        } else {
            this.form.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    deleteFromDb(row: any) {
        const uuid = this.modelList[row].uuid;
        this.service.delete(uuid).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.getWorkPlanListByFspMasterId();
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
        });
    }

    private openDialog(index: any, type: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                if (type === 'deleteCurrentRow') {
                    this.deleteRow(index);
                    dialogRef.close(true);
                } else if (type === 'deleteRowFromDB') {
                    this.modelList = [];
                    this.rows.getRawValue().forEach(e => {
                        this.modelList.push(e);
                    });
                    const uuid = this.modelList[index].uuid;
                    if (uuid) {
                        this.deleteFromDb(index);
                    } else {
                        this.deleteRow(index);
                        dialogRef.close(true);
                    }
                    dialogRef.close(true);
                }
            }
            dialogRef.close(true);
        });
    }

    startDateChange($event: MatDatepickerInputEvent<Date>, index) {
        const value = new Date($event.value);
        this.endDate[index] = value;
    }

    nextTab(): void {
        this.nextStep.emit(true);
    }

    // endDateChange($event: MatDatepickerInputEvent<Date>, index) {
    //     const value = new Date($event.value);
    //     this.startDate[index] = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    // }

}
