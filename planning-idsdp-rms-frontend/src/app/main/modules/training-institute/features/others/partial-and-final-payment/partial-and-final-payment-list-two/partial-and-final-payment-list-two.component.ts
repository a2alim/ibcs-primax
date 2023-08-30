import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, viewIcon } from 'app/main/modules/rpm/constants/button.constants';
import { RmsEvaluatorsGrantAmountLetterService } from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { ToastrService } from 'ngx-toastr';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { PageEvent } from '@angular/material/paginator';
import { EvaluatorsGrantAmountLetter } from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { PartialFinalPaymentModel } from 'app/main/modules/training-institute/models/partial-final-payment.model';
import { TrainingInstituteProfileService } from 'app/main/modules/training-institute/services/training-institute-profile.service';
import { MatSort } from '@angular/material/sort';
import { AuthService } from "../../../../../auth/services/auth.service";
import { dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { CreateGoLetterModalComponent } from './create-go-letter-modal/create-go-letter-modal.component';
import { ViewGoLetterModalComponent } from './view-go-letter-modal/view-go-letter-modal.component';

@Component({
  selector: 'app-partial-and-final-payment-list-two',
  templateUrl: './partial-and-final-payment-list-two.component.html',
  styleUrls: ['./partial-and-final-payment-list-two.component.scss']
})
export class PartialAndFinalPaymentListTwoComponent implements OnInit {

  spinner: boolean = false;
  spinner1: boolean = false;
  spinner2: boolean = false;
  spinner3: boolean = false;
  spinner4: boolean = false;
  spinner5: boolean = false;
  spinner6: boolean = false;
  spinner7: boolean = false;

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
  viewIcon = viewIcon;

  trainingInstitutes: any[] = [];
  selectedTrainingInstitute: number = 0;;

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
    private _trainingInstituteProfileService: TrainingInstituteProfileService,
    private _dialog: MatDialog) {

    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
    this.getAllTrainersInstitutesList();
  }

  getPartialFinalPaymentList(size: number, page: number, selectedTrainingInstitute) {
    this.spinner1 = true;
    this._partialFinalPaymentService.getList(size, page, selectedTrainingInstitute).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
        this.total = res.page ? res.page.totalElements : 0;
        this.spinner1 = false;
      },
      error => {
        console.log("Error: " + error);
        this.spinner1 = false;
      }
    )
  }

  onChangePage(event: PageEvent) {
    this.size = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
  }

  viewDetails(id: string) {
    this.route.navigate(['partial-and-final-payment/' + id]);
  }

  edit(id) {
    this.route.navigate(['partial-and-final-payment/edit/' + id]);
  }

  download(letter: EvaluatorsGrantAmountLetter) {
    this.service.downloadFile(letter.uploadSignatureFile).subscribe(
      _ => {
      }
    );
  }

  openDialog(uuid) {
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
        this.delete(uuid);
      }
      dialogRef.close(true);
    });
  }

  delete(uuid) {
    this.spinner = true;
    this._partialFinalPaymentService.deletePartialFinalPayment(uuid).subscribe(
      res => {
        this._toastService.success(deleteSuccess, "Success");
        this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
        this.spinner = false;
      },
      error => {
        console.log(error)
        this._toastService.error(deleteFailed, "Error");
        this.spinner = false;
      }
    );
  }

  filterByInstitute() {
    this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  changePaymentStatus(value: string, id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: `Do you want to change status ${value}` };
    const dialogRef = this._dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        this.updateStatus(value, id);
      } else {
        this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
      }
      dialogRef.close(true);
    });

  }

  updateStatus(value: string, id: number) {
    this.spinner2 = true;
    this._partialFinalPaymentService.changeStatus(value, id).subscribe(
      res => {
        this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
        this._toastService.success("Changed Status to " + value, "Success");
        this.spinner2 = false;
      },
      error => {
        this._toastService.error(error.error.message, "Error");
        this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
        console.log(error);
        this.spinner2 = false;
      }
    );
  }

  createGoLetter(id) {
    this.route.navigate(['partial-and-final-payment/' + id + '/create-go-letter']);
  }

  private getAllTrainersInstitutesList() {
    this.spinner3 = true;
    this._trainingInstituteProfileService.getTrainingInstituteList().subscribe(
      res => {
        this.trainingInstitutes = res.data;
        this.trainingInstitutes.unshift({ id: 0, trainingInstituteName: 'Select Training Institute' });
        this.spinner3 = false
      },
      error => {
        console.log(error);
        this.spinner3 = false;
      }
    )
  }


  //============================= FOR GO LETTER ===========================

  createGoLetterDialog(row: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '70%';
    dialogConfig.height = '95%';
    dialogConfig.data = { ...row.goLetter, paymentModel: row };

    const dialogRef = this._dialog.open(CreateGoLetterModalComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        dialogRef.close(true);
        this.getPartialFinalPaymentList(this.size, this.page, this.selectedTrainingInstitute);
      }
    });
  }

  viewGoLetterDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '70%';
    dialogConfig.height = '95%';
    dialogConfig.data = { ...row.goLetter, paymentModel: row };

    const dialogRef = this._dialog.open(ViewGoLetterModalComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        dialogRef.close(true);
        //this.getListData();
      }
    });
  }

}
