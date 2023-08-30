import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {MatTableDataSource} from "@angular/material/table";
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from "../../../../../core/constants/constant";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {locale as lngEnglishAction} from "../../../../../../layout/layouts/vertical/classy/i18n/en";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {QueryService} from "../../../services/query.service";
import {QueryModel} from "../../../models/query.model";
import {MinistryDivisionService} from "../../../../configuration-management/services/ministry-division.service";
import {QuestionTypeService} from "../../../../configuration-management/services/question-type.service";
import {map, switchMap} from "rxjs/operators";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {QuestionTypeModel} from "../../../../configuration-management/models/question-type.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {Router} from "@angular/router";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {OK, SUCCESSFULLY_DELETED} from "../../../../../core/constants/message";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";

@Component({
    selector: 'app-query-list',
    templateUrl: './query-list.component.html',
    styleUrls: ['./query-list.component.scss']
})
export class QueryListComponent extends UnsubscribeAdapterComponent implements OnInit {

    formGroup: FormGroup;
    displayedColumns: string[] = ['slNo', 'questionTitle', 'questionSource', 'questionType', 'action'];
    dataSource: MatTableDataSource<QueryModel>;

    ministryList: IMinistryDivision[] = [];
    questionTypeList: QuestionTypeModel[] = [];
    queryList: QueryModel[] = [];

    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    actionPermission = [];
    spinner: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private queryService: QueryService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog,
                private router: Router,
                private fileUploadService: FileUploadService,
                private ministryDivisionService: MinistryDivisionService,
                private questionTypeService: QuestionTypeService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.spinner = true;
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
                this.getList();
            })
        )
    }

    populateForm() {
        this.formGroup = new FormGroup({
            ministryDivisionId: new FormControl(''),
            questionTypeId: new FormControl('')
        });
    }

    private getList() {
        this.subscribe$.add(
            this.queryService.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.total = res.totalElements;
                this.spinner = false;
                this.populateForm();
            })
        );
    }

    private arrangeData(res: QueryModel[]) {
        return res.map(m => ({
            ...m,
            ministryDivisionName: this.ministryList.filter(e => e.id === m.ministryDivisionId).map(m => m.nameEn),
            questionTypeName: this.questionTypeList.filter(e => e.id === m.questionTypeId).map(m => m.nameEn)
        }));
    }

    edit(row: QueryModel): void {
        this.router.navigate([`query/edit/${row.uuid}`]);
    }

    openDialog(row: QueryModel): void {
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

    private delete(row: QueryModel) {
        this.spinner = true;
        this.subscribe$.add(
            this.fileUploadService.deleteById(row.id).pipe(
                switchMap(deleted => this.queryService.delete(row.uuid).pipe(
                    map(query => ({
                        deleted: deleted,
                        query: query
                    }))
                ))
            ).subscribe(res => {
                if (res.deleted && res.query) {
                    this.getList();
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                }
                this.spinner = false;
            })
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getList();
    }

    searchByCriteria() {
        this.subscribe$.add(
            this.queryService.searchByCriteria(this.formGroup.value, this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.total = res.totalElements;
                this.spinner = false;
            })
        );
    }
}
