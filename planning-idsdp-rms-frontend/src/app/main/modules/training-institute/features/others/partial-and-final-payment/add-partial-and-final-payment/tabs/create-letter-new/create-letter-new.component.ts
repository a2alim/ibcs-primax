import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from 'app/main/core/constants/editor-config';
import { dataNotFount, nextIcon, previousIcon, saveFailed, saveIcon, saveSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { PredefinedTemplateServiceService } from 'app/main/modules/settings/services/predefined-template-service.service';
import { TemplateTypeServiceService } from 'app/main/modules/settings/services/template-type-service.service';
import { AgreementModel } from 'app/main/modules/training-institute/models/agreement.model';
import { PartialFinalPaymentModel, PaymentBillVoucherModel } from 'app/main/modules/training-institute/models/partial-final-payment.model';
import { PreviousPaymentModel } from 'app/main/modules/training-institute/models/previous-payment.model';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';
import { AgreementService } from 'app/main/modules/training-institute/services/agreement.service';
import { BudgetService } from 'app/main/modules/training-institute/services/budget.service';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { ProposalService } from 'app/main/modules/training-institute/services/proposal.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-create-letter-new',
  templateUrl: './create-letter-new.component.html',
  styleUrls: ['./create-letter-new.component.scss']
})
export class CreateLetterNewComponent implements OnInit, OnChanges {

  private _parent: any;

  @Input() set parent(value: any) {
    this._parent = value;
  }

  get parent(): any {
    return this._parent;
  }
  get self(): CreateLetterNewComponent {
    return this;
  }

  @Input() existingPartialFinalPayment: PartialFinalPaymentModel;
  @Input() brodCastChange: BehaviorSubject<any>;
  @Output() nextStep = new EventEmitter<boolean>();
  @Output() backPrevious = new EventEmitter<boolean>();


  test: any;
  // @Input() newPaymentModel: PartialFinalPaymentModel;
  newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();

  // @Input() isEditable: boolean = false;
  isEditable: boolean;


  @Input() partialPaymentId: number;
  // Icons for buttons
  saveIcon = saveIcon;

  templateTypeList: any[];
  predefinedTemplates: any[];
  agreement: AgreementModel = new AgreementModel();
  proposals: ProposalModel[] = [];
  selectedProposal: ProposalModel[] = [];

  saveSuccess = saveSuccess;
  saveFailed = saveFailed;
  nextIcon = nextIcon;
  previousIcon = previousIcon;

  dataNotFount = dataNotFount;
  fiscaleYearId: number;

  mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

  agreementInstallments: { name: string, amount: number, totalAmount: number }[] =
    [
      { name: "Advance Installment", amount: 0, totalAmount: 0 },
      { name: "Adjustment & Installment No: 1", amount: 0, totalAmount: 0 },
      { name: "Installment No: 1", amount: 0, totalAmount: 0 },
      { name: "Installment No: 2", amount: 0, totalAmount: 0 },
      { name: "Installment No: 3", amount: 0, totalAmount: 0 },
      { name: "Installment No: 4", amount: 0, totalAmount: 0 }
    ];

  previousPaymentModels: PreviousPaymentModel[] = [];
  trainingBudgets: any[];
  tempPaymentBillVouchers: any[] = [];


  spinner: boolean;
  spinner1: boolean;
  spinner2: boolean;
  spinner3: boolean;
  spinner4: boolean;
  spinner5: boolean;
  spinner6: boolean;
  spinner7: boolean;
  spinner10: boolean;
  spinner11: boolean;

  installmentList: any[] = [];
  previousPayment: any[] = [];
  constructor(private _partialFinalPaymentService: PartialFinalPaymentService,
    private _toastrService: ToastrService,
    private route: Router,
    private templateTypeServiceService: TemplateTypeServiceService,
    private _predefinedTemplateServiceService: PredefinedTemplateServiceService,
    private _agreementService: AgreementService) {
    this.getTemplateType();
  }

