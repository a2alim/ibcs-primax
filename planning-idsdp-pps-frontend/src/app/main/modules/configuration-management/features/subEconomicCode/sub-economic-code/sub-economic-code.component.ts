import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../sub-economic-code/i18n/bn';
import {locale as lngEnglish} from '../sub-economic-code/i18n/en';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import {SubEconomicCodeModel} from '../../../models/sub-economic-code-model';
import {SubEconomicCodeService} from '../../../services/sub-economic-code.service';
import {EconomicCodeService} from '../../../services/economic-code-service.service';
import {EconomicTypeModel} from '../../../models/economic-code-model';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from "../../../../../../layout/layouts/vertical/classy/i18n/en";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../../core/constants/message";

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-list-page',
    templateUrl: './sub-economic-code.component.html',
    styleUrls: ['./sub-economic-code.component.scss'],
})
export class SubEconomicCodeComponent extends UnsubscribeAdapterComponent implements OnInit {
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    model: SubEconomicCodeModel = new SubEconomicCodeModel();
    subEconomicCodeList: SubEconomicCodeModel[] = new Array<SubEconomicCodeModel>();
    displayedColumns: string[] = ['id', 'economicCodeId', 'subEconomicCode', 'subEconomicCodeBng', 'subEconomicCodeName', 'subEconomicCodeNameBng', 'description', 'descriptionBn', 'status', 'action'];
    dataSource = new MatTableDataSource(this.subEconomicCodeList);
    economicCodes: EconomicTypeModel[] = new Array<EconomicTypeModel>();
    formTitle = 'Add Economic Sub-Code';

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private subEconomicCodeService: SubEconomicCodeService,
        private economicCodeService: EconomicCodeService,
        private matSnackBar : SnackbarHelper,
        private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.dataSource = new MatTableDataSource(this.subEconomicCodeList);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        // this.frmGroup = this.formBuilder.group({
        //     economicCodeId: ['', Validators.required],
        //     oldSubEconomicCodeEn: ['', Validators.required],
        //     oldSubEconomicCodeBn: ['', Validators.required],
        //     subEconomicCode: ['', Validators.required],
        //     subEconomicCodeBng: ['', Validators.required],
        //     subEconomicCodeName: ['', Validators.required],
        //     subEconomicCodeNameBng: ['', Validators.required],
        //     description: ['', ''],
        //     status: ['true', Validators.required],
        // });
        this.frmGroup = this.formBuilder.group({
            economicCodeId: [''],
            oldSubEconomicCodeEn: [''],
            oldSubEconomicCodeBn: [''],
            subEconomicCode: [''],
            subEconomicCodeBng: [''],
            subEconomicCodeName: [''],
            subEconomicCodeNameBng: [''],
            description: ['', ''],
            descriptionBn: ['', ''],
            status: ['true'],
        });
        this.getListData();
        this.getEconomicCode();
    }

    private getEconomicCode() {
        this.subscribe$.add(
            this.economicCodeService.fetchActiveEconomicCodeList().subscribe(res => {
                this.economicCodes = res;
            })
        );
    }

    onSubmit() {
        if (this.frmGroup.valid) {
            this.saveData();
        } else {
            this.matSnackBar.openErrorSnackBar();
        }
    }

    saveData() {
        this.model.economicCodeId.id = this.frmGroup.value.economicCodeId;
        //this.model.economicCodeId = this.frmGroup.value.economicCodeId;
        this.model.oldSubEconomicCodeEn = this.frmGroup.value.oldSubEconomicCodeEn;
        this.model.oldSubEconomicCodeBn = this.frmGroup.value.oldSubEconomicCodeBn;
        this.model.subEconomicCode = this.frmGroup.value.subEconomicCode;
        this.model.subEconomicCodeBng = this.frmGroup.value.subEconomicCodeBng;
        this.model.subEconomicCodeName = this.frmGroup.value.subEconomicCodeName;
        this.model.subEconomicCodeNameBng = this.frmGroup.value.subEconomicCodeNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.descriptionBn = this.frmGroup.value.descriptionBn;
        this.model.status = this.frmGroup.value.status;
        this.subEconomicCodeService.create(this.model).subscribe(res => {
            this.matSnackBar.openSuccessSnackBar();
            this.resetValue();
            this.getListData();
        });

    }

    edit(uuid: string) {
        this.editValue = true;
        console.log(uuid);
        this.subEconomicCodeService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }

    update() {
        console.log(this.uuid);
        this.model.economicCodeId.id = this.frmGroup.value.economicCodeId;
        this.model.oldSubEconomicCodeEn = this.frmGroup.value.oldSubEconomicCodeEn;
        this.model.oldSubEconomicCodeBn = this.frmGroup.value.oldSubEconomicCodeBn;
        this.model.subEconomicCode = this.frmGroup.value.subEconomicCode;
        this.model.subEconomicCodeBng = this.frmGroup.value.subEconomicCodeBng;
        this.model.subEconomicCodeName = this.frmGroup.value.subEconomicCodeName;
        this.model.subEconomicCodeNameBng = this.frmGroup.value.subEconomicCodeNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.descriptionBn = this.frmGroup.value.descriptionBn;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.subEconomicCodeService.update(this.model).subscribe(res => {
            this.matSnackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.resetValue();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getListData();
        });
    }

    private openDialog(rowUuid) {
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
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    delete(rowUuid) {
        this.subEconomicCodeService.delete(rowUuid).subscribe(res => {
            this.matSnackBar.openSuccessSnackBarWithMessage("Delete Successfully","Ok");
            this.getListData();
        });
    }

    getListData() {
        this.subEconomicCodeList = [];
        this.subEconomicCodeService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
            console.log(res);
            // res.forEach(m => {
            //     this.unitTypeList.push(m);
            // });
        });
    }


    findEconomicCodes(res: any) {
        for (let i = 0; i < this.economicCodes.length; i++) {
            if (res.id === this.economicCodes[i].id) {
                const id = this.economicCodes[i].id;
                return id;
            }
        }
    }

    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            economicCodeId: [this.findEconomicCodes(res.economicCodeId)],
            subEconomicCode: [res.subEconomicCode],
            oldSubEconomicCodeEn: [res.oldSubEconomicCodeEn],
            oldSubEconomicCodeBn: [res.oldSubEconomicCodeBn],
            subEconomicCodeBng: [res.subEconomicCodeBng],
            subEconomicCodeName: [res.subEconomicCodeName],
            subEconomicCodeNameBng: [res.subEconomicCodeNameBng],
            description: [res.description],
            descriptionBn: [res.descriptionBn],
            status: [res.status.toString()],
        });
    }

    resetValue() {
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            status: 'true'
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
        this.getListData();
    }



}

