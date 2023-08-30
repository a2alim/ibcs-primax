import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {ParipatraVersion} from '../../models/paripatra-version.model';
import {ParipatraVersionService} from '../../services/paripatra-version.service';
import {JustificationType} from '../../models/justification-type.model';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-paripatra-version',
    templateUrl: './paripatra-version.component.html',
    styleUrls: ['./paripatra-version.component.scss']
})

export class ParipatraVersionComponent extends UnsubscribeAdapterComponent implements OnInit {

    formGroup: FormGroup;
    displayedColumns: string[] = ['sl', 'nameEn', 'nameBn', 'publishDate', 'startDate', 'endDate', 'status', 'action'];

    dataSource: MatTableDataSource<ParipatraVersion>;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ParipatraVersionService, private dialog: MatDialog,
                public datePipe: DatePipe,
                private snackbarHelper: SnackbarHelper,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
        this.getParipatraVersionList();
    }

    // init form data
    private populateForm() {
        this.formGroup = new FormGroup({
            uuid: new FormControl(''),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            publishDate: new FormControl('', [Validators.required]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl('true', [Validators.required]),
        });
    }

    // check date validation
    isValidDate() {
        const pDate = new Date(this.formGroup.value.publishDate);
        const sDate = new Date(this.formGroup.value.startDate);
        const eDate = new Date(this.formGroup.value.endDate);
        return pDate != null && eDate != null && sDate != null && pDate < eDate && pDate < sDate && eDate >= sDate;
    }

    onSubmit() {
        if (this.isValidDate()) {
            (this.formGroup.value.uuid) ? this.update() : this.create();
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage('Publish Date, Start Date & End Date should be valid', 'OK');
        }
    }

    // for get Paripatra Version List
    private getParipatraVersionList() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({
                    ...m,
                    currentStatus: m.status ? 'Active' : 'Inactive'
                })));
                this.total = res.totalElements;
            })
        );
    }

    // for create Paripatra Version
    private create() {
        this.subscribe$.add(
            this.service.create(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getParipatraVersionList();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // for update Paripatra Version
    private update() {
        this.subscribe$.add(
            this.service.update(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                    this.getParipatraVersionList();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // edit form data
    edit(row: ParipatraVersion) {
        this.disableDelete = true;
        this.formGroup.patchValue({
            uuid: row.uuid,
            nameEn: row.nameEn,
            nameBn: row.nameBn,
            publishDate: row.publishDate,
            startDate: row.startDate,
            endDate: row.endDate,
            description: row.description,
            status: row.status.toString()
        });
    }

    // delete form
    delete(row: ParipatraVersion) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                    this.getParipatraVersionList();
                    this.reset();
                }
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
        this.getParipatraVersionList();
    }

    // reset form data
    reset() {
        this.disableDelete = false;
        this.formGroup.reset();
        this.formGroup.patchValue({
            status: 'true'
        });
    }

    private openDialog(row: ParipatraVersion) {
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
