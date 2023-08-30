import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {Component, OnInit} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {PartialFinalPaymentModel} from 'app/main/modules/training-institute/models/partial-final-payment.model';
import {PartialFinalPaymentService} from 'app/main/modules/training-institute/services/partial-final-payment.service';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
    selector: 'app-add-partial-and-final-payment',
    templateUrl: './edit-partial-and-final-payment.component.html',
    styleUrls: ['./edit-partial-and-final-payment.component.scss']
})
export class EditPartialAndFinalPaymentComponent implements OnInit {
    //variables
    newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();
    brodCastChange: BehaviorSubject<any> = new BehaviorSubject(null);
    tempPartialPaymentId: String;
    partialPaymentId: number;
    isEditable: boolean = false;
    fiscalYears: any[] = []

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _activatedRoute: ActivatedRoute,
                private _partialFinalPaymentService: PartialFinalPaymentService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.tempPartialPaymentId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempPartialPaymentId != null) {
            this.isEditable = true;
            this.partialPaymentId = Number(this.tempPartialPaymentId);
        }
    }

    ngOnInit(): void {

        if (this.isEditable) {
            this._partialFinalPaymentService.getPartialFinalPaymentById(this.partialPaymentId).subscribe(
                res => {
                    // console.log('------------')
                    // console.log(res)

                    this.newPaymentModel = res;
                    this.newPaymentModel.proposalId = res.proposalModel.id;
                    this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
                    this._partialFinalPaymentService.setIsEditable(this.isEditable);
                    //  this.newPaymentModel.proposalId = res.proposalModel.id
                    //  this.newPaymentModel.academicBackgroundModels = res.academicBackgroundModels


                }
            );
        } else {
            this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
            this._partialFinalPaymentService.setIsEditable(this.isEditable);
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


}


