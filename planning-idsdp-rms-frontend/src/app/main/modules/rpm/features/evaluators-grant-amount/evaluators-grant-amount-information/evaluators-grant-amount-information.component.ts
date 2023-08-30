import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ActivatedRoute} from "@angular/router";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {BehaviorSubject} from "rxjs";
import {RmsEvaluatorsGrantAmountLetterService} from "../../../services/rms-evaluators-grant-amount-letter.service";
import {EvaluatorsGrantAmountLetter} from "../../../models/EvaluatorsGrantAmountLetter";

@Component({
    selector: 'app-evaluators-grant-amount-information',
    templateUrl: './evaluators-grant-amount-information.component.html',
    styleUrls: ['./evaluators-grant-amount-information.component.scss']
})
export class EvaluatorsGrantAmountInformationComponent extends UnsubscribeAdapterComponent implements OnInit {


    horizontalStepperForm: FormGroup;
    uuid: string;
    letter: EvaluatorsGrantAmountLetter;
    spinner: boolean = true;
    brodCastChange: BehaviorSubject<any> = new BehaviorSubject(null);


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private service: RmsEvaluatorsGrantAmountLetterService,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.horizontalStepperForm = this.formBuilder.group({
            step1: this.formBuilder.group({}),
            step2: this.formBuilder.group({}),
        });

        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
            if (this.uuid) {
                this.getByEvaluatorsGrantAmountLetter();
            } else {
                this.spinner = false;
            }
        });
    }

    private getByEvaluatorsGrantAmountLetter() {
        this.subscribe$.add(
            this.service.getByUuid(this.uuid).subscribe(res => {
                if (res.success) {
                    this.letter = res.obj;
                    this.spinner = false;
                }
            })
        );
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();

    }

}
