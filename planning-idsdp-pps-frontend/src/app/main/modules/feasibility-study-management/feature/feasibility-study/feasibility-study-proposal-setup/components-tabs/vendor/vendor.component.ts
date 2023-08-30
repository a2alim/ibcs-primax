import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Subscription} from 'rxjs';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../../../core/constants/constant';
import {VendorManagementModel} from '../../../../../models/vendor-management.model';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VendorManagementService} from '../../../../../services/vendor-management.service';
import {environment} from '../../../../../../../../../environments/environment';
import {PageEvent} from '@angular/material/paginator';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {WorkPlanService} from "../../../../../services/work-plan.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FeasibilityStudyProposalSummaryService} from "../../../../../services/feasibility-study-proposal-summary.service";
import {ERROR} from "../../../../../../../core/constants/message";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";

@Component({
    selector: 'app-vendor',
    templateUrl: './vendor.component.html',
    styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    form: FormGroup;
    downloadEnable: any;
    attachmentUrl: string;
    isAttachmentNameEnable: boolean;

    fspMasterId: number;

    downloadAttachmentId: number;

    startDate: Date;
    endDate: Date;

    file: File;

    attachmentName: any;

    vendorUpdate: boolean;

    vendorManagementList: VendorManagementModel[] = new Array<VendorManagementModel>();

    model: VendorManagementModel = new VendorManagementModel();

    // for pagination
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    spinner: boolean;

    constructor(private fb: FormBuilder, private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private snackBar: SnackbarHelper,
                private router: Router,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private vendorManagementService: VendorManagementService,
                private workPlanService: WorkPlanService,
                private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
                private fileUploadService: FileUploadService,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private snackbarHelper: SnackbarHelper,
    ) {
        this.clickEventSubscription = this.vendorManagementService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.initForm();
        if (this.fspMasterId > 0) {
            this.getVendorManagementList();
        }
    }

    private initForm(): void {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            vendorName: new FormControl(''),
            description: new FormControl(''),
            contactPersonName: new FormControl(''),
            address: new FormControl(''),
            email: new FormControl(''),
            dateOfFormation: new FormControl(''),
            vendorApprovalDocument: new FormControl(''),
            fspMasterId: new FormControl(this.fspMasterId)
        });
    }

    // load all api data
    loadData(): void {
        this.fspMasterId = this.feasibilityProposalHelperService.feasibilityProposalCreateId;
        this.initForm();
        this.getFspSummaryById();
        if (this.fspMasterId > 0) {
            this.getVendorManagementList();
        }
    }

    private getFspSummaryById() {
        this.feasibilityStudyProposalSummaryService.getById(this.fspMasterId).subscribe(res => {
            this.startDate = new Date(res.dateOfCommencement);
            this.endDate = new Date(res.dateOfCompletion);
        });
    }

    //For attachment
    selectedFile(file: FileList): any {
        this.file = file.item(0);
        this.attachmentName = "";
        this.isAttachmentNameEnable = false;
    }

    /**
     * For create vendor management
     */
    create() {
        if (this.form.value.vendorName && this.form.value.contactPersonName && this.form.value.address && this.form.value.email && this.form.value.dateOfFormation) {
            if (this.file) {
                this.fileUploadService.uploadInFs(this.file).subscribe(res => {
                    this.model.vendorApprovalAttachmentId = res.id;
                    this.model.vendorName = this.form.value.vendorName;
                    this.model.description = this.form.value.description;
                    this.model.contactPersonName = this.form.value.contactPersonName;
                    this.model.address = this.form.value.address;
                    this.model.email = this.form.value.email;
                    this.model.vendorFormationDate = this.form.value.dateOfFormation;
                    this.model.fspMasterId = this.fspMasterId;

                    this.spinner = true;
                    this.vendorManagementService.create(this.model).subscribe(res => {
                        if (res.uuid) {
                            this.form.reset();
                            this.spinner = false;
                            this.getVendorManagementList();
                            this.snackBar.openSuccessSnackBar();
                        }
                    }, err => {
                        this.spinner = false;
                        this.snackBar.openErrorSnackBar();
                    });
                });
                this.form.value.markAsUntouched();
            } else {
                this.model.vendorName = this.form.value.vendorName;
                this.model.description = this.form.value.description;
                this.model.contactPersonName = this.form.value.contactPersonName;
                this.model.address = this.form.value.address;
                this.model.email = this.form.value.email;
                this.model.vendorFormationDate = this.form.value.dateOfFormation;
                this.model.fspMasterId = this.fspMasterId;

                this.spinner = true;
                this.vendorManagementService.create(this.model).subscribe(res => {
                    if (res.uuid) {
                        this.form.reset();
                        this.spinner = false;
                        this.getVendorManagementList();
                        this.snackBar.openSuccessSnackBar();
                    }
                }, err => {
                    this.spinner = false;
                    this.snackBar.openErrorSnackBar();
                });
                this.form.value.markAsUntouched();
            }
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please give mandatory data", ERROR);
        }
        // else {
        //     this.form.markAllAsTouched();
        //     this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        // }

    }

    // for get Vendor management List
    private getVendorManagementList() {
        this.vendorManagementList = [];
        this.vendorManagementService.getVendorManagementListByFsProposalSummary(this.fspMasterId, this.page, this.size).subscribe(res => {
            if (res.content.length > 0) {
                if (this.feasibilityProposalHelperService.feasibilityUpdate === true) {
                    this.vendorUpdate = true;
                } else {
                    this.vendorUpdate = false;
                }
            } else {
                this.vendorUpdate = false;
            }
            res.content.forEach(m => {
                this.vendorManagementList.push(m);
            });
            this.total = res.totalElements;
        });
    }

    // edit form data
    edit(row: VendorManagementModel) {
        this.form.patchValue({
            uuid: row.uuid,
            vendorName: row.vendorName,
            description: row.description,
            contactPersonName: row.contactPersonName,
            address: row.address,
            email: row.email,
            dateOfFormation: row.vendorFormationDate,
            vendorApprovalDocument: row.vendorApprovalAttachmentId,
            fspMasterId: row.fspMasterId
        });
        if (row.vendorApprovalAttachmentId) {
            this.downloadAttachmentId = row.vendorApprovalAttachmentId;
            this.downloadEnable = row.vendorApprovalAttachmentId;
            this.fileUploadService.getByIdFromFs(row.vendorApprovalAttachmentId).subscribe(res => {
                this.attachmentName = res.fileName;
                this.isAttachmentNameEnable = true;
                this.downloadEnable = true;
                this.attachmentUrl = res.pathUrl;
            });
        } else {
            this.attachmentName = '';
            this.isAttachmentNameEnable = false;
            this.downloadEnable = false;
            this.file = null;
            this.attachmentUrl = '';
        }

    }

    /**
     * For update vendor management
     */
    update() {
        if (this.form.valid) {
            if (this.file) {
                this.fileUploadService.uploadInFs(this.file).subscribe(res => {
                    this.model.vendorApprovalAttachmentId = res.id;
                    this.model.vendorName = this.form.value.vendorName;
                    this.model.description = this.form.value.description;
                    this.model.contactPersonName = this.form.value.contactPersonName;
                    this.model.address = this.form.value.address;
                    this.model.email = this.form.value.email;
                    this.model.vendorFormationDate = this.form.value.dateOfFormation;
                    this.model.uuid = this.form.value.uuid;
                    this.model.fspMasterId = this.fspMasterId;

                    this.spinner = true;
                    this.vendorManagementService.update(this.model).subscribe(res => {
                        if (res.uuid) {
                            this.form.reset();
                            this.spinner = false;
                            this.getVendorManagementList();
                            this.downloadEnable = false;
                            this.snackBar.openSuccessSnackBar();
                        }
                    }, err => {
                        this.spinner = false;
                        this.snackBar.openErrorSnackBar();
                    });
                });
                this.form.value.markAsUntouched();
            } else {
                this.model.vendorName = this.form.value.vendorName;
                this.model.description = this.form.value.description;
                this.model.contactPersonName = this.form.value.contactPersonName;
                this.model.address = this.form.value.address;
                this.model.email = this.form.value.email;
                this.model.vendorFormationDate = this.form.value.dateOfFormation;
                this.model.uuid = this.form.value.uuid;
                this.model.fspMasterId = this.fspMasterId;

                this.spinner = true;
                this.vendorManagementService.update(this.model).subscribe(res => {
                    if (res.uuid) {
                        this.form.reset();
                        this.spinner = false;
                        this.getVendorManagementList();
                        // this.form.value.markAsUntouched();
                        this.downloadEnable = false;
                        this.snackBar.openSuccessSnackBar();
                    }
                }, err => {
                    this.spinner = false;
                    this.snackBar.openErrorSnackBar();
                });
                this.form.value.markAsUntouched();
            }
        } else {
            this.form.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }

    }

    /**
     * For reset form
     */
    reset() {
        this.form.reset();
        // this.getVendorManagementList();
        this.downloadEnable = false;
        this.initForm();
    }

    // delete vendor management
    delete(row: VendorManagementModel) {
        this.vendorManagementService.delete(row.uuid).subscribe(res => {
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                this.getVendorManagementList();
            }
        });
    }

    /**
     * For download attachment
     */
    download() {
        this.fileUploadService.getByIdFromFs(this.downloadAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInFsService(res.pathUrl);
        });
    }

    /**
     * For mat dialog
     * @param row
     */
    private openDialog(row: VendorManagementModel) {
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

    /**
     * For pagination
     * @param event
     */
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getVendorManagementList();
    }

    saveAndNext(): void {
        this.workPlanService.feasibilitySummarySaveClickEvent();
        this.nextStep.emit(true);
    }

    saveAndExit(): void {
        this.workPlanService.feasibilitySummarySaveClickEvent();
        this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
    }

    back(): void {
        this.backPrevious.emit(true);
    }

    nextTab(): void {
        this.nextStep.emit(true);
    }


    deleteAttachment() {
        this.form.patchValue({vendorApprovalDocument: null});
        this.file = null;
        this.attachmentUrl = '';
        this.attachmentName = '';
        this.isAttachmentNameEnable = false;
        this.downloadEnable = false;
    }
}