  ngOnInit(): void {
    this.getTemplateService();
    this.getProposal();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'existingPartialFinalPayment': {
            if (this.existingPartialFinalPayment.id) {
              this.newPaymentModel = this.existingPartialFinalPayment;
            }
          }
        }
      }
    }
  }

  onSubmite(isNext: boolean) {
    if (this.newPaymentModel.id) {
      this.onUpdate(isNext);
    } else {
      this.onSave(isNext);
    }
  }

  onChangeProposal(value) {

    let proposal = this.proposals.find(p => p.id === value);
    this.newPaymentModel.fiscalYearId = proposal.fiscalYearId;

    this.getInstallmentsByProposalId(value, (res) => {
      if (res) {
        this.getPreviousPayments(value, (res) => {

          if (this.previousPayment.length == 0) {
            this.agreementInstallments = this.agreementInstallments.filter(f => { if (f.name == 'Advance Installment') return f; if (f.name == 'Installment No: 1') return f; });
            return;
          }

          this.agreementInstallments = this.agreementInstallments.filter(f => {
            if (f.name == 'Advance Installment') return f;
            if (f.name == 'Adjustment & Installment No: 1') return f;
            let find = this.installmentList.find(f2 => f2.installmentName == f.name);
            if (find) {
              return f;
            }
          });

          if (this.installmentList && this.previousPayment) {
            this.installmentList.forEach(e1 => {
              this.previousPayment.forEach(e2 => {
                if (e1.installmentName == e2.installmentType) {
                  this.agreementInstallments.splice(this.agreementInstallments.indexOf(this.agreementInstallments.find(f => f.name == e2.installmentType)), 1);
                }
              });
            });
          }

          let f = this.previousPayment.find(f => f.installmentType == 'Advance Installment');
          if (f) {
            this.agreementInstallments = this.agreementInstallments.filter(f => f.name != 'Advance Installment').filter(f => f.name != 'Installment No: 1');
          }

          let f2 = this.previousPayment.find(f => f.installmentType == "Installment No: 1");

          if (!f && f2) {
            this.agreementInstallments = this.agreementInstallments.filter(f => f.name != 'Advance Installment').filter(f => f.name != 'Adjustment & Installment No: 1');
          }

          let f3 = this.previousPayment.find(f => f.installmentType == 'Adjustment & Installment No: 1');
          if (f3) {
            this.agreementInstallments = this.agreementInstallments.filter(f => f.name != 'Adjustment & Installment No: 1');
          }
        });
      }
    });



  }

  getInstallmentsByProposalId(value, callback) {
    this.spinner = true;
    this._agreementService.getInstallmentsByProposalId(value).subscribe(
      res => {
        this.installmentList = res;
        this.spinner = false;
        callback(true);
      },
      err => {
        this._toastrService.error(err.error.message, 'Error');
        this.spinner = false;
        callback(false);
      }
    );
  }

  getPreviousPayments(value, callBack) {
    this.spinner1 = true;
    this._partialFinalPaymentService.getPreviousPaymentsNew(value).subscribe(
      res => {
        if (res.items) {
          this.previousPayment = res.items;
          this.spinner1 = false;
          callBack(true);
        } else {
          callBack(true);
          this.spinner1 = false;
        }
      },
      err => {
        this._toastrService.error(err.error.message, 'Error');
        this.spinner1 = false;
        callBack(true);
      }
    );
  }

  getTemplateService() {
    this.spinner2 = true;
    this._predefinedTemplateServiceService.getAll().subscribe(
      res => {
        this.predefinedTemplates = res.items ? res.items : [];
        this.spinner2 = false;
      },
      err => {
        this._toastrService.error(err.error.message, 'Error');
        this.spinner2 = false;
      }
    );
  }

  getProposal() {
    this.spinner3 = true;
    this.proposals = [];
    this._agreementService.getProposalByTiUser().subscribe(
      res => {
        if (res) {
          res.forEach(element => { this.proposals.push(element.proposalModel); });
        }
        this.spinner3 = false;
      },
      err => {
        this._toastrService.error(err.error.message, 'Error');
        this.spinner3 = false;
      }
    )
  }

  /*Get Predefine template via group*/
  onChangeTemplateType($event: MatSelectChange, addIn: string) {
    this._predefinedTemplateServiceService.getByTemplateTypeId($event.value).subscribe(res => {
      this.predefinedTemplates = res.items ? res.items : [];
    });
  }

  /*Get Predefine template text via Predefine id*/
  onChangePredefinedTemplateType($event: MatSelectChange, addIn: string) {
    const type = this.predefinedTemplates.find(f => f.id === $event.value);
    this.newPaymentModel.letterText = type.header;
  }

  /*Get  template  group*/
  getTemplateType() {
    this.spinner4 = true;
    this.templateTypeServiceService.getAllActive().subscribe(
      res => {
        this.templateTypeList = res.items ? res.items : [];
        this.spinner4 = false;
      },
      error => {
        this.spinner4 = false;
      });
  }

  selectLetter($event: MatSelectChange) {
    this.predefinedTemplates.map(item => {
      if (item.id == $event.value) {
      }
    });
  }

  onSave(isNext: boolean) {
    this.spinner5 = true;
    this.newPaymentModel.status = 'PENDING';
    this._partialFinalPaymentService.createPartialFinalPaymentNew(this.newPaymentModel).subscribe(
      res => {
        if (res.success) {
          this.spinner5 = false;
          this.brodCastChange.next({ ...res.obj });
          this.newPaymentModel = { ...res.obj }
          this._toastrService.success(res.message, "Success");
          this._parent.inIt(this.newPaymentModel.proposalId);
          if (isNext)
            this.nextTab();
        }
      },
      error => {
        this.spinner5 = false;
        this._toastrService.error("There's a problem on saving installment", "Error");
        console.log(error);
      }
    )
  }

  onUpdate(isNext: boolean) {
    this.spinner6 = true;
    this._partialFinalPaymentService.updatePartialFinalPaymentNew(this.newPaymentModel).subscribe(
      res => {
        if (res.success) {
          this.spinner6 = false;
          this.brodCastChange.next({ ...res.obj });
          this.newPaymentModel = { ...res.obj }
          this._toastrService.success(res.message, "Success");
          this._parent.inIt(this.newPaymentModel.proposalId);
          if (isNext)
            this.nextTab();
        }
      },
      error => {
        this.spinner6 = false;
        this._toastrService.error("There's a problem on saving installment", "Error");
        console.log(error);
      }
    )
  }

  nextTab() {
    this.nextStep.emit(true);
  }

}
