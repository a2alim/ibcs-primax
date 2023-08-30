import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {ProjectType} from '../../models/project-type.model';
import {ProjectTypeService} from '../../services/project-type.service';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";

@Component({
    selector: 'app-project-type',
    templateUrl: './project-type.component.html',
    styleUrls: ['./project-type.component.scss']
})
export class ProjectTypeComponent extends UnsubscribeAdapterComponent implements OnInit {

    formGroup: FormGroup;
    displayedColumns: string[] = ['sl', 'projectTypeCode', 'nameEn', 'nameBn', 'status', 'action'];

    dataSource: MatTableDataSource<ProjectType>;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ProjectTypeService, private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
        this.getProjectTypeList();
    }

    // init form data
    private populateForm() {
        this.formGroup = new FormGroup({
            uuid: new FormControl(''),
            projectTypeCode: new FormControl('', [Validators.required]),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl('true', [Validators.required]),
        });
    }

    onSubmit() {
        (this.formGroup.value.uuid) ? this.update() : this.create();
    }

    // for get ProjectTypeList
    private getProjectTypeList() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // for create ProjectType
    private create() {
        this.subscribe$.add(
            this.service.create(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getProjectTypeList();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.reset();
            })
        );
    }

    // for update ProjectType
    private update() {
        this.subscribe$.add(
            this.service.update(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                    this.getProjectTypeList();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.reset();
            })
        );
    }

    // edit form data
    edit(row: ProjectType) {
        this.disableDelete = true;
        this.formGroup.patchValue({
            uuid: row.uuid,
            projectTypeCode: row.projectTypeCode,
            nameEn: row.nameEn,
            nameBn: row.nameBn,
            description: row.description,
            status: row.status.toString()
        });
    }

    // delete ProjectType
    delete(row: ProjectType) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                    this.getProjectTypeList();
                }
                this.reset();
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
        this.getProjectTypeList();
    }

    // reset form data
    reset() {
        this.disableDelete = false;
        this.formGroup.reset();
        this.formGroup.patchValue({
            status: 'true'
        });
    }

    private openDialog(row: ProjectType) {
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
