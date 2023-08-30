import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, dataNotFount, deleteFailed, deleteSuccess, emailIcon, pdfIcon, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess} from 'app/main/modules/rpm/constants/button.constants';
import {EvaluatorsGrantAmountLetter} from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import {RmsEvaluatorsGrantAmountLetterService} from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {AgreementService} from 'app/main/modules/training-institute/services/agreement.service';
import {ToastrService} from 'ngx-toastr';
import {AgreementResponse} from 'app/main/modules/training-institute/models/agreement-response.model';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {GuarantorService} from "../../../../services/guarantor.service";
import {GuarantorResponse} from "../../../../models/guarantor-response.model";
import {AuthService} from "../../../../../auth/services/auth.service";

@Component({
    selector: 'app-agreement-list',
    templateUrl: './agreement-list.component.html',
    styleUrls: ['./agreement-list.component.scss']
})
export class AgreementListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl','nameOfTrainingInstitution','TrainingTitle', 'firstPartyName', 'secondPartyName', 'guarantorName', 'status', 'action'];
    dataSource: MatTableDataSource<AgreementResponse>;
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    userType: string = this._authService.getLoggedUserType();

    agreementStatusList: string[] = [
        "COMPLETED",
        "RUNNING",
        "REJECTED"
    ]

    guarantors: GuarantorResponse[] = []

    trainingInstitutes: any[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private _toastService: ToastrService,
                private route: Router,
                private snackbarHelper: SnackbarHelper,
                private _agreementService: AgreementService,
                private dialog: MatDialog,
                private _guarantorService: GuarantorService,
                private _authService: AuthService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.spinner = true

        this.getAgreementList(this.size, this.page);
        // this.getAllTrainersInstitutesList();
        // this.getAgreementList(this.size, this.page);
    }

    getTrainingInstituteName(createdBy: number) {

        let trainingInstitute = this.trainingInstitutes.find(ti => ti.id == createdBy);

        if (trainingInstitute)
            return trainingInstitute.name;
        else
            return "Not Provided";
    }

    getAgreementList(size: number, page: number) {
        this.spinner = true;
        this._agreementService.getAgreementList(size, page).subscribe(
            res => {
                this.total = res.totalItems;
                let data: any[] = res.data;
                //  used the loop to iterate through the agreement data and then
                // set new properties instituteName & guarantorName for search to work

                for (let i = 0; i < data.length; i++) {
                    data[i].instituteName = data[i].proposalModel.trainingInstituteProfileModel.trainingInstituteName;
                    data[i].firstPartyName = data[i].onBehalf.firstPartyName;
                    data[i].secondPartyName = data[i].onBehalf.secondPartyName;
                    data[i].guarantorName = data[i].guarantorModel.guarantorName;
                    data[i].guarantorName = data[i].guarantorModel.guarantorName;
                }
                this.dataSource = new MatTableDataSource(data);
                console.log(data)
            },
            error => {
                console.log("Error: " + error);
            }
        )
        this.spinner = false;
    }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }

    viewDetails(uuid: string) {
        this.route.navigate(['agreement-letter/view/' + uuid]);
    }

    editAgreement(id) {
        this.route.navigate(["/agreement-letter/add", id])
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
                this.deleteAgreement(id);
            }
            dialogRef.close(true);
        });
    }

    deleteAgreement(id) {
        console.log(id)
        this._agreementService.deleteCourse(Number(id)).subscribe(
            res => {
                this._toastService.success(deleteSuccess, "Success")
                this.getAgreementList(this.size, this.page);
            },
            error => {
                this._toastService.error(deleteFailed, "Error");
                console.log(error)
            }
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue)
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    changeAgreementStatus(value: string, id: number) {
        console.log(value)
        console.log(id)
        this._agreementService.changeStatus(value, id).subscribe(
            res => {
                this.getAgreementList(this.size, this.page);
                this._toastService.success("Changed Status to " + value, "Success");
            },
            error => {
                if (error.status == 400) {
                    this._toastService.error(updateFailed, "Error");
                }
                console.log(error);
            }
        );
    }


}

