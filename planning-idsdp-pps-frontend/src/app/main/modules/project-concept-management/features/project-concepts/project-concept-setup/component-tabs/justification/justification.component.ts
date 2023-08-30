import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {JustificationTypeService} from '../../../../../../configuration-management/services/justification-type.service';
import {JustificationModel} from '../../../../../models/justification.model';
import {JustificationService} from '../../../../../services/justification.service';
import {FileUploadService} from '../../../../../../../core/services/file-upload.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ERROR, FAILED_DELETE, OK, SUCCESSFULLY_DELETED} from '../../../../../../../core/constants/message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ProjectConceptService} from '../../../../../services/project-concept.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-justification',
    templateUrl: './justification.component.html',
    styleUrls: ['./justification.component.scss']
})
export class JustificationComponent implements OnInit {

    @Input() projectConceptMasterId: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();
    attachmentEnable: boolean;
    canUpdate: boolean;
    updateAttachment: boolean;
    file: File;
    data = [];
    justificationList = [];
    justificationTypeList = [];
    modelList: JustificationModel[] = new Array<JustificationModel>();
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    displayColumns = ['sl', 'justification', 'description', 'attachment', 'action'];
    rows: FormArray = this.fb.array([]);
    form: FormGroup = this.fb.group({
        justification: this.rows
    });

    spinner: boolean;

