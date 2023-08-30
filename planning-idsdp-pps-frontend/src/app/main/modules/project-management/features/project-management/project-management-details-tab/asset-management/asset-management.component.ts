import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {AssetManagementModel} from "../../../../models/asset-management.model";
import {AssetManagementService} from "../../../../service/asset-management.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";

@Component({
    selector: 'app-asset-management',
    templateUrl: './asset-management.component.html',
    styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {

    horizontalStepperForm: FormGroup;
    @Input() dppTappMasterId: number;
    @Input() dppTappMasterUuid: string;
    @Input() projectConceptMasterId: number;
    @Input() projectConceptUuid: string;

    @Output() goForward = new EventEmitter<boolean>();
    @Output() goBack = new EventEmitter<boolean>();
    @Output() goBackToHome = new EventEmitter<boolean>();

    spinner: boolean;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    displayedColumns: string[] = ['sl', 'assetDetails', 'vendorDetails', 'assetCategory', 'remarks', 'procurementDate', 'action'];
    assetManagementModel: AssetManagementModel = new AssetManagementModel();

    constructor(private _assetManagementService: AssetManagementService,
                private dialog: MatDialog,
                private sanckbar: SnackbarHelper,) {
        this.getAssetList();
    }

    ngOnInit(): void {
    }

    nextTab() {
        this.goForward.emit(true);
    }

    previousTab(): void {
        this.goBack.emit(true);
    }

    saveNewAsset() {
        this.assetManagementModel.dppTappMasterId = this.dppTappMasterId;
        this.assetManagementModel.dppTappMasterUuid = this.dppTappMasterUuid;
        this._assetManagementService.saveAssetManagement(this.assetManagementModel).subscribe(res => {
            this.sanckbar.openSuccessSnackBarWithMessage('Save successful', 'OK');
            this.getAssetList();
        })
    }

    getAssetList() {
        this._assetManagementService.getAssetList(0,5).subscribe(res => {
            this.dataSource = new MatTableDataSource<any>(res.page.content)
        })
    }

    deleteData(uuid: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.spinner = true;
                this._assetManagementService.deleteAsset(uuid).subscribe(
                    res => {
                        this.getAssetList();
                        this.spinner = false;
                    },
                    err => {
                        this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on delete Expenditure!', 'OK');
                        this.spinner = false;
                    }
                )
            }
            dialogRef.close(true);
        });


    }

    editData(element) {
        this.assetManagementModel = element;
    }
}
