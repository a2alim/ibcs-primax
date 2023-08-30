
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { addNewIcon, nextIcon, previousIcon, saveIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { locale as lngEnglish } from "../../../i18n/en";
import { locale as lngBangla } from "../../../i18n/bn";
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { BudgetService } from 'app/main/modules/training-institute/services/budget.service';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { PartialFinalPaymentModel, PaymentBillVoucherModel } from "../../../../../../models/partial-final-payment.model";
import { TrainingBudgetModel } from "../../../../../../models/training-budget.model";
import { ProposalService } from "../../../../../../services/proposal.service";
import { ProposalModel } from "../../../../../../models/proposal.model";
import { AgreementService } from "../../../../../../services/agreement.service";
import { AgreementModel } from "../../../../../../models/agreement.model";
import { AgreementInstallmentModel } from "../../../../../../models/agreement-installments.model";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ExpeditureItemServiceService } from "../../../../../../../settings/services/expediture-item-service.service";
import { InstallmentModel } from "../../../../../../models/installment.model";
import { DateAdapter } from '@angular/material/core';
import { dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { JasperServiceService } from 'app/main/modules/rpm/services/jasper-service.service';
import { OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UplodFileModalNewComponent } from '../uplod-file-modal-new/uplod-file-modal-new.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-submit-bill-voucher-new-two',
  templateUrl: './submit-bill-voucher-new-two.component.html',
  styleUrls: ['./submit-bill-voucher-new-two.component.scss']
})
export class SubmitBillVoucherNewTwoComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() existingPartialFinalPayment: PartialFinalPaymentModel;
  @Input() installmentList: any[];
  @Input() previousPayment: any[];
  @Input() brodCastChange: BehaviorSubject<any>;
  @Output() nextStep = new EventEmitter<boolean>();
  @Output() backPrevious = new EventEmitter<boolean>();


  // @Input() newPaymentModel: PartialFinalPaymentModel;
  newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();

  tempPaymentBillVouchers: PaymentBillVoucherModel[] = [];

  // @Input() isEditable: boolean = false;
  isEditable: boolean = false;

  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

  /*----Button---*/

  saveIcon = saveIcon;
  previousIcon = previousIcon;
  addNewIcon = addNewIcon;
  nextIcon = nextIcon;
  /*----/Button---*/

  isUpdatedAction: boolean;

  saveSuccess = saveSuccess;
  saveFailed = saveFailed;
  updateSuccess = updateSuccess;
  updateFailed = updateFailed;
  deleteSuccess = deleteSuccess;
  deleteFailed = deleteFailed;
  sentSuccess = sentSuccess;
  dataNotFount = dataNotFount;

  fiscalYears: any[] = [];
  trainingBudgets: TrainingBudgetModel[] = [];


  installmentType: String[] = [
    "First Installment",
    "Advanced Installment",
    "Adjustment Installment",
    "Final Installment",
  ];


  dataSource: MatTableDataSource<PaymentBillVoucherModel>;
  displayedColumns: string[] = ['sl', 'trainingBudgetId', 'totalBudget', 'expenditureAmount', 'vatAndTaxPercentage', 'vatAndTaxAmount', 'netPaymentAmount', 'voucherNumber'];

  proposals: ProposalModel[] = [];
  billVoucherList: any[] = [];
  agreement: AgreementModel = new AgreementModel();
  agreementInstallments: AgreementInstallmentModel[] = [];
  agreementInstallment: AgreementInstallmentModel = new AgreementInstallmentModel();
  itemOfExpenditures: any[] = [];
  installments: InstallmentModel[] = [];
  installment: InstallmentModel = new InstallmentModel();

  advanceAmount: number;


  isButtonOk: boolean = false;


  private total: number;
  private totalNetPayment = new Subject<number>();
  isDisabled: boolean = false;

  spinner: boolean;
  spinner1: boolean;
  spinner2: boolean;
  spinner3: boolean;
  spinner4: boolean;
  spinner5: boolean;
  spinner6: boolean;
  spinner7: boolean;
  canSave: boolean;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _toastrService: ToastrService,
    private _partialFinalPaymentService: PartialFinalPaymentService,
    private route: Router,
    private _budgetService: BudgetService,
    private _configurationService: ConfigurationService,
    private dateAdapter: DateAdapter<Date>,
    private _expenditureItemServiceService: ExpeditureItemServiceService,
    private _dialog: MatDialog
  ) {

    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    let agreementInstallment = new AgreementInstallmentModel();

    Object.assign(agreementInstallment, {
      percentageOfInstallment: 20,
      totalAmount: 100,
      installmentName: 'string'
    });

    this.agreementInstallment = agreementInstallment;
    this.agreementInstallments.push(agreementInstallment);

    if (this.brodCastChange) {
      this.brodCastChange.subscribe(response => {
      });
    }

  }
  ngAfterViewInit(): void {
    this.getTotalNetPayment().subscribe(
      res => {
        if (res > this.agreementInstallment.totalAmount) {
          if (this.total != res) {
            this._toastrService.error("Total amount cannot be greater than installment amount", "Error");
            this.isButtonOk = true
            // setTimeout(() => { this.isButtonOk = true }, 0.1);
            // Promise.resolve().then(()=>{this.isButtonOk = true});
          }
        } else {
          this.isButtonOk = false
          //setTimeout(() => { this.isButtonOk = false }, 0.1);
          //Promise.resolve().then(()=>{this.isButtonOk = false});
        }
        this.total = res;
      }
    );
  }
  ngOnDestroy(): void {
    this.totalNetPayment.unsubscribe();
  }

  public getTotalNetPayment(): Observable<number> {
    return this.totalNetPayment.asObservable();
  }

  public setTotalNetPayment(totalNetPayment: number): void {
    this.totalNetPayment.next(totalNetPayment);
  }

  ngOnInit(): void {
    this.getExpenditureItems();

    if (this.newPaymentModel.id && (this.newPaymentModel.installmentType != "Advance Installment")) {
      this.getBudgetByProposalId(this.newPaymentModel.proposalId, (res) => {
        this.getBillVoucherByPartialFinalPaymentId(this.newPaymentModel.id);
      });
    }

    this.inIt();
  }

  inIt() {

    if (!this.newPaymentModel.installmentType) {
      return;
    }

    if (!this.installmentList) {
      return;
    }

    if (this.newPaymentModel.installmentType == 'Advance Installment') {
      this.installment = this.installmentList.find(installment => installment.installmentName === "Installment No: 1");
      if (this.installment) {
        // this.agreementInstallment.totalAmount = this.installment.totalAmount;
        // this.newPaymentModel.installmentAmount = this.installment.totalAmount;
      }
    }

    if (this.newPaymentModel.installmentType == 'Adjustment & Installment No: 1') {
      this.installment = this.installmentList.find(installment => installment.installmentName === "Installment No: 1");

      let f = this.previousPayment.find(f => f.installmentType == 'Advance Installment');
      this.advanceAmount = f.installmentAmount ? f.installmentAmount : 0;
      if (f && this.installment) {
        this.agreementInstallment.totalAmount = this.installment.totalAmount;
        this.newPaymentModel.installmentAmount = this.installment.totalAmount - (f.installmentAmount ? f.installmentAmount : 0);
      } else if (!f && this.installment) {
        this.agreementInstallment.totalAmount = this.installment.totalAmount;
        this.newPaymentModel.installmentAmount = this.installment.totalAmount;
      }
    }

    if (this.newPaymentModel.installmentType != 'Advance Installment' && this.newPaymentModel.installmentType != 'Adjustment & Installment No: 1') {
      this.installment = this.installmentList.find(installment => installment.installmentName === this.newPaymentModel.installmentType);
      if (this.installment) {
        this.agreementInstallment.totalAmount = this.installment.totalAmount;
        this.newPaymentModel.installmentAmount = this.installment.totalAmount;
      }
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'existingPartialFinalPayment': {
            if (this.existingPartialFinalPayment.id) {
              this.newPaymentModel = this.existingPartialFinalPayment;
              console.log('bill --- >>>> ', this.newPaymentModel);
              if (this.newPaymentModel.id && (this.newPaymentModel.installmentType != "Advance Installment")) {
                this.getBudgetByProposalId(this.newPaymentModel.proposalId, (res) => {
                  this.getBillVoucherByPartialFinalPaymentId(this.newPaymentModel.id);
                });
                this.inIt();
              }

            }
          }

          case 'brodCastChange': {
            this.brodCastChange.subscribe(res => {
              if (res && res.id) {
                this.canSave = true;
                this.newPaymentModel = { ...res };
                if (this.newPaymentModel.id && (this.newPaymentModel.installmentType != "Advance Installment")) {
                  this.getBudgetByProposalId(this.newPaymentModel.proposalId, (res) => {
                    this.getBillVoucherByPartialFinalPaymentId(this.newPaymentModel.id);
                  });
                }
                console.log('bill b --- >>>> ', this.newPaymentModel);
                this.inIt();
              }
            });
            break;
          }

          case 'installmentList': {
            this.inIt();
            break;
          }
        }
      }
    }
  }



  getTotalAmountOf(propName) {
    if (!this.tempPaymentBillVouchers) return 0;
    let total: number = this.tempPaymentBillVouchers.map(t => t[propName]).reduce((acc, value) => parseInt(acc) + parseInt(value), 0);
    if (propName == 'expenditureAmount') {
      this.setTotalNetPayment(total);
    }
    return total;
  }

  calculateOtherFields(idx) {
    let tmpBillVoucher = this.tempPaymentBillVouchers[idx];
    this.tempPaymentBillVouchers[idx].vatAndTaxAmount = this.percentage(tmpBillVoucher.vatAndTaxPercentage, tmpBillVoucher.expenditureAmount);
    this.tempPaymentBillVouchers[idx].netPaymentAmount = tmpBillVoucher.expenditureAmount - this.percentage(tmpBillVoucher.vatAndTaxPercentage, tmpBillVoucher.expenditureAmount);
  }

  percentage(percent, total) {
    return parseInt(((percent / 100) * total).toFixed(2));
  }

  nextTab() {
    this.nextStep.emit(true);
  }

  previousTab(): void {
    this.backPrevious.emit(true);
  }


  getItemOfExpenditure(itemOfExpenditureId: number) {
    let itemOfExpenditure = this.itemOfExpenditures.find(iOE => iOE.id === itemOfExpenditureId);
    if (itemOfExpenditure)
      return itemOfExpenditure.expItemsName;
    else
      return "Not Found";
  }



  getTotalAmountOfTotal(totalBudget: string) {
    // if (this.newPaymentModel.paymentBillVoucherModels === undefined) return 0;
    // return this.newPaymentModel.paymentBillVoucherModels.map(t => t['trainingBudgetModel']['expenditureAmount']).reduce((acc, value) => acc + (value), 0);
    if (!this.trainingBudgets) return 0;
    return this.trainingBudgets.map(t => t['expenditureAmount']).reduce((acc, value) => acc + (value), 0);

  }



  checkMoreThenTotal($event: KeyboardEvent) {
    let value = $event.target['value'];
    if (value > this.installment.totalAmount) {
      this._toastrService.error("Advance amount can't be greater than grant amount", "Error");
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  private getExpenditureItems() {
    this.spinner = true;
    this._expenditureItemServiceService.getAll().subscribe(
      res => {
        let iOEItems: any[] = [];
        res.items.map(item => {
          if (item.expItemsFor == 'Institute_Items' || item.expItemsFor == 'Both')
            iOEItems.push(item);
        })
        this.itemOfExpenditures = iOEItems;
        this.spinner = false;
      },
      error => {
        console.log(error);
        this.spinner = false;
      }
    )
  }


  getCurrentFiscalYear(callBack) {
    this.spinner2 = true;
    this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
      res => {
        this.fiscalYears = res.items;
        callBack(true);
        this.spinner2 = false;
      },
      error => {
        console.log(error);
        callBack(true);
        this.spinner2 = false;
      }
    )
  }

  // private getFiscalYearList() {
  //     this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
  //         res => {
  //             this.fiscalYears = res.items;
  //         },
  //         error => {
  //             console.log(error)
  //         }
  //     )
  // }


  getCurrentFiscalYearId() {
    // this.jasperService.advertiseDateValidity().subscribe(validRes => {
    //     if (!validRes.success) {
    //         this.matSnackBar.openWarnSnackBarWithMessage(validRes.message, OK);
    //     }
    //     else {
    //         this.fiscalYears = this.fiscalYears.filter(f => f.id === validRes.stFiscalYearId);
    //     }
    // });
  }


  onSubmit(isNext) {
    this.onUpdate((res) => {
      this.onSaveAndUpdate(isNext);
    });
  }

  onSaveAndUpdate(isNext: boolean) {
    this.tempPaymentBillVouchers = this.tempPaymentBillVouchers.map(m => { m.partialFinalPaymentId = this.newPaymentModel.id; return m });
    this.spinner3 = true;
    this._partialFinalPaymentService.onSaveOrUpdate(this.tempPaymentBillVouchers).subscribe(
      res => {
        if (res.success) {
          this.tempPaymentBillVouchers = res.items ? res.items : [];
          this.tempPaymentBillVouchers = this.tempPaymentBillVouchers.map(m => { m.expenditureId = m.trainingBudgetModel.itemOfExpenditureId; m.budgetExpenditureAmount = m.trainingBudgetModel.expenditureAmount; return m })
          this._toastrService.success(res.message, "Success");
          this.spinner3 = false;
          if (isNext) this.viewDetails(this.newPaymentModel.id);
        } else {
          this.spinner3 = false;
        }
      },
      error => {
        this._toastrService.error("There's a problem on saving installment", "Error");
        console.log(error);
        this.spinner3 = false;
      }
    )
  }

  viewDetails(id: any) {
    this.route.navigate(['partial-and-final-payment/' + id]);
  }

  onUpdate(callBack) {
    this.spinner4 = true;
    this._partialFinalPaymentService.updatePartialFinalPaymentNew(this.newPaymentModel).subscribe(
      res => {
        if (res.success) {
          this.newPaymentModel = { ...res.obj }
          this.spinner4 = false;
          callBack(true);
        } else {
          this.spinner4 = false;
          callBack(false);
        }
      },
      error => {
        callBack(false);
        this._toastrService.error("There's a problem on saving installment", "Error");
        console.log(error);
        this.spinner4 = false;
      }
    )
  }

  getBillVoucherByPartialFinalPaymentId(partialFinalPaymentId: number) {
    this.spinner5 = true;
    this._partialFinalPaymentService.getBillVoucherByPartialFinalPaymentId(partialFinalPaymentId).subscribe(
      response => {
        this.billVoucherList = response.items ? response.items : [];
        this.tempPaymentBillVouchers = [];
        let thet = this;
        this.trainingBudgets.forEach(entity => {
          let f = this.billVoucherList.find(f => f.trainingBudgetModel.id === entity.id);
          let tempPaymentBillVoucher = new PaymentBillVoucherModel();
          if (f) {
            tempPaymentBillVoucher = { ...f, expenditureId: f.trainingBudgetModel.itemOfExpenditureId, budgetExpenditureAmount: f.trainingBudgetModel.expenditureAmount };
          } else {
            tempPaymentBillVoucher.expenditureId = entity.itemOfExpenditureId;
            tempPaymentBillVoucher.trainingBudgetId = entity.id;
            tempPaymentBillVoucher.budgetExpenditureAmount = entity.expenditureAmount;
            tempPaymentBillVoucher.expenditureAmount = 0;
            tempPaymentBillVoucher.vatAndTaxPercentage = 0;
            tempPaymentBillVoucher.vatAndTaxAmount = 0;
            tempPaymentBillVoucher.netPaymentAmount = 0;
            tempPaymentBillVoucher.voucherNumber = 0;
            tempPaymentBillVoucher.id = null;
          }
          thet.tempPaymentBillVouchers.push(tempPaymentBillVoucher);
        });
        this.spinner5 = false;
      },
      error => {
        this.spinner5 = false;
        console.log('error ----->>>>>> ', error);
      }
    );
  }

  getBudgetByProposalId(proposalId: number, callBack) {
    this.spinner6 = true;
    this._budgetService.getResearchBudgetByProposalId(proposalId).subscribe(
      res => {
        this.trainingBudgets = res;
        callBack(true);
        this.spinner6 = false;
      },
      error => {
        console.log(error);
        callBack(true);
        this.spinner6 = false;
      }
    )
  }


  uploadFileForGioLetter(row: any) {
    let data: PaymentBillVoucherModel = new PaymentBillVoucherModel();
    data = { ...row }
    data.partialFinalPaymentId = this.newPaymentModel.id;
    if (!data.id) {
      this._toastrService.warning("Bill Voucher not save yeat.", "", this.config);
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '40%';
    dialogConfig.height = 'auto';
    dialogConfig.data = { ...data };

    const dialogRef = this._dialog.open(UplodFileModalNewComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        dialogRef.close(true);
        this.getBillVoucherByPartialFinalPaymentId(this.newPaymentModel.id);
      }
    });
  }


  downloadFile(data: any) {
    window.open(environment.ibcs.minioEndPointHost + data.fileDownloadUrl);
  }

}
