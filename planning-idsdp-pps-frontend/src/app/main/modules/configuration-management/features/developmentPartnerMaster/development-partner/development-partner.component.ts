import {Component, OnInit, ViewChild} from '@angular/core';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DevelopmentPartnerModel} from '../../../models/developmentPartnerModel.model';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../../unit/i18n/en';
import {locale as lngBangla} from '../../unit/i18n/bn';
import {DevelopmentPartnerService} from '../../../services/developmentPartnerService.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OK, SUCCESSFULLY_UPDATED } from 'app/main/core/constants/message';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from '../../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
    selector: 'app-development-partner',
    templateUrl: './development-partner.component.html',
    styleUrls: ['./development-partner.component.scss']
})
export class DevelopmentPartnerComponent implements OnInit {

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    code: string;
    model: DevelopmentPartnerModel = new DevelopmentPartnerModel();
    formTitle = 'Approval Status';
    displayedColumns: string[] = ['id', 'developmentPartnerName', 'developmentPartnerNameBng', 'description', 'status', 'action'];
    dataSource: MatTableDataSource<DevelopmentPartnerModel>;
    developmentPartnerModelsList: DevelopmentPartnerModel[] = new Array<DevelopmentPartnerModel>();

    actionPermission = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private developmentPartnerService: DevelopmentPartnerService,
        private formBuilder: FormBuilder,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog

    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.dataSource = new MatTableDataSource(this.developmentPartnerModelsList);
    }

    ngOnInit(): void {

        this.actionPermission = lngEnglishAction.data.ACTION;
        this.frmGroup = this.formBuilder.group({
            developmentPartnerName: ['', Validators.required],
            developmentPartnerNameBng: ['', ''],
            description: ['', ''],
            status: ['true', Validators.required],
        });
        this.getApprovalStatusList();
    }

    create() {

        /*if (this.frmGroup.valid) {
            console.log('ok ---');
        }*/

        this.model.developmentPartnerName = this.frmGroup.value.developmentPartnerName;
        this.model.developmentPartnerNameBng = this.frmGroup.value.developmentPartnerNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.developmentPartnerService.create(this.model)
            .subscribe(
                data => {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getApprovalStatusList();
                    /*this.getApprovalStatusList();
                    this.resetValue();*/
                },
                error => {
                    if (error.status === 500) {

                    }
                });
    }

    getApprovalStatusList() {
        this.developmentPartnerModelsList = [];
        this.developmentPartnerService.fetchActiveDevelopmentList().subscribe(res => {
            this.dataSource = new MatTableDataSource(res.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            res.forEach(m => {
                console.log(m);
                this.developmentPartnerModelsList.push(m);
            });
        });

    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    edit(uuid: string) {
        this.editValue = true;
        console.log(uuid);
        this.developmentPartnerService.getByAllApprovalStatusBy(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;

        });
    }

    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            developmentPartnerName: [res.developmentPartnerName],
            developmentPartnerNameBng: [res.developmentPartnerNameBng],
            description: [res.description],
            status: [res.status].toString(),
        });
        this.model.code = res.code;
    }


    update() {

        this.model.developmentPartnerName = this.frmGroup.value.developmentPartnerName;
        this.model.developmentPartnerNameBng = this.frmGroup.value.developmentPartnerNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        console.log(this.model);
        this.developmentPartnerService.updateByAllApprovalStatusBy(this.model.uuid, this.model.developmentPartnerName,
            this.model.developmentPartnerNameBng, this.model.description , this.model.status, this.model.code).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.resetValue();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getApprovalStatusList();
        });
    }

    // delete(uuid: string) {
    //     this.developmentPartnerService.deleteFeature(uuid).subscribe(res => {
    //         this.getApprovalStatusList();
    //     });
    // }

    openDeleteDialog(uuid: string) {
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

                this.developmentPartnerService.deleteFeature(uuid).subscribe(res => {
                    this.getApprovalStatusList();
                });
            }
            dialogRef.close(true);
        });

    }


    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getApprovalStatusList();
    }

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            developmentPartnerName: [''],
            developmentPartnerNameBng: [''],
            description: [''],
            status: [''],
        });
    }
}
