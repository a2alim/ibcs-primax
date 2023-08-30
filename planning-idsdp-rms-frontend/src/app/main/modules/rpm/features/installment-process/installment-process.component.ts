import { Component, OnInit } from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {FormBuilder} from "@angular/forms";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {ActivatedRoute} from "@angular/router";
import {InstallmentProcessService} from "../../services/installment-process.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";


@Component({
  selector: 'app-installment-process',
  templateUrl: './installment-process.component.html',
  styleUrls: ['./installment-process.component.scss']
})
export class InstallmentProcessComponent implements OnInit {
    private installmentName: string;
    smallScreen: boolean;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private activateRoute: ActivatedRoute,
        private Installmentprocess: InstallmentProcessService,
        private breakpointObserver: BreakpointObserver,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small
        ]).subscribe(result => {

            var screenSize = result.matches;
            this.smallScreen = screenSize;
            localStorage.setItem('smallScreen', (screenSize) ? '1' : '0' );
        });
    }

    processId: number;

    mode:string;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    installment: number;
    amount:number;
    processUuId:string;



    ngOnInit(): void {



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


    setProcessId($event: number) {
      this.processId = $event;
    }
    setMode($event: string) {
        this.mode = $event;
    }

    setInstallment($event: number) {
        this.installment = $event;
    }
    setAmount($event: number) {
        this.amount = $event;
    }

    setInstallmentName($event: string) {
        this.installmentName = $event;

    }

    setProcessUuid($event: string) {
        this.processUuId=$event;
    }
}

