import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {ParticipantModel} from 'app/main/modules/training-institute/models/participant.model';
import {ActivatedRoute} from '@angular/router';
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {ConfigurationService} from "../../../../../settings/services/configuration.service";

@Component({
    selector: 'app-add-participant',
    templateUrl: './add-participant.component.html',
    styleUrls: ['./add-participant.component.scss']
})
export class AddParticipantComponent implements OnInit {
    //variables
    newParticipantModel: ParticipantModel = new ParticipantModel();
    tempParticipantId: String;
    participantId: number;
    isEditable: boolean = false;
    fiscalYears: any[] = []


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _activatedRoute: ActivatedRoute,
                private _participantService: ParticipantService,
                private _configurationService: ConfigurationService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.tempParticipantId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempParticipantId != null) {
            this.isEditable = true;
            this.participantId = Number(this.tempParticipantId);
        }
    }


    ngOnInit(): void {

        if (this.isEditable) {
            this._participantService.getParticipantById(this.participantId).subscribe(
                res => {
                    this.newParticipantModel = res;
                    this.newParticipantModel.proposalId = res.proposalModel.id
                    this.newParticipantModel.academicBackgroundModels = res.academicBackgroundModels
                }
            );
        }

        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res
            },
            error => {

            }
        )
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();

    }

    selectionChanged(event: StepperSelectionEvent) {             
        event.previouslySelectedStep.interacted = false;
        // if (event.previouslySelectedIndex > event.selectedIndex) {
        //     event.previouslySelectedStep.interacted = false;
        //    }
    }

    goBackToHome() {
        window.history.back();
    }


}

