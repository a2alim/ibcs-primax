import { Component, OnInit } from '@angular/core';
import { MatStepper } from "@angular/material/stepper";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProposalService } from 'app/main/modules/training-institute/services/proposal.service';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';

@Component({
    selector: 'app-proposal-tab',
    templateUrl: './proposal-tab.component.html',
    styleUrls: ['./proposal-tab.component.scss']
})
export class ProposalTabComponent implements OnInit {

    isEditable: boolean = false
    courseScheduleId: any
    proId: any
    brodCastChange: BehaviorSubject<any> = new BehaviorSubject(null);
    proposalModel: ProposalModel = new ProposalModel();
    spinner: boolean;


    verticalStepperForm: FormGroup;
    horizontalStepperForm: FormGroup;


    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService, private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _proposalService: ProposalService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        if (this._activatedRoute.snapshot.paramMap.get('fiscalYearId')) {
            this.isEditable = true;
        }
        this.courseScheduleId = this._activatedRoute.snapshot.paramMap.get('courseScheduleId');
        this.proId = this._activatedRoute.snapshot.paramMap.get('proposalId');
        this.getReadyForEdit();
        localStorage.setItem("idForUpdate", this.courseScheduleId)
        localStorage.setItem("proIdForUpdate", this.proId)
    }

    ngOnInit(): void {
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({})
        });
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    selectionChanged(event: StepperSelectionEvent) {
        event.previouslySelectedStep.interacted = false;
    }

    goBackToHome() {
        window.history.back();
    }


    getReadyForEdit() {
        if (!this.proId) {
            return;
        }
        
        this.spinner = true;
        this._proposalService.getProposalById(this.proId).subscribe(
            res => {
                this.proposalModel = res;
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );

    }




}
