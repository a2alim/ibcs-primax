import {Component, OnInit} from '@angular/core';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AuthService} from 'app/main/modules/auth/services/auth.service';
import {addNewIcon, emailIcon, pdfIcon} from 'app/main/modules/rpm/constants/button.constants';
import {EvaluatorsGrantAmountLetter} from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import {RmsEvaluatorsGrantAmountLetterService} from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {ToastrService} from 'ngx-toastr';
import {ChequeCollectionService} from 'app/main/modules/training-institute/services/cheque-collection.service';
import {ChequeCollectionResponse} from 'app/main/modules/training-institute/models/cheque-collection-response.model';
import {UploadSignatureModalComponent} from "./upload-signature-modal/upload-signature-modal.component";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import {UploadModalComponent} from "../../../agreement-process/guarantors-info/upload-modal/upload-modal.component";

@Component({
    selector: 'app-cheque-collection-list',
    templateUrl: './cheque-collection-list.component.html',
    styleUrls: ['./cheque-collection-list.component.scss']
})
export class ChequeCollectionListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'instituteName', 'collectionDate', 'receivedAmount', 'mobileNo',
        'isChequeReceived', 'signaturedDocument', 'action'];
    dataSource: MatTableDataSource<any>;
    chequeCollectionResponse: ChequeCollectionResponse[] = [];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    proposalTitle: string = "";

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    userDetails: any;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    fiscalYears: any [] = [];
    trainingInstitutes: any[] = [];
    userType: string = this._authService.getLoggedUserType();

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private route: Router,
                private dialog: MatDialog,
                private _toastService: ToastrService,
                private _chequeCollectionService: ChequeCollectionService,
                private _authService: AuthService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.userDetails = this._authService.getLoggedUserDetails();
        this.spinner = true;
        this.getList();
    }

    getInstituteName(createdBy: any) {
        let institute = this.trainingInstitutes.find(ti => ti.id == createdBy);


        if (institute.id == createdBy)
            return institute.name;
        else
            return "XYZ Institute";
    }

    getList() {
        this._chequeCollectionService.getChequeCollection(this.size, this.page).subscribe(
            res => {
                this.spinner = false;
                this.chequeCollectionResponse = []
                if (this.userType === "Rms_DO") {
                    res.data.forEach(result => {
                        if (result.isDeleted === false) {
                            this.chequeCollectionResponse.push(result);
                        }
                    })
                } else if (this._authService.getLoggedUserType() === "Rms_Training_Institute") {
                    res.data.forEach(result => {

                        this.chequeCollectionResponse.push(result);

                    })
                }

                let data: any[] = this.chequeCollectionResponse;
                for (let i = 0; i < data.length; i++) {

                    data[i].isChequeReceived = data[i].chequeReceived ? "Yes" : "No";
                    data[i].instituteName = data[i].trainingInstituteProfileModel.trainingInstituteName;
                    data[i].isSignaturedDocument = (data[i].signaturedDocument != null) ? "Uploaded" : "Not Found";
                }
                this.dataSource = new MatTableDataSource(data);
                this.total = res.totalItems;

            },
            error => {
                this.spinner = false;
                console.log(error)
            }
        );
    }

    deleteChequeCollection(chequeId: number) {
        this._chequeCollectionService.deleteChequeCollection(chequeId).subscribe(
            () => {
                this._toastService.success(deleteSuccess, "Success");
                this.getList();
            },
            error => {
                console.log("Error: " + error);
                this._toastService.success(deleteFailed, "Error");
            }
        );
    }


    openDialog(chequeId: number) {
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
                this.deleteChequeCollection(chequeId);
            }
            dialogRef.close(true);
        });
    }

    openSendMailDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(UploadSignatureModalComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this._toastService.info("Mail Sent","Success")
            }
            dialogRef.close(true);
        });
    }

    viewDetails(id: number) {
        this.route.navigate(['cheque-collection/view/' + id]);
    }

    edit(id: number) {
        this.route.navigate(['cheque-collection/edit/' + id]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
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
        this.getList();
    }

    uploadSignature(id: number, getVal) {

        // this.openSendMailDialog()

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE, id: id, ...getVal.signatureImageOfCollectingPerson};
        this.dialog.open(UploadSignatureModalComponent, dialogConfig);

    }
}
