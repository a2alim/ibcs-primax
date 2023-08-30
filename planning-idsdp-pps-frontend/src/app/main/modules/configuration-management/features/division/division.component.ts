import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DivisionModel} from '../../models/division.model';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {DivisionService} from '../../services/division.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {SnackbarHelper} from "../../../../core/helper/snackbar.helper";
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';


@Component({
    selector: 'app-division',
    templateUrl: './division.component.html',
    styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
    model: DivisionModel = new DivisionModel();
    divisionList: DivisionModel[] = new Array<DivisionModel>();
    editValue: boolean;
    frmGroup: FormGroup;
    uuid: string;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    displayedColumns: string[] = ['uuid', 'nameEn', 'nameBn', 'geoCode', 'status', 'action'];
    dataSource = new MatTableDataSource(this.divisionList);

    actionPermission = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private divisionService: DivisionService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog) {
        this.dataSource = new MatTableDataSource(this.divisionList);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.resetValue();
        this.getDivision();
    }

    create() {
        this.disableDelete = false;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.status = this.frmGroup.value.status;
        if (this.model.nameBn && this.model.nameEn && this.model.status) {
            this.divisionService.create(this.model).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.resetValue();
                this.getDivision();
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }
    reset() {
        this.resetValue();
        this.disableDelete = false;
        this.editValue = false;
    }

    // edit(row: DivisionModel) {
    //     console.log('Division');
    //     console.log(row);
    //     this.disableDelete = true;
    //     this.editValue = true;
    //     this.uuid = row.uuid;
    //     if (row) {
    //         console.log('Division set value called 1');
    //         this.setValue(row);
    //     }
    // }


    edit(uuid: string) {
        this.disableDelete = true;
        this.divisionService.getByUuid(uuid).subscribe(res => {
            console.log(res);
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }

    setValue(res: any): any {
        this.frmGroup.get('nameBangla').setValue(res.nameBn);
        this.frmGroup.get('nameEnglish').setValue(res.nameEn);
        const name = res.status.toString();
        this.frmGroup.get('status').setValue(name);
        this.frmGroup.get('geoCode').setValue(res.geoCode);
        this.frmGroup.get('description').setValue(res.description);
    }

    update() {
        this.model.uuid = this.uuid;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.status = this.frmGroup.value.status;
        this.divisionService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBar();
            this.resetValue();
            this.getDivision();
            this.editValue = false;
            this.disableDelete = false;
            this.uuid = '';
            this.model.uuid = '';
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    delete(uuid: string) {
        this.divisionService.delete(uuid).subscribe(res => {
            this.getDivision();
        });
    }

    getDivision() {
        this.divisionList = [];
        this.divisionService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
        this.getDivision();
    }

    private openDialog(uuid: string) {
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
                this.delete(uuid);
            }
            dialogRef.close(true);
        });
    }


    resetValue() {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            geoCode: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }


}

