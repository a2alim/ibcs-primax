import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {PageEvent} from '@angular/material/paginator';
import {IMainCofog} from '../../models/main-cofog';
import {MainCofogService} from '../../services/main-cofog.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {
    ERROR,
    FAILED_DELETE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_UPDATED
} from '../../../../core/constants/message';
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
  selector: 'app-main-cofog',
  templateUrl: './main-cofog.component.html',
  styleUrls: ['./main-cofog.component.scss']
})
export class MainCofogComponent extends UnsubscribeAdapterComponent implements OnInit {

    form: FormGroup;
    displayedColumns: string[] = ['sl', 'nameEn', 'nameBn', 'entryCode', 'status', 'action'];
    dataSource: MatTableDataSource<IMainCofog>;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: MainCofogService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
        this.getMainCofog();
    }

    // For initializing form
    private populateForm() {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            entryCode: new FormControl('', [Validators.required]),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl(true, [Validators.required]),
        });
    }

    // Getting all Main Cofog list
    getMainCofog() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // Calling creating or Update for save
    onSubmit() {
        (this.form.value.uuid) ? this.update() : this.create();
    }

    // For creating Main Cofog
    private create() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getMainCofog();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // For updating Main Cofog
    private update() {
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getMainCofog();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    //  Setting form patch value for update
    edit(row: IMainCofog) {
        this.disableDelete = true;
        this.form.patchValue({
            uuid: row.uuid,
            entryCode: row.entryCode,
            nameEn: row.nameEn,
            nameBn: row.nameBn,
            description: row.description,
            status: row.status,
        });
    }

    // For deleting Main Cofog
    delete(row: IMainCofog) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getMainCofog();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
            })
        );
    }

    // For searching from list
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    // For calling list during page change
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getMainCofog();
    }

    // For reset form
    reset() {
        this.form.reset();
        this.disableDelete = false;
        this.form.patchValue({
            status: true
        });
    }

    // For opening confirmation dialog before delete, create and update
    private openDialog(type: 's' | 'u' | 'd', row?: IMainCofog) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: (type === 's') ? ConfirmDialogConstant.SAVE_CONFIRMATION :
                (type === 'u') ? ConfirmDialogConstant.UPDATE_CONFIRMATION  : ConfirmDialogConstant.DELETE_CONFIRMATION };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                (type === 's') ? this.create() : (type === 'u') ? this.update() : this.delete(row);
            }
            dialogRef.close(true);
        });
    }

}
