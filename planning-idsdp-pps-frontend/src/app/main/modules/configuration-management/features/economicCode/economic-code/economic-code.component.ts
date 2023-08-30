import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../economic-code/i18n/bn';
import {locale as lngEnglish} from '../economic-code/i18n/en';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import {EconomicTypeModel} from '../../../models/economic-code-model';
import {EconomicCodeService} from '../../../services/economic-code-service.service';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from '../../../../../../layout/layouts/vertical/classy/i18n/en';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-list-page',
    templateUrl: './economic-code.component.html',
    styleUrls: ['./economic-code.component.scss'],
})
export class EconomicCodeComponent implements OnInit {
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    disableDelete;
    model: EconomicTypeModel = new EconomicTypeModel();
    economicCodeList: EconomicTypeModel[] = new Array<EconomicTypeModel>();
    displayedColumns: string[] = ['id', 'economicCode', 'economicCodeBng', 'economicCodeName', 'economicCodeNameBng', 'description', 'descriptionBn', 'status', 'action'];
    dataSource = new MatTableDataSource(this.economicCodeList);
    formTitle = 'Add Economic Code';

    actionPermission = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private snackBarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private economicCodeService: EconomicCodeService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.dataSource = new MatTableDataSource(this.economicCodeList);
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
       /* this.frmGroup = this.formBuilder.group({
            economicCodeFor: ['', Validators.required],
            oldEconomicCodeEn: ['', Validators.required],
            oldEconomicCodeBn: ['', Validators.required],
            economicCode: ['', Validators.required],
            economicCodeBng: ['', Validators.required],
            economicCodeName: ['', Validators.required],
            economicCodeNameBng: ['', Validators.required],
            description: [''],
            status: ['true', Validators.required],
        });
        */

        //without required
        this.frmGroup = this.formBuilder.group({
            economicCodeFor: [''],
            oldEconomicCodeEn: [''],
            oldEconomicCodeBn: [''],
            economicCode: [''],
            economicCodeBng: [''],
            economicCodeName: [''],
            economicCodeNameBng: [''],
            description: [''],
            descriptionBn: [''],
            status: ['true'],
        });
    }

    /*
********** For Create Economic Code
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
********** For Create Economic Code
 */
    create() {
        this.model.economicCodeFor = this.frmGroup.value.economicCodeFor;
        this.model.oldEconomicCodeEn = this.frmGroup.value.oldEconomicCodeEn;
        this.model.oldEconomicCodeBn = this.frmGroup.value.oldEconomicCodeBn;
        this.model.economicCode = this.frmGroup.value.economicCode;
        this.model.economicCodeBng = this.frmGroup.value.economicCodeBng;
        this.model.economicCodeName = this.frmGroup.value.economicCodeName;
        this.model.economicCodeNameBng = this.frmGroup.value.economicCodeNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.descriptionBn = this.frmGroup.value.descriptionBn;
        this.model.status = this.frmGroup.value.status;
        console.log(this.model);
        if (this.frmGroup.value.economicCode != null) {
            this.economicCodeService.create(this.model).subscribe(res => {
                this.reset();
                this.getListData();
                this.populateForm();
            });
        }
    }


    /*   edit(row: ProjectType) {
           this.frmGroup.patchValue({
               uuid: row.uuid,
               projectTypeCode: row.projectTypeCode,
               nameEn: row.nameEn,
               nameBn: row.nameBn,
               description: row.description,
               status: row.status.toString()
           });
       }*/

    /*
   ********** For Edit Economic Code
    */
    edit(uuid: string) {
        this.disableDelete = true;
        this.editValue = true;
        console.log(uuid);
        this.economicCodeService.getByUuid(uuid).subscribe(res => {
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
        this.model.economicCodeFor = this.frmGroup.value.economicCodeFor;
        this.model.oldEconomicCodeEn = this.frmGroup.value.oldEconomicCodeEn;
        this.model.oldEconomicCodeBn = this.frmGroup.value.oldEconomicCodeBn;
        this.model.economicCode = this.frmGroup.value.economicCode;
        this.model.economicCodeBng = this.frmGroup.value.economicCodeBng;
        this.model.economicCodeName = this.frmGroup.value.economicCodeName;
        this.model.economicCodeNameBng = this.frmGroup.value.economicCodeNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.descriptionBn = this.frmGroup.value.descriptionBn;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.economicCodeService.update(this.model).subscribe(res => {
            this.disableDelete = true;
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
********** For opening confirmation dialog before delete, create and update
 */
    private openDialog(row: EconomicTypeModel) {
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
********** For Deleting Economic Code
*/
    delete(uuid: any) {
        this.economicCodeService.delete(uuid).subscribe(res => {
            this.getListData();
            this.editValue = false;
            this.reset();
            this.snackBarHelper.openSuccessSnackBarWithMessage('Data delete successfully', 'Ok');
        });
    }

    /*
********** For Get List of Economic Code
*/
    getListData() {
        this.economicCodeList = [];
        this.economicCodeService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.unitTypeList.push(m);
            // });
        });
    }

    /*
********** For Reset Form value
*/
    reset() {
        this.disableDelete = false;
        this.editValue = false;
        this.populateForm();
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            economicCodeFor: '',
            status: 'true'
        });
    }

    /*
********** For Set Economic Code value
*/
    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            economicCodeFor: [res.economicCodeFor.toString()],
            oldEconomicCodeEn: [res.oldEconomicCodeEn],
            oldEconomicCodeBn: [res.oldEconomicCodeBn],
            economicCode: [res.economicCode],
            economicCodeBng: [res.economicCodeBng],
            economicCodeName: [res.economicCodeName],
            economicCodeNameBng: [res.economicCodeNameBng],
            description: [res.description],
            descriptionBn: [res.descriptionBn],
            status: [res.status.toString()],
        });
    }

    /*
********** For Reset Economic Code
*/
    resetValue() {
        this.frmGroup = this.formBuilder.group({
            economicCodeFor: [''],
            oldEconomicCodeEn: [''],
            oldEconomicCodeBn: [''],
            economicCode: [''],
            economicCodeBng: [''],
            economicCodeName: [''],
            economicCodeNameBng: [''],
            description: [''],
            descriptionBn: [''],
            status: ['true'],
        });
    }

    /*
********** For Reset Economic Code
*/
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /*
********** For searching from list
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

}

