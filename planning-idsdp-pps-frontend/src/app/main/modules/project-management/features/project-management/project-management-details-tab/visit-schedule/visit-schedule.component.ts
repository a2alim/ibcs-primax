import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {PmPdSelectionModel} from "../../../../models/pm-pd-selection.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {GlobalValidationService} from "../../../../../../../global/validation/global-validation.service";
import {PmPdSelectionService} from "../../../../service/pm-pd-selection.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {locale as lngEnglish} from "../pm-pd-selection/i18n/en";
import {locale as lngBangla} from "../pm-pd-selection/i18n/bn";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {PmVisitScheduleService} from "../../../../service/pm-visit-schedule.service";
import {PmViewSelectionModel} from "../../../../models/pm-view-schedule.model";
import {ExpenditureModel} from "../../../../models/expenditure.model";

@Component({
    selector: 'app-visit-schedule',
    templateUrl: './visit-schedule.component.html',
    styleUrls: ['./visit-schedule.component.scss']
})
export class VisitScheduleComponent implements OnInit {
    @Input() dppTappMasterId: number;
    @Input() dppTappMasterUuid: string;
    @Output() goForward = new EventEmitter<boolean>();
    @Output() goBack = new EventEmitter<boolean>();
    @Output() goBackToHome = new EventEmitter<boolean>();
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    displayedColumns: string[] = ['sl', 'taskDetails', 'location', 'startDate', 'startTime', 'endDate','endTime','remarks','action'];
    total: number;
    pmViewSelectionModel: PmViewSelectionModel = new PmViewSelectionModel();
    isContinuedDisabled: boolean;
    formGroup: FormGroup;
    isEndDateDisabled: boolean;
    spinner: boolean;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    @ViewChild('inputForm') inputForm: NgForm;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private sanckbar: SnackbarHelper,
        private validation: GlobalValidationService,
       // private pmPdSelectionService: PmPdSelectionService,
        private pmvisitschedule: PmVisitScheduleService,
        private dialog: MatDialog
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.createForm();
        this.getViewListByDppTappMasterUuid(this.dppTappMasterUuid);
    }

    createForm() {
        this.formGroup = this._formBuilder.group({
            taskDetails: ['', [Validators.required,]],
            location: ['', ''],
            // nid: ['', [
            //     this.validation.checkSpecialChar('this'),
            //     this.validation.checkString('this')
            // ]],
            startDate: ['', ''],
            startTime: ['', ''],
            endDate: ['', ''],
            endTime: ['', ''],
            remarks: ['', ''],
            attachmentName: ['',''],
        });

    }

    handleFileInput(files: FileList) {
        this.pmViewSelectionModel.attachmentName = '';
        this.pmViewSelectionModel.attachedFile = files.item(0);
    }

    onClickEndDate() {
        this.isContinuedDisabled = this.formGroup.get('endDate').value ? true : null;
    }

    onClickEndContinuing() {
        this.isEndDateDisabled = !this.isEndDateDisabled;
    }

    onClickSave() {
        if (!this.formGroup.valid) {
            return this.sanckbar.openErrorSnackBarWithMessage('Please filled required filed!', 'OK');
        } else {
            this.pmViewSelectionModel.dppTappMasterId = this.dppTappMasterId;
            this.pmViewSelectionModel.dppTappMasterUuid = this.dppTappMasterUuid;
            this.pmViewSelectionModel.taskDetails= this.formGroup.value.taskDetails;
            this.pmViewSelectionModel.location= this.formGroup.value.location;
            this.pmViewSelectionModel.startDate= this.formGroup.value.startDate;
            this.pmViewSelectionModel.startTime= this.formGroup.value.startTime;
            this.pmViewSelectionModel.endDate= this.formGroup.value.endDate;
            this.pmViewSelectionModel.endTime= this.formGroup.value.endTime;
            this.pmViewSelectionModel.remarks= this.formGroup.value.remarks;
            this.pmvisitschedule.createVisitSelection(this.pmViewSelectionModel).subscribe(res => {
                    if (res.success) {
                        this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
                        this.formGroup.reset();
                        this.pmViewSelectionModel = new PmViewSelectionModel();
                        this.pmViewSelectionModel.attachedFile = null;
                        this.getViewListByDppTappMasterUuid(this.dppTappMasterUuid);
                        // this.formGroup.patchValue({ dppTappMasterId:this.dppTappMasterId,
                        //     dppTappMasterUuid:this.dppTappMasterUuid
                        //
                        // });
                    } else {
                        this.sanckbar.openErrorSnackBarWithMessage(res.message, 'OK');
                    }
                    this.spinner = false;
                },
                err => {
                    this.spinner = false;
                    this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on create view Schedule!', 'OK');
                }
            )
        }


        //  this.spinner = true;
        //   this.pdSelectionModel.dppTappMasterId = this.dppTappMasterId;
        //   this.pdSelectionModel.dppTappMasterUuid = this.dppTappMasterUuid;
        //   this.pdSelectionModel.name = this.formGroup.value.name;
        //   this.pdSelectionModel.designation = this.formGroup.value.designation;
        //   this.pdSelectionModel.nid = this.formGroup.value.nid;
        //   this.pdSelectionModel.joiningDate = this.formGroup.value.joiningDate;
        //   this.pdSelectionModel.continuing = this.formGroup.value.continuing;
        //   this.pdSelectionModel.endDate = this.formGroup.value.endDate;
        //   this.pmPdSelectionService.createPdSelection(this.pdSelectionModel).subscribe(
        //       res => {
        //           if (res.success) {
        //               this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
        //               this.formGroup.reset();
        //               this.formGroup.patchValue({ nid: '' });
        //               this.pdSelectionModel = new PmPdSelectionModel();
        //               this.pdSelectionModel.attachedFile = null;
        //               this.getPdListByDppTappMasterUuid(this.dppTappMasterUuid);
        //           } else {
        //               this.sanckbar.openErrorSnackBarWithMessage(res.message, 'OK');
        //           }
        //           this.spinner = false;
        //       },
        //       err => {
        //           this.spinner = false;
        //           this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on create PD selection!', 'OK');
        //       }
        //   )
    }

    getViewListByDppTappMasterUuid(dppTappMasterUuid) {
        this.pmvisitschedule.getViewListByDppTappMasterUuid(dppTappMasterUuid).subscribe(
            res => {
                this.total = 0;
                if (res.success && res.items) {
                    this.total = res.items.length;
                    this.dataSource = new MatTableDataSource(res.items);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                } else {
                    this.dataSource = new MatTableDataSource();
                }
            },
            err => {
            }
        )
    }

    onClickEdit(data) {
        this.formGroup.patchValue({
            taskDetails: data.taskDetails,
            location: data.location,
            startDate: data.startDate,
            startTime:data.startTime,
            endDate:data.endDate,
            endTime: data.endTime,
            remarks: data.remarks,
        });
        this.pmViewSelectionModel.uuid = data.uuid;
        this.pmViewSelectionModel.id = data.id;
        this.pmViewSelectionModel.attachment = data.attachment;
        this.pmViewSelectionModel.attachment.createdOn = null;
        this.pmViewSelectionModel.attachment.updatedOn = null;
        this.pmViewSelectionModel.attachmentName = data?.attachment?.fileName;

    }

    onClickDelete(data) {
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
                this.pmvisitschedule.sotDeleteViewSelectionByUuid(data.uuid).subscribe(
                    res => {
                        if (res.success) {
                            this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
                            this.getViewListByDppTappMasterUuid(data.dppTappMasterUuid);
                        } else {
                        }
                    },
                    err => {
                        this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on delete PD!', 'OK');
                    }
                )
            }
            dialogRef.close(true);
        });
    }

    nextTab() {
        this.goForward.emit(true);
    }

    previousTab(): void {
        this.goBack.emit(true);
    }

    goToHome(): void {
        this.goBackToHome.emit(true);
    }

    formReset() {
        this.pmViewSelectionModel = new PmViewSelectionModel();
        this.formGroup.reset();
        this.inputForm.resetForm();

    }
}
