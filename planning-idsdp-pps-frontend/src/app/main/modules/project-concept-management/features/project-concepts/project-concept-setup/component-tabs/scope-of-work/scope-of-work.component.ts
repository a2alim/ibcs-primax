import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {ScopeOfWorkService} from '../../../../../services/scope-of-work.service';
import {ScopeTaskTypeService} from '../../../../../../configuration-management/services/scope-task-type.service';
import {ScopeOfWorkModel} from '../../../../../models/scope-of-work.model';
import {FileUploadService} from '../../../../../../../core/services/file-upload.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ERROR, FAILED_DELETE, OK, SUCCESSFULLY_DELETED} from '../../../../../../../core/constants/message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ProjectConceptService} from '../../../../../services/project-concept.service';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {ProjectSummaryService} from "../../../../../services/project-summary.service";

@Component({
    selector: 'app-scope-of-work',
    templateUrl: './scope-of-work.component.html',
    styleUrls: ['./scope-of-work.component.scss']
})
export class ScopeOfWorkComponent implements OnInit {
    @Input() projectConceptMasterId: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();
    canUpdate: boolean;
    file: File;
    data = [];
    scopeTypeList = [];
    updateAttachment: boolean;
    attachmentEnable: boolean;
    modelList: ScopeOfWorkModel[] = new Array<ScopeOfWorkModel>();
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    displayColumns = ['sl', 'taskType', 'taskDetails', 'startDate', 'endDate', 'attachment', 'action'];
    rows: FormArray = this.fb.array([]);
    form: FormGroup = this.fb.group({
        scope: this.rows
    });

    startDate: Date[] = [];
    endDate: Date[] = [];

    startDatePc: Date;
    endDatePc: Date;
    spinner: boolean;

