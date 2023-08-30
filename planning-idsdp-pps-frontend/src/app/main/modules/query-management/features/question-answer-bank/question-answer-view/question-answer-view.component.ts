import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../question-answer-view/i18n/bn';
import {locale as lngEnglish} from '../question-answer-view/i18n/en';
import {FormControl, FormGroup} from "@angular/forms";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {QuestionTypeModel} from "../../../../configuration-management/models/question-type.model";
import {QueryModel} from "../../../models/query.model";
import {MinistryDivisionService} from "../../../../configuration-management/services/ministry-division.service";
import {QuestionTypeService} from "../../../../configuration-management/services/question-type.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {QueryService} from "../../../services/query.service";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {map, switchMap} from "rxjs/operators";
import {AnswerBankService} from "../../../services/answer-bank.service";
import {AnswerBankModel} from "../../../models/answer-bank.model";
import {
    ERROR,
    FAILED_SAVE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_UPDATED
} from "../../../../../core/constants/message";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";

@Component({
    selector: 'app-question-answer-view',
    templateUrl: './question-answer-view.component.html',
    styleUrls: ['./question-answer-view.component.scss']
})
export class QuestionAnswerViewComponent extends UnsubscribeAdapterComponent implements OnInit {

    ministryDivision: IMinistryDivision;
    questionType: QuestionTypeModel;
    query: QueryModel;
    answerBank: AnswerBankModel;
    attachment: any;
    spinner: boolean;
    form: FormGroup;
    file: File;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private ministryDivisionService: MinistryDivisionService,
                private questionTypeService: QuestionTypeService,
                private answerBankService: AnswerBankService,
                private snackbarHelper: SnackbarHelper,
                private router: Router,
                private dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private fileUploadService: FileUploadService,
                private queryService: QueryService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        if (this.activatedRoute.snapshot.paramMap.get('uuid')) {
            this.populateForm();
            this.getQuery(this.activatedRoute.snapshot.paramMap.get('uuid'));
        }
    }

    private getQuery(uuid: string) {
        this.spinner = true;
        this.subscribe$.add(
            this.queryService.getByUuid(uuid).pipe(
                switchMap(query => this.ministryDivisionService.getById(query.ministryDivisionId).pipe(
                    switchMap(ministry => this.questionTypeService.getById(query.questionTypeId).pipe(
                        switchMap(questionType => this.answerBankService.getAnswerBankByQueryId(query.id).pipe(
                            map(answerBank => ({
                                q: query,
                                m: ministry,
                                qt: questionType,
                                ab: answerBank,
                            }))
                        ))
                    ))
                ))
            ).subscribe(res => {
                this.query = res.q;
                this.ministryDivision = res.m;
                this.questionType = res.qt;
                this.answerBank = res.ab;
                if (res.ab)
                    this.setAnswerValue(res.ab);
                this.spinner = false;
            })
        );
    }

    getAttachment(id: number) {
        this.subscribe$.add(
            this.fileUploadService.getById(id).subscribe(res => {
                this.attachment = res;
            })
        )
    }

    private populateForm() {
        this.form = new FormGroup({
            id: new FormControl(''),
            uuid: new FormControl(''),
            details: new FormControl(''),
            attachmentId: new FormControl(''),
            query: new FormControl()
        });
    }

    submit() {
        this.answerBank = this.form.value;
        this.answerBank.query = this.query;
        (this.form.value.uuid) ? this.update() : this.create();
    }

    create() {
        this.subscribe$.add(
            this.answerBankService.create(this.answerBank).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                    this.goToList();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
                }
            })
        )
    }

    update() {
        this.subscribe$.add(
            this.answerBankService.update(this.answerBank).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.goToList();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
                }
            })
        )
    }

    private setAnswerValue(answerBank: AnswerBankModel) {
        this.form.patchValue({
            id: answerBank.id,
            uuid: answerBank.uuid,
            details: answerBank.details,
            attachmentId: answerBank.attachmentId,
            query: this.query
        })
        if (answerBank.attachmentId)
            this.getAttachment(answerBank.attachmentId);
    }

    private goToList() {
        this.router.navigate(['question-answer-bank/list']);
    }

    deleteAttachment(attachmentId: number) {
        this.spinner = true;
        this.answerBank.attachmentId = null;
        this.form.patchValue({attachmentId: null});
        this.subscribe$.add(
            this.fileUploadService.deleteById(attachmentId).pipe(
                switchMap(deleted => this.answerBankService.update(this.answerBank).pipe(
                    map(answer => ({
                        d: deleted,
                        a: answer
                    }))
                ))
            ).subscribe(res => {
                if (res.a.id) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.spinner = false;
                } else {
                    this.spinner = false;
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    downloadAttachment(attachmentId) {
        this.spinner = true;
        this.subscribe$.add(
            this.fileUploadService.getById(attachmentId).subscribe(res => {
                this.fileUploadService.download(res.pathUrl);
                this.spinner = false;
            })
        );
    }

    openDialogForDeleteAttachment(attachmentId: number) {
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
                this.deleteAttachment(attachmentId);
                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }
        });
    }

    uploadFile(file: FileList): any {
        this.file = file.item(0);
        this.spinner = true;
        this.fileUploadService.upload(this.file).subscribe(res => {
            if (res.id) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Attachment Successfully Saved', 'Ok');
                this.form.patchValue({attachmentId: res.id})
            }
            this.spinner = false;
        }, error => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }
}
