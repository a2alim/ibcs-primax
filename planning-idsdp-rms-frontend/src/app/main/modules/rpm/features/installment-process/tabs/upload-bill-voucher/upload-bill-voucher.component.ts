import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
    addNewIcon,
    downloadIcon,
    nextIcon,
    previousIcon,
    printIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { FileValidatorService } from 'app/main/modules/rpm/services/file-validator.service';
import { ToastrService } from 'ngx-toastr';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { SubmitConfirmationDialogComponent } from '../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from '../../../../../../shared/constant/confirm.dialog.constant';
import { SignatureUploadModel2 } from '../../../../models/SignatureUploadModel2';
import { InstallmentProcessService } from '../../../../services/installment-process.service';
import { locale as lngBangla, locale as lngEnglish } from '../../i18n/en';
@Component({
    selector: 'app-upload-bill-voucher',
    templateUrl: './upload-bill-voucher.component.html',
    styleUrls: ['./upload-bill-voucher.component.scss'],
})
export class UploadBillVoucherComponent implements OnInit {
    @Input() processId: number;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Input() mode: string;
    @Input() processUuid: string;
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    nextIcon = nextIcon;
    saveIcon = saveIcon;
    addNewIcon = addNewIcon;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    uploadList: SignatureUploadModel2[] = new Array();
    uploadfiles: { fileName: File; id: number; name: string }[] = [];
    deleteList: { id: number }[] = [];
    modifyList: { id: number; fileName: string }[] = [];
    private uuid: string;
    spinner: boolean = false;
    btnDisable:boolean = false;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private router: Router,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private installmentProcess: InstallmentProcessService,
        private fileValidatorService: FileValidatorService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
        if (this.mode == 'edit') {
            this.getUploadVoucher();
        } else {
            this.intFrom();
        }
    }

    /*
     * Bottom Default Tab Options
     * */
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }

    saveAndNext() {
        this.save();
        //this.router.navigate(['/installment-process']);
    }

    save() {
        this.spinner = true;
        this.installmentProcess
            .createVoucher(
                this.uploadList,
                this.uploadfiles,
                this.deleteList,
                this.modifyList
            )
            .subscribe(
                (res) => {
                    if (res.success) {
                        this.toastr.success(res.message, '', this.config);
                        this.modifyList = [];
                        this.deleteList = [];
                        this.uploadfiles = [];
                        if (this.mode == 'edit') {
                            this.spinner = false;
                            this.router.navigate([
                                '/installment-process/view/all/' + this.uuid,
                            ]);
                        } else {
                            this.spinner = false;
                            this.router.navigate([
                                '/installment-process/view/all/' +
                                    this.processUuid,
                            ]);
                        }
                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, '', this.config);
                    }
                },
                (error) => {
                    this.spinner = false;
                    this.toastr.error('Http error Happened', '', this.config);
                }
            );
    }

    getUploadVoucher() {
        this.installmentProcess.getVoucherList(this.processId).subscribe(
            (res) => {
                if (res.success) {
                    res.items.forEach((item) => {
                        this.uploadList.push({
                            id: item.id,
                            uuid: item.uuid,
                            agreementId: item.m2InstallmentProcessId.id,
                            fileTitle: item.fileTitle,
                            isEditable: item.isEditable,
                        });
                        this.uploadfiles.push({
                            fileName: null,
                            id: null,
                            name: item.fileNameSignature,
                        });
                    });
                }
            },
            (error) => {
                this.toastr.error('Http error Happened', '', this.config);
            }
        );
    }
    intFrom() {
        this.uploadList.push({
            id: null,
            uuid: '',
            agreementId: +localStorage.getItem('m2_installment_process_id'),
            fileTitle: '',
            isEditable: false,
        });
        this.uploadfiles.push({ fileName: null, id: null, name: null });
    }
    addNewForm() {
        this.uploadList.push({
            id: null,
            uuid: '',
            agreementId: +localStorage.getItem('m2_installment_process_id'),
            fileTitle: '',
            isEditable: false,
        });
        this.uploadfiles.push({ fileName: null, id: null, name: null });
    }
    private openDialog(rowUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.deleteFormByIndex(rowUuid);
            }
            dialogRef.close(true);
        });
    }
    deleteFormByIndex(index: number) {
        //get id for delete from db
        if (this.mode == 'edit') {
            this.deleteList.push({
                id: this.uploadList[index].id,
            });
        }
        this.uploadList.splice(index, 1);
        //if from deleted also delete it from pushed files
        this.uploadfiles.splice(index, 1);
    }
    handleFileInput(files: any, index: number, id) {       
        console.log('ddddddddddddddddddd');
        /*_____________File Extension and File Size Validation ______________*/
        var validExt = ['pdf', 'jpg', 'jpeg', 'png'];
        this.btnDisable = false;
        var isExtension = this.fileValidatorService.checkFileExtension(files, validExt);
        if (!isExtension) {
            this.btnDisable = true;
            this.toastr.error('You can upload only pdf, jpg, jpeg and png file','',this.config);
            return;
        }
        var needFileSize = 1; //MB
        var isSize = this.fileValidatorService.checkUploadFileSize(files,needFileSize
        );
        if (!isSize) {
            this.btnDisable = true;
            this.toastr.error('File size should be less then or equal ' + needFileSize + 'MB','',this.config);
            return;
        }
        /*_____________/File Extension and File Size Validation ______________*/

        if (this.mode == 'edit') {
            this.modifyList.push({
                id: id,
                fileName: files.item(0).name,
            });
            this.uploadfiles[index] = {
                fileName: files.item(0),
                id: id,
                name: '',
            };
        } else {
            this.uploadfiles[index] = {
                fileName: files.item(0),
                id: id,
                name: files.item(0).name,
            };
        }
    }
}
