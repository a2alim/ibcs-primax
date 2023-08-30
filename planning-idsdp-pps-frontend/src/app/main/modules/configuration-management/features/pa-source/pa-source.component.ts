import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {PaSourceService} from '../../services/pa-source.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {IPaSourceModel} from '../../models/pa-source.model';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {EconomicTypeModel} from '../../models/economic-code-model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";

@Component({
    selector: 'app-pa-source',
    templateUrl: './pa-source.component.html',
    styleUrls: ['./pa-source.component.scss']
})
export class PaSourceComponent extends UnsubscribeAdapterComponent implements OnInit {

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    disableDelete: boolean;
    model: IPaSourceModel = new IPaSourceModel();
    unitTypeList: IPaSourceModel[] = new Array<IPaSourceModel>();
    displayedColumns: string[] = ['id', 'nameEn', 'nameBn', 'status', 'action'];
    dataSource = new MatTableDataSource(this.unitTypeList);
    actionPermission = [];


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private formBuilder: FormBuilder,
        private paSourceService: PaSourceService,
        private matSnackBar: MatSnackBar,
        private dialog: MatDialog,
        private snackBarHelper: SnackbarHelper,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
        this.getListData();

    }

    /*
    ********** For initializing form
     */
    populateForm() {
        this.frmGroup = this.formBuilder.group({
            nameEn: ['', Validators.required],
            nameBn: ['', Validators.required],
            description: [''],
            status: ['true', Validators.required],
        });
    }

    /*
    ********** For Create PA Source
     */
    onSubmit() {
        if (this.frmGroup.valid) {
            this.create();
            this.snackBarHelper.openSuccessSnackBar();
        } else {
            this.snackBarHelper.openErrorSnackBar();
        }
    }

    /*
    ********** For Create PA Source
     */
    create() {
        this.model.nameEn = this.frmGroup.value.nameEn;
        this.model.nameBn = this.frmGroup.value.nameBn;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        console.log(this.model);
        if (this.frmGroup.value.nameEn != null) {
            this.paSourceService.create(this.model).subscribe(res => {
                this.reset();
                this.getListData();
                this.populateForm();
            });
        }
    }

    /*
   ********** For Edit PA Source
    */
    edit(uuid: string) {
        this.disableDelete = true;
        this.editValue = true;
        console.log(uuid);
        this.paSourceService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }

    /*
   ********** For Update Economic Code
    */
    update() {
        console.log(this.uuid);
        this.model.nameEn = this.frmGroup.value.nameEn;
        this.model.nameBn = this.frmGroup.value.nameBn;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.paSourceService.update(this.model).subscribe(res => {
            this.reset();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getListData();
            this.populateForm();
            this.snackBarHelper.openSuccessSnackBarWithMessage('Data update successfully', 'Ok');
        });
    }

    /*
   ********** For opening dialog create, update delete comfirmation
    */
    private openDialog(row: IPaSourceModel) {
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
            }
            dialogRef.close(true);
        });
    }

    /*
   ********** For Delete PA Source
    */
    delete(uuid: any) {
        this.paSourceService.delete(uuid).subscribe(res => {
            this.getListData();
            this.reset();
            this.editValue = false;
            this.snackBarHelper.openSuccessSnackBarWithMessage('Data delete successfully', 'Ok');
        });
    }

    /*
   ********** For Get List of PA Source
    */
    getListData() {
        this.unitTypeList = [];
        this.paSourceService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.unitTypeList.push(m);
            // });
        });
    }

    /*
   ********** For Set value
    */
    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            nameEn: [res.nameEn],
            nameBn: [res.nameBn],
            description: [res.description],
            status: [res.status.toString()],
        });
    }

    /*
   ********** For Reset value
    */
    reset() {
        this.disableDelete = false;
        this.editValue = false;
        this.populateForm();
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            status: 'true'
        });
    }

    /*
   ********** For initialize paginator or sort
    */
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /*
   ********** For Searching data
    */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /*
    ********** For calling list during page change
    */
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
    }

    /*----------------Snack Bar---------------*/
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    openSnackBar(message: string, action: string): void {
        this.matSnackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    /*----------------/Snack Bar---------------*/


}
