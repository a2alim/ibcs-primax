import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {PriorityService} from '../../services/priority.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {IPriorityModel} from '../../models/priority.model';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";

@Component({
    selector: 'app-priority',
    templateUrl: './priority.component.html',
    styleUrls: ['./priority.component.scss']
})
export class PriorityComponent extends UnsubscribeAdapterComponent implements OnInit {

    disableDelete;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    model: IPriorityModel = new IPriorityModel();
    unitTypeList: IPriorityModel[] = new Array<IPriorityModel>();
    displayedColumns: string[] = ['id', 'nameEn', 'nameBn', 'status', 'action'];
    dataSource = new MatTableDataSource(this.unitTypeList);

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private formBuilder: FormBuilder,
        private matSnackBar: MatSnackBar,
        private priorityService: PriorityService,
        private snackBarHelper: SnackbarHelper,
        private dialog: MatDialog,
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
   ********** For Initializing Form
    */
    populateForm() {
        this.frmGroup = this.formBuilder.group({
            nameEn: ['', Validators.required],
            nameBn: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }

    /*
   ********** For Create Priority
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
   ********** For Create Priority
    */
    create() {
        this.model.nameEn = this.frmGroup.value.nameEn;
        this.model.nameBn = this.frmGroup.value.nameBn;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        console.log(this.model);
        if (this.frmGroup.value.nameEn != null) {
            this.priorityService.create(this.model).subscribe(res => {
                this.reset();
                this.getListData();
                this.populateForm();
                this.disableDelete = false;
            });
        }
    }

    /*
   ********** For edit value
    */
    edit(uuid: string) {
        this.disableDelete = true;
        this.editValue = true;
        console.log(uuid);
        this.priorityService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }

    /*
   ********** For Update Priority
    */
    update() {
        console.log(this.uuid);
        this.model.nameEn = this.frmGroup.value.nameEn;
        this.model.nameBn = this.frmGroup.value.nameBn;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.priorityService.update(this.model).subscribe(res => {
            this.reset();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getListData();
            this.populateForm();
            this.disableDelete = false;
            this.snackBarHelper.openSuccessSnackBarWithMessage('Data update Successfully', 'Ok')
        });
    }

    /*
   ********** For Opening Dialog box creating, updating and deleting confirmation
    */
    private openDialog(row: IPriorityModel) {
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
   ********** For Delete value
    */
    delete(uuid: any) {
        this.priorityService.delete(uuid).subscribe(res => {
            this.getListData();
            this.reset();
            this.editValue = false;
            this.snackBarHelper.openSuccessSnackBarWithMessage('Data delete successfully', 'Ok')
        });
    }

    /*
   ********** For Get List of Data
    */
    getListData() {
        this.unitTypeList = [];
        this.priorityService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.unitTypeList.push(m);
            // });
        });
    }

    /*
   ********** For set value
    */
    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            nameEn: [res.nameEn],
            nameBn: [res.nameBn],
            description: [res.description],
            status: [res.status.toString()],
        });
    }

    // resetValue() {
    //     this.frmGroup = this.formBuilder.group({
    //         nameEn: [''],
    //         nameBn: [''],
    //         description: [''],
    //         status: ['true'],
    //     });
    // }

    /*
   ********** For Initialize paginator or sort
    */
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    /*
   ********** For searching value
    */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /*
   ********** For calling during page change
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