    constructor(private fb: FormBuilder,
                private fileUploadService: FileUploadService,
                private matDialog: MatDialog,
                private projectSummaryService: ProjectSummaryService,
                private scopeOfWorkService: ScopeOfWorkService,
                private scopeTaskTypeService: ScopeTaskTypeService,
                private snackbarHelper: SnackbarHelper,
                private projectConceptService: ProjectConceptService,
                private fuseTranslationLoaderService: FuseTranslationLoaderService) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }


    /*
     * when scopeOfWork component is initialize this method firstly load ngOnInit
     */

    ngOnInit(): void {
        const row = this.fb.group({
            taskType: ['', Validators.required],
            taskDetails: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            attachmentId: ['', Validators.required],
            attachmentName: '',
            uuid: '',
        });
        this.rows.push(row);
        this.data.forEach(() => this.addRow());
        this.updateView();
        this.getScopeOfWorkList();
        this.getPcSummaryById();
        if (this.projectConceptMasterId) {
            this.getScopeOfWorkListByProjectId();
        }
    }


    private getPcSummaryById() {
        this.projectSummaryService.getById(this.projectConceptService.projectSummaryCreateId).subscribe(res => {
            this.startDatePc = new Date(res.expCommencementDate);
            this.endDatePc = new Date(res.expCompletionDate);
        });
    }


    /*
     * delete current row by index
     * @param index
     */
    // deleteRow(index): any {
    //     if (this.rows.length === 1) {
    //         this.rows.reset();
    //         this.modelList.splice(index);
    //         return false;
    //     } else {
    //         this.rows.removeAt(index);
    //         this.updateView();
    //         this.modelList.splice(index, 1);

    //         if (this.canUpdate) {
    //             this.modelList = [];
    //             this.rows.value.forEach(e => {
    //                 this.modelList.push(e);
    //             });
    //         }
    //         return true;
    //     }
    // }

    /*
     * Add another row by selecting + button
     */
    addRow(): any {
        const row = this.fb.group({
            taskType: ['', Validators.required],
            taskDetails: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            attachmentId: ['', Validators.required],
            attachmentName: '',
            uuid: '',
        });
        this.rows.push(row);
        this.updateView();
        this.form.markAsUntouched();
    }

    /*
     * Update mat table data
     */

    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }

    /*
    Get Scope Of Work List
     */

    getScopeOfWorkList(): any {
        this.scopeTypeList = [];
        this.scopeTaskTypeService.getList().subscribe(res => {
            res.forEach(m => {
                if(m.status===true)
                    this.scopeTypeList.push(m);
            });
        });
    }

    /*
    save justification
     */

    saveAndNext() {
        if (this.projectConceptService.projectSummaryCreateId > 0) {
            if (this.attachmentEnable) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    this.modelList[i].startDate = this.form.value.scope[i].startDate;
                    this.modelList[i].endDate = this.form.value.scope[i].endDate;
                    this.modelList[i].taskType = this.form.value.scope[i].taskType;
                    this.modelList[i].taskDetails = this.form.value.scope[i].taskDetails;
                }
            } else {
                this.modelList = [];
                this.rows.getRawValue().forEach(e => {
                    this.modelList.push(e);
                });
            }

            if (this.form.valid) {
                this.spinner = true;
                this.scopeOfWorkService.createScopeOfWork(this.modelList, this.projectConceptService.projectSummaryCreateId).subscribe(res => {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.nextStep.emit(true);
                    this.spinner = false;
                }, error => {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                });
            }
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please create Project Summary", "WARNING")
        }

    }

    /*
   upload Attachment
    */
    uploadFile(file: FileList, index): any {
        console.log(index);
        this.file = file.item(0);
        this.spinner = true;
        this.fileUploadService.upload(this.file).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
            if (this.canUpdate) {
                this.form.value.scope[index].attachmentName = '';
                this.modelList[index] = this.form.value.scope[index];
                this.modelList[index].attachmentId = res.id;
                this.updateAttachment = true;

            } else {
                this.modelList.push({
                    taskType: '',
                    taskDetails: '',
                    startDate: '',
                    endDate: '',
                    attachmentId: res.id,
                    attachmentName: '',
                    uuid: '',
                });
                this.attachmentEnable = true;
            }
            this.spinner = false;

        }, err => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }

    /*
     back Previous page
     */

    backPrevious() {
        this.backPreviousPage.emit(true);
    }

    /*
     Get Scope Of Work List By ProjectId
     */
    getScopeOfWorkListByProjectId(): any {
        this.spinner = true;
        this.scopeOfWorkService.getScopeOfWorkListByProjectId(this.projectConceptMasterId).subscribe(res => {
            this.rows.clear();
            if (res.length > 0) {
                res.forEach(re => {
                    const row = this.fb.group({
                        taskType: re.taskType,
                        taskDetails: re.taskDetails,
                        startDate: re.startDate,
                        endDate: re.endDate,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid,
                    });
                    this.modelList.push(re);
                    this.rows.push(row);
                    this.updateView();
                });
                this.canUpdate = true;
            } else {
                this.canUpdate = false;
                const row = this.fb.group({
                    taskType: ['', Validators.required],
                    taskDetails: ['', Validators.required],
                    startDate: ['', Validators.required],
                    endDate: ['', Validators.required],
                    attachmentId: ['', Validators.required],
                    attachmentName: '',
                    uuid: '',
                });
                this.rows.push(row);
                this.data.forEach(() => this.addRow());
                this.updateView();

            }
            this.spinner = false;
        });
    }

    /*
    update scope of work
     */
    update() {
        if (this.updateAttachment) {
            this.updateCall();
        } else {
            this.modelList = [];
            this.rows.getRawValue().forEach(e => {
                this.modelList.push(e);
            });
            this.updateCall();
        }

    }

    /*
     update scope of work
    */

    updateCall() {
        console.log(this.modelList);
        if (this.form.valid) {
            this.spinner = true;
            this.scopeOfWorkService.updateScopeOfWork(this.modelList, this.projectConceptMasterId).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.nextStep.emit(true);
                this.spinner = false;
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
                this.spinner = false;
            });
        }
    }

    /*
     download Attachment
    */
    download(index: any) {
        this.spinner = true;
        this.fileUploadService.getById(this.modelList[index].attachmentId).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    /*
     Delete current row from db
    */
    // deleteFromDb(row: any) {
    //     const uuid = this.modelList[row].uuid;
    //     console.log(uuid);
    //     this.spinner = true;
    //     this.scopeOfWorkService.delete(uuid).subscribe(res => {
    //         if (res) {
    //             this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
    //             this.deleteRow(row);
    //             this.getScopeOfWorkListByProjectId();
    //         } else {
    //             this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
    //         }
    //         this.spinner = false;
    //     });
    // }

    private openDialog(index: any, type: string) {
        this.spinner = true;
        this.rows.removeAt(index);
        let uuid = this.modelList[index]?this.modelList[index].uuid:null;
        if(uuid){
            this.deleteFromDb(uuid);
        }
        this.modelList.splice(index,1);
        this.updateView();
        this.spinner = false;
    }

    private deleteFromDb(uuid){
        this.scopeOfWorkService.delete(uuid).subscribe(
            res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
                this.spinner = false;
            },
            err => {
                this.spinner = false;
                console.log('deleteFromDb : ', err);
            }
        );
    }

    /*
     Open dialog for empty table
    */
    // private openDialog(index: any, type: string) {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.disableClose = false;
    //     dialogConfig.autoFocus = false;
    //     dialogConfig.width = ConfirmDialogConstant.WIDTH;
    //     dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    //     dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    //     dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
    //     const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    //     dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
    //         if (res) {
    //             if (type === 'deleteCurrentRow') {
    //                 this.deleteRow(index);
    //                 // dialogRef.close(true);
    //             } else if (type === 'deleteRowFromDB') {
    //                 this.modelList = [];
    //                 this.rows.getRawValue().forEach(e => {
    //                     this.modelList.push(e);
    //                 });
    //                 const uuid = this.modelList[index].uuid;
    //                 if (uuid) {
    //                     this.deleteFromDb(index);
    //                 } else {
    //                     this.deleteRow(index);
    //                     // dialogRef.close(true);
    //                 }
    //             }
    //             // this.rows.clearValidators();
    //             this.form.clearValidators();
    //             this.form.updateValueAndValidity();
    //             dialogRef.close(true);
    //         }
    //         dialogRef.close(true);
    //     });
    // }

    // startDateChange($event: MatDatepickerInputEvent<Date>, index) {
    //     const value = new Date($event.value);
    //     this.endDate[index] = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    // }
    //
    // endDateChange($event: MatDatepickerInputEvent<Date>, index) {
    //     const value = new Date($event.value);
    //     this.startDate[index] = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    // }

    startDateChange($event: MatDatepickerInputEvent<Date>, index) {
        const value = new Date($event.value);
        console.log(value);
        this.endDate[index] = value;
        console.log(this.endDate[index]);
    }
}
