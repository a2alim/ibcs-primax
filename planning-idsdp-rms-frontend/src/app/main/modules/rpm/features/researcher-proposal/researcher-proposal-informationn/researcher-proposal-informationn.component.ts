import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { CdkStep, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { BehaviorSubject } from 'rxjs';
import { ResearcherProposal } from '../../../models/ResearcherProposal';
import { DivisionDistrictUpzilaService } from '../../../services/division-district-upzila.service';
import { ResearcherProposalSharedService } from '../../../services/researcher-proposal-shared.service';
import { ResearcherProposalService } from '../../../services/researcher-proposal.service';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';


@Component({
    selector: 'app-researcher-proposal-informationn',
    templateUrl: './researcher-proposal-informationn.component.html',
    styleUrls: ['./researcher-proposal-informationn.component.scss']
})
export class ResearcherProposalInformationnComponent implements OnInit {

    verticalStepperForm: FormGroup;
    horizontalStepperForm: FormGroup;
    uuId: string;

    researcherProfileUuId: string;
    researcherProposalUuId: string;
    categoryTypeId: number;

    spinner: boolean;
    smallScreen: boolean;

    getFiscalYearId: number;
    onSelectResearchCategoryTypeId: number;

    proposalInfo: ResearcherProposal = new ResearcherProposal();
    brodCastChange: BehaviorSubject<any> = new BehaviorSubject(null);
    loginUserInfo: any;
    subscriber: any;

    storeDivisionList : any[];
    storeDistrictListVal : any[];
    storeUpazilaList : any[];


    activeStep = 0;
    private _renderStep: CdkStep[] = [];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private researcherProposalService: ResearcherProposalService,
        private route: ActivatedRoute,
        private storageService: StorageService,
        private breakpointObserver: BreakpointObserver,
        private researcherProposalSharedService: ResearcherProposalSharedService,
        private router: Router,
        private DividionDU: DivisionDistrictUpzilaService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        breakpointObserver.observe([Breakpoints.XSmall,Breakpoints.Small]).subscribe(result => {
            var screenSize = result.matches;
            this.smallScreen = screenSize;
            localStorage.setItem('smallScreen', (screenSize) ? '1' : '0');
        });

        this.getCategoryTypeId();
    }

    ngOnInit(): void {

        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({}),
            step5: this._formBuilder.group({})
        });

        this.route.params.subscribe(params => {
            this.researcherProfileUuId = params['researcherProfileUuId'];
            this.researcherProposalUuId = params['researcherProposalUuId'];
            // this.categoryTypeId=params['categoryTypeId'];
            if (this.researcherProposalUuId) {
                this.getResearcherProposalByUuId();
            }
            if (!this.researcherProposalUuId && !this.categoryTypeId) {
                this.router.navigate(['researcher/list']);
            }
            if (this.researcherProfileUuId) {
            }
        });

        this.loginUserInfo = this.storageService.getUserData();

        this.DividionDU.getDivision().subscribe(data => {
            this.storeDivisionList = data;
        })

        this.DividionDU.getDistrictsList().subscribe(data => {
            this.storeDistrictListVal = data;
        })
        this.DividionDU.getUpazilaList().subscribe(data => {
            this.storeUpazilaList = data;
        })
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    selectionChanged(event: StepperSelectionEvent) {
        console.log("event.selectedStep =", event);
        
        event.previouslySelectedStep.interacted = false;
        this.activeStep = event.selectedIndex;
        // if (event.previouslySelectedIndex > event.selectedIndex) {
        //     event.previouslySelectedStep.interacted = false;
        //    }
    }

    goBackToHome() {
        window.history.back();
    }

    getResearcherProposalByUuId() {
        this.spinner = true;
        this.researcherProposalService.getByUuid(this.researcherProposalUuId).subscribe(
            response => {
                if (response.success) {
                    this.proposalInfo = response.obj;
                    this.proposalInfo.stSdgsGoalsId = this.proposalInfo.stSdgsGoalsId ? JSON.parse(this.proposalInfo.stSdgsGoalsId) : '';
                } else {

                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    onChangrResearchCategoryType(data: any) {
        this.onSelectResearchCategoryTypeId = data;
    }
    setFiscal_YearId(fyId : any){
        this.getFiscalYearId = fyId;
    }

    getCategoryTypeId() {
        this.subscriber = this.researcherProposalSharedService.observable$.subscribe(
            response => {
                if (response && !this.proposalInfo.stResearchCatTypeId) {
                    this.categoryTypeId = response.categoryId;
                }
            }
        );
    }


}
