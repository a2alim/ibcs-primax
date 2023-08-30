import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {IOptionalCofog} from '../../models/optional-cofog';
import {IMainCofog} from '../../models/main-cofog';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {OptionalCofogService} from '../../services/optional-cofog.service';
import {MainCofogService} from '../../services/main-cofog.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {PageEvent} from '@angular/material/paginator';
import {IDetailsCofog} from '../../models/details-cofog';
import {DetailsCofogService} from '../../services/details-cofog.service';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
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
  selector: 'app-details-cofog',
  templateUrl: './details-cofog.component.html',
  styleUrls: ['./details-cofog.component.scss']
})
export class DetailsCofogComponent extends UnsubscribeAdapterComponent implements OnInit {

    form: FormGroup;
    displayedColumns: string[] = ['sl', 'nameEn', 'nameBn', 'entryCode', 'status', 'action'];
    dataSource: MatTableDataSource<IDetailsCofog>;
    mainCofogs: IMainCofog[] = [];
    optionalCofogs: IOptionalCofog[] = [];
    disableDelete: boolean;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    actionPermission = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: DetailsCofogService,
                private mainCofogService: MainCofogService,
                private optionalCofogService: OptionalCofogService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getMainCofog();
        this.getDetailsCofog();
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

    // Getting all active Optional Cofog list by Main Cofog Id
    getOptionalCofogByMainCofog(mainCofogId: number) {
        this.subscribe$.add(
            this.optionalCofogService.getByMainCofogId(mainCofogId).subscribe(res => {
                this.optionalCofogs = res;
            })
        );
    }

    // For initializing form
    private populateForm() {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            mainCofogId: new FormControl('', [Validators.required]),
            optionalCofogId: new FormControl('', [Validators.required]),
            entryCode: new FormControl('', [Validators.required]),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl(true),
        });
    }

    // Getting all Details Cofog list
    getDetailsCofog() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // Calling create or update for save
    onSubmit() {
        (this.form.value.uuid) ? this.update() : this.create();
    }

    // For creating  Detail Cofog
    private create() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getDetailsCofog();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }


    // For updating  Detail Cofog
    private update() {
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getDetailsCofog();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    //  Setting form patch value for update
    edit(row: IDetailsCofog) {
        this.disableDelete = true;
        this.form.patchValue({
            uuid: row.uuid,
            mainCofogId: row.optionalCofog.mainCofogId,
            optionalCofogId: row.optionalCofogId,
            entryCode: row.entryCode,
            nameEn: row.nameEn,
            nameBn: row.nameBn,
            description: row.description,
            status: row.status,
        });
    }

    // For deleting Details Cofog
    delete(row: IDetailsCofog) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getDetailsCofog();
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
        this.getDetailsCofog();
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
    private openDialog(type: 's' | 'u' | 'd', row?: IDetailsCofog) {
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
