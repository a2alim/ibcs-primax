import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {PageEvent} from '@angular/material/paginator';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {IAgency} from '../../models/agency';
import {AgencyService} from '../../services/agency.service';
import {MinistryDivisionService} from '../../services/ministry-division.service';
import {IMinistryDivision} from '../../models/ministry-divisiont';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {
    ERROR,
    FAILED_DELETE,
    FAILED_SAVE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_UPDATED
} from '../../../../core/constants/message';
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent extends UnsubscribeAdapterComponent implements OnInit {

    form: FormGroup;
    displayedColumns: string[] = ['sl', 'nameEn', 'nameBn', 'fiscalYear', 'ceilingAmount', 'entryCode', 'status', 'action'];
    dataSource: MatTableDataSource<IAgency>;
    ministryDivisions: IMinistryDivision[] = [];
    // ministryDivisions: IOption[] = [];
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: AgencyService,
                private ministryDivisionService: MinistryDivisionService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getMinistry();
        this.getAgency();
    }


    // Getting all active Ministry list
    private getMinistry() {
        this.subscribe$.add(
            this.ministryDivisionService.getActiveMinistryDivision().subscribe(res => {
                this.ministryDivisions = res.content;
                // this.ministryDivisions = res.content.map(m => ({name: m.nameEn, nameBn: m.nameBn, nameEn: m.nameEn, value: m.id}));
                this.populateForm();
            })
        );
    }

    // For initializing form
    private populateForm() {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            ministryDivisionId: new FormControl('', [Validators.required]),
            entryCode: new FormControl('', [Validators.required]),
            shortName: new FormControl(''),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            fiscalYear: new FormControl('', [Validators.required]),
            ceilingAmount: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl(true),
        });
    }


    // For getting all agency list
    getAgency() {
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


    // For creating Agency
    private create() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                    this.getAgency();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
                }
            })
        );
    }


    // For updating  Agency
    private update() {
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getAgency();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    //  Setting form patch value for update
    edit(row: IAgency) {
        this.disableDelete = true;
        this.form.patchValue({
            uuid: row.uuid,
            ministryDivisionId: row.ministryDivisionId,
            entryCode: row.entryCode,
            shortName: row.shortName,
            nameEn: row.nameEn,
            nameBn: row.nameBn,
            ceilingAmount: row.ceilingAmount,
            fiscalYear: row.fiscalYear,
            description: row.description,
            status: row.status,
        });
    }


    // For deleting Agency
    delete(row: IAgency) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getAgency();
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
        this.getAgency();
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
    private openDialog(type: 's' | 'u' | 'd', row?: IAgency) {
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
