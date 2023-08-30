import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../question-answer-list/i18n/bn';
import {locale as lngEnglish} from '../question-answer-list/i18n/en';
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {locale as lngEnglishAction} from "../../../../../../layout/layouts/vertical/classy/i18n/en";
import {FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {QueryModel} from "../../../models/query.model";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {QuestionTypeModel} from "../../../../configuration-management/models/question-type.model";
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from "../../../../../core/constants/constant";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map, switchMap} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {OK, SUCCESSFULLY_DELETED} from "../../../../../core/constants/message";
import {QueryService} from "../../../services/query.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {Router} from "@angular/router";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {MinistryDivisionService} from "../../../../configuration-management/services/ministry-division.service";
import {QuestionTypeService} from "../../../../configuration-management/services/question-type.service";

@Component({
    selector: 'app-question-answer-list',
    templateUrl: './question-answer-list.component.html',
    styleUrls: ['./question-answer-list.component.scss']
})
export class QuestionAnswerListComponent extends UnsubscribeAdapterComponent implements OnInit {

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
                private router: Router,
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
            questionTypeId: new FormControl(''),
            askById: new FormControl('')
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

    view(row: QueryModel): void {
        this.router.navigate([`question-answer-bank/view/${row.uuid}`]);
    }
}
