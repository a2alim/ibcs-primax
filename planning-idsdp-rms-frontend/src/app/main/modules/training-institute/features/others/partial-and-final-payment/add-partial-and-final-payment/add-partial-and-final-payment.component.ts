import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { PartialFinalPaymentModel } from 'app/main/modules/training-institute/models/partial-final-payment.model';
import { AgreementService } from 'app/main/modules/training-institute/services/agreement.service';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";

@Component({
    selector: 'app-add-partial-and-final-payment',
    templateUrl: './add-partial-and-final-payment.component.html',
    styleUrls: ['./add-partial-and-final-payment.component.scss']
})
export class AddPartialAndFinalPaymentComponent implements OnInit {


    private _parent: any;

    @Input() set parent(value: any) {
        this._parent = value;
    }

    get parent(): any {
        return this._parent;
    }

    get self(): AddPartialAndFinalPaymentComponent {
        return this;
    }

    brodCastChange: BehaviorSubject<any> = new BehaviorSubject(null);
    newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();
    tempPartialPaymentId: String;


    partialPaymentId: number;
    isEditable: boolean = false;
    installmentList: any[] = [];
    previousPayment: any[] = [];

    spinner: boolean;
    spinner1: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _activatedRoute: ActivatedRoute,
        private _partialFinalPaymentService: PartialFinalPaymentService,
        private _agreementService: AgreementService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.tempPartialPaymentId = this._activatedRoute.snapshot.paramMap.get('id');

        if (this.tempPartialPaymentId != null) {
            this.isEditable = true;
            this.partialPaymentId = Number(this.tempPartialPaymentId);
        }
    }

    ngOnInit(): void {
        if (this.isEditable) {
            this.spinner = true;
            this._partialFinalPaymentService.getPartialFinalPaymentNewById(this.partialPaymentId).subscribe(
                res => {
                    if (res.success && res.obj) {
                        this.newPaymentModel = res.obj;
                        this.spinner = false;
                        this.inIt(this.newPaymentModel.proposalId);
                    } else {
                        this.spinner = false;
                    }
                },
                error => {
                    console.log('error ---- >>>>> ', error);
                    this.spinner = false;
                }
            );
        }
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();

    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {
        }
    }

    goBackToHome() {
        window.history.back();
    }


    inIt(value) {
        this.getPreviousPayments(value, (res) => {
            this.getInstallmentsByProposalId(value);
        });
    }



    getInstallmentsByProposalId(value) {
        this.spinner1 = true;
        this._agreementService.getInstallmentsByProposalId(value).subscribe(
            res => {
                this.installmentList = res;
                this.spinner1 = false;
            },
            err => {
                console.log('error ---- >>>>> ', err);
                this.spinner1 = false;
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
                }
            },
            err => {
                console.log('error ---- >>>>> ', err);
                this.spinner1 = false;
                callBack(true);
            }
        );
    }


}


