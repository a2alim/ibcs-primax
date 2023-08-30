import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
//----Lng Translation----
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
@Component({
    selector: 'app-researcher-profile-information',
    templateUrl: './researcher-profile-information.component.html',
    styleUrls: ['./researcher-profile-information.component.scss'],
})

export class ResearcherProfileInformationComponent implements OnInit {
    loginUserInfo: any;
    smallScreen: boolean;
    stapes = 'horizontal';
    publicationInfo: number;
    proExperience: number;
    researchExp: number;
    trainingInfo: number;
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private StorageService: StorageService,
        private breakpointObserver: BreakpointObserver
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        localStorage.removeItem('profilePersonalInfoId');
        localStorage.removeItem('profilePersonalInfoUuid');
        breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small])
            .subscribe((result) => {
                var screenSize = result.matches;
                this.smallScreen = screenSize;
                localStorage.setItem('smallScreen', screenSize ? '1' : '0');
            });
    }

    ngOnInit(): void {
        this.loginUserInfo = this.StorageService.getUserData();
    }
    goBack(stepper: MatStepper): void {
        stepper.previous();
    }
    goForward(stepper: MatStepper): void {
        //console.log('stepper = ', stepper);
        stepper.next();
    }
    selectionChanged(event: StepperSelectionEvent) {
        event.previouslySelectedStep.interacted = false;
        let pId = sessionStorage.getItem('pId');
        let publicationInfo = sessionStorage.getItem('publicationInfo');
        let proExperience = sessionStorage.getItem('proExperience');
        let researchExp = sessionStorage.getItem('researchExp');
        let trainingInfo = sessionStorage.getItem('trainingInfo');
        if (event.selectedIndex === 1 || event.selectedIndex === 2) {
            this.publicationInfo = +publicationInfo;
        }
        if (event.selectedIndex === 3) {
            this.proExperience = +proExperience;
        }
        if (event.selectedIndex === 4) {
            this.researchExp = +researchExp;
        }
        if (event.selectedIndex === 5) {
            this.trainingInfo = +trainingInfo;
        }
    }
    
    goBackToHome() {
        window.history.back();
    }
}
