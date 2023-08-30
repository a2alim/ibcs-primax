import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, NgForm} from "@angular/forms";
import {TaskListModel} from "../../../../models/TaskListModel";
import {ActivatedRoute, Router} from "@angular/router";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {locale as lngEnglish} from "../../i18n/en";
import {locale as lngBangla} from "../../i18n/bn";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {SubmitProgressReportServiceService} from "../../../../services/submit-progress-report-service.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {StorageService} from "../../../../../../core/services/storage/storage.service";

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @ViewChild('myForm') myForm: NgForm;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    taskList: TaskListModel [] = new Array();

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    formTitle = 'Save'; //Edit
    /*----/Button---*/

    uuid: any;
    data: any;
    userDetails: any;

    frmGroup: any;
    private formBuilder: any;
    private globalVal: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _submitProgressRepost: SubmitProgressReportServiceService,
        private router: Router,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private storageService: StorageService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this._activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
        });

    }

    ngOnInit(): void {
        this.userDetails = this.storageService.getUserData();
        if (this.uuid != null) {
            this.data = this._submitProgressRepost.data;
            this.formTitle = this._submitProgressRepost.mode;
            this.taskList = this.data.taskLists;
        }
    }

    private openDialog(rowUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    delete(rowUuid) {
        this._submitProgressRepost.DeleteTask(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.router.navigate(['list-progress-report']);
            }
            else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }

    deleteFormByIndex(index: number) {
        this.taskList.splice(index, 1)
    }

    public onSubmit() {
        this.submitForm();
    }

    public submitForm() {
        if (this.formTitle != 'Edit') {
            this._submitProgressRepost.save(this.taskList).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.router.navigate(['list-progress-report']);
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                }
            )
        } else{
            this._submitProgressRepost.update(this.taskList).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.router.navigate(['list-progress-report']);

                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                }
            )

        }
    }

    reset() {
        this.frmGroup.reset();
        this.myForm.resetForm();
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    backTab() {
        this.backPrevious.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    public addNewForm() {
            this.taskList.push(
                {
                    id: null,
                    uuid: null,
                    researchProgressReportId: this._submitProgressRepost.data ? this._submitProgressRepost?.data?.id : this._submitProgressRepost?.id,
                    taskTitle: '',
                    proposalPageNo: null,
                    researcherNote: '',
                    noteOfDo: '',
                    isCompleted: false,
                    isEditable: false,
                }
            )
    }

    public prevent(event){
        if(event.key == '-' || event.key == '+' || event.key == 'e' || event.key == 'E'){
            event.preventDefault();
        }
    }

}
