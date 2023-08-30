import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../query-create/i18n/bn';
import {locale as lngEnglish} from '../query-create/i18n/en';
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {map, switchMap} from "rxjs/operators";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {QuestionTypeModel} from "../../../../configuration-management/models/question-type.model";
import {MinistryDivisionService} from "../../../../configuration-management/services/ministry-division.service";
import {QuestionTypeService} from "../../../../configuration-management/services/question-type.service";
import {DEFAULT_PAGE, MAX_PAGE_SIZE} from "../../../../../core/constants/constant";
import {
    ERROR,
    FAILED_SAVE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_UPDATED
} from "../../../../../core/constants/message";
import {QueryService} from "../../../services/query.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {QueryModel} from "../../../models/query.model";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";

@Component({
    selector: 'app-query-create',
    templateUrl: './query-create.component.html',
    styleUrls: ['./query-create.component.scss']
})
export class QueryCreateComponent extends UnsubscribeAdapterComponent implements OnInit {

    form: FormGroup;
    ministryList: IMinistryDivision[] = [];
    questionTypeList: QuestionTypeModel[] = [];
    query: QueryModel;
    file: File;
    attachmentName: string;
    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private ministryDivisionService: MinistryDivisionService,
                private questionTypeService: QuestionTypeService,
                private snackbarHelper: SnackbarHelper,
                private router: Router,
                private dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private fileUploadService: FileUploadService,
                private service: QueryService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getAllApi();
    }

    private getAllApi() {
        this.subscribe$.add(
            this.ministryDivisionService.getActiveMinistryDivision(DEFAULT_PAGE, MAX_PAGE_SIZE).pipe(
                switchMap(ministry => this.questionTypeService.getActiveQuestionList().pipe(
                    map(questionType => ({
                        ministry: ministry,
                        questionType: questionType
                    }))
                ))
            ).subscribe(res => {
                this.ministryList = res.ministry.content;
                this.questionTypeList = res.questionType;
                this.populateForm();
                if (this.activatedRoute.snapshot.paramMap.get('uuid')) {
                    this.getQuery(this.activatedRoute.snapshot.paramMap.get('uuid'));
                }
            })
        )
    }

    private populateForm() {
        this.form = new FormGroup({
            id: new FormControl(''),
            uuid: new FormControl(''),
            ministryDivisionId: new FormControl(''),
            questionTypeId: new FormControl(''),
            questionTitle: new FormControl(''),
            description: new FormControl(''),
            attachmentId: new FormControl('')
        });
    }

    onSubmit() {
        (this.form.value.uuid) ? this.update() : this.create();
    }

    private getQuery(uuid: string) {
        this.subscribe$.add(
            this.service.getByUuid(uuid).subscribe(res => {
                if (res.id) {
                    this.query = res;
                    this.setValue(res);
                }
            })
        );
    }

    setValue(queryModel: QueryModel) {
        this.form.patchValue({
            id: queryModel.id,
            uuid: queryModel.uuid,
            ministryDivisionId: queryModel.ministryDivisionId,
            questionTypeId: queryModel.questionTypeId,
            questionTitle: queryModel.questionTitle,
            description: queryModel.description,
            attachmentId: queryModel.attachmentId
        });
        this.fileUploadService.getById(queryModel.attachmentId).subscribe(res => {
            this.attachmentName = res.fileName;
        });
    }

    private create() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                    this.goToQueryList();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
                }
            })
        );
    }

    private update() {
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.goToQueryList();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
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

    private goToQueryList() {
        this.router.navigate(['query/list']);
    }

    deleteAttachment(attachmentId: number) {
        this.spinner = true;
        this.query.attachmentId = null;
        this.form.patchValue({attachmentId: null});
        this.subscribe$.add(
            this.fileUploadService.deleteById(attachmentId).pipe(
                switchMap(deleted => this.service.update(this.query).pipe(
                    map(query => ({
                        d: deleted,
                        q: query
                    }))
                ))
            ).subscribe(res => {
                if(res.q.id){
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.spinner = false;
                }else{
                    this.spinner = false;
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    downloadAttachment() {
        this.spinner = true;
        this.subscribe$.add(
            this.fileUploadService.getById(this.query.attachmentId).subscribe(res => {
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
}
