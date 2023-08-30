import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '../../../../core/services/translation-loader.service';
import { FormBuilder } from '@angular/forms';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
    selector: 'app-agreement-process',
    templateUrl: './agreement-process.component.html',
    styleUrls: ['./agreement-process.component.scss'],
})
export class AgreementProcessComponent implements OnInit {
    smallScreen: boolean;
    numberOfInstallment: number;
    stepNo: number = 0;
    getAgreementDate:any;
    getProposalId:number;
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small])
            .subscribe((result) => {
                var screenSize = result.matches;
                this.smallScreen = screenSize;
                localStorage.setItem('smallScreen', screenSize ? '1' : '0');
            });
    }
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    ngOnInit(): void {}
    goBack(stepper: MatStepper): void {
        stepper.previous();
    }
    goForward(stepper: MatStepper): void {
        stepper.next();
    }
    selectionChanged($event: StepperSelectionEvent) {
        //console.log('$event.selectedIndex = ', $event.selectedIndex);
        this.stepNo = $event.selectedIndex;
        if ($event.selectedIndex === 1) {
        }
    }
    goBackToHome() {
        window.history.back();
    }
    setNumberOfIns($event: number) {
        this.numberOfInstallment = $event;
    }
    setAgreementDate($agreementDate:any){
        console.log("setAgreementDate XXXX = ", $agreementDate);
        this.getAgreementDate = $agreementDate;
    }
    setProposalId($proposalId:number){
        console.log("setProposalId = ", $proposalId);
        this.getProposalId = $proposalId;
    }
}
