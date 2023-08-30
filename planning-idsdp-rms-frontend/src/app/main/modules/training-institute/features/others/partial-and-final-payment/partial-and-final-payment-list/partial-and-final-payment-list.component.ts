import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon} from 'app/main/modules/rpm/constants/button.constants';
import {RmsEvaluatorsGrantAmountLetterService} from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import {PartialFinalPaymentService} from 'app/main/modules/training-institute/services/partial-final-payment.service';
import {ToastrService} from 'ngx-toastr';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {PageEvent} from '@angular/material/paginator';
import {EvaluatorsGrantAmountLetter} from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {PartialFinalPaymentModel} from 'app/main/modules/training-institute/models/partial-final-payment.model';
import {TrainingInstituteProfileService} from 'app/main/modules/training-institute/services/training-institute-profile.service';
import {MatSort} from '@angular/material/sort';
import {AuthService} from "../../../../../auth/services/auth.service";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-partial-and-final-payment-list',
    templateUrl: './partial-and-final-payment-list.component.html',
    styleUrls: ['./partial-and-final-payment-list.component.scss']
})
export class PartialAndFinalPaymentListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'nameOfTrainingInstitution', 'installmentType', 'installmentDate', 'totalAmount', 'go', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    userType: string = this._authService.getLoggedUserType();

    payments: PartialFinalPaymentModel[] = [];

    addNewIcon = addNewIcon;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    trainingInstitutes: any[] = [];
    selectedTrainingInstitute: String;

    statusType: String[] = [
        "APPROVED",
        "PENDING",
        "REWORK",
        "PROCESSING",
        "REJECTED",
    ];
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private _toastService: ToastrService,
                private route: Router,
                private dialog: MatDialog,
                private _authService: AuthService,
                private _partialFinalPaymentService: PartialFinalPaymentService,
                private _trainingInstituteProfileService: TrainingInstituteProfileService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true
        this.getPartialFinalPaymentList(this.size, this.page);
        this.getAllTrainersInstitutesList();

    }

    getTrainingInstituteName(createdBy: number) {

        let trainingInstitute = this.trainingInstitutes.find(ti => ti.id == createdBy);

        if (trainingInstitute)
            return trainingInstitute.name;
        else
            return "Not Provided";
    }

    getPartialFinalPaymentList(size: number, page: number) {
        this._partialFinalPaymentService.getPartialFinalPaymentList(size, page).subscribe(
            res => {
                this.total = res.totalItems;               
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].instituteName = res.data[i].trainingInstituteProfileModel.trainingInstituteName
                }
                this.dataSource = new MatTableDataSource<PartialFinalPaymentModel>(res.data);
                this.payments = res.data;
                this.spinner = false;
            },
            error => {
                console.log("Error: " + error);
                this.spinner = false;
            }
        )
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPartialFinalPaymentList(this.size, this.page);
    }

    viewDetails(id: string) {
        this.route.navigate(['partial-and-final-payment/' + id]);
    }

    edit(id) {
        this.route.navigate(['partial-and-final-payment/edit/' + 1]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
    }

    openDialog(id) {
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
                this.deleteInstalllment(id);
            }
            dialogRef.close(true);
        });
    }

    deleteInstalllment(id) {        
        this._partialFinalPaymentService.deletePartialFinalPayment(Number(id)).subscribe(
            res => {
                this._toastService.success(deleteSuccess, "Success")
                this.getPartialFinalPaymentList(this.size, this.page);
            },
            error => {
                console.log(error)
                this._toastService.error(deleteFailed, "Error")
            }
        );
    }

    filterByInstitute() {
        const filterValue = this.selectedTrainingInstitute;
        console.log(this.selectedTrainingInstitute)
        this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    changePaymentStatus(value: string, id: number) {
        console.log(value)
        console.log(id)
        this._partialFinalPaymentService.changeStatus(value, id).subscribe(
            res => {
                this.getPartialFinalPaymentList(this.size, this.page);
                this._toastService.success("Changed Status to " + value, "Success");
            },
            error => {
                if (error.status == 400) {
                    this._toastService.error(error.error.message, "Error");
                    this.getPartialFinalPaymentList(this.size, this.page);
                }
                console.log(error);
            }
        );
    }

    createGoLetter(id) {
        this.route.navigate(['partial-and-final-payment/' + id + '/create-go-letter']);
    }

    private getAllTrainersInstitutesList() {
        this._trainingInstituteProfileService.getTrainingInstituteList().subscribe(
            res => {
                this.trainingInstitutes = res.data;
                this.spinner = false
            },
            error => {
                console.log(error)
            }
        )
    }
}
