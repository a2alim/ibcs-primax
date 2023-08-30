import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {MatTableDataSource} from "@angular/material/table";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../../../core/constants/constant";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {BehaviorSubject, Subscription} from "rxjs";
import {ConfirmDialogConstant} from "../../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {CommitteeModel} from "../../../../../models/committee.model";
import {CommitteeService} from "../../../../../services/committee.service";
import {FeasibilityProposalHelperService} from "../../../../../services/feasibility-proposal-helper.service";
import {
    ERROR,
    FAILED_DELETE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_UPDATED
} from "../../../../../../../core/constants/message";
import {FeasibilityStudyProposalSummaryService} from "../../../../../services/feasibility-study-proposal-summary.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";

@Component({
    selector: 'app-committee-management',
    templateUrl: './committee-management.component.html',
    styleUrls: ['./committee-management.component.scss']
})
export class CommitteeManagementComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    // member form and member list
    memberInfo: boolean;
    data = [];
    memberDataSource = new BehaviorSubject<AbstractControl[]>([]);
    displayColumnsMember = ['sl', 'memberName', 'designation', 'phone', 'email', 'role', 'action'];
    rows: FormArray = this.formBuilder.array([]);

    // commitee form and commitee list
    fspMasterId: number;

    startDate: Date;
    endDate: Date;

    committeeUpdate: boolean;

    isAttachmentNameEnable: boolean;
    attachmentName: any;
    downloadAttachmentId: number;
    attachmentUrl: string;

    committeeFormGroup: FormGroup;
    file: File;
    commiteeDisplayedColumns: string[] = ['sl', 'committeeName', 'description', 'dateOfFormation', 'attachment', 'action'];
    committeeDataSource: MatTableDataSource<CommitteeModel>;
    clickEventSubscription: Subscription;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    // dateOfCommencement: Date;
    // dateOfCompletion: Date;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private formBuilder: FormBuilder,
                private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private committeeService: CommitteeService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private fileUploaderService: FileUploadService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private snackbarHelper: SnackbarHelper) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.fspMasterId = feasibilityProposalHelperService.feasibilityProposalCreateId ? feasibilityProposalHelperService.feasibilityProposalCreateId : 1;
        this.clickEventSubscription = this.committeeService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        })
    }

    ngOnInit(): void {
        if (this.fspMasterId) {
            this.getCommitteeList();
            this.populateCommiteeForm();
            this.loadMemberInfo();
            this.getFspSummaryById();
        }
    }

    loadData(): void {
        this.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;
        this.getCommitteeList();
        this.populateCommiteeForm();
        this.loadMemberInfo();
        this.getFspSummaryById();
    }

    private getFspSummaryById() {
        this.feasibilityStudyProposalSummaryService.getById(this.fspMasterId).subscribe(res => {
            this.startDate = new Date(res.dateOfCommencement);
            this.endDate = new Date(res.dateOfCompletion);
        });
    }

    private loadMemberInfo(): any {
        this.rows.clear();
        const member = this.formBuilder.group({
            memberName: ['', Validators.required],
            designation: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.required],
            role: ['', Validators.required],
            uuid: ''
        });
        this.rows.push(member);
        this.data.forEach(() => this.addMember());
        this.updateMember();

    }

    private populateCommiteeForm() {
        this.committeeFormGroup = new FormGroup({
            uuid: new FormControl(''),
            committeeName: new FormControl(''),
            description: new FormControl(''),
            dateOfFormation: new FormControl(''),
            attachmentId: new FormControl(0),
            fspMasterId: new FormControl(0),
            members: this.rows,
        });
    }

    addMember(): any {
        const row = this.formBuilder.group({
            memberName: ['', Validators.required],
            designation: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.required],
            role: ['', Validators.required],
            uuid: ''
        });
        this.rows.push(row);
        this.updateMember();
        this.committeeFormGroup.value.members.markAsUntouched();
    }

    deleteMemberFromView(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateMember();
            return true;
        }
    }

    // deleteMemberFromDB(index): any {
    //     if (this.rows.length === 1) {
    //         return false;
    //     } else {
    //         this.memberService.deleteMember(this.committeeFormGroup.value.uuid, this.rows.at(index).value.uuid).subscribe(res => {
    //             this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
    //             this.rows.removeAt(index);
    //             this.updateMember();
    //             return true;
    //         });
    //     }
    // }

    updateMember(): any {
        this.memberDataSource.next(this.rows.controls);
    }

    openMemberInfo(): any {
        this.memberInfo = true;
    }

    selectFile(file: FileList): any {
        this.file = file.item(0);
        this.attachmentName = "";
        this.isAttachmentNameEnable = false;
    }

    saveAndExitMemberInfo(): void {
        if (this.committeeFormGroup.valid && this.committeeFormGroup.value.committeeName && this.committeeFormGroup.value.dateOfFormation) {
            this.memberInfo = false;
            (this.committeeFormGroup.value.uuid) ? this.update() : this.create();
            // this.committeeFormGroup.value.markAsUntouched();
        } else if (this.committeeFormGroup.valid && !this.committeeFormGroup.value.committeeName && !this.committeeFormGroup.value.dateOfFormation) {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please give committee name and date of formation", ERROR);
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please give mandatory data", ERROR);
        }

        // else {
        //     this.committeeFormGroup.markAllAsTouched();
        //     this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        // }
    }

    private create() {
        if (this.file) {
            this.fileUploaderService.uploadInFs(this.file).subscribe(res => {
                this.committeeService.createCommitteeAndMemberWithAttachment(this.fspMasterId, this.committeeFormGroup.value, res.id).subscribe(res => {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.reset();
                });
            });
        } else {
            this.committeeService.createCommitteeAndMemberWithAttachment(this.fspMasterId, this.committeeFormGroup.value, null).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.reset();
            });
        }
    }

    private update() {
        if (this.file) {
            this.fileUploaderService.uploadInFs(this.file).subscribe(res => {
                this.committeeFormGroup.value.attachmentId = res.id;
                this.updateCommitteeAndMember();
            });
        } else {
            this.updateCommitteeAndMember();
        }
    }

    private updateCommitteeAndMember() {
        this.committeeService.updateCommitteeWithMember(this.committeeFormGroup.value).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.reset();
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.committeeDataSource.filter = filterValue.trim().toLowerCase();

        if (this.committeeDataSource.paginator) {
            this.committeeDataSource.paginator.firstPage();
        }
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getCommitteeList();
    }


    private getCommitteeList() {
        this.committeeService.getCommitteeListByFspMasterId(this.fspMasterId, this.page, this.size).subscribe(res => {
            if (res.content.length > 0) {
                if (this.feasibilityProposalHelperService.feasibilityUpdate === true) {
                    this.committeeUpdate = true;
                } else {
                    this.committeeUpdate = false;
                }
            } else {
                this.committeeUpdate = false;
            }
            this.committeeDataSource = new MatTableDataSource(res.content);
            this.total = res.totalElements;
        });
    }

    openDialog(row: CommitteeModel) {
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
                row.attachmentId ? this.deleteCommitteeWithAttachment(row) : this.deleteCommitteeWithoutAttachment(row);
                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }
        });
    }

    deleteMemberDialog(index) {
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
                this.deleteMemberFromView(index);
                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }
        });
    }

    edit(row: CommitteeModel) {
        this.memberInfo = true;
        this.rows.clear();
        this.file = null;
        this.committeeFormGroup.patchValue({
            uuid: row.uuid,
            committeeName: row.committeeName,
            description: row.description,
            dateOfFormation: row.dateOfFormation,
            attachmentId: row.attachmentId,
            fspMasterId: row.fspMasterId,
            members: row.members
        });
        row.members.forEach(res => {
            const row = this.formBuilder.group({
                memberName: res.memberName,
                designation: res.designation,
                phone: res.phone,
                email: res.email,
                role: res.role,
                uuid: res.uuid
            });
            this.rows.push(row);
            this.updateMember();
        });
        if (row.attachmentId) {
            this.downloadAttachmentId = row.attachmentId;
            this.fileUploaderService.getByIdFromFs(row.attachmentId).subscribe(res => {
                this.attachmentName = res.fileName;
                this.isAttachmentNameEnable = true;
                this.attachmentUrl = res.pathUrl;
            });
        }
    }

    private deleteCommitteeWithAttachment(row: CommitteeModel) {
        this.fileUploaderService.deleteByIdFs(row.attachmentId.valueOf()).subscribe(res => {
            if (res) {
                this.committeeService.delete(row.uuid).subscribe(res => {
                    if (res) {
                        this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                        this.reset();
                    } else {
                        this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                    }
                })
                // this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                // this.reset();
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
        });
    }

    private deleteCommitteeWithoutAttachment(row: CommitteeModel) {
        this.committeeService.delete(row.uuid).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.reset();
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
        })
    }

    private reset(): void {
        this.memberInfo = false;
        this.committeeFormGroup.reset();
        this.rows.clear();
        this.getCommitteeList();
        this.addMember();
        this.committeeFormGroup.value.markAsUntouched();
    }

    download() {
        this.fileUploaderService.downloadAttachmentInFsService(this.attachmentUrl);
    }

    downloadListAttachment(attachmentId: number) {
        this.fileUploaderService.getByIdFromFs(attachmentId).subscribe(res => {
            this.fileUploaderService.downloadAttachmentInFsService(res.pathUrl);
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

    delete() {
        this.committeeFormGroup.patchValue({attachmentId: null});
        this.file = null;
        this.attachmentUrl = '';
        this.attachmentName = '';
        this.isAttachmentNameEnable = false;
    }
}
