import {Component, OnInit, ViewChild} from "@angular/core";
import {UnsubscribeAdapterComponent} from "../../../../core/helper/unsubscribeAdapter";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {CategoryEnvironmentModel} from "../../models/categoryEnvironmentModel.model";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../core/constants/constant";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {CategoryEnvironmentService} from "../../services/category-environment.service";
import {SnackbarHelper} from "../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
    selector: 'app-category-environment',
    templateUrl: './category-environment.component.html',
    styleUrls: ['./category-environment.component.scss']
})
export class CategoryEnvironmentComponent extends UnsubscribeAdapterComponent implements OnInit {

    formGroup: FormGroup;
    displayedColumns: string[] = ['sl', 'categoryCode', 'categoryCodeName', 'categoryCodeNameBng', 'status', 'action'];
    dataSource: MatTableDataSource<CategoryEnvironmentModel>;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    actionPermission = [];


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: CategoryEnvironmentService, private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog
    ) {
        super();
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
        this.getCategoryEnvironmentList();
    }

    // init form data
    private populateForm() {
        this.formGroup = new FormGroup({
            uuid: new FormControl(''),
            categoryCode: new FormControl('', [Validators.required]),
            categoryCodeName: new FormControl('', [Validators.required]),
            categoryCodeNameBng: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl('true', [Validators.required]),
        });
    }

    onSubmit() {
        (this.formGroup.value.uuid) ? this.update() : this.create();
    }

    private getCategoryEnvironmentList() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // for create category
    private create() {
        this.subscribe$.add(
            this.service.create(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getCategoryEnvironmentList();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // for update category
    private update() {
        this.subscribe$.add(
            this.service.update(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                    this.getCategoryEnvironmentList();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // edit form data
    edit(row: CategoryEnvironmentModel) {
        this.disableDelete = true;
        this.formGroup.patchValue({
            uuid: row.uuid,
            categoryCode: row.categoryCode,
            categoryCodeName: row.categoryCodeName,
            categoryCodeNameBng: row.categoryCodeNameBng,
            description: row.description,
            status: row.status.toString()
        });
    }

    // delete category data
    delete(row: CategoryEnvironmentModel) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                    this.getCategoryEnvironmentList();
                    this.reset();
                }
            })
        );
    }

    // reset form data
    reset() {
        this.disableDelete = false;
        this.formGroup.reset();
        this.formGroup.patchValue({
            status: 'true'
        });
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
        this.getCategoryEnvironmentList();
    }

    private openDialog(row: CategoryEnvironmentModel) {
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

}