    constructor(private fb: FormBuilder,
                private snackBar: SnackbarHelper,
                private matDialog: MatDialog,
                private router: Router,
                private fileUploadService: FileUploadService,
                private justificationService: JustificationService,
                private justificationTypeService: JustificationTypeService,
                private projectConceptService: ProjectConceptService,
                private fuseTranslationLoaderService: FuseTranslationLoaderService) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }


    /*
     * when justification component is initialize this method firstly load ngOnInit
     */

    ngOnInit(): void {
        if (this.projectConceptMasterId) {
            this.getJustificationList();
        }
        this.getJustificationTypeList();
        const row = this.fb.group({
            justification: ['', Validators.required],
            description: '',
            attachmentId: ['', Validators.required],
            uuid: '',
            attachmentName: '',
        });
        this.rows.push(row);
        this.data.forEach(() => this.addRow());
        this.updateView();
    }

    /*
     * delete current row by index
     * @param index
     */
    emptyTable(index): any {
        if (this.rows.length === 1) {
            //this.rows.reset();
            this.modelList.splice(index);
            this.rows.removeAt(index);
            this.updateView();  
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            this.modelList.splice(index, 1);

            if (this.canUpdate) {
                this.modelList = [];
                this.rows.value.forEach(e => {
                    this.modelList.push(e);
                });
            }
            return true;
        }
    }

    /*
     * Add another row by selecting + button
     */

    addRow(): any {
        const row = this.fb.group({
            justification: ['', Validators.required],
            description: '',
            attachmentId: ['', Validators.required],
            uuid: '',
            attachmentName: '',
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
    * Get Justification Type List
    */

    getJustificationTypeList(): any {
        this.justificationTypeList = [];
        this.justificationTypeService.getList().subscribe(res => {
            res.forEach(m => {
                if(m.status===true)
                    this.justificationTypeList.push(m);
            });
        });
    }

    /*
    * Create for Justification
    */

    saveAndNext() {
        this.spinner = true;
        if (this.projectConceptService.projectSummaryCreateId > 0) {
            if (this.attachmentEnable) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    this.modelList[i].justification = this.form.value.justification[i].justification;
                    this.modelList[i].description = this.form.value.justification[i].description;
                }
            } else {
                this.modelList = [];
                this.rows.getRawValue().forEach(e => {
                    this.modelList.push(e);
                });
            }
            console.log(this.modelList);

            if (this.form.valid) {
                this.justificationService.createJustification(this.modelList, this.projectConceptService.projectSummaryCreateId).subscribe(res => {
                    if (res.status) {
                        this.form.reset();
                        this.getJustificationList();
                        this.snackBar.openSuccessSnackBar();
                        this.nextStep.emit(true);
                        this.spinner = false;
                    }
                }, err => {
                    this.snackBar.openErrorSnackBar();
                    this.spinner = false;
                });

            }
        } else {
            this.snackBar.openWarnSnackBarWithMessage("Please create Project Summary", "WARNING");
            this.spinner = false;
        }
    }


    /*
    * Create for Justification and exit tab.
    */

    saveAndExit() {
        this.spinner = true;
        if (this.projectConceptService.projectSummaryCreateId > 0) {
            if (this.attachmentEnable) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    this.modelList[i].justification = this.form.value.justification[i].justification;
                    this.modelList[i].description = this.form.value.justification[i].description;
                }
            } else {
                this.modelList = [];
                this.rows.getRawValue().forEach(e => {
                    this.modelList.push(e);
                });
            }
            console.log(this.modelList);

            if (this.form.valid) {
                this.justificationService.createJustification(this.modelList, this.projectConceptService.projectSummaryCreateId).subscribe(res => {
                    if (res.status) {
                        this.form.reset();
                        this.getJustificationList();
                        this.snackBar.openSuccessSnackBar();
                        this.router.navigate([`project-concept`]);
                        this.spinner = false;
                    }
                }, err => {
                    this.snackBar.openErrorSnackBar();
                    this.spinner = false;
                });

            }
        } else {
            this.snackBar.openWarnSnackBarWithMessage("Please create Project Summary", "WARNING");
            this.spinner = false;
        }

    }


    /**
     * For next TAB
     */

    nextTab(): void {
        this.nextStep.emit(true);
    }

    /*
    Back previous page
     */

    backPrevious() {
        this.backPreviousPage.emit(true);
    }


    /*
    Upload Attachment File
     */
    uploadFile(file: FileList, index): any {
        this.spinner = true;
        this.file = file.item(0);
        this.fileUploadService.upload(this.file).subscribe(res => {
            this.snackBar.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
            if (this.canUpdate) {
                this.form.value.justification[index].attachmentName = '';
                this.modelList[index] = this.form.value.justification[index];
                this.modelList[index].attachmentId = res.id;
                this.updateAttachment = true;
            } else {
                this.modelList.push({
                    justification: '',
                    description: '',
                    uuid: '',
                    attachmentId: res.id,
                    attachmentName: '',
                });
                this.attachmentEnable = true;
            }
            this.spinner = false;

        }, err => {
            this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }

    /*
    Get Justification List
     */
    getJustificationList(): any {
        this.justificationService.getJustificationListByProject(this.projectConceptMasterId).subscribe(res => {
            this.rows.clear();
            console.log(res);
            if (res.length > 0) {
                res.forEach(re => {
                    const row = this.fb.group({
                        justification: re.justification,
                        description: re.description,
                        attachmentId: re.attachmentId,
                        uuid: re.uuid,
                        attachmentName: re.attachmentName,
                    });
                    this.rows.push(row);
                    this.updateView();
                    this.modelList.push(re);
                    this.canUpdate = true;
                });
            } else {
                this.canUpdate = false;
                const row = this.fb.group({
                    justification: ['', Validators.required],
                    description: '',
                    attachmentId: ['', Validators.required],
                    uuid: '',
                });
                this.rows.push(row);
                this.data.forEach(() => this.addRow());
                this.updateView();
            }
        });
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
    delete current data from db
     */

    deleteFromDb(row: any) {
        const uuid = this.modelList[row].uuid;
        console.log(uuid);
        this.spinner= true;
        this.justificationService.delete(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable(row);
                this.getJustificationList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner = false;
        });
    }

    /*
     Update justification data
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
     Update justification data and Exit
     */

    updateAndExit() {
        if (this.updateAttachment) {
            this.updateExitCall();
        } else {
            this.modelList = [];
            this.rows.getRawValue().forEach(e => {
                this.modelList.push(e);
            });
            this.updateExitCall();
        }
    }

    /*
     Update justification data and Exit
     */
    updateExitCall() {
        this.spinner = true;
        console.log(this.modelList);
        if (this.form.valid) {
            this.justificationService.updateJustification(this.modelList, this.projectConceptMasterId).subscribe(res => {
                if (res.status) {
                    this.modelList = [];
                    this.form.reset();
                    this.getJustificationList();
                    this.snackBar.openSuccessSnackBar();
                    this.router.navigate([`project-concept`]);
                }
                this.spinner= false;
            }, error => {
                this.snackBar.openErrorSnackBar();
                this.spinner = false;
            });
        }

    }


    /*
    Update justification data
    */
    updateCall() {
        console.log(this.modelList);
        this.spinner = true;
        if (this.form.valid) {
            this.justificationService.updateJustification(this.modelList, this.projectConceptMasterId).subscribe(res => {
                if (res.status) {
                    this.modelList = [];
                    this.form.reset();
                    this.getJustificationList();
                    this.snackBar.openSuccessSnackBar();
                    this.nextStep.emit(true);
                    this.spinner = false;
                }

            }, error => {
                this.snackBar.openErrorSnackBar();
                this.spinner=false;
            });
        }
    }

    /*
     Open dialog for empty table
    */

    private openDialog(index: any, type: any) {
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
                if (type === 'deleteFromCurrentRow') {
                    this.emptyTable(index);
                    dialogRef.close(true);
                } else if (type === 'deleteFromDB') {
                    this.modelList = [];
                    this.rows.getRawValue().forEach(e => {
                        this.modelList.push(e);
                    });
                    const uuid = this.modelList[index].uuid;
                    if (uuid) {
                        this.deleteFromDb(index);
                    } else {
                        this.emptyTable(index);
                        dialogRef.close(true);
                    }
                    dialogRef.close(true);
                }
            }
            dialogRef.close(true);
        });
    }

}
