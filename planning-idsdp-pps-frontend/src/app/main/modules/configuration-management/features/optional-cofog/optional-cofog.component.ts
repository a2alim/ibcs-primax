import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {PageEvent} from '@angular/material/paginator';
import {IOptionalCofog} from '../../models/optional-cofog';
import {OptionalCofogService} from '../../services/optional-cofog.service';
import {MainCofogService} from '../../services/main-cofog.service';
import {IMainCofog} from '../../models/main-cofog';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
    ERROR,
    FAILED_DELETE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_UPDATED
} from '../../../../core/constants/message';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
  selector: 'app-optional-cofog',
  templateUrl: './optional-cofog.component.html',
  styleUrls: ['./optional-cofog.component.scss']
})
export class OptionalCofogComponent extends UnsubscribeAdapterComponent implements OnInit {

    form: FormGroup;
    displayedColumns: string[] = ['sl', 'nameEn', 'nameBn', 'entryCode', 'status', 'action'];
    dataSource: MatTableDataSource<IOptionalCofog>;
    mainCofogs: IMainCofog[] = [];
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: OptionalCofogService,
                private mainCofogService: MainCofogService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getMainCofog();
        this.getOptionalCofog();
    }

    // Getting all active Main Cofog list
    private getMainCofog() {
        this.subscribe$.add(
            this.mainCofogService.getActiveMainCofog().subscribe(res => {
                this.mainCofogs = res.content;
                this.populateForm();
            })
        );
    }

    // For initializing form
    private populateForm() {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            mainCofogId: new FormControl('', [Validators.required]),
            entryCode: new FormControl('', [Validators.required]),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl(true),
        });
    }

    // For getting all Optional Cofog list
    getOptionalCofog() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // For calling creat or Update for save
    onSubmit() {
        (this.form.value.uuid) ? this.update() : this.create();
    }

    // For creating Optional Cofog
    private create() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getOptionalCofog();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // For updating Optional Cofog
    private update() {
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getOptionalCofog();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    //  Setting form patch value for update
    edit(row: IOptionalCofog) {
        this.disableDelete = true;
        this.form.patchValue({
            uuid: row.uuid,
            mainCofogId: row.mainCofogId,
            entryCode: row.entryCode,
            nameEn: row.nameEn,
            nameBn: row.nameBn,
            description: row.description,
            status: row.status,
        });
    }

    // For deleting Optional Cofog
    delete(row: IOptionalCofog) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getOptionalCofog();
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
        this.getOptionalCofog();
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
    private openDialog(type: 's' | 'u' | 'd', row?: IOptionalCofog) {
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
