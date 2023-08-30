import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {DivisionModel} from "../../models/division.model";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../core/constants/constant";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CurrencyModel} from "../../models/currency.model";
import {CurrencyService} from "../../services/currency.service";
import {SnackbarHelper} from "../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';
import {OK, SUCCESSFULLY_UPDATED} from "../../../../core/constants/message";

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

    model: CurrencyModel = new CurrencyModel();
    currencyList: CurrencyModel[] = new Array<CurrencyModel>();
    editValue: boolean;
    frmGroup: FormGroup;
    uuid: string;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    displayedColumns: string[] = ['uuid', 'nameEn', 'nameBn', 'code', 'country', 'status', 'action'];
    dataSource = new MatTableDataSource(this.currencyList);
    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              private formBuilder: FormBuilder,
              private snackbarHelper: SnackbarHelper,
              private currencyService: CurrencyService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
      this.actionPermission = lngEnglishAction.data.ACTION;
      this.resetValue();
      this.getCurrency();
  }

    create() {
        this.disableDelete = false;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.code = this.frmGroup.value.code;
        this.model.country = this.frmGroup.value.country;
        this.model.status = this.frmGroup.value.status;
        if (this.model.nameBn && this.model.nameEn && this.model.status) {
            this.currencyService.create(this.model).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.resetValue();
                this.getCurrency();
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }

    edit(uuid: string) {
        this.disableDelete = true;
        this.currencyService.getByUuid(uuid).subscribe(res => {
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
        this.frmGroup.get('code').setValue(res.code);
        this.frmGroup.get('country').setValue(res.country);
        this.frmGroup.get('description').setValue(res.description);
    }

    update() {
        this.model.uuid = this.uuid;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.code = this.frmGroup.value.code;
        this.model.country = this.frmGroup.value.country;
        this.model.status = this.frmGroup.value.status;
        this.currencyService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.resetValue();
            this.getCurrency();
            this.editValue = false;
            this.disableDelete = false;
            this.uuid = '';
            this.model.uuid = '';
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    delete(uuid: string) {
        this.currencyService.delete(uuid).subscribe(res => {
            this.getCurrency();
        });
    }

    getCurrency() {
        this.currencyList = [];
        this.currencyService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getCurrency();
    }

    reset() {
        this.resetValue();
        this.disableDelete = false;
        this.editValue = false;
    }

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            code: ['', Validators.required],
            country: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required]
        });
    }

}
